import type { GoogleSpreadsheetRow } from 'google-spreadsheet'
import z from 'zod'

/**
 * Zod schema for validating receiver data from Google Sheets
 */
export const ReceiverSchema = z.object({
  /** Recipient's phone number */
  phone: z.string(),
  /** Message content to send */
  content: z.string(),
  /** Optional send timestamp or status message */
  sendTime: z.string().optional(),
  /** Row index in the spreadsheet */
  index: z.number().optional(),
  /** Reference to the Google Spreadsheet row for updating */
  row: z.custom<GoogleSpreadsheetRow<Record<string, any>>>().optional(),
})

/**
 * TypeScript type representing a message receiver
 */
export type Receiver = z.infer<typeof ReceiverSchema>
