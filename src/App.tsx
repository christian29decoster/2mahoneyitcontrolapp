import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Shield, FileText, Users, MapPin, CreditCard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import SecurityCenter from './components/SecurityCenter';
import Contracts from './components/Contracts';
import UserManagement from './components/UserManagement';
import LocationsMap from './components/LocationsMap';
import Invoices from './components/Invoices';

type Screen = 'dashboard' | 'security' | 'contracts' | 'users' | 'locations' | 'invoices';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'security', label: 'Security Center', icon: Shield },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'locations', label: 'Locations Map', icon: MapPin },
    { id: 'invoices', label: 'Invoices', icon: CreditCard },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'security':
        return <SecurityCenter />;
      case 'contracts':
        return <Contracts />;
      case 'users':
        return <UserManagement />;
      case 'locations':
        return <LocationsMap />;
      case 'invoices':
        return <Invoices />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="iphone-frame">
        <div className="iphone-screen">
          <div className="iphone-notch"></div>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-12">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-mahoney-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-lg font-semibold">Mahoney Control</h1>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-mahoney-card hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Hamburger Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-20 left-0 right-0 z-50 bg-mahoney-card rounded-lg mx-4 shadow-lg"
              >
                <div className="p-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentScreen(item.id as Screen);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          currentScreen === item.id
                            ? 'bg-mahoney-accent text-white'
                            : 'hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; 