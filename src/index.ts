import { zaloBotSendMany } from './funcs/zalo-bot-send-many'
import { getBrowser } from './libs/puppeteer'

async function main() {
  const browser = await getBrowser()
  await zaloBotSendMany(browser)

  await browser.close()
}

main()
