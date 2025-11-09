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
  createdAt: string
}

export function App() {
  const [dbs, setDbs] = useState<Db[]>([])
  const apiUrl = 'http://localhost:8080'

  useEffect(() => {
    fetch(`${apiUrl}/databases`)
      .then(r => r.json())
      .then(setDbs)
      .catch(() => setDbs([]))
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>SafeBase - Liste des Bases de Données</h1>
      
      <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px' }}>
        <h2>Bases de données enregistrées ({dbs.length})</h2>
        {dbs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '3rem', margin: 0 }}>📭</p>
            <p>Aucune base de données configurée pour le moment.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {dbs.map(db => (
              <div key={db.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#667eea' }}>{db.name}</h3>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', background: '#667eea', color: 'white' }}>
                    {db.engine === 'mysql' ? '🐬 MySQL' : '🐘 Postgres'}
                  </span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                  🔗 {db.username}@{db.host}:{db.port}/{db.database}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  Créé le {new Date(db.createdAt).toLocaleDateString()}
                </div>
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
