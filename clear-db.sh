#!/bin/bash
# Script pour vider complètement la base de données en production

set -e

echo "⚠️  ATTENTION : Ce script va supprimer TOUTES les données de la base de données !"
echo ""
read -p "Êtes-vous sûr de vouloir continuer ? (tapez 'OUI' pour confirmer): " confirmation

if [ "$confirmation" != "OUI" ]; then
    echo "❌ Opération annulée"
    exit 0
fi

echo ""
echo "🗑️  Vidage de la base de données..."

# Méthode 1 : Supprimer toutes les tables via PostgreSQL
echo "📦 Méthode 1 : Suppression de toutes les tables..."

# Récupérer le mot de passe depuis .env.production si disponible
if [ -f ~/foodtrack/.env.production ]; then
    export $(cat ~/foodtrack/.env.production | grep -v '^#' | grep -v '^$' | xargs)
fi

# Déterminer le mot de passe à utiliser
DB_PASSWORD="${MEALPLANS_DB_PASSWORD:-mealplans_password}"

# Supprimer toutes les tables de la base de données
docker exec mealplans-postgres psql -U mealplans_user -d mealplans_db -c "
DO \$\$ 
DECLARE 
    r RECORD;
BEGIN
    -- Supprimer toutes les contraintes de clé étrangère
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END \$\$;
" || {
    echo "⚠️  Erreur lors de la suppression des tables via psql"
    echo "📦 Méthode 2 : Suppression du volume Docker..."
    
    # Arrêter les services
    echo "⏹️  Arrêt des services..."
    docker compose stop mealplans-backend mealplans-frontend 2>/dev/null || true
    
    # Supprimer le volume PostgreSQL (méthode la plus radicale)
    if docker volume ls | grep -q "mealplans.*postgres.*data\|postgres_data"; then
        echo "🗑️  Suppression du volume PostgreSQL..."
        docker compose down -v 2>/dev/null || {
            # Essayer de trouver le volume avec un autre nom
            VOLUME_NAME=$(docker volume ls | grep -i postgres | grep -i mealplans | awk '{print $2}' | head -1)
            if [ -n "$VOLUME_NAME" ]; then
                docker volume rm "$VOLUME_NAME" --force 2>/dev/null || true
            fi
        }
    fi
}

echo ""
echo "✅ Base de données vidée !"
echo ""
echo "📝 Pour réinitialiser avec le schéma Prisma :"
echo "   docker compose up -d mealplans-backend"
echo "   (Le docker-entrypoint.sh appliquera automatiquement le schéma)"

