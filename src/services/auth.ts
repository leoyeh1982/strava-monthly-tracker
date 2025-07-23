export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export class StravaAuth {
  private static CLIENT_ID = '107489';
  private static CLIENT_SECRET = 'fe0aa62a8ee8486c055ea3373ce3b9b4b948f4a8';
  private static REDIRECT_URI = chrome.identity.getRedirectURL();
  
  // Method to get real tokens from web app localStorage  
  private static async getTokensFromWebApp(): Promise<StravaTokens | null> {
    try {
      // Try to get tokens from the web app's localStorage
      const response = await fetch('https://strava-monthly-counter.web.app', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        // This is a fallback - we'll need manual token input for now
        return null;
      }
    } catch (error) {
      console.log('Could not fetch tokens from web app');
    }
    return null;
  }

  // Method to update tokens with fresh ones from web app
  static async updateTokens(newTokens: StravaTokens): Promise<void> {
    await this.saveTokens(newTokens);
    console.log('Tokens updated successfully');
  }
  
  static async authenticate(): Promise<StravaTokens | null> {
    try {
      // Store debug info in a global variable that the UI can access
      (window as any).stravaDebug = [];
      const addDebug = (msg: string) => {
        (window as any).stravaDebug.push(msg);
        console.log(msg);
      };

      addDebug('Starting authentication process...');
      
      // First check if we have stored tokens in Chrome extension storage
      const storedTokens = await this.getStoredTokens();
      
      if (storedTokens) {
        addDebug('Found stored tokens in Chrome extension storage, checking validity...');
        const validTokens = await this.getValidTokens();
        if (validTokens) {
          addDebug('Stored tokens are valid');
          return validTokens;
        } else {
          addDebug('Stored tokens are invalid, starting OAuth flow');
        }
      } else {
        addDebug('No stored tokens found in Chrome extension storage, starting OAuth flow');
      }
      
      // Use Chrome's built-in OAuth with extension redirect URI
      addDebug('Starting Chrome extension OAuth flow...');
      
      return new Promise((resolve) => {
        const authUrl = `https://www.strava.com/oauth/authorize?` +
          `client_id=${this.CLIENT_ID}&` +
          `response_type=code&` +
          `redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&` +
          `approval_prompt=force&` +
          `scope=activity:read`;
        
        addDebug(`Auth URL: ${authUrl}`);
        addDebug(`Redirect URI: ${this.REDIRECT_URI}`);
        
        chrome.identity.launchWebAuthFlow({
          url: authUrl,
          interactive: true
        }, async (responseUrl) => {
          addDebug('OAuth flow callback triggered');
          
          if (chrome.runtime.lastError) {
            addDebug(`OAuth error: ${chrome.runtime.lastError.message}`);
            addDebug('OAuth failed - using web app redirect URI should work');
            addDebug('Make sure this redirect URI is registered in Strava:');
            addDebug(`${this.REDIRECT_URI}`);
            addDebug('This should already be registered for the web app');
            resolve(null);
            return;
          }
          
          if (!responseUrl) {
            addDebug('No response URL received from OAuth flow');
            resolve(null);
            return;
          }
          
          addDebug(`OAuth response URL received: ${responseUrl}`);
          
          try {
            addDebug(`Processing OAuth response URL: ${responseUrl}`);
            
            // Handle web app redirect URI responses
            if (responseUrl.includes('strava-monthly-counter.web.app')) {
              addDebug('Received web app redirect, parsing for authorization code...');
            }
            
            const url = new URL(responseUrl);
            const code = url.searchParams.get('code');
            const error = url.searchParams.get('error');
            const state = url.searchParams.get('state');
            
            addDebug(`URL search params: code=${code ? 'present' : 'missing'}, error=${error || 'none'}, state=${state || 'none'}`);
            
            if (error) {
              addDebug(`OAuth error in response: ${error}`);
              resolve(null);
              return;
            }
            
            if (!code) {
              addDebug('No authorization code found in response URL');
              addDebug('Full URL for debugging:');
              addDebug(responseUrl);
              resolve(null);
              return;
            }
            
            addDebug(`Authorization code received: ${code.substring(0, 10)}...`);
            addDebug('Starting token exchange...');
            
            try {
              const tokens = await this.exchangeCodeForTokens(code);
              addDebug('Token exchange successful!');
              addDebug(`Access token starts with: ${tokens.access_token.substring(0, 10)}...`);
              addDebug(`Token expires at: ${new Date(tokens.expires_at * 1000).toLocaleString()}`);
              
              await this.saveTokens(tokens);
              addDebug('Tokens saved to Chrome extension storage successfully');
              resolve(tokens);
            } catch (exchangeError) {
              const errorMessage = exchangeError instanceof Error ? exchangeError.message : 'Unknown error';
              addDebug(`Token exchange failed: ${errorMessage}`);
              if (exchangeError instanceof Error) {
                addDebug(`Error stack: ${exchangeError.stack}`);
              }
              resolve(null);
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            addDebug(`OAuth callback processing failed: ${errorMessage}`);
            addDebug(`Raw response URL: ${responseUrl}`);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      return null;
    }
  }

  private static async exchangeCodeForTokens(code: string): Promise<StravaTokens> {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', errorText);
      throw new Error(`Failed to exchange code for tokens: ${response.status}`);
    }

    return await response.json();
  }

  static async getValidTokens(): Promise<StravaTokens | null> {
    // Store debug info in a global variable that the UI can access
    (window as any).stravaDebug = (window as any).stravaDebug || [];
    const addDebug = (msg: string) => {
      (window as any).stravaDebug.push(msg);
      console.log(msg);
    };

    const tokens = await this.getStoredTokens();
    if (!tokens) {
      addDebug('No tokens found in storage');
      return null;
    }

    const now = Date.now() / 1000;
    const expiresAt = tokens.expires_at;
    const timeUntilExpiry = expiresAt - now;
    
    addDebug(`Token expires at: ${new Date(expiresAt * 1000).toLocaleString()}`);
    addDebug(`Current time: ${new Date(now * 1000).toLocaleString()}`);
    addDebug(`Time until expiry: ${Math.round(timeUntilExpiry)} seconds`);

    if (timeUntilExpiry > 300) { // Token valid for more than 5 minutes
      addDebug('Token is still valid');
      return tokens;
    } else if (timeUntilExpiry > 0) {
      addDebug('Token expires soon, refreshing proactively');
    } else {
      addDebug('Token has expired, refreshing');
    }

    return await this.refreshTokens(tokens.refresh_token);
  }

  private static async refreshTokens(refreshToken: string): Promise<StravaTokens | null> {
    // Store debug info in a global variable that the UI can access
    (window as any).stravaDebug = (window as any).stravaDebug || [];
    const addDebug = (msg: string) => {
      (window as any).stravaDebug.push(msg);
      console.log(msg);
    };

    try {
      addDebug('Starting token refresh...');
      
      const requestBody = {
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      };
      
      addDebug(`Refresh request: ${JSON.stringify({ ...requestBody, client_secret: '***' })}`);
      
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      addDebug(`Refresh response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        addDebug(`Token refresh failed: ${response.status} - ${errorText}`);
        throw new Error(`Failed to refresh tokens: ${response.status} - ${errorText}`);
      }

      const tokens = await response.json();
      const newExpiryTime = new Date(tokens.expires_at * 1000).toLocaleString();
      addDebug(`Token refreshed successfully! New expiry: ${newExpiryTime}`);
      addDebug(`New access token starts with: ${tokens.access_token.substring(0, 10)}...`);
      
      await this.saveTokens(tokens);
      addDebug('Refreshed tokens saved to Chrome extension storage');
      return tokens;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addDebug(`Token refresh failed: ${errorMessage}`);
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  private static async saveTokens(tokens: StravaTokens): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ stravaTokens: tokens }, resolve);
    });
  }

  private static async getStoredTokens(): Promise<StravaTokens | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['stravaTokens'], (result) => {
        resolve(result.stravaTokens || null);
      });
    });
  }

  static async logout(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(['stravaTokens'], resolve);
    });
  }

  // Debug function to check what's in storage
  static async debugStorage(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (allData) => {
        console.log('All Chrome storage data:', allData);
        const debugMsg = `Storage contents: ${JSON.stringify(allData, null, 2)}`;
        (window as any).stravaDebug = (window as any).stravaDebug || [];
        (window as any).stravaDebug.push(debugMsg);
        resolve();
      });
    });
  }
}