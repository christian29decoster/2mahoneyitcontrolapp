import React, { useState } from 'react';
import { Users, Crown, Eye, UserPlus, ToggleLeft } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [pendingInvitations, setPendingInvitations] = useState(3);

  const admins = [
    { id: '1', name: 'John Doe', email: 'john.doe@company.com', avatar: 'JD' },
    { id: '2', name: 'Lisa Turner', email: 'lisa.turner@company.com', avatar: 'LT' },
  ];

  const viewers = [
    { id: '3', name: 'Team Account', email: 'team@company.com', avatar: 'TA' },
    { id: '4', name: 'Support Account', email: 'support@company.com', avatar: 'SA' },
  ];

  const [userRoles, setUserRoles] = useState<{ [key: string]: string }>({
    '1': 'admin',
    '2': 'admin',
    '3': 'viewer',
    '4': 'viewer',
  });

  const toggleRole = (userId: string) => {
    setUserRoles(prev => ({
      ...prev,
      [userId]: prev[userId] === 'admin' ? 'viewer' : 'admin'
    }));
  };

  const getRoleIcon = (role: string) => {
    if (role === 'admin') {
      return <Crown size={16} className="text-mahoney-accent" />;
    }
    return <Eye size={16} className="text-gray-400" />;
  };

  const getRoleColor = (role: string) => {
    if (role === 'admin') {
      return 'text-mahoney-accent';
    }
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users size={24} className="text-mahoney-accent" />
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>

      {/* Pending Invitations */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserPlus size={20} className="text-mahoney-warning" />
            <div>
              <h3 className="font-semibold">Pending Invitations</h3>
              <p className="text-sm text-gray-400">Users waiting to join</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-mahoney-warning">{pendingInvitations}</span>
            <p className="text-xs text-gray-500">invitations</p>
          </div>
        </div>
      </div>

      {/* Admins */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Crown size={20} className="text-mahoney-accent" />
          <span>Administrators</span>
        </h3>
        <div className="space-y-3">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-mahoney-accent rounded-full flex items-center justify-center text-white font-semibold">
                  {admin.avatar}
                </div>
                <div>
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-sm text-gray-400">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getRoleIcon(userRoles[admin.id])}
                <span className={`text-sm font-medium ${getRoleColor(userRoles[admin.id])}`}>
                  {userRoles[admin.id] === 'admin' ? 'Admin' : 'Viewer'}
                </span>
                <button
                  onClick={() => toggleRole(admin.id)}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                  title="Toggle role"
                >
                  <ToggleLeft size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viewers */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Eye size={20} className="text-gray-400" />
          <span>Viewers</span>
        </h3>
        <div className="space-y-3">
          {viewers.map((viewer) => (
            <div key={viewer.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {viewer.avatar}
                </div>
                <div>
                  <p className="font-medium">{viewer.name}</p>
                  <p className="text-sm text-gray-400">{viewer.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getRoleIcon(userRoles[viewer.id])}
                <span className={`text-sm font-medium ${getRoleColor(userRoles[viewer.id])}`}>
                  {userRoles[viewer.id] === 'admin' ? 'Admin' : 'Viewer'}
                </span>
                <button
                  onClick={() => toggleRole(viewer.id)}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                  title="Toggle role"
                >
                  <ToggleLeft size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Button */}
      <div className="card">
        <button className="btn-primary w-full flex items-center justify-center space-x-2">
          <UserPlus size={16} />
          <span>Invite New User</span>
        </button>
      </div>
    </div>
  );
};

export default UserManagement; 