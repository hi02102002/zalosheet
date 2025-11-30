import z from 'zod'
import { COLS_TITLE } from '@/config'
import { env } from '@/env'
import { getWorksheet } from '@/libs/sheet'
import { ReceiverSchema } from '@/schemas/receiver'

/**
 * Fetches all message receivers from the configured Google Spreadsheet
 * @returns Promise that resolves to an array of validated Receiver objects
 * @throws ZodError if the spreadsheet data doesn't match the expected schema
 */
export async function getAllReceivers() {
  const sheet = await getWorksheet(env.SHEET_ID, env.SHEET_TITLE)

  const rows = await sheet.getRows()

  const record = rows.map((row, index) => ({
    phone: row.get(COLS_TITLE.PHONE),
    content: row.get(COLS_TITLE.CONTENT),
    sendTime: row.get(COLS_TITLE.SEND_TIME),
    index,
    row,
  }))

  return z.array(ReceiverSchema).parse(record)
}
