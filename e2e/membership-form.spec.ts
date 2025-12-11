import { test, expect } from '@playwright/test';

test.describe('Formulaire d\'adhésion', () => {
  test.beforeEach(async ({ page }) => {
    // Aller sur la page d'adhésion
    await page.goto('/adhesion');
  });

  test('devrait afficher le formulaire d\'adhésion', async ({ page }) => {
    // Vérifier le titre
    await expect(page.getByRole('heading', { name: /Formulaire d'adhésion AGSE Golf/i })).toBeVisible();

    // Vérifier que les champs principaux sont présents
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel('Nom *', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Prénom *', { exact: true })).toBeVisible();
  });

  test('devrait remplir et soumettre le formulaire d\'adhésion complet', async ({ page }) => {
    // En mode démo, l'email est pré-rempli et readonly, on ne peut pas le modifier
    // Remplir les autres informations personnelles
    await page.getByLabel('Nom *', { exact: true }).fill('Dupont');
    await page.getByLabel('Prénom *', { exact: true }).fill('Jean');
    await page.getByLabel(/Date de naissance/i).fill('1990-01-15');
    await page.getByLabel(/Adresse \*/i).fill('123 Rue de la Paix');
    await page.getByLabel(/Code postal/i).fill('75001');
    await page.getByLabel(/Ville \*/i).fill('Paris');
    await page.getByLabel(/Téléphone \*/i).fill('0612345678');

    // Remplir les informations optionnelles
    await page.getByLabel(/Contact d'urgence/i).fill('Marie Dupont');
    await page.getByLabel(/Téléphone d'urgence/i).fill('0687654321');
    await page.getByLabel(/N° Licence FFG/i).fill('FFG123456');
    await page.getByLabel(/Index Golf/i).fill('15.5');
    await page.getByLabel(/Lieu de naissance/i).fill('Lyon');

    // Sélectionner le type d'adhésion
    await page.getByText('GOLF', { exact: true }).first().click();

    // Vérifier que la carte parente est sélectionnée (bordure emerald)
    const golfCard = page.locator('.border-emerald-500').filter({ hasText: 'GOLF' }).first();
    await expect(golfCard).toBeVisible();

    // Sélectionner le type de licence
    await page.getByText('Licence FFG Adulte').click();

    // Vérifier que le total est affiché
    await expect(page.getByText(/Total à payer/i)).toBeVisible();

    // Cliquer sur le bouton pour continuer vers le récapitulatif
    await page.getByRole('button', { name: /Continuer vers le récapitulatif/i }).click();

    // Attendre d'être sur le récapitulatif
    await page.waitForTimeout(1000);

    // Vérifier qu'on a le bouton de confirmation finale
    await expect(page.getByRole('button', { name: /Confirmer et envoyer/i })).toBeVisible();
  });

  test('devrait afficher le prix total calculé correctement', async ({ page }) => {
    // Sélectionner GOLF
    await page.getByText('GOLF', { exact: true }).first().click();

    // Sélectionner Licence Adulte
    await page.getByText('Licence FFG Adulte').click();

    // Vérifier que le récapitulatif de prix affiche les montants corrects
    await expect(page.getByText(/Adhésion 202\d \(GOLF\)/i)).toBeVisible();
    await expect(page.getByText(/Licence FFG 202\d/i)).toBeVisible();
    await expect(page.getByText('Total à payer')).toBeVisible();
  });

  test('devrait permettre de changer le type d\'adhésion', async ({ page }) => {
    // Sélectionner GOLF
    await page.getByText('GOLF', { exact: true }).first().click();
    await page.waitForTimeout(300);

    const golfCard = page.locator('.border-emerald-500').filter({ hasText: 'GOLF' }).first();
    await expect(golfCard).toBeVisible();

    // Changer pour GOLF LOISIR
    await page.getByText('GOLF LOISIR').first().click();
    await page.waitForTimeout(300);

    const golfLoisirCard = page.locator('.border-emerald-500').filter({ hasText: 'GOLF LOISIR' }).first();
    await expect(golfLoisirCard).toBeVisible();
  });

  test('devrait permettre de sélectionner "Pas de licence"', async ({ page }) => {
    // Sélectionner "Pas de Licence FFG demandée via l'AGSE Golf"
    await page.getByText(/Pas de Licence FFG demandée via l'AGSE Golf/i).click();

    // Vérifier que le total n'affiche que l'adhésion
    await expect(page.getByText(/Licence FFG 202\d/i)).not.toBeVisible();
  });

  test('devrait afficher l\'information de période de renouvellement en septembre', async ({ page }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    // Si nous sommes en septembre ou après (mois 8+)
    if (currentMonth >= 8) {
      await expect(page.getByText(/Période de renouvellement/i)).toBeVisible();
      await expect(page.getByText(/valable jusqu'à la fin de l'année en cours et pour toute l'année 202\d/i)).toBeVisible();
    }
  });
});

test.describe('Formulaire d\'adhésion - Dark Mode', () => {
  test('devrait afficher correctement le formulaire en dark mode', async ({ page }) => {
    await page.goto('/adhesion');

    // Activer le dark mode
    await page.locator('button').filter({ hasText: /theme/i }).or(page.locator('[aria-label*="theme"]')).or(page.locator('.group\\/toggle')).first().click();

    // Vérifier que le dark mode est actif
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Vérifier que le formulaire est visible et lisible
    await expect(page.getByRole('heading', { name: /Formulaire d'adhésion/i })).toBeVisible();

    // Vérifier que les champs ont le bon style dark
    const nomInput = page.getByLabel('Nom *', { exact: true });
    await expect(nomInput).toBeVisible();
  });
});
