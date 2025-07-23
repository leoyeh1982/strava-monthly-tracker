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
import { StravaWebAuth } from '../services/web-auth';
import { StravaAPI } from '../services/web-strava';
var Title = Typography.Title, Text = Typography.Text;
var WebApp = function () {
    var _a = useState(false), isAuthenticated = _a[0], setIsAuthenticated = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), monthlyStats = _c[0], setMonthlyStats = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var _e = useState([]), debugInfo = _e[0], setDebugInfo = _e[1];
    var addDebugInfo = function (message) {
        var timestamp = new Date().toLocaleTimeString();
        var debugMessage = "".concat(timestamp, ": ").concat(message);
        setDebugInfo(function (prev) { return __spreadArray(__spreadArray([], prev, true), [debugMessage], false); });
        console.log(debugMessage);
    };
    useEffect(function () {
        checkAuthStatus();
    }, []);
    useEffect(function () {
        // Check for OAuth callback
        var urlParams = new URLSearchParams(window.location.search);
        var code = urlParams.get('code');
        var error = urlParams.get('error');
        if (error) {
            setError("OAuth error: ".concat(error));
            setLoading(false);
        }
        else if (code) {
            console.log('OAuth callback detected, processing...');
            handleOAuthCallback();
        }
    }, []);
    var checkAuthStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
        var tokens, err_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    addDebugInfo('Checking authentication status...');
                    return [4 /*yield*/, StravaWebAuth.getValidTokens()];
                case 1:
                    tokens = _a.sent();
                    if (!tokens) return [3 /*break*/, 3];
                    addDebugInfo('Found valid tokens');
                    setIsAuthenticated(true);
                    return [4 /*yield*/, loadMonthlyStats()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    addDebugInfo('No valid tokens found');
                    setIsAuthenticated(false);
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    err_1 = _a.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Unknown error';
                    addDebugInfo("Auth check failed: ".concat(errorMessage));
                    setError('Failed to check authentication status');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
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
                    addDebugInfo("Loaded ".concat(stats.activityCount, " activities"));
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
    var handleOAuthCallback = function () { return __awaiter(void 0, void 0, void 0, function () {
        var tokens, err_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setLoading(true);
                    setError('');
                    addDebugInfo('Processing OAuth callback...');
                    return [4 /*yield*/, StravaWebAuth.authenticate()];
                case 1:
                    tokens = _a.sent();
                    if (!tokens) return [3 /*break*/, 3];
                    addDebugInfo('OAuth callback successful');
                    setIsAuthenticated(true);
                    return [4 /*yield*/, loadMonthlyStats()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    addDebugInfo('OAuth callback returned null');
                    setError('Failed to process OAuth callback');
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    err_3 = _a.sent();
                    errorMessage = err_3 instanceof Error ? err_3.message : 'Unknown error';
                    addDebugInfo("OAuth callback error: ".concat(errorMessage));
                    setError("OAuth callback failed: ".concat(errorMessage));
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setLoading(true);
                    return [4 /*yield*/, StravaWebAuth.authenticate()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    setError('Login failed');
                    setLoading(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, StravaWebAuth.logout()];
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
        return (_jsxs("div", { style: { padding: 40, textAlign: 'center' }, children: [_jsx(Spin, { size: "large" }), _jsx("div", { style: { marginTop: 16 }, children: "Loading..." })] }));
    }
    if (!isAuthenticated) {
        return (_jsxs("div", { style: { padding: 40, textAlign: 'center' }, children: [_jsx(Title, { level: 2, children: "Welcome to Strava Monthly Tracker" }), _jsx("div", { style: { marginBottom: 30 }, children: _jsx(Text, { style: { fontSize: 16 }, children: "Connect your Strava account to track your monthly activities and see your progress" }) }), _jsx(Button, { type: "primary", size: "large", onClick: handleLogin, style: {
                        backgroundColor: '#FC4C02',
                        borderColor: '#FC4C02',
                        height: 50,
                        fontSize: 16,
                        paddingLeft: 30,
                        paddingRight: 30
                    }, children: "Connect with Strava" }), error && (_jsx(Alert, { message: error, type: "error", style: { marginTop: 24, maxWidth: 400, margin: '24px auto 0' }, showIcon: true }))] }));
    }
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }, children: [_jsxs(Title, { level: 3, style: { margin: 0 }, children: [getCurrentMonth(), " Statistics"] }), _jsx(Button, { onClick: handleLogout, children: "Logout" })] }), error && (_jsx(Alert, { message: error, type: "error", style: { marginBottom: 24 }, showIcon: true })), monthlyStats && (_jsxs(Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [_jsxs(Row, { gutter: [16, 16], children: [_jsx(Col, { xs: 24, sm: 12, md: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "Total Distance", value: StravaAPI.formatDistance(monthlyStats.totalDistance), prefix: _jsx(RiseOutlined, { style: { color: '#52c41a' } }) }) }) }), _jsx(Col, { xs: 24, sm: 12, md: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "Activities", value: monthlyStats.activityCount, prefix: _jsx(TrophyOutlined, { style: { color: '#1890ff' } }) }) }) }), _jsx(Col, { xs: 24, sm: 12, md: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "Total Time", value: StravaAPI.formatTime(monthlyStats.totalTime), prefix: _jsx(ClockCircleOutlined, { style: { color: '#722ed1' } }) }) }) }), _jsx(Col, { xs: 24, sm: 12, md: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "Calories", value: monthlyStats.totalCalories, prefix: _jsx(FireOutlined, { style: { color: '#fa541c' } }) }) }) })] }), _jsx(Card, { title: "Activity Breakdown", children: _jsxs(Row, { gutter: [16, 16], children: [_jsx(Col, { span: 24, children: _jsxs("div", { style: { borderLeft: '4px solid #ff4d4f', paddingLeft: 16, marginBottom: 16 }, children: [_jsxs("div", { style: { fontWeight: 'bold', fontSize: 16, color: '#ff4d4f', marginBottom: 4 }, children: ["\uD83C\uDFC3\u200D\u2642\uFE0F Running (", monthlyStats.runningStats.count, " activities)"] }), _jsxs("div", { style: { color: '#666', fontSize: 14 }, children: [StravaAPI.formatDistance(monthlyStats.runningStats.distance), " \u2022 ", StravaAPI.formatTime(monthlyStats.runningStats.time), " \u2022 ", monthlyStats.runningStats.calories, " cal"] })] }) }), _jsx(Col, { span: 24, children: _jsxs("div", { style: { borderLeft: '4px solid #1890ff', paddingLeft: 16, marginBottom: 16 }, children: [_jsxs("div", { style: { fontWeight: 'bold', fontSize: 16, color: '#1890ff', marginBottom: 4 }, children: ["\uD83D\uDEB4\u200D\u2642\uFE0F Cycling (", monthlyStats.cyclingStats.count, " activities)"] }), _jsxs("div", { style: { color: '#666', fontSize: 14 }, children: [StravaAPI.formatDistance(monthlyStats.cyclingStats.distance), " \u2022 ", StravaAPI.formatTime(monthlyStats.cyclingStats.time), " \u2022 ", monthlyStats.cyclingStats.calories, " cal"] })] }) }), _jsx(Col, { span: 24, children: _jsxs("div", { style: { borderLeft: '4px solid #52c41a', paddingLeft: 16 }, children: [_jsxs("div", { style: { fontWeight: 'bold', fontSize: 16, color: '#52c41a', marginBottom: 4 }, children: ["\uD83C\uDFCA\u200D\u2642\uFE0F Swimming (", monthlyStats.swimmingStats.count, " activities)"] }), _jsxs("div", { style: { color: '#666', fontSize: 14 }, children: [StravaAPI.formatDistance(monthlyStats.swimmingStats.distance), " \u2022 ", StravaAPI.formatTime(monthlyStats.swimmingStats.time), " \u2022 ", monthlyStats.swimmingStats.calories, " cal"] })] }) })] }) }), _jsx(Button, { type: "primary", block: true, size: "large", onClick: loadMonthlyStats, loading: loading, style: { backgroundColor: '#FC4C02', borderColor: '#FC4C02' }, children: "Refresh Data" })] })), debugInfo.length > 0 && (_jsx(Card, { title: "Debug Information", size: "small", style: { marginTop: 24 }, extra: _jsx(Button, { size: "small", onClick: function () { return setDebugInfo([]); }, children: "Clear" }), children: _jsx("div", { style: { maxHeight: '300px', overflowY: 'auto' }, children: debugInfo.map(function (info, index) { return (_jsx("div", { style: {
                            fontSize: '12px',
                            marginBottom: 4,
                            padding: '4px 8px',
                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                        }, children: info }, index)); }) }) }))] }));
};
export default WebApp;
