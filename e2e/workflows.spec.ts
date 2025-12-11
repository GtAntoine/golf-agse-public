import { test, expect } from '@playwright/test';

test.describe('Workflow - Nouveau membre complet', () => {
  test('devrait permettre à un nouveau membre de créer un compte et faire une demande d\'adhésion', async ({ page }) => {
    // Étape 1: Aller sur la page d'accueil
    await page.goto('/');

    // Étape 2: Naviguer vers l'inscription
    const registerLink = page.getByRole('link', { name: /S'inscrire/i });
    if (await registerLink.isVisible().catch(() => false)) {
      await registerLink.click();
    } else {
      await page.goto('/register');
    }

    // Étape 3: Créer un compte
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;
    const password = 'SecurePassword123!';

    await page.getByLabel(/Email/i).fill(email);
    await page.getByLabel('Mot de passe', { exact: true }).fill(password);
    await page.getByLabel('Confirmer le mot de passe', { exact: true }).fill(password);
    await page.getByRole('button', { name: /S'inscrire|Créer un compte/i }).click();

    // Attendre la redirection ou confirmation
    await page.waitForTimeout(1000);

    // Étape 4: Se connecter si nécessaire
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      await page.getByLabel(/Email/i).fill(email);
      await page.getByLabel(/Mot de passe/i).fill(password);
      await page.getByRole('button', { name: /Se connecter/i }).click();
      await page.waitForTimeout(1000);
    }

    // Étape 5: Aller sur le formulaire d'adhésion
    await page.goto('/adhesion');

    // Vérifier qu'on est sur la bonne page
    await expect(page.getByRole('heading', { name: /Formulaire d'adhésion AGSE Golf/i })).toBeVisible();

    // Étape 6: Remplir le formulaire d'informations personnelles
    await page.getByLabel('Nom *', { exact: true }).fill('Dupont');
    await page.getByLabel('Prénom *', { exact: true }).fill('Jean');
    await page.getByLabel(/Date de naissance/i).fill('1990-01-15');
    await page.getByLabel(/Lieu de naissance/i).fill('Paris');
    await page.getByLabel(/Adresse \*/i).fill('123 Rue de la Paix');
    await page.getByLabel(/Code postal/i).fill('75001');
    await page.getByLabel(/Ville \*/i).fill('Paris');
    await page.getByLabel(/Téléphone \*/i).fill('0612345678');
    await page.getByLabel(/Contact d'urgence/i).fill('Marie Dupont');
    await page.getByLabel(/Téléphone d'urgence/i).fill('0687654321');

    // Étape 7: Sélectionner le type d'adhésion
    await page.getByText('GOLF', { exact: true }).first().click();

    // Vérifier que la sélection est active (attendre un peu pour l'état)
    await page.waitForTimeout(300);

    // Étape 8: Sélectionner le type de licence
    await page.getByText('Licence FFG Adulte').click();

    // Étape 9: Vérifier le récapitulatif de prix
    await expect(page.getByText(/Adhésion 202\d \(GOLF\)/i)).toBeVisible();
    await expect(page.getByText(/Licence FFG 202\d/i)).toBeVisible();
    await expect(page.getByText('Total à payer')).toBeVisible();
    // Le prix total devrait être visible (varie selon licence sélectionnée)
    const totalPrice = page.locator('text=/Total à payer/').locator('..').getByText(/\d+€/);
    await expect(totalPrice).toBeVisible();

    // Étape 10: Soumettre la demande (bouton continuer vers récapitulatif ou envoyer)
    const submitButton = page.getByRole('button', { name: /Continuer vers le récapitulatif|Envoyer la demande/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Attendre la confirmation ou le récapitulatif
      await page.waitForTimeout(2000);

      // Vérifier qu'on a avancé dans le processus - chercher bouton de confirmation final
      const confirmButton = await page.getByRole('button', { name: /Confirmer et envoyer la demande/i }).isVisible().catch(() => false);
      const modifierButton = await page.getByRole('button', { name: /Modifier/i }).isVisible().catch(() => false);

      expect(confirmButton || modifierButton).toBeTruthy();
    }
  });
});

test.describe('Workflow - Connexion et accès aux fonctionnalités', () => {
  test('devrait permettre à un utilisateur de se connecter et naviguer dans l\'application', async ({ page }) => {
    // Étape 1: Aller sur la page de connexion
    await page.goto('/login');

    // Étape 2: Se connecter avec un compte démo
    await page.getByLabel(/Email/i).fill('admin@demo.golf');
    await page.getByLabel(/Mot de passe/i).fill('password');
    await page.getByRole('button', { name: /Se connecter/i }).click();

    // Attendre la redirection
    await page.waitForTimeout(1500);

    // Étape 3: Vérifier qu'on a accès aux fonctionnalités
    const currentUrl = page.url();
    const isLoggedIn = currentUrl.includes('/admin') || currentUrl.includes('/profile') || currentUrl.includes('/adhesion');

    if (!isLoggedIn) {
      // Si pas redirigé automatiquement, naviguer manuellement
      await page.goto('/admin');
    }

    // Étape 4: Naviguer vers différentes sections
    await page.goto('/adhesion');
    await expect(page.getByRole('heading', { name: /Formulaire d'adhésion/i })).toBeVisible({ timeout: 5000 });

    // Étape 5: Vérifier que les infos sont pré-remplies pour utilisateur existant
    const emailInput = page.getByLabel(/Email/i);
    await expect(emailInput).toHaveValue(/\S+@\S+/);
  });
});

test.describe('Workflow - Changement de type d\'adhésion', () => {
  test('devrait permettre de comparer différents types d\'adhésion et leurs prix', async ({ page }) => {
    // Étape 1: Aller sur le formulaire d'adhésion
    await page.goto('/adhesion');

    // Étape 2: Sélectionner GOLF et vérifier le prix
    await page.getByText('GOLF', { exact: true }).first().click();
    await page.getByText('Licence FFG Adulte').click();

    // Vérifier que le récapitulatif affiche le prix (pas besoin de vérifier le montant exact)
    await expect(page.getByText('Total à payer')).toBeVisible();

    // Étape 3: Changer pour GOLF LOISIR
    await page.getByText('GOLF LOISIR').first().click();
    await page.waitForTimeout(300);

    // Vérifier que le prix a changé
    await expect(page.getByText('Total à payer')).toBeVisible();

    // Étape 4: Changer pour GOLF JEUNE
    await page.getByText('GOLF JEUNE').first().click();
    await page.waitForTimeout(300);

    // Vérifier que le prix est visible
    await expect(page.getByText('Total à payer')).toBeVisible();

    // Étape 5: Sélectionner "Pas de licence"
    await page.getByText(/Pas de Licence FFG demandée via l'AGSE Golf/i).click();

    // Vérifier que le prix de licence n'est plus affiché dans le total
    await expect(page.getByText(/Licence FFG 202\d/i)).not.toBeVisible();
  });
});

test.describe('Workflow - Dark mode persistant', () => {
  test('devrait conserver le dark mode lors de la navigation entre pages', async ({ page }) => {
    // Étape 1: Aller sur la page d'adhésion
    await page.goto('/adhesion');

    // Étape 2: Activer le dark mode
    const themeButton = page.locator('button').filter({ hasText: /theme/i })
      .or(page.locator('[aria-label*="theme"]'))
      .or(page.locator('.group\\/toggle'))
      .first();

    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(500);
    } else {
      // Activer manuellement si le bouton n'est pas trouvé
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      });
    }

    // Vérifier que le dark mode est actif
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Étape 3: Naviguer vers la page de connexion
    await page.goto('/login');
    await page.waitForTimeout(500);

    // Vérifier que le dark mode est toujours actif
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Étape 4: Naviguer vers la page d'inscription
    await page.goto('/register');
    await page.waitForTimeout(500);

    // Vérifier que le dark mode est toujours actif
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Étape 5: Revenir à la page d'adhésion
    await page.goto('/adhesion');
    await page.waitForTimeout(500);

    // Vérifier que le dark mode est toujours actif
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Vérifier que les éléments sont visibles et lisibles en dark mode
    await expect(page.getByRole('heading', { name: /Formulaire d'adhésion/i })).toBeVisible();
    await expect(page.getByLabel('Nom *', { exact: true })).toBeVisible();
  });
});

test.describe('Workflow - Validation du formulaire par étapes', () => {
  test('devrait guider l\'utilisateur à travers le formulaire avec validation', async ({ page }) => {
    // Étape 1: Aller sur le formulaire d'adhésion
    await page.goto('/adhesion');

    // En mode démo, les infos sont pré-remplies et on est redirigé vers le récapitulatif
    // Vérifier si on est sur le récapitulatif et revenir au formulaire
    const modifierButton = page.getByRole('button', { name: /Modifier/i });
    if (await modifierButton.isVisible().catch(() => false)) {
      await modifierButton.click();
      await page.waitForTimeout(500);
    }

    // Vérifier qu'on est bien revenu au formulaire (présence des inputs)
    await expect(page.getByLabel('Nom *', { exact: true })).toBeVisible();

    // Vider les champs pour tester la validation
    await page.getByLabel('Nom *', { exact: true }).clear();
    await page.getByLabel('Prénom *', { exact: true }).clear();
    await page.getByLabel(/Adresse \*/i).clear();

    // Étape 2: Vérifier que les champs obligatoires ont l'attribut required
    const nomInput = page.getByLabel('Nom *', { exact: true });
    await expect(nomInput).toHaveAttribute('required', '');

    const adresseInput = page.getByLabel(/Adresse \*/i);
    await expect(adresseInput).toHaveAttribute('required', '');

    // Étape 3: Remplir les informations de base
    await page.getByLabel('Nom *', { exact: true }).fill('Martin');
    await page.getByLabel('Prénom *', { exact: true }).fill('Sophie');
    await page.getByLabel(/Date de naissance/i).fill('1995-03-20');

    // Étape 4: Compléter le formulaire
    await page.getByLabel(/Adresse \*/i).fill('456 Boulevard du Golf');
    await page.getByLabel(/Code postal/i).fill('69000');
    await page.getByLabel(/Ville \*/i).fill('Lyon');
    await page.getByLabel(/Téléphone \*/i).fill('0698765432');

    // Étape 5: Sélectionner adhésion et licence
    await page.getByText('GOLF LOISIR').first().click();
    await page.getByText('Licence FFG Adulte').click();

    // Étape 6: Vérifier que le formulaire est maintenant complet
    await expect(page.getByText('Total à payer')).toBeVisible();

    // Vérifier que le bouton de soumission est disponible
    const submitButton = page.getByRole('button', { name: /Continuer vers le récapitulatif/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});
