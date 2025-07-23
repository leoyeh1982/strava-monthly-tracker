var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { StravaAuth } from './auth';
var StravaAPI = /** @class */ (function () {
    function StravaAPI() {
    }
    StravaAPI.getMonthlyActivities = function (year, month) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.makeAuthenticatedRequest(function (tokens) { return __awaiter(_this, void 0, void 0, function () {
                            var startDate, endDate, after, before, url, response, errorText, activities;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        startDate = new Date(year, month - 1, 1);
                                        endDate = new Date(year, month, 0);
                                        after = Math.floor(startDate.getTime() / 1000);
                                        before = Math.floor(endDate.getTime() / 1000);
                                        url = "".concat(this.BASE_URL, "/athlete/activities?after=").concat(after, "&before=").concat(before, "&per_page=200");
                                        console.log("Fetching activities from: ".concat(url));
                                        return [4 /*yield*/, fetch(url, {
                                                headers: {
                                                    'Authorization': "Bearer ".concat(tokens.access_token),
                                                },
                                            })];
                                    case 1:
                                        response = _a.sent();
                                        console.log("Response status: ".concat(response.status));
                                        if (!!response.ok) return [3 /*break*/, 3];
                                        return [4 /*yield*/, response.text()];
                                    case 2:
                                        errorText = _a.sent();
                                        console.error("API Error: ".concat(response.status, " - ").concat(errorText));
                                        if (response.status === 401) {
                                            throw new Error('TOKEN_EXPIRED');
                                        }
                                        throw new Error("Failed to fetch activities: ".concat(response.status, " - ").concat(errorText));
                                    case 3: return [4 /*yield*/, response.json()];
                                    case 4:
                                        activities = _a.sent();
                                        console.log("Fetched ".concat(activities.length, " activities"));
                                        return [2 /*return*/, activities];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StravaAPI.makeAuthenticatedRequest = function (requestFn) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, StravaAuth.getValidTokens()];
                    case 1:
                        tokens = _a.sent();
                        if (!tokens) {
                            throw new Error('Not authenticated');
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 8]);
                        return [4 /*yield*/, requestFn(tokens)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_1 = _a.sent();
                        if (!(error_1 instanceof Error && error_1.message === 'TOKEN_EXPIRED')) return [3 /*break*/, 7];
                        console.log('Token expired, forcing refresh and retrying...');
                        return [4 /*yield*/, StravaAuth.getValidTokens()];
                    case 5:
                        // Force refresh by getting tokens again
                        tokens = _a.sent();
                        if (!tokens) {
                            throw new Error('Failed to refresh authentication');
                        }
                        return [4 /*yield*/, requestFn(tokens)];
                    case 6: 
                    // Retry the request with new tokens
                    return [2 /*return*/, _a.sent()];
                    case 7: throw error_1;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    StravaAPI.calculateMonthlyStats = function (activities) {
        // Filter activities to only include running, cycling, and swimming
        var targetActivityTypes = ['Run', 'Ride', 'Swim'];
        var filteredActivities = activities.filter(function (activity) {
            return targetActivityTypes.includes(activity.type);
        });
        // Calculate stats by activity type
        var runningActivities = filteredActivities.filter(function (a) { return a.type === 'Run'; });
        var cyclingActivities = filteredActivities.filter(function (a) { return a.type === 'Ride'; });
        var swimmingActivities = filteredActivities.filter(function (a) { return a.type === 'Swim'; });
        var calculateTypeStats = function (typeActivities, caloriesPerKm) {
            var distance = typeActivities.reduce(function (sum, a) { return sum + a.distance; }, 0);
            var time = typeActivities.reduce(function (sum, a) { return sum + a.moving_time; }, 0);
            var calories = Math.round(distance / 1000 * caloriesPerKm);
            var count = typeActivities.length;
            return { distance: Math.round(distance), time: time, calories: calories, count: count };
        };
        var runningStats = calculateTypeStats(runningActivities, 70); // 70 cal/km for running
        var cyclingStats = calculateTypeStats(cyclingActivities, 40); // 40 cal/km for cycling  
        var swimmingStats = calculateTypeStats(swimmingActivities, 100); // 100 cal/km for swimming
        // Calculate totals
        var totalDistance = runningStats.distance + cyclingStats.distance + swimmingStats.distance;
        var totalTime = runningStats.time + cyclingStats.time + swimmingStats.time;
        var totalCalories = runningStats.calories + cyclingStats.calories + swimmingStats.calories;
        var activityCount = runningStats.count + cyclingStats.count + swimmingStats.count;
        var totalElevation = filteredActivities.reduce(function (sum, activity) {
            return sum + (activity.total_elevation_gain || 0);
        }, 0);
        return {
            totalDistance: totalDistance,
            totalTime: totalTime,
            totalElevation: Math.round(totalElevation),
            activityCount: activityCount,
            totalCalories: totalCalories,
            runningStats: runningStats,
            cyclingStats: cyclingStats,
            swimmingStats: swimmingStats,
        };
    };
    StravaAPI.getCurrentMonthStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, activities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        return [4 /*yield*/, this.getMonthlyActivities(now.getFullYear(), now.getMonth() + 1)];
                    case 1:
                        activities = _a.sent();
                        return [2 /*return*/, this.calculateMonthlyStats(activities)];
                }
            });
        });
    };
    StravaAPI.formatDistance = function (meters) {
        var km = meters / 1000;
        return "".concat(km.toFixed(2), " km");
    };
    StravaAPI.formatTime = function (seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        return "".concat(hours, "h ").concat(minutes, "m");
    };
    StravaAPI.formatSpeed = function (metersPerSecond) {
        var kmh = metersPerSecond * 3.6;
        return "".concat(kmh.toFixed(1), " km/h");
    };
    StravaAPI.BASE_URL = 'https://www.strava.com/api/v3';
    return StravaAPI;
}());
export { StravaAPI };
