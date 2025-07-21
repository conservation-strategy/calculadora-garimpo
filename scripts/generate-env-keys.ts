require('dotenv').config({ path: '.env.local' });

const crypto = require('crypto');

interface GenerateKeyOptions {
  environment: 'prod' | 'dev' | 'test';
  partner: string;
}

interface ApiKeyRecord {
  keyHash: string;
  name: string;
  environment: 'prod' | 'dev' | 'test';
  partner: string;
  isActive: boolean;
  rateLimit: number;
  allowedOrigins: string[];
}

function generateProductionApiKey({ environment, partner }: GenerateKeyOptions): string {
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

function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

function generateKeyRecord(
  partner: string, 
  environment: 'prod' | 'dev' | 'test' = 'prod',
  options?: {
    rateLimit?: number;
    allowedOrigins?: string[];
  }
): { key: string, record: ApiKeyRecord, envVarName: string } {
  const key = generateProductionApiKey({ environment, partner });
  const keyHash = hashApiKey(key);
  
  // Generate environment variable name
  const envVarName = `${environment.toUpperCase()}_${partner.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY_HASH`;
  
  const record: ApiKeyRecord = {
    keyHash,
    name: `${partner} ${environment.toUpperCase()}`,
    environment,
    partner,
    isActive: true,
    rateLimit: options?.rateLimit || (environment === 'prod' ? 1000 : environment === 'dev' ? 100 : 50),
    allowedOrigins: options?.allowedOrigins || []
  };
  
  return { key, record, envVarName };
}

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'create':
      if (args.length < 1) {
        console.error('Usage: yarn generate-env-keys create <partner-name> [environment] [rate-limit]');
        process.exit(1);
      }
      
      const partner = args[0];
      const environment = (args[1] as any) || 'prod';
      const rateLimit = args[2] ? parseInt(args[2]) : undefined;
      
      const { key, record, envVarName } = generateKeyRecord(partner, environment, {
        rateLimit
      });
      
      console.log('\n🔑 NEW API KEY GENERATED:');
      console.log('================================');
      console.log('⚠️  SAVE THIS KEY SECURELY - IT WILL NOT BE SHOWN AGAIN!');
      console.log('================================');
      console.log(`Key: ${key}`);
      console.log(`Partner: ${record.partner}`);
      console.log(`Environment: ${record.environment}`);
      console.log(`Rate Limit: ${record.rateLimit} requests/minute`);
      console.log(`Key Hash: ${record.keyHash}`);
      console.log('================================');
      console.log('\n📋 ENVIRONMENT VARIABLE SETUP:');
      console.log('================================');
      console.log('Add this to your Vercel Environment Variables:');
      console.log(`${envVarName}=${record.keyHash}`);
      console.log('================================');
      console.log('\n🔧 CODE UPDATE NEEDED:');
      console.log('================================');
      console.log('Add this to src/lib/api/auth/apiKeys.ts buildProductionKeys():');
      console.log(`
    if (process.env.${envVarName}) {
        keys[process.env.${envVarName}] = {
            keyHash: process.env.${envVarName},
            name: "${record.name}",
            environment: "${record.environment}",
            partner: "${record.partner}",
            isActive: true,
            rateLimit: ${record.rateLimit},
            allowedOrigins: []
        };
    }`);
      console.log('================================\n');
      break;

    case 'hash':
      if (args.length < 1) {
        console.error('Usage: yarn generate-env-keys hash <api-key>');
        process.exit(1);
      }
      
      const inputKey = args[0];
      const hash = hashApiKey(inputKey);
      
      console.log('\n🔒 API KEY HASH:');
      console.log('================================');
      console.log(`Input Key: ${inputKey}`);
      console.log(`Hash: ${hash}`);
      console.log('================================\n');
      break;

    case 'batch':
      console.log('\n🏭 BATCH KEY GENERATION:');
      console.log('================================');
      
      const partners = [
        { name: 'CSF Production', env: 'prod', limit: 1000 },
        { name: 'Partner Org', env: 'prod', limit: 500 },
        { name: 'Test Client', env: 'test', limit: 50 }
      ];
      
      const envVars: string[] = [];
      const codeUpdates: string[] = [];
      
      partners.forEach(({ name, env, limit }) => {
        const { key, record, envVarName } = generateKeyRecord(name, env as any, { rateLimit: limit });
        
        console.log(`\n${name} (${env}):`);
        console.log(`  Key: ${key}`);
        console.log(`  Hash: ${record.keyHash}`);
        
        envVars.push(`${envVarName}=${record.keyHash}`);
        codeUpdates.push(`
    if (process.env.${envVarName}) {
        keys[process.env.${envVarName}] = {
            keyHash: process.env.${envVarName},
            name: "${record.name}",
            environment: "${record.environment}",
            partner: "${record.partner}",
            isActive: true,
            rateLimit: ${record.rateLimit},
            allowedOrigins: []
        };
    }`);
      });
      
      console.log('\n📋 ALL ENVIRONMENT VARIABLES:');
      console.log('================================');
      envVars.forEach(envVar => console.log(envVar));
      
      console.log('\n🔧 ALL CODE UPDATES:');
      console.log('================================');
      codeUpdates.forEach(update => console.log(update));
      console.log('================================\n');
      break;

    default:
      console.log(`
📚 Environment Variable API Key Management:

  create <partner> [env] [rate-limit]  Generate new API key with env var setup
  hash <api-key>                       Get hash of existing API key
  batch                                Generate multiple keys for different partners

Examples:
  yarn generate-env-keys create "Conservation Org" prod 1000
  yarn generate-env-keys hash cg_prod_abc123...
  yarn generate-env-keys batch

Note: This generates keys for the new environment variable system.
The old file-based system won't work with serverless platforms like Vercel.
      `);
  }
}

main().catch(console.error);

export {}; 