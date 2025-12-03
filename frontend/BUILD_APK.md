# Guide pour générer l'APK Android de MealPlans

## Prérequis

1. **Java JDK 11+** installé
2. **Android Studio** installé (optionnel mais recommandé)
3. **Variables d'environnement Android** configurées (ANDROID_HOME, etc.)

## Étapes pour générer l'APK

### 1. Construire l'application Nuxt

```bash
cd frontend
npm run generate
```

### 2. Synchroniser avec Capacitor

```bash
npm run cap:sync
```

Cela copie les fichiers web générés dans le projet Android.

### 3. Générer l'APK de debug (pour tester)

```bash
cd android
./gradlew assembleDebug
```

L'APK sera généré dans : `android/app/build/outputs/apk/debug/app-debug.apk`

### 4. Générer l'APK de release (pour publication)

**IMPORTANT :** Avant de générer l'APK de release, vous devez :

1. **Créer une clé de signature** (si ce n'est pas déjà fait) :
```bash
keytool -genkey -v -keystore mealplans-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mealplans
```

2. **Configurer la signature** dans `android/app/build.gradle` :
```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/mealplans-release-key.jks')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'mealplans'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

3. **Générer l'APK de release** :
```bash
cd android
./gradlew assembleRelease
```

L'APK sera généré dans : `android/app/build/outputs/apk/release/app-release.apk`

### 5. Générer un AAB (Android App Bundle) pour Google Play Store

```bash
cd android
./gradlew bundleRelease
```

L'AAB sera généré dans : `android/app/build/outputs/bundle/release/app-release.aab`

## Configuration de l'API

⚠️ **IMPORTANT** : Pour que l'application fonctionne sur mobile, vous **DEVEZ** configurer l'URL de l'API backend.

### Configuration via fichier .env (recommandé)

Créez un fichier `.env` dans le dossier `frontend/` avec :

```bash
NUXT_PUBLIC_API_BASE=https://apifood.chocot.be
```

Ce fichier sera automatiquement chargé par Nuxt lors du build. Le fichier `.env` est ignoré par git (ne sera pas commité).

**Pour le développement local**, vous pouvez créer un `.env.local` avec :
```bash
NUXT_PUBLIC_API_BASE=http://localhost:3000
```

### Option alternative : Variable d'environnement

Si vous préférez définir la variable manuellement :

```bash
export NUXT_PUBLIC_API_BASE=https://apifood.chocot.be
npm run generate
npm run cap:sync
```

**Note** : Si aucune variable n'est définie, l'APK utilisera `http://localhost:3000` par défaut, ce qui ne fonctionnera **PAS** sur un appareil mobile.

### Option 2 : API locale (pour développement)

Dans `capacitor.config.ts`, décommentez et configurez :

```typescript
server: {
  url: 'http://VOTRE_IP_LOCALE:3000',
  cleartext: true
}
```

**Note :** Remplacez `VOTRE_IP_LOCALE` par l'IP locale de votre machine (ex: `192.168.1.100`).

## Workflow recommandé

Pour un workflow rapide, utilisez les scripts npm :

```bash
# Tout en un : build + sync
npm run cap:build

# Ouvrir Android Studio
npm run cap:open android
```
Si vous avez un téléphone Android connecté à votre pc, vous pouvez faire cette commande pour voir l'application sur votre téléphone.
```bash
npx cap run android
```

Puis dans Android Studio :
- Build > Generate Signed Bundle / APK
- Suivez l'assistant pour créer l'APK ou AAB signé

## Informations importantes

- **App ID** : `com.mealplans.app`
- **App Name** : `MealPlans`
- **Version Code** : Modifiable dans `android/app/build.gradle` (versionCode)
- **Version Name** : Modifiable dans `android/app/build.gradle` (versionName)

## Dépannage

### Erreur "SDK location not found"
Configurez `ANDROID_HOME` dans votre environnement :
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Erreur de permissions
Vérifiez que les permissions nécessaires sont dans `AndroidManifest.xml`

### L'API ne fonctionne pas sur l'APK (mais fonctionne sur localhost/prod)

**Symptômes** : L'application fonctionne sur localhost et en production web, mais les appels API échouent sur l'APK.

**Causes possibles** :

1. **URL de l'API incorrecte** : L'APK utilise `http://localhost:3000` au lieu de l'URL de production.
   - **Solution** : Vérifiez que vous avez défini `NUXT_PUBLIC_API_BASE` avant de générer :
   ```bash
   export NUXT_PUBLIC_API_BASE=https://apifood.chocot.be
   npm run generate
   npm run cap:sync
   ```
   - **Vérification** : Après le build, vérifiez le fichier `.output/public/_nuxt/` pour voir quelle URL est utilisée.

2. **Problème de sécurité réseau Android** : Android bloque le trafic HTTP (cleartext) par défaut.
   - **Solution** : Un fichier `network_security_config.xml` a été créé pour permettre les connexions HTTPS vers l'API de production.
   - Si vous utilisez HTTP en développement local, décommentez la section correspondante dans `android/app/src/main/res/xml/network_security_config.xml`.

3. **CORS** : Le serveur backend doit autoriser les requêtes depuis l'application mobile.
   - **Solution** : Vérifiez que le backend autorise les origines Capacitor (voir `backend/src/main.ts`).

**Pour déboguer** :
- Connectez votre téléphone en USB
- Activez le débogage USB dans les options développeur
- Utilisez `adb logcat` pour voir les erreurs :
  ```bash
  adb logcat | grep -i "error\|exception\|network"
  ```
- Ou utilisez Chrome DevTools : `chrome://inspect` > Inspecter votre appareil

