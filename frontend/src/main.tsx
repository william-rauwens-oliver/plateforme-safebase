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

export function App() {
  const [dbs, setDbs] = useState<Db[]>([])
  const [loading, setLoading] = useState(false)
  const apiUrl = 'http://localhost:8080'

  useEffect(() => {
    fetch(`${apiUrl}/databases`)
      .then(r => r.json())
      .then(setDbs)
      .catch(() => setDbs([]))
  }, [])

  async function triggerBackup(id: string) {
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/backup/${id}`, { method: 'POST' })
      if (!res.ok) throw new Error('backup failed')
      alert('Backup déclenché avec succès!')
    } catch (err) {
      alert('Erreur lors du backup')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>SafeBase - Sauvegarde Manuelle</h1>
      
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
                onClick={() => triggerBackup(db.id)} 
                disabled={loading}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white', cursor: 'pointer' }}
              >
                {loading ? 'Backup en cours...' : '💾 Backup maintenant'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
