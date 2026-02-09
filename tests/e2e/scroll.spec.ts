import { test, expect } from '@playwright/test'

test('visual check - all 111 pals with images', async ({ page }) => {
  await page.goto('/')
  
  // Wait for the data to load
  await page.waitForSelector('text=/111 Pals found/')
  
  // Wait a bit for images to load
  await page.waitForTimeout(1500)
  
  // Screenshot initial view
  await page.screenshot({ path: 'tests/e2e/screenshots/grid-final-1.png', fullPage: false })
  
  // Scroll to middle
  await page.evaluate(() => {
    const scrollContainer = document.querySelector('.overflow-auto')
    if (scrollContainer) {
      scrollContainer.scrollTop = 2000
    }
  })
  
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'tests/e2e/screenshots/grid-final-2.png', fullPage: false })
  
  // Scroll to end to verify last pals have images
  await page.evaluate(() => {
    const scrollContainer = document.querySelector('.overflow-auto')
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  })
  
  await page.waitForTimeout(800)
  await page.screenshot({ path: 'tests/e2e/screenshots/grid-final-3.png', fullPage: false })
  
  // Verify cards are present
  const palLinks = await page.locator('a[href^="/pals/"]').count()
  console.log('Visible Pal cards:', palLinks)
  expect(palLinks).toBeGreaterThan(10)
})
