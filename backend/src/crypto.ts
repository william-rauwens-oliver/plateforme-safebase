import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Clé de chiffrement dérivée depuis une variable d'environnement
 * Si non définie, utilise une clé par défaut (non sécurisée pour production)
 */
const ENCRYPTION_KEY_ENV = process.env.ENCRYPTION_KEY || 'safebase-default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;

let encryptionKey: Buffer | null = null;

/**
 * Dérive la clé de chiffrement depuis la variable d'environnement
 */
async function getEncryptionKey(): Promise<Buffer> {
  if (encryptionKey) return encryptionKey;
  
  // Dériver une clé de 32 bytes depuis la clé d'environnement
  encryptionKey = (await scryptAsync(ENCRYPTION_KEY_ENV, 'safebase-salt', 32)) as Buffer;
  return encryptionKey;
}

/**
 * Chiffre un texte avec AES-256-GCM
 * @param text - Texte à chiffrer
 * @returns Texte chiffré au format base64 (IV:SALT:CIPHERTEXT:TAG)
 */
export async function encrypt(text: string): Promise<string> {
  if (!text) return '';
  
  const key = await getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const salt = randomBytes(SALT_LENGTH);
  
  // Dériver une clé depuis le salt
  const derivedKey = (await scryptAsync(key, salt, 32)) as Buffer;
  
  const cipher = createCipheriv(ALGORITHM, derivedKey, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const tag = cipher.getAuthTag();
  
  // Format: IV:SALT:CIPHERTEXT:TAG (tous en base64)
  return `${iv.toString('base64')}:${salt.toString('base64')}:${encrypted}:${tag.toString('base64')}`;
}

/**
 * Déchiffre un texte chiffré avec AES-256-GCM
 * @param encryptedText - Texte chiffré au format base64
 * @returns Texte déchiffré
 */
export async function decrypt(encryptedText: string): Promise<string> {
  if (!encryptedText) return '';
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 4) {
      // Ancien format non chiffré ou format invalide
      return encryptedText;
    }
    
    const [ivBase64, saltBase64, ciphertext, tagBase64] = parts;
    const iv = Buffer.from(ivBase64, 'base64');
    const salt = Buffer.from(saltBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    
    const key = await getEncryptionKey();
    const derivedKey = (await scryptAsync(key, salt, 32)) as Buffer;
    
    const decipher = createDecipheriv(ALGORITHM, derivedKey, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    // Si le déchiffrement échoue, retourner le texte tel quel (rétrocompatibilité)
    return encryptedText;
  }
}

/**
 * Vérifie si un texte est chiffré
 * @param text - Texte à vérifier
 * @returns true si le texte est chiffré
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false;
  const parts = text.split(':');
  return parts.length === 4;
}

