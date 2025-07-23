// Content script that runs on the web app to detect and send tokens to extension

interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

console.log('Strava Monthly Tracker content script loaded');

// Function to check for tokens and send to extension
const checkAndSendTokens = () => {
  try {
    const tokensStr = localStorage.getItem('stravaTokens');
    if (tokensStr) {
      const tokens: StravaTokens = JSON.parse(tokensStr);
      
      // Validate tokens
      if (tokens.access_token && tokens.refresh_token && tokens.expires_at) {
        console.log('Found valid tokens in web app, sending to extension...');
        
        // Send tokens to extension
        chrome.runtime.sendMessage({
          type: 'TOKENS_AVAILABLE',
          tokens: tokens
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Extension not available:', chrome.runtime.lastError.message);
          } else {
            console.log('Tokens sent to extension successfully');
          }
        });
      }
    }
  } catch (error) {
    console.log('Error checking tokens:', error);
  }
};

// Check immediately when script loads
checkAndSendTokens();

// Monitor localStorage changes
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key: string, value: string) {
  originalSetItem.apply(this, [key, value]);
  
  if (key === 'stravaTokens') {
    console.log('stravaTokens updated in localStorage');
    setTimeout(checkAndSendTokens, 500); // Small delay to ensure data is saved
  }
};

// Also check periodically in case we missed the update
setInterval(checkAndSendTokens, 2000);

// Listen for page visibility changes (when user returns to tab)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    setTimeout(checkAndSendTokens, 1000);
  }
});