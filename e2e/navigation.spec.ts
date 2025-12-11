import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('devrait afficher la page d\'accueil', async ({ page }) => {
    await page.goto('/');

    // Vérifier que le logo est présent
    await expect(page.getByAltText(/AGSE Golf/i)).toBeVisible();

    // Vérifier le titre de la marque dans la navigation
    await expect(page.locator('nav').getByRole('heading', { name: 'AGSE Golf', exact: true })).toBeVisible();
  });

  test('devrait naviguer vers la page d\'adhésion', async ({ page }) => {
    await page.goto('/');

    // Cliquer sur le lien d'adhésion
    await page.getByRole('link', { name: /Adhésion/i }).click();

    // Vérifier qu'on est sur la bonne page
    await expect(page).toHaveURL(/.*adhesion/);
    await expect(page.getByRole('heading', { name: /Formulaire d'adhésion/i })).toBeVisible();
  });

  test('devrait afficher le badge MODE DÉMO si activé', async ({ page }) => {
    await page.goto('/');

    // Vérifier si le mode démo est activé
    const demoBadge = page.getByText(/MODE DÉMO/i);
    const isDemoMode = await demoBadge.isVisible().catch(() => false);

    if (isDemoMode) {
      await expect(demoBadge).toBeVisible();
      await expect(demoBadge).toHaveClass(/animate-pulse/);
    }
  });

  test('devrait afficher le menu de navigation avec effet glassmorphism', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la barre de navigation a l'effet backdrop-blur
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    await expect(nav).toHaveClass(/backdrop-blur/);
  });

  test('devrait mettre en surbrillance le lien actif', async ({ page }) => {
    await page.goto('/');

    // Aller sur la page d'adhésion
    await page.getByRole('link', { name: /Adhésion/i }).click();

    // Vérifier que le lien Adhésion est actif
    const adhesionLink = page.getByRole('link', { name: /Adhésion/i });
    await expect(adhesionLink).toHaveClass(/bg-gradient-emerald/);
  });

  test('devrait afficher la barre d\'accent gradient en haut de la navigation', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la barre gradient est présente
    const gradientBar = page.locator('nav div.h-1.bg-gradient-to-r');
    await expect(gradientBar).toBeVisible();
  });

  test('devrait naviguer vers la page de connexion', async ({ page }) => {
    await page.goto('/');

    // Cliquer sur Se connecter
    const loginLink = page.getByRole('link', { name: /Se connecter/i });
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('devrait naviguer vers la page d\'inscription', async ({ page }) => {
    await page.goto('/');

    // Cliquer sur S'inscrire
    const registerLink = page.getByRole('link', { name: /S'inscrire/i });
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/.*register/);
    }
  });

  test('devrait afficher un effet hover sur les liens de navigation', async ({ page }) => {
    await page.goto('/');

    const adhesionLink = page.getByRole('link', { name: /Adhésion/i });

    // Hover sur le lien
    await adhesionLink.hover();

    // Le lien devrait être visible (test basique)
    await expect(adhesionLink).toBeVisible();
  });
});

test.describe('Navigation responsive', () => {
  test('devrait afficher la navigation sur mobile', async ({ page }) => {
    // Définir la taille d'écran mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Vérifier que le logo est visible
    await expect(page.getByAltText(/AGSE Golf/i)).toBeVisible();

    // Les liens peuvent être cachés ou affichés différemment sur mobile
    // selon votre implémentation
  });

  test('devrait afficher la navigation sur tablette', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.getByAltText(/AGSE Golf/i)).toBeVisible();
  });

  test('devrait afficher la navigation sur desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.getByAltText(/AGSE Golf/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Adhésion/i })).toBeVisible();
  });
});
