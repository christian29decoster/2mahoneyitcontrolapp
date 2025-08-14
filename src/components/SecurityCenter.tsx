import React, { useState } from 'react';
import { Shield, AlertTriangle, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const SecurityCenter: React.FC = () => {
  const [expandedAlarm, setExpandedAlarm] = useState<string | null>(null);

  const vulnerabilities = [
    { level: 'Critical', count: 2, color: 'text-mahoney-danger' },
    { level: 'Medium', count: 5, color: 'text-mahoney-warning' },
    { level: 'Low', count: 12, color: 'text-gray-400' },
  ];

  const securityEvents = [
    { time: '14:32:15', event: 'Failed login attempt detected', severity: 'warning' },
    { time: '14:30:42', event: 'Suspicious network activity', severity: 'critical' },
    { time: '14:28:19', event: 'Firewall rule updated', severity: 'info' },
    { time: '14:25:33', event: 'Virus scan completed', severity: 'success' },
    { time: '14:22:08', event: 'New device connected', severity: 'info' },
  ];

  const alarmPlans = [
    {
      id: '1',
      title: 'Primary Alarm Response',
      description: 'Standard response procedures for security incidents',
      details: 'This plan outlines the immediate actions to be taken when a security incident is detected, including notification procedures, containment steps, and escalation protocols.',
    },
    {
      id: '2',
      title: 'Data Breach Protocol',
      description: 'Procedures for handling potential data breaches',
      details: 'Comprehensive protocol for identifying, containing, and reporting data breaches in compliance with regulatory requirements.',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-mahoney-danger';
      case 'warning': return 'text-mahoney-warning';
      case 'success': return 'text-mahoney-success';
      default: return 'text-gray-400';
    }
  };

  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-mahoney-danger';
      case 'warning': return 'bg-mahoney-warning';
      case 'success': return 'bg-mahoney-success';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield size={24} className="text-mahoney-accent" />
        <h2 className="text-xl font-semibold">Security Center</h2>
      </div>

      {/* Vulnerabilities */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Current Vulnerabilities</h3>
        <div className="space-y-3">
          {vulnerabilities.map((vuln, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle size={16} className={vuln.color} />
                <span className="font-medium">{vuln.level}</span>
              </div>
              <span className={`text-lg font-bold ${vuln.color}`}>{vuln.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Events Log */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Security Events</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {securityEvents.map((event, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-gray-800/30 rounded">
              <div className={`w-2 h-2 rounded-full ${getSeverityDot(event.severity)}`}></div>
              <span className="text-xs text-gray-500 font-mono">{event.time}</span>
              <span className="text-sm flex-1">{event.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alarm Plans */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Alarm Plans</h3>
        <div className="space-y-3">
          {alarmPlans.map((plan) => (
            <div key={plan.id} className="border border-gray-700 rounded-lg">
              <button
                onClick={() => setExpandedAlarm(expandedAlarm === plan.id ? null : plan.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText size={16} className="text-mahoney-accent" />
                  <div>
                    <h4 className="font-medium">{plan.title}</h4>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>
                </div>
                {expandedAlarm === plan.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedAlarm === plan.id && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-300">{plan.details}</p>
                  <button className="btn-primary mt-3 text-sm">
                    View PDF
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter; 