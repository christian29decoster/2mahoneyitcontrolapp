import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { copy } from '@/lib/copy'

const featuredSolutions = [
  {
    id: '1',
    name: 'Advanced Threat Detection',
    description: 'AI-powered threat detection with real-time alerts and automated response',
    category: 'Security',
    rating: 4.8,
    price: 'From $299/month',
    featured: true,
  },
  {
    id: '2',
    name: 'Cloud Backup & Recovery',
    description: 'Secure cloud backup with instant recovery and disaster protection',
    category: 'Backup',
    rating: 4.9,
    price: 'From $199/month',
    featured: true,
  },
  {
    id: '3',
    name: 'Network Monitoring Pro',
    description: 'Comprehensive network monitoring with performance analytics',
    category: 'Monitoring',
    rating: 4.7,
    price: 'From $399/month',
    featured: true,
  },
]

const categories = [
  { name: 'Security', count: 24 },
  { name: 'Monitoring', count: 18 },
  { name: 'Backup', count: 12 },
  { name: 'Analytics', count: 15 },
  { name: 'Integration', count: 31 },
  { name: 'Compliance', count: 8 },
]

const integrations = [
  { name: 'Slack', status: 'Available', type: 'Communication' },
  { name: 'Microsoft Teams', status: 'Available', type: 'Communication' },
  { name: 'Jira', status: 'Available', type: 'Project Management' },
  { name: 'ServiceNow', status: 'Coming Soon', type: 'ITSM' },
  { name: 'PagerDuty', status: 'Available', type: 'Incident Management' },
  { name: 'Zapier', status: 'Available', type: 'Automation' },
]

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{copy.marketplace.title}</h1>
        <p className="text-muted-foreground mt-2">{copy.marketplace.subtitle}</p>
      </div>

      {/* Featured Solutions */}
      <Card>
        <h2 className="text-xl font-semibold mb-6">{copy.marketplace.featured}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSolutions.map((solution) => (
            <div key={solution.id} className="p-6 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="accent">{solution.category}</Badge>
                {solution.featured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{solution.name}</h3>
              <p className="text-muted-foreground mb-4">{solution.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium">{solution.rating}</span>
                </div>
                <span className="text-sm font-medium text-primary">{solution.price}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories and Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">{copy.marketplace.categories}</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary">{category.count} solutions</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">{copy.marketplace.integrations}</h3>
          <div className="space-y-3">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{integration.name}</p>
                  <p className="text-sm text-muted-foreground">{integration.type}</p>
                </div>
                <Badge 
                  variant={integration.status === 'Available' ? 'accent' : 'secondary'}
                >
                  {integration.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Personalized Recommendations */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">{copy.marketplace.recommendations}</h3>
        <div className="space-y-4">
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-accent">Based on your security profile</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  We recommend Advanced Threat Detection to enhance your current security posture and provide better protection against emerging threats.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium text-primary">Performance optimization</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Network Monitoring Pro can help you identify and resolve performance bottlenecks in your security infrastructure.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-medium">Compliance enhancement</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Consider our compliance solutions to ensure your security measures meet industry standards and regulatory requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-left hover:bg-primary/20 transition-colors">
            <h4 className="font-medium text-primary">Request Demo</h4>
            <p className="text-sm text-muted-foreground mt-1">Schedule a personalized demo of any solution</p>
          </button>
          <button className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-left hover:bg-accent/20 transition-colors">
            <h4 className="font-medium text-accent">Contact Sales</h4>
            <p className="text-sm text-muted-foreground mt-1">Get in touch with our sales team</p>
          </button>
          <button className="p-4 bg-muted/30 border border-border rounded-lg text-left hover:bg-muted/50 transition-colors">
            <h4 className="font-medium">View Documentation</h4>
            <p className="text-sm text-muted-foreground mt-1">Access technical documentation and guides</p>
          </button>
        </div>
      </Card>
    </div>
  )
}
