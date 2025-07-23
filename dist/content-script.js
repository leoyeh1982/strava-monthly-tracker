console.log("Strava Monthly Tracker content script loaded");
const checkAndSendTokens = () => {
  try {
    const tokensStr = localStorage.getItem("stravaTokens");
    if (tokensStr) {
      const tokens = JSON.parse(tokensStr);
      if (tokens.access_token && tokens.refresh_token && tokens.expires_at) {
        console.log("Found valid tokens in web app, sending to extension...");
        chrome.runtime.sendMessage({
          type: "TOKENS_AVAILABLE",
          tokens
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.log("Extension not available:", chrome.runtime.lastError.message);
          } else {
            console.log("Tokens sent to extension successfully");
          }
        });
      }
    }
  } catch (error) {
    console.log("Error checking tokens:", error);
  }
};
checkAndSendTokens();
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  originalSetItem.apply(this, [key, value]);
  if (key === "stravaTokens") {
    console.log("stravaTokens updated in localStorage");
    setTimeout(checkAndSendTokens, 500);
  }
};
setInterval(checkAndSendTokens, 2e3);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    setTimeout(checkAndSendTokens, 1e3);
  }
});
