import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

type Db = {
  id: string
  name: string
  engine: 'mysql' | 'postgres'
  host: string
  port: number
  username: string
  password: string
  database: string
}

function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { 
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore localStorage errors
    }
  }, [key, value])
  return [value, setValue] as const
}

export function App() {
  const [dbs, setDbs] = useState<Db[]>([])
  const [theme, setTheme] = usePersistentState<'dark'|'light'>('safebase-theme', 'dark')
  const apiUrl = 'http://localhost:8080'

  useEffect(() => {
    fetch(`${apiUrl}/databases`)
      .then(r => r.json())
      .then(setDbs)
      .catch(() => setDbs([]))
  }, [])

  const isDark = theme === 'dark'
  const bgColor = isDark ? '#1f2937' : '#ffffff'
  const textColor = isDark ? '#f9fafb' : '#111827'
  const cardBg = isDark ? '#374151' : '#f9fafb'
  const borderColor = isDark ? '#4b5563' : '#e5e7eb'

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: '100vh',
      background: bgColor,
      color: textColor
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>SafeBase - Thème Clair/Sombre</h1>
        <button 
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            border: 'none', 
            background: isDark ? '#fbbf24' : '#1f2937', 
            color: isDark ? '#1f2937' : '#f9fafb',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {isDark ? '☀️ Mode clair' : '🌙 Mode sombre'}
        </button>
      </div>
      
      <div style={{ 
        background: cardBg, 
        padding: '2rem', 
        borderRadius: '12px',
        border: `1px solid ${borderColor}`
      }}>
        <h2>Bases de données ({dbs.length})</h2>
        {dbs.length === 0 ? (
          <p>Aucune base de données enregistrée.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {dbs.map(db => (
              <div 
                key={db.id} 
                style={{ 
                  background: isDark ? '#4b5563' : 'white', 
                  padding: '1.5rem', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: `1px solid ${borderColor}`
                }}
              >
                <h3 style={{ margin: 0, color: isDark ? '#60a5fa' : '#667eea' }}>{db.name}</h3>
                <p style={{ color: isDark ? '#d1d5db' : '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {db.engine} - {db.username}@{db.host}:{db.port}/{db.database}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
