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

type Version = {
  id: string
  databaseId: string
  createdAt: string
  sizeBytes?: number
  pinned?: boolean
}

export function App() {
  const [dbs, setDbs] = useState<Db[]>([])
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedDb, setSelectedDb] = useState<Db | null>(null)
  const [loading, setLoading] = useState(false)
  const apiUrl = 'http://localhost:8080'

  useEffect(() => {
    fetch(`${apiUrl}/databases`)
      .then(r => r.json())
      .then(setDbs)
      .catch(() => setDbs([]))
  }, [])

  async function loadVersions(db: Db) {
    setSelectedDb(db)
    const res = await fetch(`${apiUrl}/backups/${db.id}`)
    if (!res.ok) return
    const items = await res.json()
    setVersions(items)
  }

  async function restore(versionId: string) {
    if (!confirm('Restaurer cette version? Cela écrasera les données actuelles!')) return
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/restore/${versionId}`, { method: 'POST' })
      if (!res.ok) throw new Error('restore failed')
      alert('Restauration réussie!')
    } catch (err) {
      alert('Erreur lors de la restauration')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>SafeBase - Restauration</h1>
      
      <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h2>Bases de données ({dbs.length})</h2>
        {dbs.length === 0 ? (
          <p>Aucune base de données enregistrée.</p>
        ) : (
          dbs.map(db => (
            <div key={db.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>{db.name}</h3>
              <p>{db.engine} - {db.username}@{db.host}:{db.port}/{db.database}</p>
              <button 
                onClick={() => loadVersions(db)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white', cursor: 'pointer' }}
              >
                📦 Voir les versions
              </button>
            </div>
          ))
        )}
      </div>

      {selectedDb && (
        <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px' }}>
          <h2>Versions de {selectedDb.name}</h2>
          {versions.length === 0 ? (
            <p>Aucune version sauvegardée.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {versions.map(v => (
                <li key={v.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{new Date(v.createdAt).toLocaleString()}</strong>
                    {v.pinned && <span style={{ marginLeft: '0.5rem', color: '#f59e0b' }}>📌 Épinglée</span>}
                    {v.sizeBytes && <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{(v.sizeBytes / 1024).toFixed(2)} KB</div>}
                  </div>
                  <button 
                    onClick={() => restore(v.id)}
                    disabled={loading}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer' }}
                  >
                    {loading ? 'Restauration...' : '🔄 Restaurer'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
