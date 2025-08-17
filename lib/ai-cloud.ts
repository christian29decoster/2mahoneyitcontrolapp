import { awsIncident } from './incident';

export function aiExplainAwsIncidentShort(){
  return `Summary: Leaked IAM key used from unusual ASN; EC2 i-0ab3 started; S3 access to finance-archive detected. Next: isolate EC2, block IP, rotate keys, enable bucket encryption.`;
}

export function aiCloudPostureSummary(){
  return `AWS: 78/100 score, 14 findings (1 critical, 4 high). Azure: 83/100 score, 9 findings (0 critical, 2 high). Focus on AWS IAM credential leak and S3 encryption.`;
}

export function aiCloudRecommendation(category: string, severity: string){
  const recommendations = {
    'IAM': 'Implement least-privilege access, enable MFA, rotate keys regularly, monitor unusual access patterns.',
    'Storage': 'Enable default encryption (SSE-S3/KMS), block public access, enforce bucket policies, enable versioning.',
    'Network': 'Restrict security groups to corporate IPs, use SSM Session Manager instead of SSH, enable VPC Flow Logs.',
    'Logging': 'Enable CloudTrail/Activity Logs, export to SIEM, set retention policies, monitor GuardDuty/Defender signals.',
    'KMS': 'Enable key rotation, soft-delete protection, audit key usage, implement least-privilege key policies.',
    'Compute': 'Install EDR/XDR agents, enforce IMDSv2, use hardened AMIs, enable CloudWatch monitoring.'
  };
  
  return recommendations[category as keyof typeof recommendations] || 'Review security configuration and follow cloud security best practices.';
}
