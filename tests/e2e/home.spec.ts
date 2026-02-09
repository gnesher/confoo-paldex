import { test, expect } from '@playwright/test'

test.describe('Home Page (/)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so team state doesn't leak between tests
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/')
    await page.waitForSelector('h1:has-text("Paldex")')
  })

  test('should display the page heading and description', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Paldex')
    await expect(page.locator('text=A Pokedex for Palworld')).toBeVisible()
  })

  test('should load and display all 111 Pals', async ({ page }) => {
    await expect(page.locator('text=111 Pals found')).toBeVisible()
  })

  test('should display the filter sidebar', async ({ page }) => {
    const sidebar = page.locator('aside')
    await expect(sidebar.locator('text=Filters')).toBeVisible()
    await expect(sidebar.locator('text=Search')).toBeVisible()
    await expect(sidebar.locator('label:has-text("Types")')).toBeVisible()
    await expect(sidebar.locator('text=Attack Range')).toBeVisible()
  })

  test('should render Pal cards with images', async ({ page }) => {
    const firstCard = page.locator('a[href*="/pals/"]').first()
    await expect(firstCard).toBeVisible()

    const img = firstCard.locator('img').first()
    await expect(img).toBeVisible()
    await expect(img).toHaveAttribute('alt', /.+/)
  })

  test('should display Pal name and stats on cards', async ({ page }) => {
    // Lamball is the first Pal
    await expect(page.locator('text=Lamball').first()).toBeVisible()
    await expect(page.locator('text=#001').first()).toBeVisible()
  })

  test('should filter Pals by search text', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'fox')
    await page.waitForTimeout(500) // debounce

    // URL should update with search param
    await expect(page).toHaveURL(/q=fox/)

    // Should show Foxparks
    await expect(page.locator('text=Foxparks').first()).toBeVisible()

    // Should show fewer results than 111
    const countText = page.locator('text=/\\d+ Pals found/')
    await expect(countText).toBeVisible()
    const text = await countText.textContent()
    const count = parseInt(text!.match(/(\d+)/)?.[1] ?? '999')
    expect(count).toBeLessThan(111)
  })

  test('should clear search and show all Pals again', async ({ page }) => {
    // Search first
    await page.fill('input[placeholder*="Search"]', 'fox')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/q=fox/)

    // Clear the search
    await page.fill('input[placeholder*="Search"]', '')
    await page.waitForTimeout(500)

    // Should show all Pals again
    await expect(page.locator('text=111 Pals found')).toBeVisible()
  })

  test('should filter Pals by type', async ({ page }) => {
    // Confirm we start with 111
    await expect(page.locator('text=111 Pals found')).toBeVisible()

    // Open the type dropdown
    await page.locator('aside button:has-text("Select types")').click()

    // Select Fire type by clicking its label
    await page.locator('aside label:has-text("Fire") input[type="checkbox"]').click()

    // Wait for the count to change from 111
    await expect(page.locator('text=111 Pals found')).not.toBeVisible({ timeout: 5000 })

    // URL should have types param (encoding varies)
    expect(page.url()).toContain('types=')
  })

  test('should navigate to Pal detail page when clicking a card', async ({ page }) => {
    // Click the first Pal card (Lamball)
    await page.locator('a[href*="/pals/001"]').first().click()
    await page.waitForURL(/\/pals\/001/)

    await expect(page.locator('h1')).toContainText('Lamball')
  })

  test('should show "Clear all filters" when filters are active', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'test')
    await page.waitForTimeout(500)

    await expect(page.locator('aside >> text=Clear all filters')).toBeVisible()
  })

  test('should display active filter badges', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'lam')
    await page.waitForTimeout(500)

    // Should show search badge
    await expect(page.locator('text=/Search:.*"lam"/')).toBeVisible()
  })

  test('should take a screenshot of the home page', async ({ page }) => {
    await page.waitForTimeout(1000) // let images load
    await page.screenshot({
      path: 'tests/e2e/screenshots/home-full.png',
      fullPage: true,
    })
  })
})
