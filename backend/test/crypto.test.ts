import { describe, it, expect, beforeEach } from 'vitest';
import { encrypt, decrypt, isEncrypted } from '../src/crypto.js';

describe('Crypto Module - Unit Tests', () => {
  beforeEach(() => {
    // S'assurer qu'une clé de chiffrement est définie
    if (!process.env.ENCRYPTION_KEY) {
      process.env.ENCRYPTION_KEY = 'test-encryption-key-for-unit-tests';
    }
  });

  describe('encrypt', () => {
    it('should encrypt a string', async () => {
      const plaintext = 'test-password-123';
      const encrypted = await encrypt(plaintext);
      
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toContain(':');
      expect(encrypted.split(':')).toHaveLength(4);
    });

    it('should return empty string for empty input', async () => {
      const encrypted = await encrypt('');
      expect(encrypted).toBe('');
    });

    it('should produce different output for same input (due to random IV)', async () => {
      const plaintext = 'same-password';
      const encrypted1 = await encrypt(plaintext);
      const encrypted2 = await encrypt(plaintext);
      
      // Les deux doivent être différents (IV aléatoire)
      expect(encrypted1).not.toBe(encrypted2);
      
      // Mais les deux doivent pouvoir être déchiffrés
      const decrypted1 = await decrypt(encrypted1);
      const decrypted2 = await decrypt(encrypted2);
      expect(decrypted1).toBe(plaintext);
      expect(decrypted2).toBe(plaintext);
    });

    it('should handle special characters', async () => {
      const plaintext = "test'password\"with$special&chars<>";
      const encrypted = await encrypt(plaintext);
      const decrypted = await decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });

    it('should handle unicode characters', async () => {
      const plaintext = 'test-密码-пароль-🔐';
      const encrypted = await encrypt(plaintext);
      const decrypted = await decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('decrypt', () => {
    it('should decrypt an encrypted string', async () => {
      const plaintext = 'test-password-123';
      const encrypted = await encrypt(plaintext);
      const decrypted = await decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });

    it('should return empty string for empty input', async () => {
      const decrypted = await decrypt('');
      expect(decrypted).toBe('');
    });

    it('should handle invalid encrypted format gracefully', async () => {
      const invalid = 'not-encrypted-format';
      const decrypted = await decrypt(invalid);
      
      // Devrait retourner la chaîne originale si le format est invalide
      expect(decrypted).toBe(invalid);
    });

    it('should handle corrupted encrypted data', async () => {
      const corrupted = 'invalid:format:data';
      const decrypted = await decrypt(corrupted);
      
      // Devrait retourner la chaîne originale si le déchiffrement échoue
      expect(typeof decrypted).toBe('string');
    });
  });

  describe('isEncrypted', () => {
    it('should return true for encrypted string', async () => {
      const encrypted = await encrypt('test');
      expect(isEncrypted(encrypted)).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isEncrypted('')).toBe(false);
    });

    it('should return false for plain text', () => {
      expect(isEncrypted('plain-text-password')).toBe(false);
    });

    it('should return false for invalid format', () => {
      expect(isEncrypted('invalid:format')).toBe(false);
      expect(isEncrypted('too:many:parts:here:extra')).toBe(false);
    });
  });
});

