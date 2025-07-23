"use strict";
// Background script to handle messages and store tokens
console.log('Strava Monthly Tracker background script loaded');
// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Background script received message:', message.type);
    if (message.type === 'TOKENS_AVAILABLE') {
        console.log('Received tokens from web app:', message.tokens);
        // Save tokens to Chrome storage
        chrome.storage.local.set({ stravaTokens: message.tokens }, function () {
            if (chrome.runtime.lastError) {
                console.error('Failed to save tokens:', chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
            }
            else {
                console.log('Tokens saved to Chrome storage successfully');
                sendResponse({ success: true });
                // Notify any open popup about the new tokens
                chrome.runtime.sendMessage({
                    type: 'TOKENS_UPDATED',
                    tokens: message.tokens
                }).catch(function () {
                    // Popup might not be open, that's fine
                    console.log('No popup to notify (this is normal)');
                });
            }
        });
        return true; // Keep message channel open for async response
    }
    if (message.type === 'TEST_MESSAGE') {
        console.log('Test message received by background script');
        sendResponse({ success: true, message: 'Background script is working' });
        return true;
    }
});
// Listen for extension installation/startup
chrome.runtime.onStartup.addListener(function () {
    console.log('Extension started');
});
chrome.runtime.onInstalled.addListener(function () {
    console.log('Extension installed');
});
