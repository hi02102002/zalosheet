export async function getBrowser() {
  const puppeteer = await import('puppeteer')

  const browser = await puppeteer.launch({
    slowMo: 200,
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userDataDir: './tmp/puppeteer',
    
  })

  return browser
}
