// src/lib/api/auth/keyManager.ts
import fs from 'fs';
import path from 'path';
import { generateProductionApiKey, validateKeyFormat, hashApiKey } from './keyGenerator';

export interface ApiKeyRecord {
  keyHash: string;
  keyId: string;           // Unique identifier for the key
  name: string;
  environment: 'prod' | 'dev' | 'test';
  partner: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
  rateLimit: number;
  allowedOrigins: string[];
}

export interface KeyStore {
  version: string;
  lastUpdated: string;
  keys: ApiKeyRecord[];
}

export class ProductionKeyManager {
  private readonly keyStorePath: string;

    
  constructor() {
    const configDir = process.env.NODE_ENV === 'production' 
      ? '/etc/calculadora-garimpo' 
      : path.join(process.cwd(), 'src/config');
    
    this.keyStorePath = path.join(configDir, 'apiKeys.all.json'); // Store all keys together but clearly named
    this.ensureKeyStoreExists();
  }

  private ensureKeyStoreExists(): void {
    if (!fs.existsSync(this.keyStorePath)) {
      const initialStore: KeyStore = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        keys: []
      };
      
      // Ensure directory exists
      const dir = path.dirname(this.keyStorePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.keyStorePath, JSON.stringify(initialStore, null, 2));
    }
  }

  private loadKeyStore(): KeyStore {
    try {
      const data = fs.readFileSync(this.keyStorePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading key store:', error);
      throw new Error('Failed to load API key store');
    }
  }

  private saveKeyStore(store: KeyStore): void {
    try {
      store.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.keyStorePath, JSON.stringify(store, null, 2));
    } catch (error) {
      console.error('Error saving key store:', error);
      throw new Error('Failed to save API key store');
    }
  }

  // Generate new key for partner
  async createPartnerKey(
    partner: string, 
    environment: 'prod' | 'dev' | 'test' = 'prod',
    options?: {
      rateLimit?: number;
      allowedOrigins?: string[];
    }
  ): Promise<{key: string, record: ApiKeyRecord}> {
    const key = generateProductionApiKey({ environment, partner });
    const keyHash = hashApiKey(key);
    const keyId = crypto.randomUUID();
    
    const record: ApiKeyRecord = {
      keyHash,
      keyId,
      name: `${partner} ${environment.toUpperCase()}`,
      environment,
      partner,
      createdAt: new Date().toISOString(),
      isActive: true,
      rateLimit: options?.rateLimit || (environment === 'prod' ? 1000 : 100),
      allowedOrigins: options?.allowedOrigins || []
    };
    
    // Load, add, save
    const store = this.loadKeyStore();
    store.keys.push(record);
    this.saveKeyStore(store);
    
    console.log(`✅ Created new ${environment} API key for ${partner}`);
    return { key, record };
  }

  // Validate incoming key
  async validateKey(incomingKey: string): Promise<ApiKeyRecord | null> {
    if (!validateKeyFormat(incomingKey)) {
      return null;
    }
    
    const keyHash = hashApiKey(incomingKey);
    const store = this.loadKeyStore();
    
    const record = store.keys.find(k => k.keyHash === keyHash && k.isActive);
    
    if (record) {
      // Update last used timestamp
      record.lastUsed = new Date().toISOString();
      this.saveKeyStore(store);
    }
    
    return record || null;
  }

  // List all keys (without exposing actual keys)
  async listKeys(): Promise<Omit<ApiKeyRecord, 'keyHash'>[]> {
    const store = this.loadKeyStore();
    return store.keys.map(({ keyHash, ...record }) => record);
  }

  // Deactivate key
  async deactivateKey(keyId: string): Promise<boolean> {
    const store = this.loadKeyStore();
    const keyIndex = store.keys.findIndex(k => k.keyId === keyId);
    
    if (keyIndex === -1) return false;
    
    store.keys[keyIndex].isActive = false;
    this.saveKeyStore(store);
    
    console.log(`🔒 Deactivated API key: ${store.keys[keyIndex].name}`);
    return true;
  }

  // Rotate key (generate new key for existing partner)
  async rotateKey(keyId: string): Promise<{newKey: string, record: ApiKeyRecord} | null> {
    const store = this.loadKeyStore();
    const existingRecord = store.keys.find(k => k.keyId === keyId);
    
    if (!existingRecord) return null;
    
    // Deactivate old key
    existingRecord.isActive = false;
    
    // Create new key
    const newKey = generateProductionApiKey({ 
      environment: existingRecord.environment, 
      partner: existingRecord.partner 
    });
    
    const newRecord: ApiKeyRecord = {
      ...existingRecord,
      keyHash: hashApiKey(newKey),
      keyId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastUsed: undefined,
      isActive: true
    };
    
    store.keys.push(newRecord);
    this.saveKeyStore(store);
    
    console.log(`🔄 Rotated API key for ${existingRecord.partner}`);
    return { newKey, record: newRecord };
  }

  // Update key settings
  async updateKeySettings(
    keyId: string, 
    updates: Partial<Pick<ApiKeyRecord, 'rateLimit' | 'allowedOrigins' | 'name'>>
  ): Promise<boolean> {
    const store = this.loadKeyStore();
    const keyIndex = store.keys.findIndex(k => k.keyId === keyId);
    
    if (keyIndex === -1) return false;
    
    Object.assign(store.keys[keyIndex], updates);
    this.saveKeyStore(store);
    
    console.log(`⚙️ Updated settings for: ${store.keys[keyIndex].name}`);
    return true;
  }
}