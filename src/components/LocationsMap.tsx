import React, { useState } from 'react';
import { MapPin, Monitor, Wifi, WifiOff } from 'lucide-react';

const LocationsMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [
    {
      id: 'frankfurt',
      name: 'Frankfurt',
      country: '🇩🇪 Germany',
      coordinates: { lat: 50.1109, lng: 8.6821 },
      devices: 45,
      status: 'online',
      position: { x: 52, y: 35 },
    },
    {
      id: 'boca-raton',
      name: 'Boca Raton',
      country: '🇺🇸 USA',
      coordinates: { lat: 26.3683, lng: -80.1289 },
      devices: 32,
      status: 'online',
      position: { x: 25, y: 45 },
    },
    {
      id: 'singapore',
      name: 'Singapore',
      country: '🇸🇬 Singapore',
      coordinates: { lat: 1.3521, lng: 103.8198 },
      devices: 28,
      status: 'warning',
      position: { x: 75, y: 60 },
    },
    {
      id: 'london',
      name: 'London',
      country: '🇬🇧 UK',
      coordinates: { lat: 51.5074, lng: -0.1278 },
      devices: 38,
      status: 'online',
      position: { x: 48, y: 32 },
    },
    {
      id: 'new-york',
      name: 'New York',
      country: '🇺🇸 USA',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      devices: 52,
      status: 'offline',
      position: { x: 22, y: 40 },
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi size={16} className="text-mahoney-success" />;
      case 'warning':
        return <Monitor size={16} className="text-mahoney-warning" />;
      case 'offline':
        return <WifiOff size={16} className="text-mahoney-danger" />;
      default:
        return <Wifi size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-mahoney-success';
      case 'warning':
        return 'text-mahoney-warning';
      case 'offline':
        return 'text-mahoney-danger';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'warning':
        return 'Warning';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <MapPin size={24} className="text-mahoney-accent" />
        <h2 className="text-xl font-semibold">Locations Map</h2>
      </div>

      {/* World Map */}
      <div className="card">
        <div className="relative w-full h-64 bg-gradient-to-br from-blue-900/20 to-gray-800/20 rounded-lg border border-gray-700">
          {/* Simplified world map background */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              {/* Simplified continents */}
              <path d="M20 30 Q25 25 30 30 Q35 35 40 30 Q45 25 50 30 Q55 35 60 30 Q65 25 70 30 Q75 35 80 30" 
                    fill="none" stroke="white" strokeWidth="0.5"/>
              <path d="M15 40 Q20 35 25 40 Q30 45 35 40 Q40 35 45 40 Q50 45 55 40 Q60 35 65 40 Q70 45 75 40 Q80 35 85 40" 
                    fill="none" stroke="white" strokeWidth="0.5"/>
            </svg>
          </div>

          {/* Location Pins */}
          {locations.map((location) => (
            <div
              key={location.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${location.position.x}%`, top: `${location.position.y}%` }}
              onClick={() => setSelectedLocation(selectedLocation === location.id ? null : location.id)}
            >
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                location.status === 'online' ? 'bg-mahoney-success' :
                location.status === 'warning' ? 'bg-mahoney-warning' : 'bg-mahoney-danger'
              }`}></div>
              
              {/* Location Info Popup */}
              {selectedLocation === location.id && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-mahoney-card border border-gray-600 rounded-lg p-3 shadow-lg min-w-48 z-10">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin size={16} className="text-mahoney-accent" />
                    <h3 className="font-semibold">{location.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{location.country}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Devices:</span>
                    <span className="font-semibold">{location.devices}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status:</span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(location.status)}
                      <span className={`text-sm font-medium ${getStatusColor(location.status)}`}>
                        {getStatusText(location.status)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">All Locations</h3>
        <div className="space-y-3">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  location.status === 'online' ? 'bg-mahoney-success' :
                  location.status === 'warning' ? 'bg-mahoney-warning' : 'bg-mahoney-danger'
                }`}></div>
                <div>
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-gray-400">{location.country}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{location.devices} devices</p>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(location.status)}
                  <span className={`text-sm ${getStatusColor(location.status)}`}>
                    {getStatusText(location.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationsMap; 