#!/bin/bash
# Script pour démarrer les services en production
# Fusionne les fonctionnalités de fix-all.sh et clear-db.sh

set -e

# Fonction pour vider la base de données
clear_database() {
    echo "🗑️  Vidage de la base de données..."
    
    # Récupérer le mot de passe depuis .env.production si disponible
    if [ -f ~/foodtrack/.env.production ]; then
        export $(cat ~/foodtrack/.env.production | grep -v '^#' | grep -v '^$' | xargs)
    fi
    
    DB_PASSWORD="${MEALPLANS_DB_PASSWORD:-mealplans_password}"
    
    # Vérifier que PostgreSQL est accessible
    if ! docker exec mealplans-postgres pg_isready -U mealplans_user -d mealplans_db >/dev/null 2>&1; then
        echo "❌ PostgreSQL n'est pas accessible. Démarrez d'abord le conteneur."
        return 1
    fi
    
    # Supprimer toutes les tables
    echo "📦 Suppression de toutes les tables..."
    docker exec -e PGPASSWORD="$DB_PASSWORD" mealplans-postgres psql -U mealplans_user -d mealplans_db <<EOF
DO \$\$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public')
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END \$\$;
EOF
    
    echo "✅ Base de données vidée !"
}

# Vérifier les arguments
CLEAR_DB=false
REBUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --clear-db)
            CLEAR_DB=true
            shift
            ;;
        --rebuild)
            REBUILD=true
            shift
            ;;
        *)
            echo "❌ Option inconnue: $1"
            echo "Usage: $0 [--clear-db] [--rebuild]"
            exit 1
            ;;
    esac
done

# Charger les variables d'environnement de production
echo "📝 Chargement des variables depuis ~/foodtrack/.env.production..."
if [ ! -f ~/foodtrack/.env.production ]; then
    echo "❌ ERREUR: ~/foodtrack/.env.production n'existe pas"
    exit 1
fi

export $(cat ~/foodtrack/.env.production | grep -v '^#' | grep -v '^$' | xargs)


echo "✅ Variables chargées"

# Vérifier que docker-compose.yml utilise ${MEALPLANS_DB_PASSWORD}

echo "✅ docker-compose.yml utilise bien \${MEALPLANS_DB_PASSWORD}"

# Option: Vider la base de données
if [ "$CLEAR_DB" = true ]; then
    echo ""
    echo "⚠️  ATTENTION : Vous allez supprimer TOUTES les données de la base de données !"
    read -p "Êtes-vous sûr de vouloir continuer ? (tapez 'OUI' pour confirmer): " confirmation
    
    if [ "$confirmation" != "OUI" ]; then
        echo "❌ Opération annulée"
        exit 0
    fi
    
    clear_database
fi

# Arrêter les services
echo "⏹️  Arrêt des services..."
docker compose stop mealplans-postgres mealplans-backend mealplans-frontend 2>/dev/null || true

# Supprimer les conteneurs
echo "🗑️  Suppression des conteneurs..."
docker compose rm -f mealplans-postgres mealplans-backend mealplans-frontend 2>/dev/null || true

# Attendre un peu
sleep 2

# Supprimer le volume si --clear-db est spécifié
if [ "$CLEAR_DB" = true ]; then
    if docker volume ls | grep -q mealplans-postgres-data; then
        echo "🗑️  Suppression du volume PostgreSQL..."
        docker volume rm mealplans-postgres-data 2>/dev/null || {
            echo "⚠️  Le volume est encore utilisé, forçons la suppression..."
            docker volume rm mealplans-postgres-data --force 2>/dev/null || true
        }
    fi
fi

# Rebuild si demandé
if [ "$REBUILD" = true ]; then
    echo "🔨 Rebuild du backend..."
    docker compose build --no-cache mealplans-backend
    
    echo "🔨 Rebuild du frontend..."
    docker compose build --no-cache mealplans-frontend
fi

# Démarrer PostgreSQL
echo "🔄 Démarrage de PostgreSQL..."
docker compose up -d mealplans-postgres

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente que PostgreSQL soit prêt (30 secondes)..."
sleep 30

# Vérifier PostgreSQL
if docker exec mealplans-postgres pg_isready -U mealplans_user -d mealplans_db >/dev/null 2>&1; then
    echo "✅ PostgreSQL est prêt"
    
    # Tester la connexion
    if docker exec -e PGPASSWORD="$MEALPLANS_DB_PASSWORD" mealplans-postgres psql -U mealplans_user -d mealplans_db -c "SELECT 1;" >/dev/null 2>&1; then
        echo "✅ Connexion réussie"
    else
        echo "❌ Connexion échouée - vérifiez le mot de passe"
        exit 1
    fi
    
    # Backend
    echo "🚀 Démarrage du backend..."
    echo "   Le docker-entrypoint.sh appliquera automatiquement le schéma avec 'db push'"
    docker compose up -d mealplans-backend
    
    # Attendre que le backend soit prêt et que docker-entrypoint.sh ait appliqué le schéma
    echo "⏳ Attente que le backend démarre et applique le schéma (via docker-entrypoint.sh)..."
    
    max_attempts=60
    attempt=0
    schema_applied=false
    while [ $attempt -lt $max_attempts ]; do
        # Vérifier si le schéma a été appliqué
        if docker logs mealplans-backend 2>&1 | grep -q "Database schema applied successfully"; then
            echo "✅ Backend démarré et schéma appliqué"
            schema_applied=true
            break
        fi
        # Vérifier si l'application a démarré (signe que le schéma est appliqué)
        if docker logs mealplans-backend 2>&1 | grep -q "Starting application\|Application is running\|Nest application successfully started"; then
            echo "✅ Backend démarré (schéma déjà appliqué)"
            schema_applied=true
            break
        fi
        # Vérifier les erreurs
        if docker logs mealplans-backend 2>&1 | grep -q "Failed to apply database schema"; then
            echo "❌ Échec de l'application du schéma"
            docker logs mealplans-backend --tail 30
            exit 1
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    
    if [ "$schema_applied" = false ]; then
        echo "⚠️  Timeout en attendant le démarrage du backend"
        echo "📋 Derniers logs du backend :"
        docker logs mealplans-backend --tail 30
        echo ""
        echo "⚠️  Le backend pourrait encore être en train de démarrer..."
        echo "   Vous pouvez vérifier les logs avec: docker logs mealplans-backend -f"
    fi
    
    # Attendre un peu pour que tout soit prêt
    sleep 5
    
    # Frontend
    echo "🎨 Démarrage du frontend..."
    docker compose up -d mealplans-frontend
    
    echo ""
    echo "✅ Terminé !"
    docker logs mealplans-backend --tail 10
else
    echo "❌ PostgreSQL n'est pas prêt"
    docker logs mealplans-postgres --tail 20
    exit 1
fi

