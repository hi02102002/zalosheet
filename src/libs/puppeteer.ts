/**
 * Creates and configures a Puppeteer browser instance
 * @returns Promise that resolves to a configured Browser instance
 * @example
 * const browser = await getBrowser()
 * // Use browser...
 * await browser.close()
 */
export async function getBrowser() {
  const puppeteer = await import('puppeteer')

  const browser = await puppeteer.launch({
    slowMo: 200,
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],

  })

  return browser
}
