import { test, expect } from '@playwright/test'

test.describe('Paldex App', () => {
  test('should load the home page with Pal images', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1:has-text("Paldex")')
    
    await expect(page).toHaveTitle(/Paldex/)
    await expect(page.locator('h1')).toContainText('Paldex')
    await expect(page.locator('text=111 Pals found')).toBeVisible()
    await expect(page.locator('text=Lamball').first()).toBeVisible()
    
    const firstPalImage = page.locator('img[alt="Lamball"]').first()
    await expect(firstPalImage).toBeVisible()
    
    const imgSrc = await firstPalImage.getAttribute('src')
    console.log('Image src:', imgSrc)
    expect(imgSrc).toContain('wikia.nocookie.net')
    
    await page.screenshot({ path: 'tests/e2e/screenshots/home-with-images.png', fullPage: true })
  })

  test.skip('should filter Pals by type', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=120 Pals found')
    
    // Click the type dropdown
    await page.click('button:has-text("Select types")')
    
    // Select Fire type
    await page.getByLabel('Fire').check()
    
    // Wait for navigation/filter
    await page.waitForTimeout(1500)
    
    // Take screenshot to see state
    await page.screenshot({ path: 'tests/e2e/screenshots/filtered-by-fire.png', fullPage: true })
    
    // URL should have types param
    const url = page.url()
    console.log('URL after filter:', url)
    expect(url).toContain('types=')
  })

  test('should navigate to Pal detail page', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=Lamball')
    
    await page.locator('a[href*="/pals/001"]').first().click({ force: true })
    await page.waitForURL(/\/pals\/001/)
    
    await expect(page.locator('h1')).toContainText('Lamball')
    await expect(page.locator('.grid >> text=HP').first()).toBeVisible()
    await expect(page.locator('h2:has-text("Work Suitability")')).toBeVisible()
    await expect(page.locator('h2:has-text("Drops")')).toBeVisible()
    
    await page.screenshot({ path: 'tests/e2e/screenshots/pal-detail.png', fullPage: true })
  })

  test('should add/remove Pal from team', async ({ page }) => {
    await page.goto('/pals/001')
    await page.waitForSelector('h1:has-text("Lamball")')
    
    await page.click('button:has-text("Add to Team")')
    await expect(page.locator('text=1 Pal')).toBeVisible()
    await expect(page.locator('button:has-text("Remove from Team")')).toBeVisible()
    
    await page.click('text=My Team')
    await expect(page.locator('.fixed.bottom-0 >> text=Lamball')).toBeVisible()
    
    await page.screenshot({ path: 'tests/e2e/screenshots/team-with-pal.png', fullPage: true })
  })

  test('should search Pals by name', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1:has-text("Paldex")')
    
    await page.fill('input[placeholder*="Search"]', 'lam')
    await page.waitForTimeout(800)
    
    expect(page.url()).toContain('q=lam')
    await expect(page.locator('h3:has-text("Lamball")')).toBeVisible()
    
    await page.screenshot({ path: 'tests/e2e/screenshots/search-results.png', fullPage: true })
  })
})
