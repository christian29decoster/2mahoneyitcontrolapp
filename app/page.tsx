import { Lightbulb } from 'lucide-react'
import { Card } from '@/components/Card'
import { Stat } from '@/components/Stat'
import { Badge } from '@/components/Badge'
import { copy } from '@/lib/copy'
import { dashboardStats } from '@/lib/data'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {copy.dashboard.hero}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Monitor your security infrastructure, track performance metrics, and stay ahead of potential threats.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <Stat
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Proactive Recommendations */}
      <Card>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">
              {copy.dashboard.proactiveRecommendations}
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="accent">Optimized</Badge>
              <p className="text-muted-foreground">
                {copy.dashboard.noRecommendations}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Unauthorized access attempt</p>
                <p className="text-sm text-muted-foreground">Back Office Access Control</p>
              </div>
              <Badge variant="destructive">High</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Low battery warning</p>
                <p className="text-sm text-muted-foreground">Lobby Motion Sensor</p>
              </div>
              <Badge variant="secondary">Low</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Cameras</span>
              <Badge variant="accent">22/25 Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Sensors</span>
              <Badge variant="accent">18/20 Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Access Control</span>
              <Badge variant="accent">8/8 Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Alarms</span>
              <Badge variant="accent">2/2 Online</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
