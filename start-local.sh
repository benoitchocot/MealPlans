#!/bin/bash
# Script pour lancer les services en local

set -e

echo "🚀 Démarrage des services en local..."

# Vérifier que docker-compose.yml existe
if [ ! -f docker-compose.yml ]; then
    echo "❌ ERREUR: docker-compose.yml n'existe pas"
    exit 1
fi

# Arrêter les services existants s'ils sont en cours
echo "⏹️  Arrêt des services existants..."
docker compose down 2>/dev/null || true

# Construire les images si nécessaire
echo "🔨 Construction des images..."
docker compose build

# Démarrer tous les services
echo "🚀 Démarrage des services..."
docker compose up

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente que PostgreSQL soit prêt..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker exec mealplans-postgres pg_isready -U mealplans_user -d mealplans_db >/dev/null 2>&1; then
        echo "✅ PostgreSQL est prêt"
        break
    fi
    attempt=$((attempt + 1))
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ PostgreSQL n'est pas prêt après $max_attempts tentatives"
    docker logs mealplans-postgres --tail 20
    exit 1
fi

# Attendre que le backend soit prêt
echo "⏳ Attente que le backend soit prêt..."
max_attempts=60
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker logs mealplans-backend 2>&1 | grep -q "Nest application successfully started\|Application is running"; then
        echo "✅ Backend est prêt"
        break
    fi
    attempt=$((attempt + 1))
    sleep 2
done

echo ""
echo "✅ Tous les services sont démarrés !"
echo ""
echo "📋 Services disponibles :"
echo "   - Backend API: http://localhost:3000"
echo "   - Frontend: http://localhost:3001"
echo "   - PostgreSQL: localhost:5432"
echo ""
echo "📝 Commandes utiles :"
echo "   - Voir les logs: docker compose logs -f"
echo "   - Arrêter: docker compose down"
echo "   - Redémarrer: docker compose restart"

