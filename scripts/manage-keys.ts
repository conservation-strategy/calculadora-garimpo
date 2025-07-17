const { ProductionKeyManager } = require('../src/lib/api/auth/keyManager');

interface ApiKeyRecord {
    keyId: string;
    name: string;
    environment: string;
    partner: string;
    createdAt: string;
    lastUsed?: string;
    isActive: boolean;
    rateLimit: number;
    allowedOrigins: string[];
}

const keyManager = new ProductionKeyManager();

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'create':
      if (args.length < 1) {
        console.error('Usage: yarn manage-keys create <partner-name> [environment] [rate-limit]');
        process.exit(1);
      }
      
      const partner = args[0];
      const environment = (args[1] as any) || 'prod';
      const rateLimit = args[2] ? parseInt(args[2]) : undefined;
      
      const { key, record } = await keyManager.createPartnerKey(partner, environment, {
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
      console.log(`Key ID: ${record.keyId}`);
      console.log('================================\n');
      break;

    case 'list':
      const keys = await keyManager.listKeys();
      console.log('\n📋 API KEYS:');
      console.log('================================');
      keys.forEach((key: ApiKeyRecord) => {
        const status = key.isActive ? '✅ Active' : '❌ Inactive';
        console.log(`${status} | ${key.name} | ${key.environment} | ${key.rateLimit}/min | ID: ${key.keyId}`);
      });
      console.log('================================\n');
      break;

    case 'deactivate':
      if (args.length < 1) {
        console.error('Usage: yarn manage-keys deactivate <key-id>');
        process.exit(1);
      }
      
      const success = await keyManager.deactivateKey(args[0]);
      if (success) {
        console.log('✅ Key deactivated successfully');
      } else {
        console.log('❌ Key not found');
      }
      break;

    case 'rotate':
      if (args.length < 1) {
        console.error('Usage: yarn manage-keys rotate <key-id>');
        process.exit(1);
      }
      
      const rotated = await keyManager.rotateKey(args[0]);
      if (rotated) {
        console.log('\n🔄 KEY ROTATED SUCCESSFULLY:');
        console.log('================================');
        console.log('⚠️  SAVE THIS NEW KEY SECURELY!');
        console.log('================================');
        console.log(`New Key: ${rotated.newKey}`);
        console.log(`Partner: ${rotated.record.partner}`);
        console.log(`Key ID: ${rotated.record.keyId}`);
        console.log('================================\n');
      } else {
        console.log('❌ Key not found');
      }
      break;

    default:
      console.log(`
📚 API Key Management Commands:

  create <partner> [env] [rate-limit]  Create new API key
  list                                 List all keys
  deactivate <key-id>                 Deactivate a key
  rotate <key-id>                     Rotate (replace) a key

Examples:
  yarn manage-keys create "Conservation Org" prod 1000
  yarn manage-keys list
  yarn manage-keys deactivate abc-123-def
  yarn manage-keys rotate abc-123-def
      `);
  }
}

main().catch(console.error);

// export {};