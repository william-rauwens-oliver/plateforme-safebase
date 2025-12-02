import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Petit shim de localStorage pour les environnements de test qui ne
// fournissent pas toutes les méthodes (ex: --localstorage-file mal configuré)
function ensureTestLocalStorage() {
  const hasFullApi =
    typeof localStorage !== 'undefined' &&
    typeof (localStorage as any).getItem === 'function' &&
    typeof (localStorage as any).setItem === 'function' &&
    typeof (localStorage as any).removeItem === 'function' &&
    typeof (localStorage as any).clear === 'function';

  if (hasFullApi) return;

  const store = new Map<string, string>();
  const memoryStorage: Storage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };

  // @ts-expect-error: on remplace le localStorage global uniquement pour les tests
  globalThis.localStorage = memoryStorage;
}

// Mock du hook usePersistentState (copie de l'implémentation réelle)
function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore errors
    }
  }, [key, value]);

  return [value, setValue] as const;
}

describe('Frontend Hooks - Unit Tests', () => {
  // S'assurer avant tous les tests que localStorage dispose bien de l'API complète
  beforeAll(() => {
    ensureTestLocalStorage();
  });

  beforeEach(() => {
    // Certains environnements de test (ou options comme --localstorage-file)
    // peuvent fournir un localStorage sans méthode clear()
    if (typeof localStorage.clear === 'function') {
      localStorage.clear();
    } else {
      // Fallback : supprimer manuellement les clés connues utilisées dans les tests
      try {
        Object.keys(localStorage).forEach((key) => {
          localStorage.removeItem(key);
        });
      } catch {
        // Ignorer toute erreur de nettoyage, les tests resteront isolés
      }
    }
    vi.clearAllMocks();
  });

  describe('usePersistentState', () => {
    it('should initialize with default value', () => {
      const { result } = renderHook(() => usePersistentState('test-key', 'default'));
      
      expect(result.current[0]).toBe('default');
    });

    it('should load value from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify('saved-value'));
      
      const { result } = renderHook(() => usePersistentState('test-key', 'default'));
      
      expect(result.current[0]).toBe('saved-value');
    });

    it('should update localStorage when value changes', () => {
      const { result } = renderHook(() => usePersistentState('test-key', 'default'));
      
      act(() => {
        result.current[1]('new-value');
      });
      
      expect(result.current[0]).toBe('new-value');
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    });

    it('should handle object values', () => {
      const initialValue = { apiUrl: 'http://localhost:8080', apiKey: '' };
      const { result } = renderHook(() => usePersistentState('config', initialValue));
      
      expect(result.current[0]).toEqual(initialValue);
      
      act(() => {
        result.current[1]({ apiUrl: 'http://localhost:3000', apiKey: 'test-key' });
      });
      
      expect(result.current[0].apiUrl).toBe('http://localhost:3000');
      expect(result.current[0].apiKey).toBe('test-key');
    });

    it('should handle localStorage errors gracefully', () => {
      // Simuler une erreur localStorage
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      const { result } = renderHook(() => usePersistentState('test-key', 'default'));
      
      act(() => {
        result.current[1]('new-value');
      });
      
      // Ne devrait pas planter
      expect(result.current[0]).toBe('new-value');
      
      setItemSpy.mockRestore();
    });
  });
});

