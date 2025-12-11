# Tests E2E avec Playwright

Ce dossier contient les tests end-to-end (E2E) pour l'application AGSE Golf, utilisant Playwright.

## Structure des tests

```
e2e/
├── auth.spec.ts              # Tests d'authentification (login, register)
├── dark-mode.spec.ts         # Tests du mode sombre
├── membership-form.spec.ts   # Tests du formulaire d'adhésion
├── navigation.spec.ts        # Tests de navigation
├── helpers/
│   └── test-helpers.ts       # Fonctions utilitaires pour les tests
└── README.md                 # Ce fichier
```

## Installation

1. Installer les dépendances Playwright :

```bash
npm install
```

2. Installer les navigateurs Playwright :

```bash
npx playwright install
```

Ou pour installer uniquement Chromium (plus rapide) :

```bash
npx playwright install chromium
```

## Lancer les tests

Par défaut, les tests s'exécutent sur `https://golf-demo.netlify.app/`

### Tester en local (par défaut)

### Tous les tests

```bash
npm test
```

### Mode UI (interface graphique)

Le mode UI permet de voir les tests s'exécuter visuellement et de déboguer facilement :

```bash
npm run test:ui
```

### Mode headed (avec fenêtre du navigateur visible)

Pour voir le navigateur s'ouvrir et exécuter les tests :

```bash
npm run test:headed
```

### Mode debug

Pour déboguer pas à pas :

```bash
npm run test:debug
```

### Tester contre la production (Netlify)

Pour tester contre le site en production sur https://golf-demo.netlify.app :

```bash
# Mode standard
BASE_URL=https://golf-demo.netlify.app npm test

# Mode UI
BASE_URL=https://golf-demo.netlify.app npm run test:ui

# Mode headed
BASE_URL=https://golf-demo.netlify.app npm run test:headed

# Chromium seulement
BASE_URL=https://golf-demo.netlify.app npx playwright test --project=chromium
```

**Note** : Quand vous testez contre la production, le serveur de développement local ne sera pas démarré automatiquement.

### Lancer un fichier de test spécifique

```bash
npx playwright test membership-form.spec.ts
```

### Lancer un test spécifique

```bash
npx playwright test -g "devrait remplir et soumettre le formulaire"
```

### Lancer sur un navigateur spécifique

```bash
# Chromium seulement
npx playwright test --project=chromium

# Firefox seulement
npx playwright test --project=firefox

# WebKit (Safari) seulement
npx playwright test --project=webkit
```

## Voir les rapports

Après l'exécution des tests, vous pouvez voir un rapport HTML :

```bash
npm run test:report
```

## Configuration

La configuration se trouve dans `playwright.config.ts` à la racine du projet.

Options principales :
- **baseURL** : `https://golf-demo.netlify.app/`
- **webServer** : Lance automatiquement le serveur de développement avant les tests
- **retries** : 2 tentatives sur CI, 0 en local
- **trace** : Trace activée lors des retries pour le débogage

## Écrire de nouveaux tests

### Exemple de base

```typescript
import { test, expect } from '@playwright/test';

test('mon nouveau test', async ({ page }) => {
  await page.goto('/ma-page');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

### Utiliser les helpers

```typescript
import { test, expect } from '@playwright/test';
import { enableDarkMode, fillMembershipForm } from './helpers/test-helpers';

test('tester le formulaire en dark mode', async ({ page }) => {
  await page.goto('/adhesion');
  await enableDarkMode(page);

  await fillMembershipForm(page, {
    firstname: 'Marie',
    lastname: 'Martin',
  });

  // Assertions...
});
```

## Tests disponibles

### 1. Tests du formulaire d'adhésion (`membership-form.spec.ts`)

- ✅ Affichage du formulaire
- ✅ Remplissage et soumission complet
- ✅ Validation des champs obligatoires
- ✅ Calcul du prix total
- ✅ Changement de type d'adhésion
- ✅ Sélection de licence
- ✅ Message de période de renouvellement
- ✅ Dark mode

### 2. Tests de navigation (`navigation.spec.ts`)

- ✅ Page d'accueil
- ✅ Navigation entre les pages
- ✅ Badge MODE DÉMO
- ✅ Effet glassmorphism
- ✅ Liens actifs
- ✅ Barre d'accent gradient
- ✅ Tests responsive (mobile, tablette, desktop)

### 3. Tests dark mode (`dark-mode.spec.ts`)

- ✅ Basculement light/dark
- ✅ Fond sombre
- ✅ Persistance du thème
- ✅ Icônes sun/moon
- ✅ Glassmorphism en dark mode
- ✅ Couleurs emerald
- ✅ Contraste du texte
- ✅ Animation du toggle
- ✅ Barres d'accent gradient

### 4. Tests d'authentification (`auth.spec.ts`)

- ✅ Formulaire de connexion
- ✅ Formulaire d'inscription
- ✅ Validation des champs
- ✅ Lien entre login/register
- ✅ Navigation conditionnelle
- ✅ Pages protégées
- ✅ Dark mode sur les formulaires

## Bonnes pratiques

1. **Sélecteurs** : Préférer les sélecteurs par rôle et label :
   ```typescript
   page.getByRole('button', { name: /Envoyer/i })
   page.getByLabel(/Email/i)
   ```

2. **Attentes** : Toujours utiliser des assertions Playwright :
   ```typescript
   await expect(element).toBeVisible()
   await expect(element).toHaveText('texte')
   ```

3. **Isolation** : Chaque test doit être indépendant

4. **BeforeEach** : Utiliser pour la configuration commune :
   ```typescript
   test.beforeEach(async ({ page }) => {
     await page.goto('/ma-page');
   });
   ```

5. **Noms descriptifs** : Utiliser des noms de tests clairs en français

## Débogage

### Prendre une capture d'écran

```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### Mode pause

```typescript
await page.pause();
```

### Voir les traces

Les traces sont automatiquement collectées lors des retries. Pour les voir :

```bash
npx playwright show-trace trace.zip
```

### Console du navigateur

```typescript
page.on('console', msg => console.log(msg.text()));
```

## CI/CD

Les tests sont configurés pour s'exécuter sur CI avec :
- 1 worker (tests séquentiels)
- 2 retries en cas d'échec
- Screenshots sur échec
- Traces sur retry

## Ressources

- [Documentation Playwright](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
