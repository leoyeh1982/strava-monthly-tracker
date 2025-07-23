import { StravaAuth, StravaTokens } from './auth';
import { mockStravaAPI } from '../popup/dev-mock';

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
}

export interface MonthlyStats {
  totalDistance: number;
  totalTime: number;
  totalElevation: number;
  activityCount: number;
  totalCalories: number;
  runningStats: ActivityTypeStats;
  cyclingStats: ActivityTypeStats;
  swimmingStats: ActivityTypeStats;
}

export interface ActivityTypeStats {
  distance: number;
  time: number;
  calories: number;
  count: number;
}

export class StravaAPI {
  private static BASE_URL = 'https://www.strava.com/api/v3';

  static async getMonthlyActivities(year: number, month: number): Promise<StravaActivity[]> {
    return await this.makeAuthenticatedRequest(async (tokens) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const after = Math.floor(startDate.getTime() / 1000);
      const before = Math.floor(endDate.getTime() / 1000);

      const url = `${this.BASE_URL}/athlete/activities?after=${after}&before=${before}&per_page=200`;
      console.log(`Fetching activities from: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        
        if (response.status === 401) {
          throw new Error('TOKEN_EXPIRED');
        }
        
        throw new Error(`Failed to fetch activities: ${response.status} - ${errorText}`);
      }

      const activities = await response.json();
      console.log(`Fetched ${activities.length} activities`);
      return activities;
    });
  }

  private static async makeAuthenticatedRequest<T>(
    requestFn: (tokens: StravaTokens) => Promise<T>
  ): Promise<T> {
    let tokens = await StravaAuth.getValidTokens();
    if (!tokens) {
      throw new Error('Not authenticated');
    }

    try {
      return await requestFn(tokens);
    } catch (error) {
      if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
        console.log('Token expired, forcing refresh and retrying...');
        
        // Force refresh by getting tokens again
        tokens = await StravaAuth.getValidTokens();
        if (!tokens) {
          throw new Error('Failed to refresh authentication');
        }
        
        // Retry the request with new tokens
        return await requestFn(tokens);
      }
      throw error;
    }
  }

  static calculateMonthlyStats(activities: StravaActivity[]): MonthlyStats {
    // Filter activities to only include running, cycling, and swimming
    const targetActivityTypes = ['Run', 'Ride', 'Swim'];
    const filteredActivities = activities.filter(activity => 
      targetActivityTypes.includes(activity.type)
    );

    // Calculate stats by activity type
    const runningActivities = filteredActivities.filter(a => a.type === 'Run');
    const cyclingActivities = filteredActivities.filter(a => a.type === 'Ride');
    const swimmingActivities = filteredActivities.filter(a => a.type === 'Swim');

    const calculateTypeStats = (typeActivities: StravaActivity[], caloriesPerKm: number): ActivityTypeStats => {
      const distance = typeActivities.reduce((sum, a) => sum + a.distance, 0);
      const time = typeActivities.reduce((sum, a) => sum + a.moving_time, 0);
      const calories = Math.round(distance / 1000 * caloriesPerKm);
      const count = typeActivities.length;
      
      return { distance: Math.round(distance), time, calories, count };
    };

    const runningStats = calculateTypeStats(runningActivities, 70); // 70 cal/km for running
    const cyclingStats = calculateTypeStats(cyclingActivities, 40); // 40 cal/km for cycling  
    const swimmingStats = calculateTypeStats(swimmingActivities, 100); // 100 cal/km for swimming

    // Calculate totals
    const totalDistance = runningStats.distance + cyclingStats.distance + swimmingStats.distance;
    const totalTime = runningStats.time + cyclingStats.time + swimmingStats.time;
    const totalCalories = runningStats.calories + cyclingStats.calories + swimmingStats.calories;
    const activityCount = runningStats.count + cyclingStats.count + swimmingStats.count;
    const totalElevation = filteredActivities.reduce((sum, activity) => 
      sum + (activity.total_elevation_gain || 0), 0);

    return {
      totalDistance,
      totalTime,
      totalElevation: Math.round(totalElevation),
      activityCount,
      totalCalories,
      runningStats,
      cyclingStats,
      swimmingStats,
    };
  }

  static async getCurrentMonthStats(): Promise<MonthlyStats> {
    const now = new Date();
    const activities = await this.getMonthlyActivities(now.getFullYear(), now.getMonth() + 1);
    return this.calculateMonthlyStats(activities);
  }

  static formatDistance(meters: number): string {
    const km = meters / 1000;
    return `${km.toFixed(2)} km`;
  }

  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  static formatSpeed(metersPerSecond: number): string {
    const kmh = metersPerSecond * 3.6;
    return `${kmh.toFixed(1)} km/h`;
  }
}