#!/bin/bash
# Script simplifié pour vider la base de données (sans confirmation)

set -e

echo "🗑️  Vidage de la base de données..."

# Récupérer le mot de passe depuis .env.production si disponible
if [ -f ~/foodtrack/.env.production ]; then
    export $(cat ~/foodtrack/.env.production | grep -v '^#' | grep -v '^$' | xargs)
fi

DB_PASSWORD="${MEALPLANS_DB_PASSWORD:-mealplans_password}"

# Vérifier que PostgreSQL est accessible
if ! docker exec mealplans-postgres pg_isready -U mealplans_user -d mealplans_db >/dev/null 2>&1; then
    echo "❌ PostgreSQL n'est pas accessible. Démarrez d'abord le conteneur :"
    echo "   docker compose up -d mealplans-postgres"
    exit 1
fi

# Supprimer toutes les tables
echo "📦 Suppression de toutes les tables..."
docker exec -e PGPASSWORD="$DB_PASSWORD" mealplans-postgres psql -U mealplans_user -d mealplans_db <<EOF
-- Supprimer toutes les tables avec CASCADE pour gérer les dépendances
DO \$\$ 
DECLARE 
    r RECORD;
BEGIN
    -- Supprimer toutes les tables du schéma public
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Supprimer toutes les séquences restantes
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public')
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END \$\$;
EOF

echo "✅ Base de données vidée !"
echo ""
echo "📝 Le schéma sera réappliqué automatiquement au prochain démarrage du backend."

