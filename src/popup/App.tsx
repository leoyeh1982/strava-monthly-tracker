import React, { useState, useEffect } from 'react';
import { Card, Button, Statistic, Row, Col, List, Typography, Space, Alert, Spin } from 'antd';
import { TrophyOutlined, FireOutlined, ClockCircleOutlined, RiseOutlined } from '@ant-design/icons';
import { StravaAuth } from '../services/auth';
import { StravaAPI, MonthlyStats, StravaActivity } from '../services/strava';

const { Title, Text } = Typography;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [debugMode, setDebugMode] = useState(true); // Always show debug by default

  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugMessage = `${timestamp}: ${message}`;
    setDebugInfo(prev => [...prev, debugMessage]);
    console.log(debugMessage);
  };

  useEffect(() => {
    checkAuthStatus(true);
    
    // Listen for token updates from background script
    const messageListener = (message: any) => {
      if (message.type === 'TOKENS_UPDATED') {
        addDebugInfo('Received tokens from web app automatically!');
        addDebugInfo('Tokens received via background script');
        setError('');
        // Recheck auth status to update UI
        setTimeout(() => checkAuthStatus(), 500);
      }
    };
    
    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  // Auto refresh extension functionality - only when needed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isAuthenticated) {
        // Only check when not authenticated and popup becomes visible
        addDebugInfo('Extension popup became visible, checking for tokens...');
        setTimeout(checkAuthStatus, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  const checkAuthStatus = async (isInitial = false) => {
    try {
      addDebugInfo(`Checking authentication status... ${isInitial ? '(initial)' : '(visibility change)'}`);
      const tokens = await StravaAuth.getValidTokens();
      
      if (tokens) {
        addDebugInfo('Found valid tokens, user is authenticated');
        setIsAuthenticated(true);
        setError(''); // Clear any previous errors
        await loadMonthlyStats();
      } else {
        if (!isInitial) {
          addDebugInfo('Still no valid tokens after visibility change');
        } else {
          addDebugInfo('No valid tokens found, user needs to authenticate');
        }
        setIsAuthenticated(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addDebugInfo(`Auth check failed: ${errorMessage}`);
      if (isInitial) {
        setError('Failed to check authentication status');
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  };

  const loadMonthlyStats = async () => {
    try {
      setLoading(true);
      addDebugInfo('Loading monthly stats...');
      const stats = await StravaAPI.getCurrentMonthStats();
      addDebugInfo(`Loaded ${stats.activityCount} activities, total distance: ${StravaAPI.formatDistance(stats.totalDistance)}`);
      setMonthlyStats(stats);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addDebugInfo(`Failed to load stats: ${errorMessage}`);
      setError(`Failed to load monthly stats: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
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
      setTimeout(async () => {
        addDebugInfo('Checking for tokens from web app...');
        try {
          // Check if we can get tokens from storage
          const tokens = await StravaAuth.getValidTokens();
          if (tokens) {
            addDebugInfo('Found valid tokens!');
            setIsAuthenticated(true);
            setError('');
            await loadMonthlyStats();
          }
        } catch (err) {
          addDebugInfo('No tokens found yet, please use Update Tokens button');
        }
      }, 5000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addDebugInfo(`Login error: ${errorMessage}`);
      setError(`Login failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await StravaAuth.logout();
    setIsAuthenticated(false);
    setMonthlyStats(null);
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <Title level={3}>Strava Monthly Tracker</Title>
        <div style={{ marginBottom: 20 }}>
          <Text>Connect your Strava account to track your monthly activities</Text>
        </div>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleLogin}
          style={{ backgroundColor: '#FC4C02', borderColor: '#FC4C02' }}
        >
          Connect with Strava
        </Button>
        {error && (
          <Alert 
            message={error} 
            type="error" 
            style={{ marginTop: 16 }} 
            showIcon 
          />
        )}
        {debugMode && (
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Debug Info</span>
                <Button 
                  size="small" 
                  onClick={() => setDebugInfo([])}
                  style={{ fontSize: '10px' }}
                >
                  Clear
                </Button>
              </div>
            }
            size="small" 
            style={{ marginTop: 16 }}
          >
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {debugInfo.length === 0 ? (
                <Text style={{ fontSize: '10px', color: '#999' }}>No debug info yet...</Text>
              ) : (
                debugInfo.map((info, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      fontSize: '10px', 
                      marginBottom: 4,
                      padding: '2px 4px',
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent',
                      borderRadius: '2px',
                      fontFamily: 'monospace'
                    }}
                  >
                    {info}
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
        
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Space wrap>
            <Button 
              size="small" 
              type="text" 
              onClick={() => setDebugMode(!debugMode)}
              style={{ fontSize: '10px' }}
            >
              {debugMode ? 'Hide Debug' : 'Show Debug'}
            </Button>
            <Button 
              size="small" 
              type="text" 
              onClick={() => {
                const debugText = debugInfo.join('\n');
                navigator.clipboard.writeText(debugText).then(() => {
                  addDebugInfo('Debug info copied to clipboard');
                }).catch(() => {
                  addDebugInfo('Failed to copy debug info');
                });
              }}
              style={{ fontSize: '10px' }}
            >
              Copy Debug
            </Button>
            <Button 
              size="small" 
              type="primary" 
              onClick={async () => {
                addDebugInfo('Manual refresh triggered...');
                setError('');
                await checkAuthStatus();
              }}
              style={{ fontSize: '10px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              loading={loading}
            >
              🔄 Refresh
            </Button>
            <Button 
              size="small" 
              type="text" 
              onClick={async () => {
                await StravaAuth.debugStorage();
                const authDebug = (window as any).stravaDebug || [];
                const newDebugMessages = authDebug.slice(debugInfo.length);
                newDebugMessages.forEach((msg: string) => addDebugInfo(msg));
              }}
              style={{ fontSize: '10px' }}
            >
              Check Storage
            </Button>
            <Button 
              size="small" 
              type="text" 
              onClick={async () => {
                try {
                  // Send test message to check if background script is working
                  chrome.runtime.sendMessage({
                    type: 'TEST_MESSAGE'
                  }, (response) => {
                    if (chrome.runtime.lastError) {
                      addDebugInfo(`Background script error: ${chrome.runtime.lastError.message}`);
                    } else {
                      addDebugInfo('Background script is working');
                    }
                  });
                  
                  // Check if we can access web app tab
                  chrome.tabs.query({url: "*://strava-monthly-counter.web.app/*"}, (tabs) => {
                    if (tabs.length > 0) {
                      addDebugInfo(`Found ${tabs.length} web app tab(s)`);
                      tabs.forEach(tab => {
                        addDebugInfo(`Tab ${tab.id}: ${tab.url}`);
                      });
                    } else {
                      addDebugInfo('No web app tabs found');
                    }
                  });
                } catch (err) {
                  addDebugInfo(`Test failed: ${err}`);
                }
              }}
              style={{ fontSize: '10px' }}
            >
              Test Scripts
            </Button>
            <Button 
              size="small" 
              type="text" 
              onClick={async () => {
                await StravaAuth.logout();
                addDebugInfo('Cleared all stored tokens');
                setIsAuthenticated(false);
                setMonthlyStats(null);
                setError('');
              }}
              style={{ fontSize: '10px' }}
            >
              Clear Tokens
            </Button>
            <Button 
              size="small" 
              type="text" 
              onClick={async () => {
                const input = prompt('Please enter new tokens in JSON format from web app:\n\nExample:\n{"access_token":"xxx","refresh_token":"yyy","expires_at":1234567}');
                if (input) {
                  try {
                    const newTokens = JSON.parse(input);
                    await StravaAuth.updateTokens(newTokens);
                    addDebugInfo('Tokens updated successfully');
                    setError('');
                    await checkAuthStatus();
                  } catch (err) {
                    addDebugInfo('Failed to update tokens: Invalid JSON');
                    setError('Invalid token format');
                  }
                }
              }}
              style={{ fontSize: '10px' }}
            >
              Update Tokens
            </Button>
          </Space>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          {getCurrentMonth()} Stats
        </Title>
        <Space>
          <Button 
            size="small" 
            type="primary" 
            onClick={async () => {
              addDebugInfo('Manual refresh triggered from authenticated view...');
              await checkAuthStatus();
            }}
            loading={loading}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            🔄
          </Button>
          <Button size="small" onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      </div>

      {error && (
        <Alert 
          message={error} 
          type="error" 
          style={{ marginBottom: 16 }} 
          showIcon 
        />
      )}

      {monthlyStats && (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* Overall Stats */}
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Card size="small">
                <Statistic
                  title="Total Distance"
                  value={StravaAPI.formatDistance(monthlyStats.totalDistance)}
                  prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small">
                <Statistic
                  title="Activities"
                  value={monthlyStats.activityCount}
                  prefix={<TrophyOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Card size="small">
                <Statistic
                  title="Total Time"
                  value={StravaAPI.formatTime(monthlyStats.totalTime)}
                  prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small">
                <Statistic
                  title="Calories"
                  value={monthlyStats.totalCalories}
                  prefix={<FireOutlined style={{ color: '#fa541c' }} />}
                />
              </Card>
            </Col>
          </Row>

          {/* Activity Type Breakdown */}
          <Card size="small" title="Activity Breakdown">
            <Row gutter={[4, 8]}>
              {/* Running */}
              <Col span={24}>
                <div style={{ borderLeft: '3px solid #ff4d4f', paddingLeft: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#ff4d4f' }}>
                    🏃‍♂️ Running ({monthlyStats.runningStats.count} activities)
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {StravaAPI.formatDistance(monthlyStats.runningStats.distance)} • {StravaAPI.formatTime(monthlyStats.runningStats.time)} • {monthlyStats.runningStats.calories} cal
                  </div>
                </div>
              </Col>
              
              {/* Cycling */}
              <Col span={24}>
                <div style={{ borderLeft: '3px solid #1890ff', paddingLeft: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#1890ff' }}>
                    🚴‍♂️ Cycling ({monthlyStats.cyclingStats.count} activities)
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {StravaAPI.formatDistance(monthlyStats.cyclingStats.distance)} • {StravaAPI.formatTime(monthlyStats.cyclingStats.time)} • {monthlyStats.cyclingStats.calories} cal
                  </div>
                </div>
              </Col>
              
              {/* Swimming */}
              <Col span={24}>
                <div style={{ borderLeft: '3px solid #52c41a', paddingLeft: 8 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#52c41a' }}>
                    🏊‍♂️ Swimming ({monthlyStats.swimmingStats.count} activities)
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {StravaAPI.formatDistance(monthlyStats.swimmingStats.distance)} • {StravaAPI.formatTime(monthlyStats.swimmingStats.time)} • {monthlyStats.swimmingStats.calories} cal
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Button 
            type="primary" 
            block 
            onClick={loadMonthlyStats}
            loading={loading}
          >
            Refresh Data
          </Button>
        </Space>
      )}
      
      {/* Debug Information for authenticated users */}
      {debugInfo.length > 0 && (
        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px' }}>Debug Info</span>
              <Space>
                <Button 
                  size="small" 
                  onClick={() => {
                    const debugText = debugInfo.join('\n');
                    navigator.clipboard.writeText(debugText).then(() => {
                      addDebugInfo('Debug info copied to clipboard');
                    }).catch(() => {
                      addDebugInfo('Failed to copy debug info');
                    });
                  }}
                  style={{ fontSize: '10px' }}
                >
                  Copy
                </Button>
                <Button 
                  size="small" 
                  onClick={() => setDebugInfo([])}
                  style={{ fontSize: '10px' }}
                >
                  Clear
                </Button>
              </Space>
            </div>
          }
          size="small" 
          style={{ marginTop: 16 }}
        >
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {debugInfo.map((info, index) => (
              <div 
                key={index} 
                style={{ 
                  fontSize: '10px', 
                  marginBottom: 2,
                  padding: '2px 4px',
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent',
                  borderRadius: '2px',
                  fontFamily: 'monospace'
                }}
              >
                {info}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default App;