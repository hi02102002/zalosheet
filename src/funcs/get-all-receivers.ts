import z from 'zod'
import { COLS_TITLE } from '@/config'
import { env } from '@/env'
import { getWorksheet } from '@/libs/sheet'
import { ReceiverSchema } from '@/schemas/receiver'

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
