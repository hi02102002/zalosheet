import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { env } from '../env'

let jwt: JWT | null = null

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

export async function getDocument(spreadsheetId: string) {
  const doc = new GoogleSpreadsheet(spreadsheetId, getJwt())

  await doc.loadInfo()

  return doc
}

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
