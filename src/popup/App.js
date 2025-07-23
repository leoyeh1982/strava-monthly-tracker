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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Button, Statistic, Row, Col, Typography, Space, Alert, Spin } from 'antd';
import { TrophyOutlined, FireOutlined, ClockCircleOutlined, RiseOutlined } from '@ant-design/icons';
import { StravaAuth } from '../services/auth';
import { StravaAPI } from '../services/strava';
var Title = Typography.Title, Text = Typography.Text;
var App = function () {
    var _a = useState(false), isAuthenticated = _a[0], setIsAuthenticated = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), monthlyStats = _c[0], setMonthlyStats = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var _e = useState([]), debugInfo = _e[0], setDebugInfo = _e[1];
    var _f = useState(true), debugMode = _f[0], setDebugMode = _f[1]; // Always show debug by default
    var addDebugInfo = function (message) {
        var timestamp = new Date().toLocaleTimeString();
        var debugMessage = "".concat(timestamp, ": ").concat(message);
        setDebugInfo(function (prev) { return __spreadArray(__spreadArray([], prev, true), [debugMessage], false); });
        console.log(debugMessage);
    };
    useEffect(function () {
        checkAuthStatus(true);
        // Listen for token updates from background script
        var messageListener = function (message) {
            if (message.type === 'TOKENS_UPDATED') {
                addDebugInfo('Received tokens from web app automatically!');
                addDebugInfo('Tokens received via background script');
                setError('');
                // Recheck auth status to update UI
                setTimeout(function () { return checkAuthStatus(); }, 500);
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);
        return function () {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);
    // Auto refresh extension functionality - only when needed
    useEffect(function () {
        var handleVisibilityChange = function () {
            if (!document.hidden && !isAuthenticated) {
                // Only check when not authenticated and popup becomes visible
                addDebugInfo('Extension popup became visible, checking for tokens...');
                setTimeout(checkAuthStatus, 500);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return function () {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated]);
    var checkAuthStatus = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (isInitial) {
            var tokens, err_1, errorMessage;
            if (isInitial === void 0) { isInitial = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        addDebugInfo("Checking authentication status... ".concat(isInitial ? '(initial)' : '(visibility change)'));
                        return [4 /*yield*/, StravaAuth.getValidTokens()];
                    case 1:
                        tokens = _a.sent();
                        if (!tokens) return [3 /*break*/, 3];
                        addDebugInfo('Found valid tokens, user is authenticated');
                        setIsAuthenticated(true);
                        setError(''); // Clear any previous errors
                        return [4 /*yield*/, loadMonthlyStats()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (!isInitial) {
                            addDebugInfo('Still no valid tokens after visibility change');
                        }
                        else {
                            addDebugInfo('No valid tokens found, user needs to authenticate');
                        }
                        setIsAuthenticated(false);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        err_1 = _a.sent();
                        errorMessage = err_1 instanceof Error ? err_1.message : 'Unknown error';
                        addDebugInfo("Auth check failed: ".concat(errorMessage));
                        if (isInitial) {
                            setError('Failed to check authentication status');
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        if (isInitial) {
                            setLoading(false);
                        }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    var loadMonthlyStats = function () { return __awaiter(void 0, void 0, void 0, function () {
        var stats, err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    addDebugInfo('Loading monthly stats...');
                    return [4 /*yield*/, StravaAPI.getCurrentMonthStats()];
                case 1:
                    stats = _a.sent();
                    addDebugInfo("Loaded ".concat(stats.activityCount, " activities, total distance: ").concat(StravaAPI.formatDistance(stats.totalDistance)));
                    setMonthlyStats(stats);
                    setError('');
                    return [3 /*break*/, 4];
                case 2:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Unknown error';
                    addDebugInfo("Failed to load stats: ".concat(errorMessage));
                    setError("Failed to load monthly stats: ".concat(errorMessage));
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
        var errorMessage;
        return __generator(this, function (_a) {
            try {
                setLoading(true);
                setError(''); // Clear previous errors
                setDebugInfo([]); // Clear previous debug info
                addDebugInfo('Starting authentication...');
                addDebugInfo('Opening web app for OAuth authentication...');
                // Open web app in new tab for OAuth
                chrome.tabs.create({
                    url: 'https://strava-monthly-counter.web.app',
                    active: true
                });
                addDebugInfo('Web app opened in new tab');
                addDebugInfo('Please complete authentication in the web app');
                addDebugInfo('Then use "Update Tokens" button to copy tokens to extension');
                addDebugInfo('Or extension will try to auto-detect tokens from web app');
                setError('Please complete authentication in the web app tab, then return here.');
                // Try to get tokens from web app after a delay
                setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, err_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                addDebugInfo('Checking for tokens from web app...');
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 5, , 6]);
                                return [4 /*yield*/, StravaAuth.getValidTokens()];
                            case 2:
                                tokens = _a.sent();
                                if (!tokens) return [3 /*break*/, 4];
                                addDebugInfo('Found valid tokens!');
                                setIsAuthenticated(true);
                                setError('');
                                return [4 /*yield*/, loadMonthlyStats()];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [3 /*break*/, 6];
                            case 5:
                                err_3 = _a.sent();
                                addDebugInfo('No tokens found yet, please use Update Tokens button');
                                return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); }, 5000);
            }
            catch (err) {
                errorMessage = err instanceof Error ? err.message : 'Unknown error';
                addDebugInfo("Login error: ".concat(errorMessage));
                setError("Login failed: ".concat(errorMessage));
            }
            finally {
                setLoading(false);
            }
            return [2 /*return*/];
        });
    }); };
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, StravaAuth.logout()];
                case 1:
                    _a.sent();
                    setIsAuthenticated(false);
                    setMonthlyStats(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var getCurrentMonth = function () {
        var now = new Date();
        return now.toLocaleString('default', { month: 'long', year: 'numeric' });
    };
    if (loading) {
        return (_jsxs("div", { style: { padding: 20, textAlign: 'center' }, children: [_jsx(Spin, { size: "large" }), _jsx("div", { style: { marginTop: 16 }, children: "Loading..." })] }));
    }
    if (!isAuthenticated) {
        return (_jsxs("div", { style: { padding: 20, textAlign: 'center' }, children: [_jsx(Title, { level: 3, children: "Strava Monthly Tracker" }), _jsx("div", { style: { marginBottom: 20 }, children: _jsx(Text, { children: "Connect your Strava account to track your monthly activities" }) }), _jsx(Button, { type: "primary", size: "large", onClick: handleLogin, style: { backgroundColor: '#FC4C02', borderColor: '#FC4C02' }, children: "Connect with Strava" }), error && (_jsx(Alert, { message: error, type: "error", style: { marginTop: 16 }, showIcon: true })), debugMode && (_jsx(Card, { title: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { children: "Debug Info" }), _jsx(Button, { size: "small", onClick: function () { return setDebugInfo([]); }, style: { fontSize: '10px' }, children: "Clear" })] }), size: "small", style: { marginTop: 16 }, children: _jsx("div", { style: { maxHeight: '200px', overflowY: 'auto' }, children: debugInfo.length === 0 ? (_jsx(Text, { style: { fontSize: '10px', color: '#999' }, children: "No debug info yet..." })) : (debugInfo.map(function (info, index) { return (_jsx("div", { style: {
                                fontSize: '10px',
                                marginBottom: 4,
                                padding: '2px 4px',
                                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent',
                                borderRadius: '2px',
                                fontFamily: 'monospace'
                            }, children: info }, index)); })) }) })), _jsx("div", { style: { textAlign: 'center', marginTop: 8 }, children: _jsxs(Space, { wrap: true, children: [_jsx(Button, { size: "small", type: "text", onClick: function () { return setDebugMode(!debugMode); }, style: { fontSize: '10px' }, children: debugMode ? 'Hide Debug' : 'Show Debug' }), _jsx(Button, { size: "small", type: "text", onClick: function () {
                                    var debugText = debugInfo.join('\n');
                                    navigator.clipboard.writeText(debugText).then(function () {
                                        addDebugInfo('Debug info copied to clipboard');
                                    }).catch(function () {
                                        addDebugInfo('Failed to copy debug info');
                                    });
                                }, style: { fontSize: '10px' }, children: "Copy Debug" }), _jsx(Button, { size: "small", type: "primary", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                addDebugInfo('Manual refresh triggered...');
                                                setError('');
                                                return [4 /*yield*/, checkAuthStatus()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, style: { fontSize: '10px', backgroundColor: '#52c41a', borderColor: '#52c41a' }, loading: loading, children: "\uD83D\uDD04 Refresh" }), _jsx(Button, { size: "small", type: "text", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var authDebug, newDebugMessages;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, StravaAuth.debugStorage()];
                                            case 1:
                                                _a.sent();
                                                authDebug = window.stravaDebug || [];
                                                newDebugMessages = authDebug.slice(debugInfo.length);
                                                newDebugMessages.forEach(function (msg) { return addDebugInfo(msg); });
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, style: { fontSize: '10px' }, children: "Check Storage" }), _jsx(Button, { size: "small", type: "text", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        try {
                                            // Send test message to check if background script is working
                                            chrome.runtime.sendMessage({
                                                type: 'TEST_MESSAGE'
                                            }, function (response) {
                                                if (chrome.runtime.lastError) {
                                                    addDebugInfo("Background script error: ".concat(chrome.runtime.lastError.message));
                                                }
                                                else {
                                                    addDebugInfo('Background script is working');
                                                }
                                            });
                                            // Check if we can access web app tab
                                            chrome.tabs.query({ url: "*://strava-monthly-counter.web.app/*" }, function (tabs) {
                                                if (tabs.length > 0) {
                                                    addDebugInfo("Found ".concat(tabs.length, " web app tab(s)"));
                                                    tabs.forEach(function (tab) {
                                                        addDebugInfo("Tab ".concat(tab.id, ": ").concat(tab.url));
                                                    });
                                                }
                                                else {
                                                    addDebugInfo('No web app tabs found');
                                                }
                                            });
                                        }
                                        catch (err) {
                                            addDebugInfo("Test failed: ".concat(err));
                                        }
                                        return [2 /*return*/];
                                    });
                                }); }, style: { fontSize: '10px' }, children: "Test Scripts" }), _jsx(Button, { size: "small", type: "text", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, StravaAuth.logout()];
                                            case 1:
                                                _a.sent();
                                                addDebugInfo('Cleared all stored tokens');
                                                setIsAuthenticated(false);
                                                setMonthlyStats(null);
                                                setError('');
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, style: { fontSize: '10px' }, children: "Clear Tokens" }), _jsx(Button, { size: "small", type: "text", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var input, newTokens, err_4;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                input = prompt('Please enter new tokens in JSON format from web app:\n\nExample:\n{"access_token":"xxx","refresh_token":"yyy","expires_at":1234567}');
                                                if (!input) return [3 /*break*/, 5];
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 4, , 5]);
                                                newTokens = JSON.parse(input);
                                                return [4 /*yield*/, StravaAuth.updateTokens(newTokens)];
                                            case 2:
                                                _a.sent();
                                                addDebugInfo('Tokens updated successfully');
                                                setError('');
                                                return [4 /*yield*/, checkAuthStatus()];
                                            case 3:
                                                _a.sent();
                                                return [3 /*break*/, 5];
                                            case 4:
                                                err_4 = _a.sent();
                                                addDebugInfo('Failed to update tokens: Invalid JSON');
                                                setError('Invalid token format');
                                                return [3 /*break*/, 5];
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                }); }, style: { fontSize: '10px' }, children: "Update Tokens" })] }) })] }));
    }
    return (_jsxs("div", { style: { padding: 16 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, children: [_jsxs(Title, { level: 4, style: { margin: 0 }, children: [getCurrentMonth(), " Stats"] }), _jsxs(Space, { children: [_jsx(Button, { size: "small", type: "primary", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                addDebugInfo('Manual refresh triggered from authenticated view...');
                                                return [4 /*yield*/, checkAuthStatus()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, loading: loading, style: { backgroundColor: '#52c41a', borderColor: '#52c41a' }, children: "\uD83D\uDD04" }), _jsx(Button, { size: "small", onClick: handleLogout, children: "Logout" })] })] }), error && (_jsx(Alert, { message: error, type: "error", style: { marginBottom: 16 }, showIcon: true })), monthlyStats && (_jsxs(Space, { direction: "vertical", size: "middle", style: { width: '100%' }, children: [_jsxs(Row, { gutter: [8, 8], children: [_jsx(Col, { span: 12, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: "Total Distance", value: StravaAPI.formatDistance(monthlyStats.totalDistance), prefix: _jsx(RiseOutlined, { style: { color: '#52c41a' } }) }) }) }), _jsx(Col, { span: 12, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: "Activities", value: monthlyStats.activityCount, prefix: _jsx(TrophyOutlined, { style: { color: '#1890ff' } }) }) }) })] }), _jsxs(Row, { gutter: [8, 8], children: [_jsx(Col, { span: 12, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: "Total Time", value: StravaAPI.formatTime(monthlyStats.totalTime), prefix: _jsx(ClockCircleOutlined, { style: { color: '#722ed1' } }) }) }) }), _jsx(Col, { span: 12, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: "Calories", value: monthlyStats.totalCalories, prefix: _jsx(FireOutlined, { style: { color: '#fa541c' } }) }) }) })] }), _jsx(Card, { size: "small", title: "Activity Breakdown", children: _jsxs(Row, { gutter: [4, 8], children: [_jsx(Col, { span: 24, children: _jsxs("div", { style: { borderLeft: '3px solid #ff4d4f', paddingLeft: 8, marginBottom: 8 }, children: [_jsxs("div", { style: { fontWeight: 'bold', fontSize: '12px', color: '#ff4d4f' }, children: ["\uD83C\uDFC3\u200D\u2642\uFE0F Running (", monthlyStats.runningStats.count, " activities)"] }), _jsxs("div", { style: { fontSize: '11px', color: '#666' }, children: [StravaAPI.formatDistance(monthlyStats.runningStats.distance), " \u2022 ", StravaAPI.formatTime(monthlyStats.runningStats.time), " \u2022 ", monthlyStats.runningStats.calories, " cal"] })] }) }), _jsx(Col, { span: 24, children: _jsxs("div", { style: { borderLeft: '3px solid #1890ff', paddingLeft: 8, marginBottom: 8 }, children: [_jsxs("div", { style: { fontWeight: 'bold', fontSize: '12px', color: '#1890ff' }, children: ["\uD83D\uDEB4\u200D\u2642\uFE0F Cycling (", monthlyStats.cyclingStats.count, " activities)"] }), _jsxs("div", { style: { fontSize: '11px', color: '#666' }, children: [StravaAPI.formatDistance(monthlyStats.cyclingStats.distance), " \u2022 ", StravaAPI.formatTime(monthlyStats.cyclingStats.time), " \u2022 ", monthlyStats.cyclingStats.calories, " cal"] })] }) }), _jsx(Col, { span: 24, children: _jsxs("div", { style: { borderLeft: '3px solid #52c41a', paddingLeft: 8 }, children: [_jsxs("div", { style: { fontWeight: 'bold', fontSize: '12px', color: '#52c41a' }, children: ["\uD83C\uDFCA\u200D\u2642\uFE0F Swimming (", monthlyStats.swimmingStats.count, " activities)"] }), _jsxs("div", { style: { fontSize: '11px', color: '#666' }, children: [StravaAPI.formatDistance(monthlyStats.swimmingStats.distance), " \u2022 ", StravaAPI.formatTime(monthlyStats.swimmingStats.time), " \u2022 ", monthlyStats.swimmingStats.calories, " cal"] })] }) })] }) }), _jsx(Button, { type: "primary", block: true, onClick: loadMonthlyStats, loading: loading, children: "Refresh Data" })] })), debugInfo.length > 0 && (_jsx(Card, { title: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { style: { fontSize: '12px' }, children: "Debug Info" }), _jsxs(Space, { children: [_jsx(Button, { size: "small", onClick: function () {
                                        var debugText = debugInfo.join('\n');
                                        navigator.clipboard.writeText(debugText).then(function () {
                                            addDebugInfo('Debug info copied to clipboard');
                                        }).catch(function () {
                                            addDebugInfo('Failed to copy debug info');
                                        });
                                    }, style: { fontSize: '10px' }, children: "Copy" }), _jsx(Button, { size: "small", onClick: function () { return setDebugInfo([]); }, style: { fontSize: '10px' }, children: "Clear" })] })] }), size: "small", style: { marginTop: 16 }, children: _jsx("div", { style: { maxHeight: '150px', overflowY: 'auto' }, children: debugInfo.map(function (info, index) { return (_jsx("div", { style: {
                            fontSize: '10px',
                            marginBottom: 2,
                            padding: '2px 4px',
                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent',
                            borderRadius: '2px',
                            fontFamily: 'monospace'
                        }, children: info }, index)); }) }) }))] }));
};
export default App;
