# Strava Monthly Tracker Chrome Extension

A Chrome extension that tracks your monthly Strava activities and displays comprehensive exercise statistics using React and Ant Design.

## Features

- 🔐 Secure Strava OAuth authentication
- 📊 Monthly activity statistics
- 🏃‍♂️ Distance, time, elevation, and calorie tracking
- 📱 Beautiful UI with Ant Design components
- 🔄 Automatic token refresh
- 📈 Activity list with details

## Setup Instructions

### 1. Strava API Setup

1. Go to [Strava Developers](https://developers.strava.com/)
2. Create a new application
3. Note down your `Client ID` and `Client Secret`
4. Set the authorization callback domain to your Chrome extension ID

### 2. Configure the Extension

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Update Strava credentials in `src/services/auth.ts`:
   ```typescript
   private static CLIENT_ID = 'YOUR_STRAVA_CLIENT_ID';
   private static CLIENT_SECRET = 'YOUR_STRAVA_CLIENT_SECRET';
   ```

4. Update `manifest.json` with your Strava Client ID:
   ```json
   "oauth2": {
     "client_id": "YOUR_STRAVA_CLIENT_ID",
     "scopes": ["activity:read_all"]
   }
   ```

### 3. Build and Install

1. Build the extension:
   ```bash
   npm run build
   ```

2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder

### 4. Usage

1. Click the extension icon in Chrome
2. Click "Connect with Strava" to authenticate
3. View your monthly statistics and recent activities
4. Use "Refresh Data" to update your stats

## Development

```bash
# Development mode with watch
npm run dev

# Production build
npm run build

# Clean build directory
npm run clean
```

## Technologies Used

- React 18 with TypeScript
- Ant Design for UI components
- Vite for fast builds and development
- Chrome Extensions Manifest V3
- Strava API v3

## Monthly Statistics Displayed

- **Total Distance**: Accumulated distance for the current month
- **Activities**: Number of activities completed
- **Total Time**: Total moving time
- **Calories**: Estimated calories burned
- **Recent Activities**: List of your latest 5 activities

## Requirements

- Chrome browser with Extensions support
- Strava account with activities
- Active internet connection for API calls