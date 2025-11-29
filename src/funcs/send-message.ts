import type { Page } from 'puppeteer'
import logger from '@/libs/logger'
import { AppError } from '@/utils/error'
import { sleep } from '@/utils/sleep'

export async function sendMessage({ content, phone, page, onNotFound, onError, onSuccess}: {
  page: Page
  phone: string
  content: string
  onNotFound?: () => void | Promise<void>
  onError?: (error: AppError) => void | Promise<void>
  onSuccess?: () => void | Promise<void>
}) {
  const searchEl = await page.$('#contact-search-input')

  if (!searchEl) {
    logger.error('Cannot find search input element')
    return false
  }
  try {
    await searchEl.focus()
    await searchEl.click({ clickCount: 2 })
    await page.keyboard.press('Backspace')
    await page.keyboard.type(phone)

    const firstContactEl = await page.$('#searchResultList [id^="friend-item-"]')
    const notFoundEl = await page.$('#searchResultList .global-search-no-result')
    const contactHiddenEl = await page.$('#searchResultList [data-translate-inner="STR_UNVALID_SEARCH_NUM_PHONE"]')

    if (notFoundEl || contactHiddenEl) {
      logger.warn(`Phone number ${phone} not found`)
      await onNotFound?.()
      return
    }

    if (!firstContactEl) {
      logger.warn(`Phone number ${phone} not found`)
      await onNotFound?.()
      return false
    }

    await page.evaluate(el => el && (el).click(), firstContactEl)

    const inputEl = await page.$('#input_line_0')

    if (!inputEl) {
      logger.error('Cannot find message input element')

      await onError?.(
        new AppError('Cannot find message input element', 'NOT_FOUND'),
      )

      return false
    }

    await inputEl.focus()
    await inputEl.click({
      clickCount: 2,
    })

    await page.keyboard.press('Backspace')
    await page.keyboard.type(content)
    await page.keyboard.press('Enter')
    await onSuccess?.()
    logger.info(`Message sent to ${phone}`)
  }
  catch (error) {
    logger.error(`Error sending message to ${phone}: ${(error as Error).message}`)

    await searchEl.focus()
    await searchEl.click({ clickCount: 2 })
    await page.keyboard.press('Backspace')

    await onError?.(
      new AppError((error as Error).message, 'UNKNOWN'),
    )

    return false
  }
}
