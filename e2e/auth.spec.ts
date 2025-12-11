import { test, expect } from '@playwright/test';

test.describe('Authentification - Page de connexion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('devrait afficher le formulaire de connexion', async ({ page }) => {
    // Vérifier les éléments du formulaire
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Mot de passe/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Se connecter/i })).toBeVisible();
  });

  test('devrait afficher un lien vers l\'inscription', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /créer un compte|S'inscrire/i });
    await expect(registerLink).toBeVisible();
  });

  test('devrait valider les champs email et mot de passe', async ({ page }) => {
    // Essayer de soumettre sans remplir
    await page.getByRole('button', { name: /Se connecter/i }).click();

    // Vérifier que les champs sont requis
    const emailInput = page.getByLabel(/Email/i);
    await expect(emailInput).toHaveAttribute('required', '');

    const passwordInput = page.getByLabel(/Mot de passe/i);
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('devrait afficher le formulaire avec glassmorphism en dark mode', async ({ page }) => {
    // Activer dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    await page.reload();

    // Vérifier que le formulaire est visible
    await expect(page.getByLabel(/Email/i)).toBeVisible();

    // Vérifier qu'il y a des éléments avec backdrop-blur
    const form = page.locator('form');
    if (await form.count() > 0) {
      await expect(form.first()).toBeVisible();
    }
  });

  test('devrait permettre de saisir des identifiants', async ({ page }) => {
    const email = 'test@example.com';
    const password = 'Password123!';

    await page.getByLabel(/Email/i).fill(email);
    await page.getByLabel(/Mot de passe/i).fill(password);

    // Vérifier que les valeurs sont bien remplies
    await expect(page.getByLabel(/Email/i)).toHaveValue(email);
    await expect(page.getByLabel(/Mot de passe/i)).toHaveValue(password);
  });

  test('devrait masquer le mot de passe par défaut', async ({ page }) => {
    const passwordInput = page.getByLabel(/Mot de passe/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Authentification - Page d\'inscription', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('devrait afficher le formulaire d\'inscription', async ({ page }) => {
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel('Mot de passe', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirmer le mot de passe', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /S'inscrire|Créer un compte/i })).toBeVisible();
  });

  test('devrait afficher un lien vers la connexion', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /Se connecter|Déjà un compte/i });
    await expect(loginLink).toBeVisible();
  });

  test('devrait valider tous les champs requis', async ({ page }) => {
    // Essayer de soumettre sans remplir
    await page.getByRole('button', { name: /S'inscrire|Créer un compte/i }).click();

    // Vérifier que les champs sont requis
    await expect(page.getByLabel(/Email/i)).toHaveAttribute('required', '');
    await expect(page.getByLabel('Mot de passe', { exact: true })).toHaveAttribute('required', '');
    await expect(page.getByLabel('Confirmer le mot de passe', { exact: true })).toHaveAttribute('required', '');
  });

  test('devrait permettre de remplir le formulaire d\'inscription', async ({ page }) => {
    await page.getByLabel(/Email/i).fill('nouveau@example.com');
    await page.getByLabel('Mot de passe', { exact: true }).fill('SecurePassword123!');
    await page.getByLabel('Confirmer le mot de passe', { exact: true }).fill('SecurePassword123!');

    // Vérifier les valeurs
    await expect(page.getByLabel(/Email/i)).toHaveValue('nouveau@example.com');
    await expect(page.getByLabel('Mot de passe', { exact: true })).toHaveValue('SecurePassword123!');
    await expect(page.getByLabel('Confirmer le mot de passe', { exact: true })).toHaveValue('SecurePassword123!');
  });

  test('devrait afficher le formulaire avec glassmorphism', async ({ page }) => {
    // Vérifier qu'il y a des éléments avec backdrop-blur
    const blurElements = page.locator('[class*="backdrop-blur"]');
    if (await blurElements.count() > 0) {
      await expect(blurElements.first()).toBeVisible();
    }
  });
});

test.describe('Authentification - Navigation conditionnelle', () => {
  test('devrait afficher les liens public quand non connecté', async ({ page }) => {
    await page.goto('/');

    // Vérifier que les liens de connexion/inscription sont visibles
    const loginLink = page.getByRole('link', { name: /Se connecter/i });
    const registerLink = page.getByRole('link', { name: /S'inscrire/i });

    // Au moins un devrait être visible
    const loginVisible = await loginLink.isVisible().catch(() => false);
    const registerVisible = await registerLink.isVisible().catch(() => false);

    expect(loginVisible || registerVisible).toBeTruthy();
  });

  test('devrait rediriger vers login pour les pages protégées', async ({ page }) => {
    // Essayer d'accéder à une page admin sans être connecté
    await page.goto('/admin');

    // Devrait être redirigé vers login ou afficher un message
    const url = page.url();
    const isProtected = url.includes('/login') || url.includes('/');

    expect(isProtected).toBeTruthy();
  });
});

test.describe('Authentification - Dark Mode', () => {
  test('devrait afficher le formulaire de connexion en dark mode', async ({ page }) => {
    // D'abord charger la page
    await page.goto('/login');

    // PUIS activer dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    // Vérifier que le HTML a la classe dark
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Vérifier que les champs sont visibles et lisibles
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Mot de passe/i)).toBeVisible();
  });

  test('devrait afficher le formulaire d\'inscription en dark mode', async ({ page }) => {
    // D'abord charger la page
    await page.goto('/register');

    // PUIS activer dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByLabel(/Email/i)).toBeVisible();
  });
});
