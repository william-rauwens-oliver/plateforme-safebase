import { createHash } from 'crypto';

/**
 * Hash un mot de passe pour le stockage sécurisé
 * @param password - Mot de passe en clair
 * @returns Hash SHA-256 du mot de passe
 */
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

/**
 * Vérifie si un mot de passe correspond à un hash
 * @param password - Mot de passe en clair
 * @param hash - Hash stocké
 * @returns true si le mot de passe correspond
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

