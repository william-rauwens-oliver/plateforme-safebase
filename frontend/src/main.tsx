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

  useEffect(() => {
    fetch('http://localhost:8080/databases')
      .then(r => r.json())
      .then(setDbs)
      .catch(() => setDbs([]))
  }, [])

  async function openVersions(db: Db) {
    const res = await fetch(`http://localhost:8080/backups/${db.id}`)
    if (!res.ok) return
    const items = await res.json()
    setVersionsModal({ open: true, db, items })
  }

  async function actOnVersion(cmd: 'pin'|'unpin'|'delete'|'download', vid: string) {
    if (cmd === 'download') {
      const res = await fetch(`http://localhost:8080/versions/${vid}/download`)
      if (!res.ok) return
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup-${vid}.sql`
      a.click()
      window.URL.revokeObjectURL(url)
      return
    }
    if (cmd === 'delete') {
      if (!confirm('Supprimer cette version?')) return
      await fetch(`http://localhost:8080/versions/${vid}`, { method: 'DELETE' })
      if (versionsModal.db) openVersions(versionsModal.db)
      return
    }
    await fetch(`http://localhost:8080/versions/${vid}/${cmd}`, { method: 'POST' })
    if (versionsModal.db) openVersions(versionsModal.db)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>SafeBase - Gestion des Versions</h1>
      
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
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
            <h2>Versions de {versionsModal.db.name}</h2>
            <button onClick={() => setVersionsModal({ open: false, items: [] })} style={{ float: 'right' }}>✕</button>
            {versionsModal.items.length === 0 ? (
              <p>Aucune version sauvegardée.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {versionsModal.items.map(v => (
                  <li key={v.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{new Date(v.createdAt).toLocaleString()}</strong>
                        {v.pinned && <span style={{ marginLeft: '0.5rem', color: '#f59e0b' }}>📌 Épinglée</span>}
                        {v.sizeBytes && <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{(v.sizeBytes / 1024).toFixed(2)} KB</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => actOnVersion('download', v.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Télécharger</button>
                        {v.pinned ? (
                          <button onClick={() => actOnVersion('unpin', v.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Retirer</button>
                        ) : (
                          <button onClick={() => actOnVersion('pin', v.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Épingler</button>
                        )}
                        {!v.pinned && <button onClick={() => actOnVersion('delete', v.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', background: '#ef4444', color: 'white' }}>Supprimer</button>}
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
