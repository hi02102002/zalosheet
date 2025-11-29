import type { GoogleSpreadsheetRow } from 'google-spreadsheet'
import z from 'zod'

export const ReceiverSchema = z.object({
  phone: z.string(),
  content: z.string(),
  sendTime: z.string().optional(),
  index: z.number().optional(),
  row: z.custom<GoogleSpreadsheetRow<Record<string, any>>>().optional(),
})

export type Receiver = z.infer<typeof ReceiverSchema>
