import React, { useState, useEffect } from 'react';
import { Activity, Monitor, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [uptime, setUptime] = useState(99.7);
  const [devicesOnline, setDevicesOnline] = useState(247);
  const [securityAlerts, setSecurityAlerts] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live data updates
      setUptime(prev => Math.max(99.0, Math.min(100, prev + (Math.random() - 0.5) * 0.2)));
      setDevicesOnline(prev => Math.max(240, Math.min(255, prev + Math.floor(Math.random() * 6) - 3)));
      setSecurityAlerts(prev => Math.max(0, Math.min(8, prev + Math.floor(Math.random() * 3) - 1)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      title: 'System Uptime',
      value: `${uptime.toFixed(1)}%`,
      icon: Activity,
      color: 'text-mahoney-success',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Devices Online',
      value: devicesOnline.toString(),
      icon: Monitor,
      color: 'text-mahoney-accent',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Security Alerts',
      value: securityAlerts.toString(),
      icon: AlertTriangle,
      color: 'text-mahoney-warning',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp size={24} className="text-mahoney-accent" />
        <h2 className="text-xl font-semibold">System Overview</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon size={20} className={metric.color} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{metric.title}</p>
                    <p className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-2 h-2 bg-mahoney-success rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-500 mt-1">Live</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-mahoney-success rounded-full"></div>
            <span className="text-sm">New device connected: Server-01</span>
            <span className="text-xs text-gray-500 ml-auto">2m ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-mahoney-warning rounded-full"></div>
            <span className="text-sm">Security scan completed</span>
            <span className="text-xs text-gray-500 ml-auto">5m ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-mahoney-accent rounded-full"></div>
            <span className="text-sm">Backup process started</span>
            <span className="text-xs text-gray-500 ml-auto">8m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 