import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { env } from '../env'

let jwt: JWT | null = null

/**
 * Gets or creates a JWT client for Google Sheets authentication
 * Caches the JWT instance for reuse across requests
 * @returns JWT client configured with service account credentials
 */
export function getJwt() {
  if (jwt) {
    return jwt
  }

  jwt = new JWT({
    email: env.GOOGLE_WORKER_EMAIL,
    key: env.GOOGLE_WORKER_EMAIL_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return jwt
}

/**
 * Loads and returns a Google Spreadsheet document
 * @param spreadsheetId - The ID of the Google Spreadsheet
 * @returns Promise that resolves to the loaded GoogleSpreadsheet document
 */
export async function getDocument(spreadsheetId: string) {
  const doc = new GoogleSpreadsheet(spreadsheetId, getJwt())

  await doc.loadInfo()

  return doc
}

/**
 * Gets a specific worksheet from a Google Spreadsheet by title
 * @param spreadsheetId - The ID of the Google Spreadsheet
 * @param sheetTitle - The title/name of the sheet tab
 * @returns Promise that resolves to the worksheet
 * @throws Error if the sheet with the specified title is not found
 */
export async function getWorksheet(
  spreadsheetId: string,
  sheetTitle: string,
): Promise<GoogleSpreadsheetWorksheet> {
  const doc = await getDocument(spreadsheetId)

  const sheet = doc.sheetsByTitle[sheetTitle]

  if (!sheet) {
    throw new Error(`Sheet with title "${sheetTitle}" not found`)
  }

  return sheet
}
