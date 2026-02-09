import { test, expect } from '@playwright/test'

test.describe('Detail Page (/pals/$palId)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so team state doesn't leak between tests
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should display the Pal name and ID', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    await expect(page.locator('h1')).toContainText('Lamball')
    await expect(page.locator('text=#001')).toBeVisible()
  })

  test('should display the Pal image', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    const img = page.locator('img[alt="Lamball"]')
    await expect(img).toBeVisible()
  })

  test('should display type badges', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    // Lamball is Neutral type
    await expect(page.locator('span:has-text("Neutral")')).toBeVisible()
  })

  test('should display dual type badges', async ({ page }) => {
    // Pengullet (010) is Water + Ice
    await page.goto('/pals/010')
    await page.waitForSelector('h1:has-text("Pengullet")')

    // Type badges are in the hero section, use exact text match
    await expect(page.locator('span.rounded-full:text-is("Water")')).toBeVisible()
    await expect(page.locator('span.rounded-full:text-is("Ice")')).toBeVisible()
  })

  test('should display HP, Attack, and Defense stats', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    // Stats are in stat cards in the hero section
    const statsSection = page.locator('.grid.grid-cols-3')
    await expect(statsSection.locator('text=HP')).toBeVisible()
    await expect(statsSection.locator('text=Attack')).toBeVisible()
    await expect(statsSection.locator('text=Defense')).toBeVisible()
  })

  test('should display the Work Suitability table', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    await expect(page.locator('h2:has-text("Work Suitability")')).toBeVisible()

    // Lamball has Handiwork, Transporting, Farming
    await expect(page.locator('text=Handiwork')).toBeVisible()
    await expect(page.locator('text=Transporting')).toBeVisible()
    await expect(page.locator('text=Farming')).toBeVisible()
  })

  test('should display the Drops table', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    await expect(page.locator('h2:has-text("Drops")')).toBeVisible()
    await expect(page.locator('text=Wool')).toBeVisible()
  })

  test('should display the "Add to Team" button', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    await expect(page.locator('button:has-text("Add to Team")')).toBeVisible()
  })

  test('should add a Pal to the team', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    await page.click('button:has-text("Add to Team")')

    // Button should change to "Remove from Team"
    await expect(page.locator('button:has-text("Remove from Team")')).toBeVisible()

    // Team bar should appear with count
    await expect(page.locator('text=1 Pal')).toBeVisible()
    await expect(page.locator('text=My Team')).toBeVisible()
  })

  test('should remove a Pal from the team', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    // Add then remove
    await page.click('button:has-text("Add to Team")')
    await expect(page.locator('button:has-text("Remove from Team")')).toBeVisible()

    await page.click('button:has-text("Remove from Team")')
    await expect(page.locator('button:has-text("Add to Team")')).toBeVisible()
  })

  test('should expand the team bar to show Pal thumbnails', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    // Add Pal to team
    await page.click('button:has-text("Add to Team")')

    // Expand the team bar
    await page.click('text=My Team')

    // Should show Lamball in the expanded bar
    await expect(page.locator('.fixed.bottom-0 >> text=Lamball')).toBeVisible()
  })

  test('should persist team across page navigation', async ({ page }) => {
    // Add Pal on detail page
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')
    await page.click('button:has-text("Add to Team")')
    await expect(page.locator('text=1 Pal')).toBeVisible()

    // Navigate back to home
    await page.click('text=Back to Paldex')
    await page.waitForSelector('h1:has-text("Paldex")')

    // Team bar should still show
    await expect(page.locator('text=1 Pal')).toBeVisible()
  })

  test('should have a "Back to Paldex" link', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')

    const backLink = page.locator('text=Back to Paldex')
    await expect(backLink).toBeVisible()

    await backLink.click()
    await page.waitForURL('/')
    await expect(page.locator('h1')).toContainText('Paldex')
  })

  test('should show "Pal Not Found" for invalid ID', async ({ page }) => {
    await page.goto('/pals/999')
    await page.waitForTimeout(1000) // wait for data load

    await expect(page.locator('text=Pal Not Found')).toBeVisible()
    await expect(page.locator('text=No Pal with ID "999" exists')).toBeVisible()
  })

  test('should display different Pals correctly', async ({ page }) => {
    // Test Foxparks (Fire type)
    await page.goto('/pals/005')
    await page.waitForSelector('h1:has-text("Foxparks")')

    await expect(page.locator('h1')).toContainText('Foxparks')
    await expect(page.locator('span:has-text("Fire")')).toBeVisible()
    await expect(page.locator('text=Kindling')).toBeVisible()
  })

  test('should take a screenshot of the detail page', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')
    await page.waitForTimeout(1000) // let images load

    await page.screenshot({
      path: 'tests/e2e/screenshots/detail-full.png',
      fullPage: true,
    })
  })
})
