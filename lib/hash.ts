export function maskIp(ip?: string|null){
  if (!ip) return 'unknown';
  // keep first part only, mask rest
  const parts = ip.split(',');
  const real = parts[0].trim();
  if (real.includes(':')) { // IPv6
    const seg = real.split(':');
    return seg.slice(0,2).join(':') + '::xxxx';
  }
  const seg = real.split('.');
  if (seg.length === 4) return `${seg[0]}.${seg[1]}.x.x`;
  return 'unknown';
}
