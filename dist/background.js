console.log("Strava Monthly Tracker background script loaded");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received message:", message.type);
  if (message.type === "TOKENS_AVAILABLE") {
    console.log("Received tokens from web app:", message.tokens);
    chrome.storage.local.set({ stravaTokens: message.tokens }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to save tokens:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log("Tokens saved to Chrome storage successfully");
        sendResponse({ success: true });
        chrome.runtime.sendMessage({
          type: "TOKENS_UPDATED",
          tokens: message.tokens
        }).catch(() => {
          console.log("No popup to notify (this is normal)");
        });
      }
    });
    return true;
  }
  if (message.type === "TEST_MESSAGE") {
    console.log("Test message received by background script");
    sendResponse({ success: true, message: "Background script is working" });
    return true;
  }
});
chrome.runtime.onStartup.addListener(() => {
  console.log("Extension started");
});
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});
