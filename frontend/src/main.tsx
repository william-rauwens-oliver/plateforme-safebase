import React, { useEffect, useState, useMemo } from 'react'
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
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'name'|'engine'|'created'>('name')
  const apiUrl = 'http://localhost:8080'

  useEffect(() => {
    fetch(`${apiUrl}/databases`)
      .then(r => r.json())
      .then(setDbs)
      .catch(() => setDbs([]))
  }, [])

  const filteredAndSorted = useMemo(() => {
    let filtered = dbs.filter(db => 
      db.name.toLowerCase().includes(query.toLowerCase()) ||
      db.host.toLowerCase().includes(query.toLowerCase()) ||
      db.database.toLowerCase().includes(query.toLowerCase())
    )
    
    filtered.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'engine') return a.engine.localeCompare(b.engine)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
    
    return filtered
  }, [dbs, query, sort])

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>SafeBase - Recherche et Tri</h1>
      
      <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '1rem' }}
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as 'name'|'engine'|'created')}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '1rem', background: 'white' }}
          >
            <option value="name">Trier par nom</option>
            <option value="engine">Trier par moteur</option>
            <option value="created">Trier par date</option>
          </select>
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          {filteredAndSorted.length} résultat(s) sur {dbs.length}
        </div>
      </div>

      <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px' }}>
        <h2>Bases de données ({filteredAndSorted.length})</h2>
        {filteredAndSorted.length === 0 ? (
          <p>Aucune base de données trouvée.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filteredAndSorted.map(db => (
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
