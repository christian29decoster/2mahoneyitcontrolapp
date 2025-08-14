import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { copy } from '@/lib/copy'
import { devices, staff } from '@/lib/data'

export default function DevicesPage() {
  const onlineDevices = devices.filter(d => d.status === 'online').length
  const offlineDevices = devices.filter(d => d.status === 'offline').length
  const warningDevices = devices.filter(d => d.status === 'warning').length
  const activeStaff = staff.filter(s => s.status === 'active').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{copy.devices.title}</h1>
        <p className="text-muted-foreground mt-2">{copy.devices.subtitle}</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold">{devices.length}</p>
            <p className="text-sm text-muted-foreground">{copy.devices.totalDevices}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{onlineDevices}</p>
            <p className="text-sm text-muted-foreground">{copy.devices.onlineDevices}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-destructive">{offlineDevices}</p>
            <p className="text-sm text-muted-foreground">{copy.devices.offlineDevices}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{activeStaff}</p>
            <p className="text-sm text-muted-foreground">{copy.devices.activeStaff}</p>
          </div>
        </Card>
      </div>

      {/* Devices List */}
      <Card>
        <h2 className="text-xl font-semibold mb-6">Devices</h2>
        <div className="space-y-4">
          {devices.slice(0, 10).map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium">{device.name}</h3>
                  <Badge 
                    variant={
                      device.status === 'online' ? 'accent' : 
                      device.status === 'warning' ? 'secondary' : 'destructive'
                    }
                  >
                    {device.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {device.location} • {device.type.replace('_', ' ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
                </p>
                {device.battery && (
                  <p className="text-sm text-muted-foreground">
                    Battery: {device.battery}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Staff List */}
      <Card>
        <h2 className="text-xl font-semibold mb-6">Staff</h2>
        <div className="space-y-4">
          {staff.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {member.role} • {member.department}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={member.status === 'active' ? 'accent' : 'secondary'}>
                  {member.status}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Last login: {new Date(member.lastLogin).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
