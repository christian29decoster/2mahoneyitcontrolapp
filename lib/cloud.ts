export type CloudVendor = 'AWS' | 'Azure';
export type Severity = 'low'|'medium'|'high'|'critical';

export type CloudFinding = {
  id: string;
  vendor: CloudVendor;
  category: 'IAM'|'Storage'|'Network'|'Logging'|'KMS'|'Compute'|'Other';
  title: string;
  description: string;
  severity: Severity;
  resource: string;       // e.g., arn:aws:s3:::finance-archive
  region?: string;
  detectedAtISO: string;
  status: 'open'|'in_progress'|'resolved';
  recommendation?: string;
};

export type CloudPosture = {
  vendor: CloudVendor;
  score: number;          // 0..100
  openFindings: number;
  critical: number;
  high: number;
  lastScanISO: string;
  trending: string;       // e.g., '+2%', '-1%', '+5%'
};

export const demoCloudPosture: CloudPosture[] = [
  { vendor: 'AWS',   score: 78, openFindings: 14, critical: 1, high: 4, lastScanISO: '2025-08-16T14:00:00Z', trending: '+2%' },
  { vendor: 'Azure', score: 83, openFindings: 9,  critical: 0, high: 2, lastScanISO: '2025-08-16T14:00:00Z', trending: '+1%' },
];

export const demoFindings: CloudFinding[] = [
  // AWS – critical
  {
    id: 'f-aws-001', vendor: 'AWS', category: 'IAM',
    title: 'Access key used from unusual ASN',
    description: 'An IAM user access key was used from an ISP not seen before (ASN 209242). Possible credential leak.',
    severity: 'critical', resource: 'arn:aws:iam::123456789012:user/ci-bot',
    region: 'us-east-1', detectedAtISO: '2025-08-16T11:21:00Z', status: 'open',
    recommendation: 'Rotate access keys, enable MFA, scope permissions to least privilege.'
  },
  {
    id: 'f-aws-002', vendor: 'AWS', category: 'Storage',
    title: 'S3 bucket without default encryption',
    description: 'Bucket finance-archive has no default SSE enabled.',
    severity: 'high', resource: 'arn:aws:s3:::finance-archive',
    region: 'us-east-1', detectedAtISO: '2025-08-15T08:10:00Z', status: 'open',
    recommendation: 'Enable SSE-S3 or SSE-KMS and enforce bucket policy.'
  },
  {
    id: 'f-aws-003', vendor: 'AWS', category: 'Network',
    title: 'Security Group allows 0.0.0.0/0 on SSH',
    description: 'SG sg-07ab… allows inbound port 22 from anywhere.',
    severity: 'high', resource: 'sg-07ab91e4', region: 'us-east-1',
    detectedAtISO: '2025-08-14T17:45:00Z', status: 'open',
    recommendation: 'Restrict to corporate IPs or use SSM Session Manager.'
  },
  // Azure
  {
    id: 'f-az-101', vendor: 'Azure', category: 'Logging',
    title: 'Diagnostic logs disabled on Storage Account',
    description: 'Activity logs not exported to Log Analytics workspace.',
    severity: 'medium', resource: '/subs/xxx/resourceGroups/rg-app/providers/Microsoft.Storage/storageAccounts/acctlogs',
    region: 'eastus', detectedAtISO: '2025-08-15T10:00:00Z', status: 'open',
    recommendation: 'Enable diagnostics and retention on critical resources.'
  },
  {
    id: 'f-az-102', vendor: 'Azure', category: 'KMS',
    title: 'Key vault soft-delete not enabled',
    description: 'Key recovery protection missing.',
    severity: 'high', resource: '/subs/xxx/resourceGroups/rg-core/providers/Microsoft.KeyVault/vaults/prod-kv',
    region: 'eastus2', detectedAtISO: '2025-08-13T13:30:00Z', status: 'open',
    recommendation: 'Enable soft-delete and purge protection on Key Vault.'
  },
];

export function postureDot(score:number){
  if (score >= 85) return 'good';
  if (score >= 70) return 'warn';
  return 'risk';
}
