# Zalo Sheet Bot

An automated bot that sends messages via Zalo Web based on data from Google Sheets. This tool allows you to manage and automate bulk message sending through Zalo using a spreadsheet as your data source.

## Features

- 📊 **Google Sheets Integration**: Read recipient data directly from Google Sheets
- 🤖 **Automated Zalo Messaging**: Automatically send messages through Zalo Web using Puppeteer
- ⏱️ **Status Tracking**: Updates spreadsheet with send time or error status for each message
- 🔒 **Type-Safe**: Built with TypeScript and Zod for runtime validation
- 📝 **Logging**: Comprehensive logging using Pino
- 🔄 **Error Handling**: Graceful error handling with status updates in the spreadsheet

## Prerequisites

- Node.js (v16 or higher recommended)
- Yarn package manager
- A Google Cloud Project with Google Sheets API enabled
- A Google Service Account with access to your target spreadsheet
- Access to Zalo Web

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hi02102002/zalosheet.git
   cd zalosheet
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory:

   ```bash
   touch .env
   ```

4. Configure your environment variables (see Configuration section below)

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Google Service Account Email
GOOGLE_WORKER_EMAIL=your-service-account@project-id.iam.gserviceaccount.com

# Google Service Account Private Key (with \n for newlines)
GOOGLE_WORKER_EMAIL_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n

# Google Spreadsheet ID (from the URL)
SHEET_ID=your-spreadsheet-id

# Sheet Title/Name within the spreadsheet
SHEET_TITLE=Sheet1
```

### Google Sheets Setup

1. **Create a Google Service Account**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Sheets API
   - Create a Service Account and download the JSON key file

2. **Share your spreadsheet**:
   - Open your Google Spreadsheet
   - Click "Share"
   - Add your service account email with Editor permissions

3. **Spreadsheet Format**:

   Your spreadsheet should have the following columns:

   - `phone`: Recipient's phone number
   - `content`: Message content to send
   - `sendTime`: (Auto-populated) Timestamp or status of the message

   Example:

   | phone       | content                | sendTime           |
   |-------------|------------------------|-------------------|
   | 0123456789  | Hello from Zalo Bot!  |                   |
   | 0987654321  | Have a great day!     |                   |

## Usage

### Build the project

```bash
yarn build
```

### Run the bot

```bash
yarn start
```

### Development mode with auto-rebuild

```bash
yarn dev
```

### Linting

```bash
# Check for linting errors
yarn lint

# Fix linting errors automatically
yarn lint:fix
```

## How It Works

1. **Authentication**: The bot authenticates with Google Sheets using the service account credentials
2. **Data Retrieval**: Fetches all rows from the specified sheet that have phone numbers and content
3. **Browser Launch**: Opens a Puppeteer-controlled Chrome browser
4. **Zalo Login**: Navigates to Zalo Web and waits for manual login via QR code
5. **Message Sending**: For each recipient:
   - Searches for the contact by phone number
   - Opens the chat
   - Types and sends the message
   - Updates the spreadsheet with send time or error status
6. **Status Updates**:
   - Success: Updates `sendTime` with timestamp (DD/MM/YYYY HH:mm:ss)
   - Not found: Sets `sendTime` to "Không tìm thấy số Zalo"
   - Error: Sets `sendTime` to "Đã xảy ra lỗi khi gửi"

## Project Structure

```
zalosheet/
├── src/
│   ├── funcs/              # Core functionality
│   │   ├── get-all-receivers.ts    # Fetch recipients from spreadsheet
│   │   ├── send-message.ts         # Send message via Zalo Web
│   │   └── zalo-bot-send-many.ts   # Main bot orchestration
│   ├── libs/               # Library integrations
│   │   ├── logger.ts       # Pino logger setup
│   │   ├── puppeteer.ts    # Puppeteer browser configuration
│   │   └── sheet.ts        # Google Sheets API wrapper
│   ├── schemas/            # Zod validation schemas
│   │   └── receiver.ts     # Receiver data schema
│   ├── utils/              # Utility functions
│   │   ├── error.ts        # Custom error classes
│   │   └── sleep.ts        # Sleep/delay utility
│   ├── config.ts           # Application configuration
│   ├── env.ts              # Environment validation
│   └── index.ts            # Application entry point
├── .env                    # Environment variables (not in repo)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── tsdown.config.ts        # Build configuration
```

## Scripts

- `yarn build` - Build the project using tsdown
- `yarn start` - Run the built application
- `yarn dev` - Build and run in watch mode
- `yarn lint` - Check for code quality issues
- `yarn lint:fix` - Automatically fix linting issues

## Dependencies

### Production

- `google-spreadsheet` - Google Sheets API client
- `google-auth-library` - Google authentication
- `puppeteer` - Browser automation
- `dotenv` - Environment variable management
- `zod` - Runtime type validation
- `pino` - Fast JSON logger
- `dayjs` - Date formatting

### Development

- `typescript` - TypeScript compiler
- `tsdown` - Fast TypeScript bundler
- `eslint` - Code linting
- `@antfu/eslint-config` - ESLint configuration

## Troubleshooting

### OpenSSL Error (Node.js 22+)

If you encounter an error like `error:1E08010C:DECODER routines::unsupported`, ensure your private key is properly formatted. The `env.ts` file includes a transform that converts literal `\n` to actual newlines.

### Zalo Login Issues

- Make sure you manually scan the QR code when prompted
- The bot waits up to 200 seconds for login
- Ensure Zalo Web is accessible in your region

### Spreadsheet Not Found

- Verify `SHEET_ID` in your `.env` file
- Check that the sheet title matches `SHEET_TITLE` exactly
- Ensure the service account has editor access to the spreadsheet

### Phone Number Not Found

- Ensure the phone number format matches Zalo's expected format
- Verify the contact exists in your Zalo account
- Check if privacy settings prevent the contact from being searched
