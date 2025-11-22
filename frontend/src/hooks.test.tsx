import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

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
  beforeEach(() => {
    localStorage.clear();
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

