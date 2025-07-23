export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export class StravaWebAuth {
  private static CLIENT_ID = '107489';
  private static CLIENT_SECRET = 'fe0aa62a8ee8486c055ea3373ce3b9b4b948f4a8';
  private static REDIRECT_URI = `https://strava-monthly-counter.web.app`;
  
  static async authenticate(): Promise<StravaTokens | null> {
    try {
      // Check if we're returning from OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      console.log('Authenticate called, code:', code);
      
      if (code) {
        console.log('Processing authorization code...');
        try {
          const tokens = await this.exchangeCodeForTokens(code);
          console.log('Token exchange successful');
          await this.saveTokens(tokens);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
          return tokens;
        } catch (error) {
          console.error('Token exchange failed:', error);
          throw error;
        }
      }
      
      // Check if we already have valid tokens
      const existingTokens = await this.getValidTokens();
      if (existingTokens) {
        console.log('Found existing valid tokens');
        return existingTokens;
      }
      
      // Redirect to Strava OAuth
      console.log('Redirecting to Strava OAuth...');
      const authUrl = `https://www.strava.com/oauth/authorize?` +
        `client_id=${this.CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&` +
        `approval_prompt=force&` +
        `scope=activity:read`;

      window.location.href = authUrl;
      return null;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  private static async exchangeCodeForTokens(code: string): Promise<StravaTokens> {
    console.log('Exchanging code for tokens...');
    
    const requestBody = {
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: this.REDIRECT_URI,
    };
    
    console.log('Request body:', { ...requestBody, client_secret: '***' });
    
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Token exchange response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange error:', errorText);
      throw new Error(`Failed to exchange code for tokens: ${response.status} - ${errorText}`);
    }

    const tokens = await response.json();
    console.log('Received tokens:', { ...tokens, access_token: tokens.access_token?.substring(0, 10) + '...', refresh_token: tokens.refresh_token?.substring(0, 10) + '...' });
    return tokens;
  }

  static async getValidTokens(): Promise<StravaTokens | null> {
    const tokens = await this.getStoredTokens();
    if (!tokens) return null;

    if (Date.now() / 1000 < tokens.expires_at) {
      return tokens;
    }

    return await this.refreshTokens(tokens.refresh_token);
  }

  private static async refreshTokens(refreshToken: string): Promise<StravaTokens | null> {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.CLIENT_ID,
          client_secret: this.CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh tokens');
      }

      const tokens = await response.json();
      await this.saveTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  private static async saveTokens(tokens: StravaTokens): Promise<void> {
    localStorage.setItem('stravaTokens', JSON.stringify(tokens));
  }

  private static async getStoredTokens(): Promise<StravaTokens | null> {
    const stored = localStorage.getItem('stravaTokens');
    return stored ? JSON.parse(stored) : null;
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('stravaTokens');
  }
}