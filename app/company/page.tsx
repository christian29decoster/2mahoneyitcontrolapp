import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { copy } from '@/lib/copy'
import { companyData } from '@/lib/data'

export default function CompanyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{copy.company.title}</h1>
        <p className="text-muted-foreground mt-2">{copy.company.subtitle}</p>
      </div>

      {/* Company Information */}
      <Card>
        <h2 className="text-xl font-semibold mb-6">Company Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{copy.company.companyName}</label>
              <p className="text-lg font-medium">{companyData.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{copy.company.industry}</label>
              <p className="text-lg font-medium">{companyData.industry}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{copy.company.size}</label>
              <p className="text-lg font-medium">{companyData.size}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{copy.company.location}</label>
              <p className="text-lg font-medium">{companyData.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{copy.company.securityLevel}</label>
              <div className="flex items-center space-x-2">
                <Badge variant="accent">{companyData.securityLevel}</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Security Policies</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Access Control</span>
              <Badge variant="accent">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Multi-Factor Auth</span>
              <Badge variant="accent">Required</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Audit Logging</span>
              <Badge variant="accent">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Data Encryption</span>
              <Badge variant="accent">AES-256</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>ISO 27001</span>
              <Badge variant="accent">Certified</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>GDPR</span>
              <Badge variant="accent">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>HIPAA</span>
              <Badge variant="accent">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>SOX</span>
              <Badge variant="accent">Compliant</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Security Events</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Security policy updated</p>
              <p className="text-sm text-muted-foreground">Multi-factor authentication now required for all users</p>
            </div>
            <span className="text-sm text-muted-foreground">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">New device registered</p>
              <p className="text-sm text-muted-foreground">Security camera added to Warehouse B</p>
            </div>
            <span className="text-sm text-muted-foreground">1 day ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Access granted</p>
              <p className="text-sm text-muted-foreground">Sarah Johnson granted admin access to security systems</p>
            </div>
            <span className="text-sm text-muted-foreground">3 days ago</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
