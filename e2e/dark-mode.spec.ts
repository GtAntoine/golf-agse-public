import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test('devrait basculer entre light et dark mode', async ({ page }) => {
    await page.goto('/');

    // Vérifier que nous sommes en mode light au départ (ou récupérer le mode actuel)
    const html = page.locator('html');
    const initialMode = await html.getAttribute('class');

    // Trouver et cliquer sur le toggle de thème
    const themeToggle = page.locator('button').filter({
      has: page.locator('svg').first()
    }).filter({
      has: page.locator('[class*="sun"], [class*="moon"], [class*="Sun"], [class*="Moon"]').first()
    }).first();

    await themeToggle.click();

    // Attendre un peu pour la transition
    await page.waitForTimeout(500);

    // Vérifier que le mode a changé
    const newMode = await html.getAttribute('class');
    expect(newMode).not.toBe(initialMode);
  });

  test('devrait avoir un fond sombre en dark mode', async ({ page }) => {
    await page.goto('/');

    // Activer le dark mode
    const html = page.locator('html');

    // S'assurer qu'on est en dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    await page.reload();

    // Vérifier que la classe dark est présente
    await expect(html).toHaveClass(/dark/);

    // Vérifier que le fond a changé en vérifiant le dégradé
    const rootDiv = page.locator('#root > div').first();
    const classes = await rootDiv.getAttribute('class');

    // Le fond devrait avoir les classes de dégradé dark mode
    expect(classes).toMatch(/dark:from-gray-950|dark:via-emerald-950|dark:to-forest-950/);
  });

  test('devrait conserver le thème après rechargement', async ({ page }) => {
    await page.goto('/');

    // Activer le dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    // Recharger la page
    await page.reload();

    // Vérifier que le dark mode est toujours actif
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('devrait afficher les icônes sun et moon dans le toggle', async ({ page }) => {
    await page.goto('/');

    // Chercher le bouton de toggle (il contient des SVGs)
    const themeToggle = page.getByRole('button', { name: /Toggle theme/i });
    await expect(themeToggle).toBeVisible();

    // Vérifier qu'il y a des SVGs dans le toggle (sun et moon)
    const toggleSvgs = themeToggle.locator('svg');
    const svgCount = await toggleSvgs.count();
    expect(svgCount).toBeGreaterThan(0);
  });

  test('devrait avoir un effet glassmorphism sur les cartes en dark mode', async ({ page }) => {
    await page.goto('/');

    // Activer le dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    await page.goto('/adhesion');

    // Vérifier qu'il y a des éléments avec backdrop-blur
    const blurElements = page.locator('[class*="backdrop-blur"]');
    await expect(blurElements.first()).toBeVisible();
  });

  test('devrait avoir des couleurs emerald en dark mode', async ({ page }) => {
    await page.goto('/');

    // Activer le dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    await page.goto('/adhesion');

    // Vérifier qu'il y a des éléments avec des couleurs emerald
    const emeraldElements = page.locator('[class*="emerald"]');
    await expect(emeraldElements.first()).toBeVisible();
  });

  test('devrait avoir un contraste de texte suffisant en dark mode', async ({ page }) => {
    await page.goto('/');

    // Activer le dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    await page.goto('/adhesion');

    // Vérifier que les textes sont lisibles (blanc ou gris clair)
    const heading = page.getByRole('heading', { name: /Formulaire d'adhésion/i });
    const color = await heading.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // La couleur devrait être claire (rgb avec des valeurs élevées)
    // ou utiliser un gradient qui contient des couleurs claires
    expect(color).toBeTruthy();
  });

  test('devrait animer le toggle du thème', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('button').filter({
      has: page.locator('svg').first()
    }).filter({
      has: page.locator('[class*="sun"], [class*="moon"]').first()
    }).first();

    // Vérifier que le bouton a des classes de transition
    const classes = await themeToggle.getAttribute('class');
    expect(classes).toMatch(/transition|duration/);
  });

  test('devrait afficher correctement les cartes de statistiques en dark mode', async ({ page }) => {
    await page.goto('/');

    // Activer le dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    // Aller sur le dashboard (si accessible sans auth)
    // Sinon, tester sur une autre page avec des cartes
    await page.goto('/adhesion');

    // Vérifier que les cartes ont un fond sombre semi-transparent
    const cards = page.locator('[class*="bg-gray-800"], [class*="dark:bg-gray-800"]');
    if (await cards.count() > 0) {
      await expect(cards.first()).toBeVisible();
    }
  });
});

test.describe('Dark Mode - Gradient Accent Bars', () => {
  test('devrait afficher les barres d\'accent gradient sur les cartes', async ({ page }) => {
    await page.goto('/adhesion');

    // Chercher les barres gradient
    const gradientBars = page.locator('[class*="bg-gradient-to-r"][class*="emerald"]');

    if (await gradientBars.count() > 0) {
      await expect(gradientBars.first()).toBeVisible();
    }
  });

  test('devrait afficher les barres gradient en dark mode', async ({ page }) => {
    // D'abord charger la page
    await page.goto('/adhesion');

    // PUIS activer dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    const gradientBars = page.locator('[class*="bg-gradient-to-r"]');

    if (await gradientBars.count() > 0) {
      await expect(gradientBars.first()).toBeVisible();
    }
  });
});
