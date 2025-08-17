export type Incident = {
  id: string; vendor: 'AWS'; title: string; severity: 'high'|'critical';
  status: 'open'|'contained'|'resolved';
  startedAtISO: string;
  summary: string;
  timeline: Array<{ atISO:string; text:string }>;
  suspected: { iamUser: string; sourceASN: string; ip: string; ec2Id?: string; s3Bucket?: string };
  actions: Array<{ key:string; label:string; done:boolean }>;
};

export let awsIncident: Incident = {
  id: 'inc-aws-2025-08-16-01',
  vendor: 'AWS',
  title: 'Suspicious AWS access key usage & S3 exfil attempt',
  severity: 'critical',
  status: 'open',
  startedAtISO: '2025-08-16T11:21:00Z',
  summary: 'A leaked IAM user key was used from an unusual ASN. A t3.medium EC2 was started and S3 GET/List operations targeted finance-archive.',
  timeline: [
    { atISO:'2025-08-16T11:21:00Z', text:'GuardDuty: Unusual credential usage from ASN 209242' },
    { atISO:'2025-08-16T11:29:30Z', text:'EC2 i-0ab3 started in us-east-1' },
    { atISO:'2025-08-16T11:33:10Z', text:'S3 List/Get against arn:aws:s3:::finance-archive' },
  ],
  suspected: { iamUser:'ci-bot', sourceASN:'209242', ip:'45.133.1.22', ec2Id:'i-0ab3', s3Bucket:'finance-archive' },
  actions: [
    { key:'isolate-ec2', label:'Isolate EC2 (SG to deny all)', done:false },
    { key:'block-ip', label:'Block source IP via WAF', done:false },
    { key:'rotate-keys', label:'Rotate IAM access keys & enforce MFA', done:false },
    { key:'encrypt-bucket', label:'Enable S3 Default Encryption', done:false },
  ]
};

export function markActionDone(key:string){
  awsIncident = {
    ...awsIncident,
    actions: awsIncident.actions.map(a => a.key===key ? {...a, done:true} : a),
    status: awsIncident.actions.every(a => a.key===key || a.done) ? 'contained' : awsIncident.status
  };
  return awsIncident;
}
