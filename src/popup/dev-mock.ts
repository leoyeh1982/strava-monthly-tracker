// Mock Chrome APIs for local development
export const mockChromeAPI = () => {
  if (typeof window !== 'undefined' && !window.chrome) {
    (window as any).chrome = {
      identity: {
        getRedirectURL: () => 'http://localhost:3000/oauth/callback',
        launchWebAuthFlow: (details: any, callback: any) => {
          // Mock OAuth flow
          console.log('Mock OAuth flow initiated', details);
          setTimeout(() => {
            callback('http://localhost:3000/oauth/callback?code=mock_code_123');
          }, 1000);
        }
      },
      storage: {
        local: {
          set: (data: any, callback?: () => void) => {
            Object.keys(data).forEach(key => {
              localStorage.setItem(key, JSON.stringify(data[key]));
            });
            callback?.();
          },
          get: (keys: string[], callback: (result: any) => void) => {
            const result: any = {};
            keys.forEach(key => {
              const value = localStorage.getItem(key);
              if (value) {
                result[key] = JSON.parse(value);
              }
            });
            callback(result);
          },
          remove: (keys: string[], callback?: () => void) => {
            keys.forEach(key => localStorage.removeItem(key));
            callback?.();
          }
        }
      },
      runtime: {
        lastError: null
      }
    };
  }
};

// Mock Strava API responses for development
export const mockStravaAPI = {
  activities: [
    {
      id: 1,
      name: "晨跑",
      distance: 5000,
      moving_time: 1800,
      elapsed_time: 1800,
      total_elevation_gain: 50,
      type: "Run",
      start_date: "2024-01-15T06:00:00Z",
      average_speed: 2.78,
      max_speed: 4.5,
      average_heartrate: 145,
      max_heartrate: 165
    },
    {
      id: 2,
      name: "單車通勤",
      distance: 12000,
      moving_time: 2400,
      elapsed_time: 2400,
      total_elevation_gain: 120,
      type: "Ride",
      start_date: "2024-01-16T08:00:00Z",
      average_speed: 5.0,
      max_speed: 8.3,
      average_heartrate: 125,
      max_heartrate: 145
    },
    {
      id: 3,
      name: "健身房訓練",
      distance: 0,
      moving_time: 3600,
      elapsed_time: 3600,
      total_elevation_gain: 0,
      type: "Workout",
      start_date: "2024-01-17T19:00:00Z",
      average_speed: 0,
      max_speed: 0
    }
  ]
};