export interface Device {
  id: string
  name: string
  type: 'camera' | 'sensor' | 'access_control' | 'alarm'
  status: 'online' | 'offline' | 'warning'
  location: string
  lastSeen: string
  battery?: number
}

export interface Staff {
  id: string
  name: string
  role: string
  department: string
  status: 'active' | 'inactive'
  lastLogin: string
  avatar?: string
}

export interface Alert {
  id: string
  type: 'security' | 'maintenance' | 'system'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  deviceId?: string
  resolved: boolean
}

export interface Stat {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

// Mock devices data (~25 devices for web preview)
export const devices: Device[] = [
  { id: '1', name: 'Front Door Camera', type: 'camera', status: 'online', location: 'Main Entrance', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Back Office Sensor', type: 'sensor', status: 'online', location: 'Back Office', lastSeen: '2024-01-15T10:29:00Z' },
  { id: '3', name: 'Parking Lot Camera', type: 'camera', status: 'offline', location: 'Parking Lot', lastSeen: '2024-01-15T08:15:00Z' },
  { id: '4', name: 'Server Room Access', type: 'access_control', status: 'online', location: 'Server Room', lastSeen: '2024-01-15T10:28:00Z' },
  { id: '5', name: 'Lobby Motion Sensor', type: 'sensor', status: 'warning', location: 'Lobby', lastSeen: '2024-01-15T10:25:00Z', battery: 15 },
  { id: '6', name: 'Warehouse Camera 1', type: 'camera', status: 'online', location: 'Warehouse A', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '7', name: 'Warehouse Camera 2', type: 'camera', status: 'online', location: 'Warehouse B', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '8', name: 'Fire Alarm Panel', type: 'alarm', status: 'online', location: 'Main Building', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '9', name: 'Side Entrance Sensor', type: 'sensor', status: 'online', location: 'Side Entrance', lastSeen: '2024-01-15T10:29:00Z' },
  { id: '10', name: 'Loading Dock Camera', type: 'camera', status: 'offline', location: 'Loading Dock', lastSeen: '2024-01-15T07:45:00Z' },
  { id: '11', name: 'Office Access Control', type: 'access_control', status: 'online', location: 'Office Area', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '12', name: 'Perimeter Sensor 1', type: 'sensor', status: 'online', location: 'North Perimeter', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '13', name: 'Perimeter Sensor 2', type: 'sensor', status: 'online', location: 'South Perimeter', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '14', name: 'Security Office Camera', type: 'camera', status: 'online', location: 'Security Office', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '15', name: 'Break Room Sensor', type: 'sensor', status: 'warning', location: 'Break Room', lastSeen: '2024-01-15T10:20:00Z', battery: 25 },
  { id: '16', name: 'Maintenance Access', type: 'access_control', status: 'online', location: 'Maintenance Area', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '17', name: 'Storage Camera', type: 'camera', status: 'online', location: 'Storage Room', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '18', name: 'Emergency Exit Sensor', type: 'sensor', status: 'online', location: 'Emergency Exit', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '19', name: 'Conference Room Camera', type: 'camera', status: 'offline', location: 'Conference Room', lastSeen: '2024-01-15T09:30:00Z' },
  { id: '20', name: 'IT Room Access', type: 'access_control', status: 'online', location: 'IT Room', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '21', name: 'Kitchen Motion Sensor', type: 'sensor', status: 'online', location: 'Kitchen', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '22', name: 'Reception Camera', type: 'camera', status: 'online', location: 'Reception', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '23', name: 'Burglar Alarm', type: 'alarm', status: 'online', location: 'Main Building', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '24', name: 'Employee Entrance', type: 'access_control', status: 'online', location: 'Employee Entrance', lastSeen: '2024-01-15T10:30:00Z' },
  { id: '25', name: 'Outdoor Lighting Sensor', type: 'sensor', status: 'warning', location: 'Outdoor Area', lastSeen: '2024-01-15T10:15:00Z', battery: 10 },
]

// Mock staff data
export const staff: Staff[] = [
  { id: '1', name: 'John Smith', role: 'Security Manager', department: 'Security', status: 'active', lastLogin: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Sarah Johnson', role: 'IT Administrator', department: 'IT', status: 'active', lastLogin: '2024-01-15T10:25:00Z' },
  { id: '3', name: 'Mike Davis', role: 'Facility Manager', department: 'Facilities', status: 'active', lastLogin: '2024-01-15T09:45:00Z' },
  { id: '4', name: 'Lisa Wilson', role: 'Security Officer', department: 'Security', status: 'active', lastLogin: '2024-01-15T10:20:00Z' },
  { id: '5', name: 'David Brown', role: 'System Administrator', department: 'IT', status: 'inactive', lastLogin: '2024-01-14T16:30:00Z' },
]

// Mock alerts data
export const alerts: Alert[] = [
  { id: '1', type: 'security', severity: 'medium', title: 'Unauthorized access attempt', description: 'Multiple failed attempts detected at Back Office Access Control', timestamp: '2024-01-15T10:15:00Z', deviceId: '2', resolved: false },
  { id: '2', type: 'maintenance', severity: 'low', title: 'Low battery warning', description: 'Lobby Motion Sensor battery level below 20%', timestamp: '2024-01-15T10:10:00Z', deviceId: '5', resolved: false },
  { id: '3', type: 'system', severity: 'high', title: 'Device offline', description: 'Parking Lot Camera has been offline for more than 2 hours', timestamp: '2024-01-15T08:30:00Z', deviceId: '3', resolved: false },
]

// Dashboard stats
export const dashboardStats: Stat[] = [
  { label: 'Active Alerts', value: 3, change: '+1', trend: 'up' },
  { label: 'Offline Devices', value: 3, change: '-1', trend: 'down' },
  { label: 'MTTR', value: '2.3h', change: '-0.5h', trend: 'down' },
  { label: 'Coverage', value: '92%', change: '+2%', trend: 'up' },
]

// Company data
export const companyData = {
  name: 'Mahoney Security Solutions',
  industry: 'Security Services',
  size: '250-500 employees',
  location: 'San Francisco, CA',
  securityLevel: 'Enterprise',
}

// Profile data
export const profileData = {
  name: 'John Smith',
  email: 'john.smith@mahoney.com',
  role: 'Security Manager',
  department: 'Security',
  lastLogin: '2024-01-15T10:30:00Z',
}
