# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension built with React and Ant Design that connects to the Strava API to track monthly exercise activities and statistics. The extension allows users to authenticate with Strava and view their current month's activity summary including distance, time, elevation, and calories burned.

## Development Commands

```bash
# Install dependencies
npm install

# Development build with watch mode
npm run dev

# Production build
npm run build

# Clean build directory
npm run clean
```

## Build System

This project uses Vite instead of Webpack for faster builds and better development experience. The configuration is in `vite.config.ts` with Chrome extension specific settings.

## Architecture

### Core Structure
- **src/popup/**: Main UI components for the Chrome extension popup
  - `App.tsx`: Main React component with authentication and stats display
  - `index.tsx`: React app entry point
  - `popup.html`: HTML template for the extension popup

- **src/services/**: API and authentication logic
  - `auth.ts`: Strava OAuth flow handling with Chrome identity API
  - `strava.ts`: Strava API client for fetching activities and calculating stats

### Key Components
- **Authentication Flow**: Uses Chrome's `chrome.identity.launchWebAuthFlow` for OAuth
- **Data Storage**: Chrome storage API for persisting access tokens
- **Token Management**: Automatic token refresh handling
- **Stats Calculation**: Monthly aggregation of distance, time, elevation, calories

## Strava API Integration

The extension requires Strava API credentials:
1. Update `YOUR_STRAVA_CLIENT_ID` and `YOUR_STRAVA_CLIENT_SECRET` in `src/services/auth.ts`
2. Update `YOUR_STRAVA_CLIENT_ID` in `manifest.json`
3. Register your extension's redirect URI with Strava

## Chrome Extension Setup

1. Build the extension: `npm run build`
2. Load unpacked extension from the `dist/` directory in Chrome
3. Ensure manifest permissions are correctly configured for Strava API access

## File Structure
```
├── manifest.json          # Chrome extension manifest
├── webpack.config.js       # Build configuration
├── src/
│   ├── popup/             # Extension UI
│   └── services/          # API and auth logic
└── dist/                  # Built extension files
```