import type { Browser } from 'puppeteer'
import dayjs from 'dayjs'
import { COLS_TITLE } from '@/config'
import logger from '@/libs/logger'
import { sleep } from '@/utils/sleep'
import { getAllReceivers } from './get-all-receivers'
import { sendMessage } from './send-message'

/**
 * Main bot function that orchestrates the Zalo bulk message sending process
 * @param browser - Puppeteer Browser instance
 * @returns Promise that resolves when all messages have been processed
 *
 * Process:
 * 1. Opens Zalo Web and waits for user login
 * 2. Fetches all receivers from Google Sheets
 * 3. Iterates through receivers and sends messages
 * 4. Updates spreadsheet with send status
 */
export async function zaloBotSendMany(browser: Browser) {
  const page = await browser.newPage()

  page.setViewport({
    width: 1280,
    height: 900,
  })

  await page.goto('https://chat.zalo.me/', {
    waitUntil: 'networkidle2',
  })

  await page.waitForSelector('#app .form-signin .qrcode img').catch(() => {
    logger.info('Please login to Zalo Web')
  }).then(
    () => {
      logger.info('Please login to Zalo Web by scanning the QR code')
    },
  )

  await page.reload()

  await page.waitForSelector('#contact-search-input', { timeout: 200000 })

  logger.info('Zalo Bot is ready to send messages')

  const receivers = await getAllReceivers()

  if (receivers.length === 0) {
    logger.info('No receivers found. Exiting.')
    await page.close()
    return
  }

  for (let i = 0; i < receivers.length; i++) {
    const receiver = receivers[i]
    logger.info(`Preparing to send message to ${receiver.phone} (${i + 1}/${receivers.length})`)

    await sendMessage({
      page,
      phone: receiver.phone,
      content: receiver.content,
      onNotFound: async () => {
        receiver.row?.set(COLS_TITLE.SEND_TIME, 'Không tìm thấy số Zalo')
        await receiver.row?.save()
      },
      onError: async () => {
        receiver.row?.set(COLS_TITLE.SEND_TIME, 'Đã xảy ra lỗi khi gửi')
        await receiver.row?.save()
      },
      onSuccess: async () => {
        await sleep(500)
        const now = new Date()
        receiver.row?.set(COLS_TITLE.SEND_TIME, dayjs(now).format('DD/MM/YYYY HH:mm:ss'),
        )
        await receiver.row?.save()
      },
    })
  }
}
