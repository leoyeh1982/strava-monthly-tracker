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
var StravaWebAuth = /** @class */ (function () {
    function StravaWebAuth() {
    }
    StravaWebAuth.authenticate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var urlParams, code, tokens, error_1, existingTokens, authUrl, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        urlParams = new URLSearchParams(window.location.search);
                        code = urlParams.get('code');
                        console.log('Authenticate called, code:', code);
                        if (!code) return [3 /*break*/, 5];
                        console.log('Processing authorization code...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.exchangeCodeForTokens(code)];
                    case 2:
                        tokens = _a.sent();
                        console.log('Token exchange successful');
                        return [4 /*yield*/, this.saveTokens(tokens)];
                    case 3:
                        _a.sent();
                        // Clean URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                        return [2 /*return*/, tokens];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Token exchange failed:', error_1);
                        throw error_1;
                    case 5: return [4 /*yield*/, this.getValidTokens()];
                    case 6:
                        existingTokens = _a.sent();
                        if (existingTokens) {
                            console.log('Found existing valid tokens');
                            return [2 /*return*/, existingTokens];
                        }
                        // Redirect to Strava OAuth
                        console.log('Redirecting to Strava OAuth...');
                        authUrl = "https://www.strava.com/oauth/authorize?" +
                            "client_id=".concat(this.CLIENT_ID, "&") +
                            "response_type=code&" +
                            "redirect_uri=".concat(encodeURIComponent(this.REDIRECT_URI), "&") +
                            "approval_prompt=force&" +
                            "scope=activity:read";
                        window.location.href = authUrl;
                        return [2 /*return*/, null];
                    case 7:
                        error_2 = _a.sent();
                        console.error('Authentication failed:', error_2);
                        throw error_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    StravaWebAuth.exchangeCodeForTokens = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var requestBody, response, errorText, tokens;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('Exchanging code for tokens...');
                        requestBody = {
                            client_id: this.CLIENT_ID,
                            client_secret: this.CLIENT_SECRET,
                            code: code,
                            grant_type: 'authorization_code',
                            redirect_uri: this.REDIRECT_URI,
                        };
                        console.log('Request body:', __assign(__assign({}, requestBody), { client_secret: '***' }));
                        return [4 /*yield*/, fetch('https://www.strava.com/oauth/token', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(requestBody),
                            })];
                    case 1:
                        response = _c.sent();
                        console.log('Token exchange response status:', response.status);
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _c.sent();
                        console.error('Token exchange error:', errorText);
                        throw new Error("Failed to exchange code for tokens: ".concat(response.status, " - ").concat(errorText));
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        tokens = _c.sent();
                        console.log('Received tokens:', __assign(__assign({}, tokens), { access_token: ((_a = tokens.access_token) === null || _a === void 0 ? void 0 : _a.substring(0, 10)) + '...', refresh_token: ((_b = tokens.refresh_token) === null || _b === void 0 ? void 0 : _b.substring(0, 10)) + '...' }));
                        return [2 /*return*/, tokens];
                }
            });
        });
    };
    StravaWebAuth.getValidTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStoredTokens()];
                    case 1:
                        tokens = _a.sent();
                        if (!tokens)
                            return [2 /*return*/, null];
                        if (Date.now() / 1000 < tokens.expires_at) {
                            return [2 /*return*/, tokens];
                        }
                        return [4 /*yield*/, this.refreshTokens(tokens.refresh_token)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StravaWebAuth.refreshTokens = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var response, tokens, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch('https://www.strava.com/oauth/token', {
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
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to refresh tokens');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        tokens = _a.sent();
                        return [4 /*yield*/, this.saveTokens(tokens)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, tokens];
                    case 4:
                        error_3 = _a.sent();
                        console.error('Token refresh failed:', error_3);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    StravaWebAuth.saveTokens = function (tokens) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                localStorage.setItem('stravaTokens', JSON.stringify(tokens));
                return [2 /*return*/];
            });
        });
    };
    StravaWebAuth.getStoredTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stored;
            return __generator(this, function (_a) {
                stored = localStorage.getItem('stravaTokens');
                return [2 /*return*/, stored ? JSON.parse(stored) : null];
            });
        });
    };
    StravaWebAuth.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                localStorage.removeItem('stravaTokens');
                return [2 /*return*/];
            });
        });
    };
    StravaWebAuth.CLIENT_ID = '107489';
    StravaWebAuth.CLIENT_SECRET = 'fe0aa62a8ee8486c055ea3373ce3b9b4b948f4a8';
    StravaWebAuth.REDIRECT_URI = "https://strava-monthly-counter.web.app";
    return StravaWebAuth;
}());
export { StravaWebAuth };
