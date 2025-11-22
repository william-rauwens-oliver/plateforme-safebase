import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../src/utils.js';

describe('Utils Module - Unit Tests', () => {
  describe('hashPassword', () => {
    it('should hash a password', () => {
      const password = 'test-password-123';
      const hash = hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash).toHaveLength(64); // SHA-256 produces 64 hex characters
    });

    it('should produce same hash for same password', () => {
      const password = 'same-password';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);
      
      expect(hash1).toBe(hash2);
    });

    it('should produce different hash for different passwords', () => {
      const hash1 = hashPassword('password1');
      const hash2 = hashPassword('password2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', () => {
      const hash = hashPassword('');
      expect(hash).toBeDefined();
      expect(hash).toHaveLength(64);
    });

    it('should handle special characters', () => {
      const password = "test'password\"with$special&chars";
      const hash = hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).toHaveLength(64);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', () => {
      const password = 'test-password-123';
      const hash = hashPassword(password);
      
      expect(verifyPassword(password, hash)).toBe(true);
    });

    it('should reject incorrect password', () => {
      const password = 'test-password-123';
      const hash = hashPassword(password);
      
      expect(verifyPassword('wrong-password', hash)).toBe(false);
    });

    it('should handle empty password', () => {
      const hash = hashPassword('');
      expect(verifyPassword('', hash)).toBe(true);
      expect(verifyPassword('non-empty', hash)).toBe(false);
    });

    it('should handle case sensitivity', () => {
      const password = 'Test-Password';
      const hash = hashPassword(password);
      
      expect(verifyPassword('test-password', hash)).toBe(false);
      expect(verifyPassword('Test-Password', hash)).toBe(true);
    });
  });
});

