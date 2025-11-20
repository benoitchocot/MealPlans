# FoodTrack - Meal Planning Application

Application complète de planification de repas avec génération automatique de menus et listes de courses.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Installation](#installation)
- [Développement](#développement)
- [Tests](#tests)
- [Documentation API](#documentation-api)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)

## 🎯 Vue d'ensemble

FoodTrack est une application web moderne permettant de :
- Parcourir et découvrir des recettes
- Générer automatiquement des plans de repas personnalisés
- Créer des listes de courses à partir des plans de repas

## ✨ Fonctionnalités

### Phase 1 : Fondations Backend ✅
- ✅ Setup projet NestJS + Prisma + PostgreSQL
- ✅ Configuration Docker Compose (DB + Backend)
- ✅ Schéma Prisma complet + migrations initiales
- ✅ Module Auth (register, login, JWT)
- ✅ Module Users + UserSettings (CRUD)
- ✅ Tests unitaires Auth + Users

### Phase 2 : Domaine Recettes ✅
- ✅ Module Recipes (CRUD)
- ✅ Module Ingredients (CRUD)
- ✅ Endpoints de recherche/filtrage de recettes
- ✅ Seed de données (20-30 recettes réalistes)
- ✅ Tests d'intégration Recipes

### Phase 3 : Génération de Menus ✅
- ✅ Module MealPlans
- ✅ Service de génération intelligente de menus
- ✅ Endpoint POST /meal-plans/generate
- ✅ Tests du service de génération

### Phase 4 : Liste de Courses ✅
- ✅ Module ShoppingLists
- ✅ Service d'agrégation des ingrédients
- ✅ Endpoints CRUD shopping lists
- ✅ Tests d'intégration


### Phase 6 : Frontend Nuxt 3 ✅
- ✅ Setup Nuxt 3 + Tailwind + PWA
- ✅ Configuration TypeScript + Pinia
- ✅ Pages complètes (Landing, Dashboard, Recipes, Meal Plans, Shopping Lists)
- ✅ Composants réutilisables
- ✅ Intégration API backend
- ✅ Auth flow complet

### Phase 7 : PWA & Offline ✅
- ✅ Configuration PWA (manifest, service worker)
- ✅ Cache des recettes consultées
- ✅ Mode offline pour consultation
- ✅ Indicateur de statut offline

### Phase 8 : Tests & Qualité ✅
- ✅ Tests e2e Playwright
- ✅ Tests unitaires frontend (Vitest)
- ✅ Documentation API (Swagger/OpenAPI)
- ✅ README complet

## 🛠 Stack technique

### Backend
- **Framework** : NestJS 10
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : JWT (Passport)
- **Validation** : class-validator
- **Documentation** : Swagger/OpenAPI
- **Tests** : Jest

### Frontend
- **Framework** : Nuxt 3
- **Styling** : Tailwind CSS
- **State Management** : Pinia
- **Internationalisation** : @nuxtjs/i18n (FR/EN)
- **PWA** : @vite-pwa/nuxt
- **Tests** : Vitest (unitaires), Playwright (e2e)

### Infrastructure
- **Containerisation** : Docker & Docker Compose
- **Base de données** : PostgreSQL (via Docker)

## 🚀 Installation

### Prérequis

- Node.js 20+
- Docker & Docker Compose
- npm ou yarn

### Installation complète

1. **Cloner le repository** (si applicable)
   ```bash
   git clone <repository-url>
   cd FoodTrack
   ```

2. **Démarrer la base de données**
   ```bash
   docker-compose up -d postgres
   ```

3. **Configurer le backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configurer les variables d'environnement
   npm run prisma:migrate
   npm run prisma:generate
   npm run prisma:seed  # Optionnel : charger des données de test
   ```

4. **Configurer le frontend**
   ```bash
   cd ../frontend
   npm install
   ```

## 💻 Développement

### Démarrer le backend

```bash
cd backend
npm run start:dev
```

Le backend sera disponible sur `http://localhost:3000`
La documentation Swagger sera disponible sur `http://localhost:3000/api`

### Démarrer le frontend

```bash
cd frontend
npm run dev
```

Le frontend sera disponible sur `http://localhost:3001`

### Démarrer avec Docker Compose

```bash
docker-compose up --build
```

## 🧪 Tests

### Tests Backend

```bash
cd backend
npm test              # Tests unitaires
npm run test:cov      # Tests avec couverture
npm run test:e2e      # Tests end-to-end
```

### Tests Frontend

```bash
cd frontend
npm test              # Tests unitaires (Vitest)
npm run test:watch    # Tests en mode watch
npm run test:e2e      # Tests e2e (Playwright)
npm run test:e2e:ui   # Tests e2e avec interface UI
```

## 📚 Documentation API

Une fois le backend démarré, la documentation Swagger est disponible à :
- **URL** : `http://localhost:3000/api`
- **Format** : OpenAPI 3.0
- **Authentification** : JWT Bearer Token

### Endpoints principaux

#### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/profile` - Profil utilisateur (protégé)

#### Recettes
- `GET /recipes` - Liste des recettes (avec filtres)
- `GET /recipes/:id` - Détail d'une recette
- `POST /recipes` - Créer une recette (protégé)

#### Plans de repas
- `GET /meal-plans` - Liste des plans de repas (protégé)
- `POST /meal-plans/generate` - Générer un plan de repas (protégé)
- `GET /meal-plans/:id` - Détail d'un plan de repas (protégé)

#### Listes de courses
- `GET /shopping-lists` - Liste des listes de courses (protégé)
- `POST /shopping-lists/from-meal-plan` - Générer depuis un plan de repas (protégé)
- `GET /shopping-lists/:id` - Détail d'une liste (protégé)


## 📁 Structure du projet

```
Jow/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/           # Module d'authentification
│   │   ├── users/           # Module utilisateurs
│   │   ├── recipes/         # Module recettes
│   │   ├── ingredients/     # Module ingrédients
│   │   ├── meal-plans/      # Module plans de repas
│   │   ├── shopping-lists/  # Module listes de courses
│   │   └── prisma/          # Service Prisma
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma de base de données
│   │   └── migrations/      # Migrations
│   └── test/                # Tests e2e
│
├── frontend/                 # Application Nuxt 3
│   ├── components/          # Composants réutilisables
│   ├── composables/         # Composables Vue
│   ├── pages/              # Pages de l'application
│   ├── i18n/               # Fichiers de traduction
│   ├── e2e/                # Tests e2e Playwright
│   └── tests/              # Tests unitaires Vitest
│
└── docker-compose.yml       # Configuration Docker
```

## 🌍 Internationalisation

L'application supporte deux langues :
- **Français** (par défaut)
- **English**

La langue est détectée automatiquement depuis le navigateur. L'utilisateur peut également changer manuellement la langue via le sélecteur dans la navbar.

## 📱 PWA

L'application est une Progressive Web App (PWA) :
- Installable sur mobile et desktop
- Mode offline pour consulter les recettes mises en cache
- Service Worker pour la mise en cache intelligente
- Indicateur de statut offline

Voir [PWA.md](frontend/PWA.md) pour plus de détails.

## 🚢 Déploiement

### Backend

1. Configurer les variables d'environnement de production
2. Build : `npm run build`
3. Démarrer : `npm run start:prod`

### Frontend

1. Configurer les variables d'environnement
2. Build : `npm run build`
3. Preview : `npm run preview`

## 📝 Scripts disponibles

### Backend
- `npm run start:dev` - Développement avec hot-reload
- `npm run build` - Build production
- `npm run start:prod` - Démarrer en production
- `npm test` - Tests unitaires
- `npm run test:cov` - Tests avec couverture
- `npm run test:e2e` - Tests e2e
- `npm run prisma:migrate` - Migrations
- `npm run prisma:studio` - Prisma Studio

### Frontend
- `npm run dev` - Développement
- `npm run build` - Build production
- `npm run preview` - Preview production
- `npm test` - Tests unitaires
- `npm run test:e2e` - Tests e2e
- `npm run test:e2e:ui` - Tests e2e avec UI

## 🤝 Contribution

1. Créer une branche pour votre fonctionnalité
2. Faire vos modifications
3. Ajouter des tests
4. S'assurer que tous les tests passent
5. Créer une pull request

## 📄 Licence

MIT

## 👥 Auteurs

Développé avec ❤️ pour simplifier la planification de repas.

