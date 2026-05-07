# Google Sheets Integration Setup

## Current Feature: CSV Export
Your job tracker now has CSV export functionality that works seamlessly with Google Sheets:

1. Click "Export to CSV" or "Export to Google Sheets"
2. A CSV file will be downloaded
3. Open Google Sheets at https://sheets.google.com
4. Create a new blank sheet
5. Go to File > Import > Upload
6. Select the downloaded CSV file
7. Choose "Replace spreadsheet" or "Insert new sheet(s)"
8. Click "Import data"

## Optional: Direct Google Sheets API Integration

If you want direct API integration (to auto-sync without manual CSV import), follow these steps:

### Step 1: Create a Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable the Google Sheets API and Google Drive API

### Step 2: Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Create credentials > Service account
3. Fill in the details and create
4. Go to the service account > Keys > Add key > Create new key
5. Choose JSON and download the key file
6. Save it as `google-credentials.json` in your project root

### Step 3: Share Your Google Sheet
1. Create a new Google Sheet
2. Click "Share"
3. Add the service account email (from your JSON key) as an editor
4. Copy the sheet ID from the URL (it's the long string between `/d/` and `/edit`)

### Step 4: Update Environment Variables
Add these to your `.env.local`:
```
GOOGLE_SHEET_ID=your-sheet-id-here
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```
