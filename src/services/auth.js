var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var StravaAuth = /** @class */ (function () {
    function StravaAuth() {
    }
    // Method to get real tokens from web app localStorage  
    StravaAuth.getTokensFromWebApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch('https://strava-monthly-counter.web.app', {
                                method: 'GET',
                                credentials: 'include'
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.ok) {
                            // This is a fallback - we'll need manual token input for now
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log('Could not fetch tokens from web app');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    // Method to update tokens with fresh ones from web app
    StravaAuth.updateTokens = function (newTokens) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveTokens(newTokens)];
                    case 1:
                        _a.sent();
                        console.log('Tokens updated successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    StravaAuth.authenticate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addDebug_1, storedTokens, validTokens, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        // Store debug info in a global variable that the UI can access
                        window.stravaDebug = [];
                        addDebug_1 = function (msg) {
                            window.stravaDebug.push(msg);
                            console.log(msg);
                        };
                        addDebug_1('Starting authentication process...');
                        return [4 /*yield*/, this.getStoredTokens()];
                    case 1:
                        storedTokens = _a.sent();
                        if (!storedTokens) return [3 /*break*/, 3];
                        addDebug_1('Found stored tokens in Chrome extension storage, checking validity...');
                        return [4 /*yield*/, this.getValidTokens()];
                    case 2:
                        validTokens = _a.sent();
                        if (validTokens) {
                            addDebug_1('Stored tokens are valid');
                            return [2 /*return*/, validTokens];
                        }
                        else {
                            addDebug_1('Stored tokens are invalid, starting OAuth flow');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        addDebug_1('No stored tokens found in Chrome extension storage, starting OAuth flow');
                        _a.label = 4;
                    case 4:
                        // Use Chrome's built-in OAuth with extension redirect URI
                        addDebug_1('Starting Chrome extension OAuth flow...');
                        return [2 /*return*/, new Promise(function (resolve) {
                                var authUrl = "https://www.strava.com/oauth/authorize?" +
                                    "client_id=".concat(_this.CLIENT_ID, "&") +
                                    "response_type=code&" +
                                    "redirect_uri=".concat(encodeURIComponent(_this.REDIRECT_URI), "&") +
                                    "approval_prompt=force&" +
                                    "scope=activity:read";
                                addDebug_1("Auth URL: ".concat(authUrl));
                                addDebug_1("Redirect URI: ".concat(_this.REDIRECT_URI));
                                chrome.identity.launchWebAuthFlow({
                                    url: authUrl,
                                    interactive: true
                                }, function (responseUrl) { return __awaiter(_this, void 0, void 0, function () {
                                    var url, code, error, state, tokens, exchangeError_1, errorMessage, err_1, errorMessage;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                addDebug_1('OAuth flow callback triggered');
                                                if (chrome.runtime.lastError) {
                                                    addDebug_1("OAuth error: ".concat(chrome.runtime.lastError.message));
                                                    addDebug_1('OAuth failed - using web app redirect URI should work');
                                                    addDebug_1('Make sure this redirect URI is registered in Strava:');
                                                    addDebug_1("".concat(this.REDIRECT_URI));
                                                    addDebug_1('This should already be registered for the web app');
                                                    resolve(null);
                                                    return [2 /*return*/];
                                                }
                                                if (!responseUrl) {
                                                    addDebug_1('No response URL received from OAuth flow');
                                                    resolve(null);
                                                    return [2 /*return*/];
                                                }
                                                addDebug_1("OAuth response URL received: ".concat(responseUrl));
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 7, , 8]);
                                                addDebug_1("Processing OAuth response URL: ".concat(responseUrl));
                                                // Handle web app redirect URI responses
                                                if (responseUrl.includes('strava-monthly-counter.web.app')) {
                                                    addDebug_1('Received web app redirect, parsing for authorization code...');
                                                }
                                                url = new URL(responseUrl);
                                                code = url.searchParams.get('code');
                                                error = url.searchParams.get('error');
                                                state = url.searchParams.get('state');
                                                addDebug_1("URL search params: code=".concat(code ? 'present' : 'missing', ", error=").concat(error || 'none', ", state=").concat(state || 'none'));
                                                if (error) {
                                                    addDebug_1("OAuth error in response: ".concat(error));
                                                    resolve(null);
                                                    return [2 /*return*/];
                                                }
                                                if (!code) {
                                                    addDebug_1('No authorization code found in response URL');
                                                    addDebug_1('Full URL for debugging:');
                                                    addDebug_1(responseUrl);
                                                    resolve(null);
                                                    return [2 /*return*/];
                                                }
                                                addDebug_1("Authorization code received: ".concat(code.substring(0, 10), "..."));
                                                addDebug_1('Starting token exchange...');
                                                _a.label = 2;
                                            case 2:
                                                _a.trys.push([2, 5, , 6]);
                                                return [4 /*yield*/, this.exchangeCodeForTokens(code)];
                                            case 3:
                                                tokens = _a.sent();
                                                addDebug_1('Token exchange successful!');
                                                addDebug_1("Access token starts with: ".concat(tokens.access_token.substring(0, 10), "..."));
                                                addDebug_1("Token expires at: ".concat(new Date(tokens.expires_at * 1000).toLocaleString()));
                                                return [4 /*yield*/, this.saveTokens(tokens)];
                                            case 4:
                                                _a.sent();
                                                addDebug_1('Tokens saved to Chrome extension storage successfully');
                                                resolve(tokens);
                                                return [3 /*break*/, 6];
                                            case 5:
                                                exchangeError_1 = _a.sent();
                                                errorMessage = exchangeError_1 instanceof Error ? exchangeError_1.message : 'Unknown error';
                                                addDebug_1("Token exchange failed: ".concat(errorMessage));
                                                if (exchangeError_1 instanceof Error) {
                                                    addDebug_1("Error stack: ".concat(exchangeError_1.stack));
                                                }
                                                resolve(null);
                                                return [3 /*break*/, 6];
                                            case 6: return [3 /*break*/, 8];
                                            case 7:
                                                err_1 = _a.sent();
                                                errorMessage = err_1 instanceof Error ? err_1.message : 'Unknown error';
                                                addDebug_1("OAuth callback processing failed: ".concat(errorMessage));
                                                addDebug_1("Raw response URL: ".concat(responseUrl));
                                                resolve(null);
                                                return [3 /*break*/, 8];
                                            case 8: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            })];
                    case 5:
                        error_2 = _a.sent();
                        console.error('Authentication failed:', error_2);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StravaAuth.exchangeCodeForTokens = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var response, errorText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('https://www.strava.com/oauth/token', {
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
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _a.sent();
                        console.error('Token exchange failed:', errorText);
                        throw new Error("Failed to exchange code for tokens: ".concat(response.status));
                    case 3: return [4 /*yield*/, response.json()];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StravaAuth.getValidTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addDebug, tokens, now, expiresAt, timeUntilExpiry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Store debug info in a global variable that the UI can access
                        window.stravaDebug = window.stravaDebug || [];
                        addDebug = function (msg) {
                            window.stravaDebug.push(msg);
                            console.log(msg);
                        };
                        return [4 /*yield*/, this.getStoredTokens()];
                    case 1:
                        tokens = _a.sent();
                        if (!tokens) {
                            addDebug('No tokens found in storage');
                            return [2 /*return*/, null];
                        }
                        now = Date.now() / 1000;
                        expiresAt = tokens.expires_at;
                        timeUntilExpiry = expiresAt - now;
                        addDebug("Token expires at: ".concat(new Date(expiresAt * 1000).toLocaleString()));
                        addDebug("Current time: ".concat(new Date(now * 1000).toLocaleString()));
                        addDebug("Time until expiry: ".concat(Math.round(timeUntilExpiry), " seconds"));
                        if (timeUntilExpiry > 300) { // Token valid for more than 5 minutes
                            addDebug('Token is still valid');
                            return [2 /*return*/, tokens];
                        }
                        else if (timeUntilExpiry > 0) {
                            addDebug('Token expires soon, refreshing proactively');
                        }
                        else {
                            addDebug('Token has expired, refreshing');
                        }
                        return [4 /*yield*/, this.refreshTokens(tokens.refresh_token)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StravaAuth.refreshTokens = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var addDebug, requestBody, response, errorText, tokens, newExpiryTime, error_3, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Store debug info in a global variable that the UI can access
                        window.stravaDebug = window.stravaDebug || [];
                        addDebug = function (msg) {
                            window.stravaDebug.push(msg);
                            console.log(msg);
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        addDebug('Starting token refresh...');
                        requestBody = {
                            client_id: this.CLIENT_ID,
                            client_secret: this.CLIENT_SECRET,
                            refresh_token: refreshToken,
                            grant_type: 'refresh_token',
                        };
                        addDebug("Refresh request: ".concat(JSON.stringify(__assign(__assign({}, requestBody), { client_secret: '***' }))));
                        return [4 /*yield*/, fetch('https://www.strava.com/oauth/token', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(requestBody),
                            })];
                    case 2:
                        response = _a.sent();
                        addDebug("Refresh response status: ".concat(response.status));
                        if (!!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.text()];
                    case 3:
                        errorText = _a.sent();
                        addDebug("Token refresh failed: ".concat(response.status, " - ").concat(errorText));
                        throw new Error("Failed to refresh tokens: ".concat(response.status, " - ").concat(errorText));
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        tokens = _a.sent();
                        newExpiryTime = new Date(tokens.expires_at * 1000).toLocaleString();
                        addDebug("Token refreshed successfully! New expiry: ".concat(newExpiryTime));
                        addDebug("New access token starts with: ".concat(tokens.access_token.substring(0, 10), "..."));
                        return [4 /*yield*/, this.saveTokens(tokens)];
                    case 6:
                        _a.sent();
                        addDebug('Refreshed tokens saved to Chrome extension storage');
                        return [2 /*return*/, tokens];
                    case 7:
                        error_3 = _a.sent();
                        errorMessage = error_3 instanceof Error ? error_3.message : 'Unknown error';
                        addDebug("Token refresh failed: ".concat(errorMessage));
                        console.error('Token refresh failed:', error_3);
                        return [2 /*return*/, null];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    StravaAuth.saveTokens = function (tokens) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        chrome.storage.local.set({ stravaTokens: tokens }, resolve);
                    })];
            });
        });
    };
    StravaAuth.getStoredTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        chrome.storage.local.get(['stravaTokens'], function (result) {
                            resolve(result.stravaTokens || null);
                        });
                    })];
            });
        });
    };
    StravaAuth.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        chrome.storage.local.remove(['stravaTokens'], resolve);
                    })];
            });
        });
    };
    // Debug function to check what's in storage
    StravaAuth.debugStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        chrome.storage.local.get(null, function (allData) {
                            console.log('All Chrome storage data:', allData);
                            var debugMsg = "Storage contents: ".concat(JSON.stringify(allData, null, 2));
                            window.stravaDebug = window.stravaDebug || [];
                            window.stravaDebug.push(debugMsg);
                            resolve();
                        });
                    })];
            });
        });
    };
    StravaAuth.CLIENT_ID = '107489';
    StravaAuth.CLIENT_SECRET = 'fe0aa62a8ee8486c055ea3373ce3b9b4b948f4a8';
    StravaAuth.REDIRECT_URI = chrome.identity.getRedirectURL();
    return StravaAuth;
}());
export { StravaAuth };
