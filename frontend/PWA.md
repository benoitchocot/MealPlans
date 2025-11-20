# Guide PWA - FoodTrack

## Fonctionnalités PWA implémentées

### ✅ Configuration PWA
- Manifest PWA configuré avec icônes (192x192 et 512x512)
- Service Worker activé avec Workbox
- Mode standalone pour une expérience native
- Thème coloré (#10b981)

### ✅ Cache des recettes
- Les recettes consultées sont automatiquement mises en cache
- Stratégie NetworkFirst : essaie le réseau d'abord, puis le cache si offline
- Cache des recettes individuelles : 7 jours, max 50 entrées
- Cache de la liste des recettes : 1 jour, max 10 entrées
- Cache général API : 1 heure, max 100 entrées

### ✅ Mode Offline
- Détection automatique du statut online/offline
- Indicateur visuel en haut de page quand offline
- Consultation des recettes mises en cache même sans connexion
- Fallback automatique vers le cache en cas d'erreur réseau

### ✅ Installation PWA
- Prompt d'installation automatique
- Installation possible sur mobile (iOS/Android) et desktop
- Mise à jour automatique du service worker

## Test de la PWA

### Sur Desktop (Chrome/Edge)
1. Ouvrir l'application dans le navigateur
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. L'application s'ouvre en mode standalone

### Sur Mobile (iOS)
1. Ouvrir l'application dans Safari
2. Cliquer sur le bouton "Partager"
3. Sélectionner "Sur l'écran d'accueil"
4. L'application apparaît comme une app native

### Sur Mobile (Android)
1. Ouvrir l'application dans Chrome
2. Un prompt d'installation apparaît automatiquement
3. Ou via le menu : "Ajouter à l'écran d'accueil"

### Test du mode offline
1. Ouvrir l'application et consulter quelques recettes
2. Activer le mode avion ou couper le WiFi
3. L'indicateur "Mode hors ligne" apparaît
4. Les recettes consultées restent accessibles depuis le cache

## Configuration

La configuration PWA se trouve dans `nuxt.config.ts` :

```typescript
pwa: {
  registerType: 'autoUpdate',
  manifest: { ... },
  workbox: {
    runtimeCaching: [ ... ]
  }
}
```

## Composable useOffline

Un composable `useOffline` est disponible pour gérer le mode offline :

```typescript
const { isOnline, isOffline, isCached, getFromCache } = useOffline()
```

## Composant OfflineIndicator

Un composant `OfflineIndicator` affiche automatiquement un bandeau en haut de page quand l'application est offline.

