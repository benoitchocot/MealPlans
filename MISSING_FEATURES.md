# Fonctionnalités manquantes par rapport aux instructions

## ✅ Ce qui est implémenté

- ✅ Authentification email/password
- ✅ Génération de menus personnalisés
- ✅ Affichage des recettes avec détails complets
- ✅ Liste de courses agrégée
- ✅ Catégorisation des ingrédients
- ✅ Cocher/décocher des ingrédients
- ✅ Modifier les quantités
- ✅ PWA avec mode offline
- ✅ Tests (e2e + unitaires)
- ✅ Documentation API (Swagger)

## 📝 À implémenter plus tard (noté)

### **CRUD de recettes**
**Demande :** Possibilité de créer / supprimer / éditer des recettes dans un formulaire simple

**Contraintes :**
- Les recettes doivent être accessibles à tous
- Éviter que des utilisateurs malveillants fassent n'importe quoi
- Solution de modération/validation à prévoir

**À discuter :**
- Système de modération (approbation manuelle)
- Système de validation (vérification automatique)
- Système de permissions (utilisateurs vérifiés)
- Système de signalement

## ❌ Ce qui manque
### 4. **Export de liste de courses**
**Instructions :** 
- Export texte / PDF / partage (copier-coller)

**État actuel :** 
- Pas d'option d'export

**À implémenter :**
- Bouton "Exporter" sur la page de liste de courses
- Options : Texte, PDF, Copier dans le presse-papier
- Format lisible et organisé par catégories

### 6. **OAuth Google** (Optionnel mais mentionné)
**Instructions :** Authentification utilisateur par email/mot de passe, éventuellement OAuth (Google)

**État actuel :** 
- Seulement email/password

**À implémenter :**
- Intégration OAuth Google
- Bouton "Continuer avec Google" sur login/register

### 7. **Historique des menus/recettes**
**Instructions :** Sauvegarde de l'historique des menus / recettes utilisées

**État actuel :** 
- Les menus sont sauvegardés mais pas de page d'historique dédiée
- Pas de suivi des recettes consultées/utilisées

**À implémenter :**
- Page "Historique" ou section dans le dashboard
- Liste des menus précédents
- Recettes récemment consultées
- Statistiques (recettes favorites, etc.)

### 8. **Amélioration UX - Flow utilisateur**
**Instructions :** Flow type avec onboarding → génération → sélection → liste → export

**État actuel :** 
- Le flow existe mais n'est pas guidé
- Pas de redirection automatique après onboarding

**À améliorer :**
- Guide/assistant pour les nouveaux utilisateurs
- Redirections automatiques logiques dans le flow
- Indicateurs de progression

## Priorités recommandées

1. **URGENT :** Onboarding & Préférences (bloque l'expérience utilisateur)
2. **IMPORTANT :** Page d'accueil améliorée (première impression)
3. **IMPORTANT :** Export de liste de courses (fonctionnalité demandée)
4. **NICE TO HAVE :** Bouton regénérer, filtres, OAuth, historique

