# Fonctionnement des Préférences Utilisateur

## ✅ Oui, vos préférences sont bien enregistrées et fonctionnelles !

### 1. Enregistrement des préférences

Les préférences sont sauvegardées dans la base de données via l'endpoint `/users/me/settings` :
- **householdSize** : Nombre de personnes (utilisé pour ajuster les quantités)
- **defaultMealsPerWeek** : Nombre de repas par semaine par défaut
- **toolsAvailable** : Équipements disponibles (four, micro-ondes, etc.)
- **dietPreferences** : Contraintes alimentaires (végétarien, halal, etc.)
- **difficultyPreference** : Niveau de difficulté préféré (EASY, MEDIUM, HARD)
- **maxPrepTime** : Temps de préparation maximum en minutes

### 2. Utilisation dans la génération de menus

**Oui, la sélection de recettes utilise bien vos critères !**

L'algorithme de génération (dans `meal-plans.service.ts`) :

1. **Récupère vos préférences** depuis la base de données (lignes 56-62)
2. **Applique des filtres stricts** :
   - ✅ **Contraintes alimentaires** : Les recettes doivent correspondre à TOUTES vos préférences alimentaires
   - ✅ **Difficulté** : Seulement les recettes avec difficulté ≤ votre préférence
   - ✅ **Temps de préparation** : Seulement les recettes avec prepTime ≤ votre maxPrepTime
   - ✅ **Équipements** : Seulement les recettes qui nécessitent des outils que vous avez

3. **Stratégie de fallback intelligente** :
   - Si pas assez de recettes trouvées, l'algorithme relâche progressivement les contraintes :
     - Tentative 1 : Contraintes strictes
     - Tentative 2 : Relâche la difficulté
     - Tentative 3 : Relâche le temps de préparation (+50%)
     - Tentative 4 : Garde seulement les contraintes alimentaires
     - Dernier recours : N'importe quelle recette

4. **Diversité** : L'algorithme assure une variété dans les tags et difficultés

### 3. Modification des préférences

**Oui, il y a maintenant une page pour modifier vos préférences !**

- **Page** : `/settings`
- **Accès** : Bouton "Paramètres" dans le dashboard
- **Fonctionnalités** :
  - Modifier toutes vos préférences
  - Interface identique à l'onboarding
  - Sauvegarde immédiate

## Comment tester

1. **Vérifier l'enregistrement** :
   - Complétez l'onboarding
   - Allez sur `/settings` pour voir vos préférences

2. **Vérifier l'utilisation** :
   - Générez un plan de repas
   - Les recettes proposées devraient respecter vos critères :
     - Si vous avez sélectionné "Végétarien", toutes les recettes seront végétariennes
     - Si vous avez sélectionné "EASY" et maxPrepTime 30min, les recettes seront faciles et rapides
     - Si vous n'avez que "four", les recettes nécessiteront au maximum un four

3. **Modifier les préférences** :
   - Allez sur `/settings`
   - Modifiez vos préférences
   - Générez un nouveau plan de repas
   - Les nouvelles recettes devraient refléter vos nouvelles préférences

## Points d'attention

- Les **contraintes alimentaires** sont en mode "ET" (toutes doivent être respectées)
- Les **équipements** sont en mode "OU" (la recette doit nécessiter au moins un de vos équipements, ou aucun équipement)
- Si vous n'avez pas assez de recettes correspondant à vos critères, l'algorithme relâche progressivement les contraintes pour trouver des recettes

