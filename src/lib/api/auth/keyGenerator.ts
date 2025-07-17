import crypto from 'crypto';

export interface GenerateKeyOptions {
  environment: 'prod' | 'dev' | 'test';
  partner: string;
}

export function generateProductionApiKey({ environment, partner }: GenerateKeyOptions): string {
  const prefix = 'cg'; // calculadora-garimpo
  const randomData = crypto.randomBytes(32).toString('hex');
  
  // Generate checksum for validation
  const checksum = crypto
    .createHash('sha256')
    .update(`${prefix}_${environment}_${randomData}_${partner}`)
    .digest('hex')
    .substring(0, 8);
  
  return `${prefix}_${environment}_${randomData}_${checksum}`;
}

export function validateKeyFormat(key: string): boolean {
  const pattern = /^cg_(prod|dev|test)_[a-f0-9]{64}_[a-f0-9]{8}$/;
  return pattern.test(key);
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}