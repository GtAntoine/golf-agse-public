import { Page } from '@playwright/test';

/**
 * Active le dark mode sur la page
 */
export async function enableDarkMode(page: Page) {
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  });
}

/**
 * Active le light mode sur la page
 */
export async function enableLightMode(page: Page) {
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  });
}

/**
 * Bascule le thème en cliquant sur le toggle
 */
export async function toggleTheme(page: Page) {
  const themeToggle = page.locator('button').filter({
    has: page.locator('svg').first()
  }).filter({
    has: page.locator('[class*="sun"], [class*="moon"]').first()
  }).first();

  await themeToggle.click();
  await page.waitForTimeout(300); // Attendre l'animation
}

/**
 * Remplit le formulaire d'adhésion avec des données de test
 */
export async function fillMembershipForm(page: Page, data?: {
  email?: string;
  lastname?: string;
  firstname?: string;
  birthdate?: string;
  address?: string;
  postalcode?: string;
  city?: string;
  phone?: string;
  membershipType?: 'GOLF' | 'GOLF_LOISIR' | 'GOLF_JEUNE';
  licenseType?: 'adult' | 'young-adult' | 'teen' | 'child' | 'none';
}) {
  const defaultData = {
    email: 'test@example.com',
    lastname: 'Dupont',
    firstname: 'Jean',
    birthdate: '1990-01-15',
    address: '123 Rue de la Paix',
    postalcode: '75001',
    city: 'Paris',
    phone: '0612345678',
    membershipType: 'GOLF' as const,
    licenseType: 'adult' as const,
    ...data,
  };

  // Remplir les champs
  await page.getByLabel(/Email/i).fill(defaultData.email);
  await page.getByLabel(/Nom \*/i).fill(defaultData.lastname);
  await page.getByLabel(/Prénom \*/i).fill(defaultData.firstname);
  await page.getByLabel(/Date de naissance/i).fill(defaultData.birthdate);
  await page.getByLabel(/Adresse \*/i).fill(defaultData.address);
  await page.getByLabel(/Code postal/i).fill(defaultData.postalcode);
  await page.getByLabel(/Ville \*/i).fill(defaultData.city);
  await page.getByLabel(/Téléphone \*/i).fill(defaultData.phone);

  // Sélectionner le type d'adhésion
  if (defaultData.membershipType === 'GOLF') {
    await page.getByText('GOLF', { exact: true }).first().click();
  } else if (defaultData.membershipType === 'GOLF_LOISIR') {
    await page.getByText('GOLF LOISIR').first().click();
  } else if (defaultData.membershipType === 'GOLF_JEUNE') {
    await page.getByText('GOLF JEUNE').first().click();
  }

  // Sélectionner le type de licence
  const licenseLabels = {
    adult: 'Licence FFG Adulte',
    'young-adult': 'Licence FFG Jeune adulte',
    teen: 'Licence FFG Jeune',
    child: 'Licence FFG Enfant',
    none: "Pas de Licence FFG demandée via l'AGSE Golf",
  };

  await page.getByText(licenseLabels[defaultData.licenseType]).click();
}

/**
 * Attend qu'un élément avec une classe spécifique soit visible
 */
export async function waitForElementWithClass(page: Page, className: string, timeout = 5000) {
  await page.waitForSelector(`[class*="${className}"]`, { timeout });
}

/**
 * Vérifie si un élément a une classe spécifique
 */
export async function hasClass(page: Page, selector: string, className: string): Promise<boolean> {
  const element = page.locator(selector).first();
  const classes = await element.getAttribute('class');
  return classes ? classes.includes(className) : false;
}

/**
 * Prend une capture d'écran avec un nom personnalisé
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

/**
 * Attend que la navigation soit complète
 */
export async function waitForNavigation(page: Page, url: string, timeout = 5000) {
  await page.waitForURL(`**${url}**`, { timeout });
}

/**
 * Simule une connexion (à adapter selon votre backend)
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel(/Email/i).fill(email);
  await page.getByLabel(/Mot de passe/i).fill(password);
  await page.getByRole('button', { name: /Se connecter/i }).click();
  await page.waitForTimeout(1000);
}

/**
 * Vérifie si l'utilisateur est connecté
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  // Vérifier si les liens Mon profil ou Paramètres sont visibles
  const profileLink = page.getByRole('link', { name: /Mon profil/i });
  const settingsLink = page.getByRole('link', { name: /Paramètres/i });

  const profileVisible = await profileLink.isVisible().catch(() => false);
  const settingsVisible = await settingsLink.isVisible().catch(() => false);

  return profileVisible || settingsVisible;
}

/**
 * Se déconnecte (à adapter selon votre implémentation)
 */
export async function logout(page: Page) {
  // Nettoyer le localStorage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.goto('/');
}
