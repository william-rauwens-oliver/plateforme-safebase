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

  async function triggerBackupAll() {
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/backup-all`, { method: 'POST' })
      if (!res.ok) throw new Error('backup all failed')
      const data = await res.json()
      const successCount = data.results.filter((r: any) => r.ok).length
      alert(`Backups lancés: ${successCount}/${data.results.length} réussis`)
    } catch (err) {
      alert('Erreur lors des backups globaux')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>SafeBase - Sauvegarde Globale</h1>
      
      <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h2>Sauvegarder toutes les bases de données</h2>
        <button 
          onClick={triggerBackupAll} 
          disabled={loading || dbs.length === 0}
          style={{ padding: '1rem 2rem', borderRadius: '12px', border: 'none', background: '#667eea', color: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
        >
          {loading ? 'Backups en cours...' : `💾 Sauvegarder toutes les bases (${dbs.length})`}
        </button>
      </div>

      <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px' }}>
        <h2>Bases de données ({dbs.length})</h2>
        {dbs.length === 0 ? (
          <p>Aucune base de données enregistrée.</p>
        ) : (
          dbs.map(db => (
            <div key={db.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>{db.name}</h3>
              <p>{db.engine} - {db.username}@{db.host}:{db.port}/{db.database}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
