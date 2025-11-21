# Guide de Déploiement FoodTrack

## 📋 Prérequis

- Serveur avec Docker et Docker Compose
- Traefik configuré comme reverse proxy
- Noms de domaine configurés :
  - `jow.chocot.be` → Frontend
  - `apijow.chocot.be` → Backend API

## 🚀 Déploiement Initial

### 1. Cloner le projet sur le serveur

```bash
ssh votre-serveur
cd ~
git clone <votre-repo> Jow
cd Jow
```

### 2. Configurer les variables d'environnement

```bash
# Créer le fichier .env.production à la racine du projet
cp .env.production.example .env.production
nano .env.production
```

Remplissez les variables :

```env
# Base de données - Utilisez un mot de passe fort
JOW_DB_PASSWORD=VotreMotDePasseSecurise123!

# JWT - Générez une clé secrète longue et aléatoire
JOW_JWT_SECRET=$(openssl rand -base64 64)

# Email (pour les notifications de soumission de recettes)
JOW_SMTP_HOST=smtp.gmail.com
JOW_SMTP_PORT=587
JOW_SMTP_SECURE=false
JOW_SMTP_USER=votre.email@gmail.com
JOW_SMTP_PASS=votre_app_password_gmail
JOW_SMTP_FROM=noreply@jow.chocot.be

# Admin
JOW_ADMIN_EMAIL=benoit.chocot@gmail.com
```

### 3. Ajouter au docker-compose principal

Les services FoodTrack ont déjà été ajoutés à votre `swag.yml` :

- `jow-postgres` : Base de données PostgreSQL
- `jow-backend` : API NestJS
- `jow-frontend` : Application Nuxt

### 4. Charger les variables d'environnement

```bash
# Depuis la racine du projet
export $(cat .env.production | xargs)
```

### 5. Builder et démarrer les services

```bash
# Retourner au répertoire où se trouve swag.yml
cd ~
docker-compose -f swag.yml up -d jow-postgres jow-backend jow-frontend
```

### 6. Initialiser la base de données

```bash
# Attendre que PostgreSQL soit prêt (environ 10 secondes)
sleep 10

# Appliquer les migrations Prisma
docker exec jow-backend npx prisma migrate deploy

# Peupler la base avec les données initiales (40+ recettes)
docker exec jow-backend npm run prisma:seed
```

### 7. Vérifier que tout fonctionne

```bash
# Vérifier les logs
docker logs jow-backend
docker logs jow-frontend

# Vérifier l'état des services
docker ps | grep jow
```

### 8. Tester l'application

- Frontend : https://jow.chocot.be
- Backend API : https://apijow.chocot.be
- Documentation Swagger : https://apijow.chocot.be/api

## 🔄 Mise à jour du déploiement

### Mise à jour du code

```bash
cd ~/Jow
git pull origin main

# Reconstruire les images
cd ~
docker-compose -f swag.yml build jow-backend jow-frontend

# Redémarrer les services
docker-compose -f swag.yml up -d jow-backend jow-frontend
```

### Appliquer de nouvelles migrations

```bash
docker exec jow-backend npx prisma migrate deploy
```

### Mettre à jour les données de seed

```bash
docker exec jow-backend npm run prisma:seed
```

## 🗄️ Sauvegarde de la base de données

### Créer une sauvegarde

```bash
docker exec jow-postgres pg_dump -U jow_user jow_db > ~/backups/jow_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurer une sauvegarde

```bash
cat ~/backups/jow_backup_YYYYMMDD_HHMMSS.sql | docker exec -i jow-postgres psql -U jow_user jow_db
```

### Sauvegarde automatique (cron)

Ajoutez à votre crontab :

```bash
crontab -e

# Ajouter cette ligne pour une sauvegarde quotidienne à 3h du matin
0 3 * * * docker exec jow-postgres pg_dump -U jow_user jow_db > ~/backups/jow_backup_$(date +\%Y\%m\%d).sql
```

## 🔧 Maintenance

### Voir les logs

```bash
# Logs en temps réel
docker logs -f jow-backend
docker logs -f jow-frontend

# Dernières 100 lignes
docker logs --tail 100 jow-backend
```

### Redémarrer un service

```bash
docker-compose -f swag.yml restart jow-backend
docker-compose -f swag.yml restart jow-frontend
```

### Accéder à la base de données

```bash
# Via psql
docker exec -it jow-postgres psql -U jow_user -d jow_db

# Via Prisma Studio (en local avec tunnel SSH)
ssh -L 5555:localhost:5555 votre-serveur
docker exec -it jow-backend npx prisma studio
# Puis ouvrez http://localhost:5555 dans votre navigateur local
```

### Nettoyer les anciennes images

```bash
docker image prune -a
```

## 🔒 Sécurité

### SSL/HTTPS

Si vous n'avez pas encore configuré HTTPS avec Traefik, modifiez les labels dans `swag.yml` :

```yaml
labels:
  - "traefik.http.routers.jow.entrypoints=websecure"  # Au lieu de 'http'
  - "traefik.http.routers.jow.tls.certresolver=letsencrypt"
```

### Variables d'environnement sensibles

- Ne commitez JAMAIS `.env.production`
- Utilisez des mots de passe forts (minimum 32 caractères)
- Changez le `JWT_SECRET` en production
- Utilisez des App Passwords pour Gmail, pas votre mot de passe principal

### Volumes et données

Les données persistantes sont stockées dans :
- Base de données : volume Docker `jow-postgres-data`
- Images uploadées : `~/jow-uploads` sur l'hôte

## 📊 Monitoring

### Vérifier l'utilisation des ressources

```bash
docker stats jow-postgres jow-backend jow-frontend
```

### Vérifier l'espace disque

```bash
# Base de données
docker exec jow-postgres du -sh /var/lib/postgresql/data

# Images uploadées
du -sh ~/jow-uploads
```

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker logs jow-backend

# Vérifier que PostgreSQL est démarré
docker ps | grep jow-postgres

# Vérifier la connexion DB
docker exec jow-backend npx prisma db pull
```

### Le frontend ne se connecte pas au backend

1. Vérifiez `NUXT_PUBLIC_API_BASE` dans le docker-compose
2. Vérifiez `CORS_ORIGIN` dans les variables du backend
3. Vérifiez que Traefik route correctement :
   ```bash
   curl -I https://apijow.chocot.be
   ```

### Les emails ne partent pas

1. Vérifiez les credentials SMTP dans `.env.production`
2. Pour Gmail, activez la validation en 2 étapes et générez un App Password
3. Vérifiez les logs :
   ```bash
   docker logs jow-backend | grep -i "email\|smtp"
   ```

### Les images uploadées ne s'affichent pas

1. Vérifiez que le volume est bien monté :
   ```bash
   docker inspect jow-backend | grep -A 5 Mounts
   ```

2. Vérifiez les permissions :
   ```bash
   ls -la ~/jow-uploads/images/
   ```

3. Testez l'accès direct :
   ```bash
   curl -I https://apijow.chocot.be/uploads/images/test.jpg
   ```

## 📝 Checklist de déploiement

- [ ] Cloner le projet sur le serveur
- [ ] Créer et remplir `.env.production`
- [ ] Ajouter les services au docker-compose
- [ ] Créer les volumes nécessaires
- [ ] Builder les images Docker
- [ ] Démarrer les services
- [ ] Appliquer les migrations Prisma
- [ ] Seeder la base de données
- [ ] Tester l'accès au frontend
- [ ] Tester l'accès au backend/API
- [ ] Tester la création de compte
- [ ] Tester la soumission d'une recette
- [ ] Vérifier la réception de l'email
- [ ] Configurer les sauvegardes automatiques
- [ ] Configurer HTTPS si nécessaire

## 🆘 Support

En cas de problème :
1. Vérifiez les logs : `docker logs jow-backend`
2. Vérifiez l'état des services : `docker ps`
3. Consultez la documentation Traefik si problème de routing
4. Vérifiez que les ports ne sont pas déjà utilisés

## 📚 Ressources

- Documentation Prisma : https://www.prisma.io/docs
- Documentation NestJS : https://docs.nestjs.com
- Documentation Nuxt : https://nuxt.com
- Documentation Traefik : https://doc.traefik.io/traefik/

