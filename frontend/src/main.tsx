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
  const [versionsModal, setVersionsModal] = useState<{ open: boolean, db?: Db, items: Version[] }>({ open: false, items: [] })
  const apiUrl = 'http://localhost:8080'

  useEffect(() => {
    fetch(`${apiUrl}/databases`)
      .then(r => r.json())
      .then(setDbs)
      .catch(() => setDbs([]))
  }, [])

  async function openVersions(db: Db) {
    const res = await fetch(`${apiUrl}/backups/${db.id}`)
    if (!res.ok) return
    const items = await res.json()
    setVersionsModal({ open: true, db, items })
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>SafeBase - Modal de Gestion des Versions</h1>
      
      <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px' }}>
        <h2>Bases de données ({dbs.length})</h2>
        {dbs.length === 0 ? (
          <p>Aucune base de données enregistrée.</p>
        ) : (
          dbs.map(db => (
            <div key={db.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>{db.name}</h3>
              <p>{db.engine} - {db.username}@{db.host}:{db.port}/{db.database}</p>
              <button 
                onClick={() => openVersions(db)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white', cursor: 'pointer' }}
              >
                📦 Voir les versions
              </button>
            </div>
          ))
        )}
      </div>

      {versionsModal.open && versionsModal.db && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Versions de {versionsModal.db.name}</h2>
              <button 
                onClick={() => setVersionsModal({ open: false, items: [] })} 
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
              >
                ✕
              </button>
            </div>
            {versionsModal.items.length === 0 ? (
              <p>Aucune version sauvegardée.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {versionsModal.items.map(v => (
                  <li key={v.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{new Date(v.createdAt).toLocaleString()}</strong>
                        {v.pinned && <span style={{ marginLeft: '0.5rem', color: '#f59e0b' }}>📌 Épinglée</span>}
                        {v.sizeBytes && <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>{(v.sizeBytes / 1024).toFixed(2)} KB</div>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
