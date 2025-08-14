import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { copy } from '@/lib/copy'
import { profileData } from '@/lib/data'

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{copy.profile.title}</h1>
        <p className="text-muted-foreground mt-2">{copy.profile.subtitle}</p>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-primary mx-auto flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-muted-foreground">{profileData.role}</p>
            </div>
            <div className="flex justify-center">
              <Badge variant="accent">{profileData.department}</Badge>
            </div>
          </div>
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{copy.profile.name}</label>
                <p className="text-lg font-medium">{profileData.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{copy.profile.email}</label>
                <p className="text-lg font-medium">{profileData.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{copy.profile.role}</label>
                <p className="text-lg font-medium">{profileData.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{copy.profile.department}</label>
                <p className="text-lg font-medium">{profileData.department}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity and Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Logged in</p>
                <p className="text-sm text-muted-foreground">Dashboard accessed</p>
              </div>
              <span className="text-sm text-muted-foreground">Just now</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Device status checked</p>
                <p className="text-sm text-muted-foreground">Reviewed offline devices</p>
              </div>
              <span className="text-sm text-muted-foreground">30 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Alert acknowledged</p>
                <p className="text-sm text-muted-foreground">Unauthorized access attempt</p>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Enhanced security for your account</p>
              </div>
              <Badge variant="accent">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Badge variant="accent">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <span className="text-sm font-medium">30 minutes</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Status */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Security Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-accent">98%</p>
            <p className="text-sm text-muted-foreground">Security Score</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-primary">256-bit</p>
            <p className="text-sm text-muted-foreground">Encryption</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-accent">Active</p>
            <p className="text-sm text-muted-foreground">Account Status</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
