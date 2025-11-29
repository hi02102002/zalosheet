import dotenv from 'dotenv'

import { z } from 'zod'

dotenv.config()

const EnvSchema = z.object({
  GOOGLE_WORKER_EMAIL: z.string().min(1, 'GOOGLE_WORKER_EMAIL is required'),
  GOOGLE_WORKER_EMAIL_PRIVATE_KEY: z.string().min(1, 'GOOGLE_WORKER_EMAIL_PRIVATE_KEY is required').transform(key => key.replace(/\\n/g, '\n')),
  SHEET_ID: z.string().min(1, 'SPREADSHEET_ID is required'),
  SHEET_TITLE: z.string().min(1, 'SHEET_TITLE is required'),
})

// eslint-disable-next-line node/prefer-global/process
export const env = EnvSchema.parse(process.env)
export type Env = z.infer<typeof EnvSchema>
