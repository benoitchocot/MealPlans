# Schéma de Base de Données - FoodTrack

## 📊 Diagramme des Relations

Le schéma complet au format DBML est disponible dans [`database/schema.dbml`](./database/schema.dbml).

Pour visualiser le diagramme de manière interactive, vous pouvez :
1. Copier le contenu de `database/schema.dbml`
2. Le coller sur [dbdiagram.io](https://dbdiagram.io/)
3. Le diagramme sera généré automatiquement

## 📋 Modèles de Données

### 👤 User
Utilisateurs de l'application

**Champs principaux :**
- `id` : UUID unique
- `email` : Email (unique)
- `password` : Mot de passe hashé
- `firstName`, `lastName` : Nom et prénom
- `createdAt`, `updatedAt` : Dates de création/modification

**Relations :**
- `settings` : Préférences utilisateur (1-1)
- `recipes` : Recettes créées (1-N)
- `mealPlans` : Plans de repas (1-N)
- `shoppingLists` : Listes de courses (1-N)
- `favorites` : Recettes favorites (1-N)
- `recipeViews` : Historique de consultation (1-N)
- `recipeSubmissions` : Soumissions de recettes (1-N)

---

### ⚙️ UserSettings
Préférences utilisateur pour la génération de plans

**Champs principaux :**
- `householdSize` : Nombre de personnes dans le foyer
- `defaultMealsPerWeek` : Nombre de repas par semaine
- `toolsAvailable` : Outils de cuisine disponibles (enum[])
- `dietPreferences` : Régimes alimentaires (enum[])
- `difficultyPreference` : Niveau de difficulté préféré
- `maxPrepTime` : Temps de préparation maximum (en minutes)

**Enums utilisés :**
- `KitchenTool` : OVEN, STOVE, MICROWAVE, BLENDER, FOOD_PROCESSOR, etc.
- `DietType` : VEGETARIAN, VEGAN, HALAL, GLUTEN_FREE, etc.
- `Difficulty` : EASY, MEDIUM, HARD

---

### 🍳 Recipe
Recettes de cuisine

**Champs principaux :**
- `id` : UUID unique
- `title` : Titre de la recette
- `description` : Description (optionnel)
- `imageUrl` : URL de l'image
- `prepTime` : Temps de préparation (minutes)
- `cookTime` : Temps de cuisson (minutes)
- `servings` : Nombre de portions (défaut: 1)
- `difficulty` : Niveau de difficulté
- `tags` : Tags de recette (enum[])
- `toolsRequired` : Outils nécessaires (enum[])
- `dietTypes` : Types de régimes compatibles (enum[])

**Relations :**
- `author` : Utilisateur créateur (N-1)
- `ingredients` : Liste d'ingrédients (1-N via RecipeIngredient)
- `steps` : Étapes de préparation (1-N)
- `mealPlanRecipes` : Plans de repas utilisant cette recette (1-N)
- `favorites` : Utilisateurs ayant mis en favori (1-N)
- `views` : Historique de consultation (1-N)

---

### 🥕 Ingredient
Ingrédients disponibles

**Champs principaux :**
- `id` : UUID unique
- `name` : Nom de l'ingrédient
- `category` : Catégorie (enum)
- `defaultUnit` : Unité par défaut (enum)

**Relations :**
- `recipeIngredients` : Utilisations dans les recettes (1-N)
- `shoppingListItems` : Présence dans les listes de courses (1-N)

**Categories :**
- MEAT, FISH, DAIRY, VEGETABLES, FRUITS, GRAINS, SPICES, etc.

---

### 🔗 RecipeIngredient
Table de liaison entre Recipe et Ingredient

**Champs :**
- `quantity` : Quantité (Decimal)
- `unit` : Unité de mesure (enum)
- `optional` : Ingrédient optionnel (booléen)

---

### 📝 RecipeStep
Étapes de préparation d'une recette

**Champs :**
- `stepNumber` : Numéro de l'étape
- `instruction` : Instructions détaillées

---

### 📅 MealPlan
Plans de repas générés

**Champs principaux :**
- `id` : UUID unique
- `name` : Nom du plan
- `startDate` : Date de début
- `endDate` : Date de fin
- `mealsPerWeek` : Nombre de repas dans ce plan

**Relations :**
- `user` : Utilisateur propriétaire (N-1)
- `mealPlanRecipes` : Recettes du plan (1-N)
- `shoppingLists` : Listes de courses générées (1-N)

---

### 📆 MealPlanRecipe
Association entre plan de repas et recettes

**Champs :**
- `mealDate` : Date du repas
- `mealType` : Type de repas (BREAKFAST, LUNCH, DINNER, SNACK)

---

### 🛒 ShoppingList
Listes de courses

**Champs principaux :**
- `id` : UUID unique
- `name` : Nom de la liste
- `status` : Statut (IN_PROGRESS, FINALIZED, COMPLETED)
- `createdAt` : Date de création

**Relations :**
- `user` : Utilisateur propriétaire (N-1)
- `mealPlan` : Plan de repas source (N-1, optionnel)
- `items` : Articles de la liste (1-N)

---

### 📦 ShoppingListItem
Articles individuels d'une liste de courses

**Champs :**
- `quantity` : Quantité totale (agrégée)
- `unit` : Unité de mesure
- `checked` : Coché/Acheté (booléen)

**Relations :**
- `ingredient` : Ingrédient concerné (N-1)
- `shoppingList` : Liste parente (N-1)

---

### ❤️ Favorite
Recettes favorites des utilisateurs

**Champs :**
- `userId` + `recipeId` : Clé composite unique
- `createdAt` : Date d'ajout aux favoris

---

### 👁️ RecipeView
Historique de consultation des recettes

**Champs :**
- `userId` + `recipeId` + `date` : Clé composite unique
- `viewedAt` : Date/heure de consultation

**Note :** Une seule vue par utilisateur par recette par jour (agrégation automatique)

---

### 📤 RecipeSubmission
Soumissions de recettes par les utilisateurs

**Champs principaux :**
- `id` : UUID unique
- `status` : Statut (PENDING, APPROVED, REJECTED)
- `approvalToken` : Token unique pour approbation (64 caractères)
- `title`, `description`, `imageUrl` : Détails de la recette
- `prepTime`, `cookTime`, `servings`, `difficulty` : Caractéristiques
- `tags`, `toolsRequired`, `dietTypes` : Filtres
- `submittedAt` : Date de soumission
- `reviewedAt` : Date de review (null si en attente)
- `rejectionReason` : Raison du rejet (optionnel)

**Relations :**
- `user` : Utilisateur soumettant (N-1)
- `ingredients` : Ingrédients proposés (1-N via RecipeSubmissionIngredient)
- `steps` : Étapes proposées (1-N via RecipeSubmissionStep)

**Workflow :**
1. Utilisateur soumet une recette → `status: PENDING`, `approvalToken` généré
2. Email envoyé à l'admin avec lien unique contenant le token
3. Admin approuve → Recette créée, `status: APPROVED`, `reviewedAt` renseigné
4. Admin rejette → `status: REJECTED`, `rejectionReason` renseigné

---

## 🔢 Énumérations

### DietType
`VEGETARIAN`, `VEGAN`, `HALAL`, `KOSHER`, `GLUTEN_FREE`, `LACTOSE_FREE`, `NUT_FREE`

### Difficulty
`EASY`, `MEDIUM`, `HARD`

### KitchenTool
`OVEN`, `STOVE`, `MICROWAVE`, `BLENDER`, `FOOD_PROCESSOR`, `MIXER`, `SLOW_COOKER`, `PRESSURE_COOKER`, `AIR_FRYER`, `GRILL`, `STEAMER`

### Unit
`GRAM`, `KILOGRAM`, `LITER`, `MILLILITER`, `PIECE`, `TABLESPOON`, `TEASPOON`, `CUP`, `PINCH`, `SLICE`, `CLOVE`, `BUNCH`

### IngredientCategory
`MEAT`, `FISH`, `DAIRY`, `VEGETABLES`, `FRUITS`, `GRAINS`, `LEGUMES`, `NUTS`, `SPICES`, `OILS`, `CONDIMENTS`, `BAKING`, `BEVERAGES`, `OTHER`

### RecipeTag
`QUICK`, `BUDGET`, `COMFORT_FOOD`, `HEALTHY`, `FESTIVE`, `SUMMER`, `WINTER`, `SOUP`, `SALAD`, `DESSERT`, `BREAKFAST`, `APPETIZER`, `MAIN_COURSE`, `SIDE_DISH`, `BEVERAGE`

### MealType
`BREAKFAST`, `LUNCH`, `DINNER`, `SNACK`

### ShoppingListStatus
`IN_PROGRESS`, `FINALIZED`, `COMPLETED`

### RecipeSubmissionStatus
`PENDING`, `APPROVED`, `REJECTED`

---

## 📊 Statistiques du Schéma

- **14 modèles** de données
- **11 enums** pour typage fort
- **~20 relations** entre les tables
- **Support complet** de l'application (auth, recettes, plans, listes, favoris, historique, soumissions)

---

## 🔄 Migrations

Les migrations Prisma sont dans `backend/prisma/migrations/`.

Pour créer une nouvelle migration :
```bash
cd backend
npx prisma migrate dev --name ma_migration
```

Pour appliquer les migrations en production :
```bash
npx prisma migrate deploy
```

---

## 🌱 Seed

Le fichier `backend/prisma/seed.ts` contient :
- 40+ recettes variées pour 1 personne
- Tous les ingrédients nécessaires avec catégories
- Associations recettes-ingrédients avec quantités précises

Pour peupler la base :
```bash
cd backend
npm run prisma:seed
```

---

## 🛠️ Outils

### Prisma Studio
Interface graphique pour explorer et modifier les données :
```bash
cd backend
npx prisma studio
```
Accessible sur http://localhost:5555

### Générer le DBML
Pour mettre à jour le schéma DBML :
```bash
cd backend
npx prisma generate
```

Le fichier `database/schema.dbml` sera régénéré.

### Visualiser le schéma
1. Ouvrez [dbdiagram.io](https://dbdiagram.io/)
2. Cliquez sur "Import" → "From DBML"
3. Collez le contenu de `database/schema.dbml`
4. Le diagramme ERD sera généré automatiquement avec toutes les relations

