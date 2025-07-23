import React, { useState, useEffect } from 'react';
import { Card, Button, Statistic, Row, Col, List, Typography, Space, Alert, Spin } from 'antd';
import { TrophyOutlined, FireOutlined, ClockCircleOutlined, RiseOutlined } from '@ant-design/icons';
import { StravaWebAuth } from '../services/web-auth';
import { StravaAPI, MonthlyStats, StravaActivity } from '../services/web-strava';

const { Title, Text } = Typography;

const WebApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugMessage = `${timestamp}: ${message}`;
    setDebugInfo(prev => [...prev, debugMessage]);
    console.log(debugMessage);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      setError(`OAuth error: ${error}`);
      setLoading(false);
    } else if (code) {
      console.log('OAuth callback detected, processing...');
      handleOAuthCallback();
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      addDebugInfo('Checking authentication status...');
      const tokens = await StravaWebAuth.getValidTokens();
      
      if (tokens) {
        addDebugInfo('Found valid tokens');
        setIsAuthenticated(true);
        await loadMonthlyStats();
      } else {
        addDebugInfo('No valid tokens found');
        setIsAuthenticated(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addDebugInfo(`Auth check failed: ${errorMessage}`);
      setError('Failed to check authentication status');
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      setLoading(true);
      addDebugInfo('Loading monthly stats...');
      const stats = await StravaAPI.getCurrentMonthStats();
      addDebugInfo(`Loaded ${stats.activityCount} activities`);
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

  const handleOAuthCallback = async () => {
    try {
      setLoading(true);
      setError('');
      addDebugInfo('Processing OAuth callback...');
      
      const tokens = await StravaWebAuth.authenticate();
      if (tokens) {
        addDebugInfo('OAuth callback successful');
        setIsAuthenticated(true);
        await loadMonthlyStats();
      } else {
        addDebugInfo('OAuth callback returned null');
        setError('Failed to process OAuth callback');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addDebugInfo(`OAuth callback error: ${errorMessage}`);
      setError(`OAuth callback failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await StravaWebAuth.authenticate();
    } catch (err) {
      setError('Login failed');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await StravaWebAuth.logout();
    setIsAuthenticated(false);
    setMonthlyStats(null);
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Title level={2}>Welcome to Strava Monthly Tracker</Title>
        <div style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16 }}>
            Connect your Strava account to track your monthly activities and see your progress
          </Text>
        </div>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleLogin}
          style={{ 
            backgroundColor: '#FC4C02', 
            borderColor: '#FC4C02',
            height: 50,
            fontSize: 16,
            paddingLeft: 30,
            paddingRight: 30
          }}
        >
          Connect with Strava
        </Button>
        {error && (
          <Alert 
            message={error} 
            type="error" 
            style={{ marginTop: 24, maxWidth: 400, margin: '24px auto 0' }} 
            showIcon 
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          {getCurrentMonth()} Statistics
        </Title>
        <Button onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {error && (
        <Alert 
          message={error} 
          type="error" 
          style={{ marginBottom: 24 }} 
          showIcon 
        />
      )}

      {monthlyStats && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Distance"
                  value={StravaAPI.formatDistance(monthlyStats.totalDistance)}
                  prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Activities"
                  value={monthlyStats.activityCount}
                  prefix={<TrophyOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Time"
                  value={StravaAPI.formatTime(monthlyStats.totalTime)}
                  prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Calories"
                  value={monthlyStats.totalCalories}
                  prefix={<FireOutlined style={{ color: '#fa541c' }} />}
                />
              </Card>
            </Col>
          </Row>

          {/* Activity Type Breakdown */}
          <Card title="Activity Breakdown">
            <Row gutter={[16, 16]}>
              {/* Running */}
              <Col span={24}>
                <div style={{ borderLeft: '4px solid #ff4d4f', paddingLeft: 16, marginBottom: 16 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 16, color: '#ff4d4f', marginBottom: 4 }}>
                    🏃‍♂️ Running ({monthlyStats.runningStats.count} activities)
                  </div>
                  <div style={{ color: '#666', fontSize: 14 }}>
                    {StravaAPI.formatDistance(monthlyStats.runningStats.distance)} • {StravaAPI.formatTime(monthlyStats.runningStats.time)} • {monthlyStats.runningStats.calories} cal
                  </div>
                </div>
              </Col>
              
              {/* Cycling */}
              <Col span={24}>
                <div style={{ borderLeft: '4px solid #1890ff', paddingLeft: 16, marginBottom: 16 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 16, color: '#1890ff', marginBottom: 4 }}>
                    🚴‍♂️ Cycling ({monthlyStats.cyclingStats.count} activities)
                  </div>
                  <div style={{ color: '#666', fontSize: 14 }}>
                    {StravaAPI.formatDistance(monthlyStats.cyclingStats.distance)} • {StravaAPI.formatTime(monthlyStats.cyclingStats.time)} • {monthlyStats.cyclingStats.calories} cal
                  </div>
                </div>
              </Col>
              
              {/* Swimming */}
              <Col span={24}>
                <div style={{ borderLeft: '4px solid #52c41a', paddingLeft: 16 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 16, color: '#52c41a', marginBottom: 4 }}>
                    🏊‍♂️ Swimming ({monthlyStats.swimmingStats.count} activities)
                  </div>
                  <div style={{ color: '#666', fontSize: 14 }}>
                    {StravaAPI.formatDistance(monthlyStats.swimmingStats.distance)} • {StravaAPI.formatTime(monthlyStats.swimmingStats.time)} • {monthlyStats.swimmingStats.calories} cal
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Button 
            type="primary" 
            block 
            size="large"
            onClick={loadMonthlyStats}
            loading={loading}
            style={{ backgroundColor: '#FC4C02', borderColor: '#FC4C02' }}
          >
            Refresh Data
          </Button>
        </Space>
      )}
      
      {/* Debug Information */}
      {debugInfo.length > 0 && (
        <Card 
          title="Debug Information" 
          size="small" 
          style={{ marginTop: 24 }}
          extra={
            <Button 
              size="small" 
              onClick={() => setDebugInfo([])}
            >
              Clear
            </Button>
          }
        >
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {debugInfo.map((info, index) => (
              <div 
                key={index} 
                style={{ 
                  fontSize: '12px', 
                  marginBottom: 4,
                  padding: '4px 8px',
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent',
                  borderRadius: '4px',
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

export default WebApp;