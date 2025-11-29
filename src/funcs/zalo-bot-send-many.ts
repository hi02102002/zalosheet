import type { Browser } from 'puppeteer'
import { COLS_TITLE } from '@/config'
import logger from '@/libs/logger'
import { sleep } from '@/utils/sleep'
import { getAllReceivers } from './get-all-receivers'
import { sendMessage } from './send-message'

export async function zaloBotSendMany(browser: Browser) {
  const page = await browser.newPage()

  page.setViewport({
    width: 1280,
    height: 900,
  })

  await page.goto('https://chat.zalo.me/', {
    waitUntil: 'networkidle2',
  })

  await page.waitForSelector('#app .form-signin.animated.fadeIn .qr-container img').catch(() => {
    logger.info('Please login to Zalo Web')
  })

  await page.waitForSelector('#contact-search-input', {
    timeout: 200000,
  })

  await page.reload()

  await page.waitForSelector('#contact-search-input', { timeout: 200000 })

  logger.info('Zalo Bot is ready to send messages')

  const receivers = await getAllReceivers()

  for (let i = 0; i < receivers.length; i++) {
    const receiver = receivers[i]
    logger.info(`Preparing to send message to ${receiver.phone} (${i + 1}/${receivers.length})`)

    await sendMessage({
      page,
      phone: receiver.phone,
      content: receiver.content,
      onNotFound: async () => {
        receiver.row?.set(COLS_TITLE.SEND_TIME, 'NOT_FOUND')
        await receiver.row?.save()
      },
      onError: async (error) => {
        receiver.row?.set(COLS_TITLE.SEND_TIME, `ERROR: ${error.message}`)
        await receiver.row?.save()
      },
      onSuccess: async () => {
        await sleep(1000)
        const now = new Date()
        receiver.row?.set(COLS_TITLE.SEND_TIME, now.toISOString())
        await receiver.row?.save()
      },
    })
  }
}
