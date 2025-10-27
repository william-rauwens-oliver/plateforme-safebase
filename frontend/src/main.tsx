import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_KEY = import.meta.env.VITE_API_KEY

function authHeaders(extra?: Record<string, string>) {
  const headers: Record<string, string> = { ...(extra || {}) }
  if (API_KEY) headers['x-api-key'] = String(API_KEY)
  return headers
}

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

function App() {
  const [health, setHealth] = useState('pending')
  const [dbs, setDbs] = useState<Db[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', engine: 'mysql', host: 'localhost', port: 3306,
    username: 'safebase', password: 'safebase', database: 'safebase'
  } as any)

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center' as const,
      color: 'white',
      marginBottom: '3rem'
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      margin: '0 0 1rem 0',
      textShadow: '0 4px 6px rgba(0,0,0,0.3)',
      background: 'linear-gradient(45deg, #fff, #e0e7ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      fontSize: '1.2rem',
      opacity: 0.9,
      fontStyle: 'italic'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    healthBadge: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      background: health === 'ok' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#ef4444',
      color: 'white',
      marginLeft: '1rem'
    },
    form: {
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    },
    input: {
      padding: '0.875rem 1rem',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      transition: 'all 0.3s',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
    },
    select: {
      padding: '0.875rem 1rem',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    button: {
      padding: '0.875rem 2rem',
      borderRadius: '12px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      gridColumn: '1 / -1'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
    },
    dbCard: {
      background: 'linear-gradient(135deg, #f5f3ff, #e9d5ff)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'all 0.3s'
    },
    dbCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
    },
    dbHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    dbTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#667eea',
      margin: 0
    },
    engineBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      background: '#667eea',
      color: 'white'
    },
    dbInfo: {
      color: '#6b7280',
      fontSize: '0.9rem',
      marginBottom: '1rem',
      fontFamily: 'monospace'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem'
    },
    actionButton: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    backupBtn: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white'
    },
    versionsBtn: {
      background: '#10b981',
      color: 'white'
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '3rem',
      color: '#6b7280'
    }
  }

  useEffect(() => {
    fetch(`${API}/health`).then(r => r.json()).then(() => setHealth('ok')).catch(() => setHealth('down'))
    refresh()
  }, [])

  function refresh() {
    fetch(`${API}/databases`, { headers: authHeaders() }).then(r => r.json()).then(setDbs)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`${API}/databases`, { 
        method: 'POST', 
        headers: authHeaders({ 'Content-Type': 'application/json' }), 
        body: JSON.stringify({ ...form, port: Number(form.port) })
      })
      setForm({ ...form, name: '' })
      refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function triggerBackup(id: string) {
    setLoading(true)
    try {
      await fetch(`${API}/backup/${id}`, { method: 'POST', headers: authHeaders() })
      alert('✓ Backup déclenché avec succès!')
    } catch (err) {
      alert('✗ Erreur lors du backup')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function showBackups(id: string) {
    const versions = await fetch(`${API}/backups/${id}`, { headers: authHeaders() }).then(r => r.json())
    const lines = versions.map((v: any) => 
      `\n${v.id.substring(0, 8)}... | ${new Date(v.createdAt).toLocaleString()} | ${(v.sizeBytes||0)}B | ${v.pinned ? '📌' : ''}`
    ).join('')
    const action = window.prompt(`Versions disponibles:${lines}\n\nActions: restore <id> | pin <id> | unpin <id> | delete <id> | download <id>`)
    if (!action) return
    const [cmd, vid] = action.split(/\s+/)
    if (!vid) return
    
    setLoading(true)
    try {
      if (cmd === 'restore') {
        await fetch(`${API}/restore/${vid}`, { method: 'POST', headers: authHeaders() })
        alert('✓ Restauration déclenchée')
      } else if (cmd === 'pin') {
        await fetch(`${API}/versions/${vid}/pin`, { method: 'POST', headers: authHeaders() })
        alert('✓ Version épinglée')
      } else if (cmd === 'unpin') {
        await fetch(`${API}/versions/${vid}/unpin`, { method: 'POST', headers: authHeaders() })
        alert('✓ Épingle retirée')
      } else if (cmd === 'delete') {
        await fetch(`${API}/versions/${vid}`, { method: 'DELETE', headers: authHeaders() })
        alert('✓ Version supprimée')
      } else if (cmd === 'download') {
        window.location.href = `${API}/versions/${vid}/download`
        return
      }
      refresh()
    } catch (err) {
      alert('✗ Erreur lors de l\'opération')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>SafeBase</h1>
          <p style={styles.subtitle}>"Parce qu'un DROP DATABASE est vite arrivé..."</p>
          <div>
            API Status: <strong>{health}</strong>
            <span style={styles.healthBadge}>{health === 'ok' ? '✓ En ligne' : '✗ Hors ligne'}</span>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={{ marginTop: 0, color: '#667eea' }}>➕ Ajouter une base de données</h2>
          <form onSubmit={submit} style={styles.form}>
            <input 
              placeholder="Nom de la base" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={styles.input}
              required
            />
            <select 
              value={form.engine} 
              onChange={e => setForm({ ...form, engine: e.target.value })}
              style={styles.select}
            >
              <option value="mysql">🐬 MySQL</option>
              <option value="postgres">🐘 PostgreSQL</option>
            </select>
            <input 
              placeholder="Hôte" 
              value={form.host} 
              onChange={e => setForm({ ...form, host: e.target.value })}
              style={styles.input}
              required
            />
            <input 
              placeholder="Port" 
              type="number" 
              value={form.port} 
              onChange={e => setForm({ ...form, port: Number(e.target.value) })}
              style={styles.input}
              required
            />
            <input 
              placeholder="Utilisateur" 
              value={form.username} 
              onChange={e => setForm({ ...form, username: e.target.value })}
              style={styles.input}
              required
            />
            <input 
              placeholder="Mot de passe" 
              type="password"
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={styles.input}
              required
            />
            <input 
              placeholder="Nom de la base de données" 
              value={form.database} 
              onChange={e => setForm({ ...form, database: e.target.value })}
              style={styles.input}
              required
            />
            <button 
              type="submit" 
              style={styles.button}
              disabled={loading}
            >
              {loading ? '⏳ Ajout en cours...' : '✨ Ajouter la base'}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={{ marginTop: 0, color: '#667eea' }}>
            📊 Bases de données enregistrées {dbs.length > 0 && `(${dbs.length})`}
          </h2>
          {dbs.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ fontSize: '3rem', margin: 0 }}>📭</p>
              <p>Aucune base de données configurée pour le moment.</p>
              <p>Ajoutez-en une ci-dessus pour commencer !</p>
            </div>
          ) : (
            dbs.map(db => (
              <div key={db.id} style={styles.dbCard}>
                <div style={styles.dbHeader}>
                  <h3 style={styles.dbTitle}>{db.name}</h3>
                  <span style={styles.engineBadge}>
                    {db.engine === 'mysql' ? '🐬 MySQL' : '🐘 Postgres'}
                  </span>
                </div>
                <div style={styles.dbInfo}>
                  🔗 {db.username}@{db.host}:{db.port}/{db.database}
                </div>
                <div style={styles.actionButtons}>
                  <button 
                    onClick={() => triggerBackup(db.id)} 
                    style={{ ...styles.actionButton, ...styles.backupBtn }}
                    disabled={loading}
                  >
                    💾 Backup maintenant
                  </button>
                  <button 
                    onClick={() => showBackups(db.id)} 
                    style={{ ...styles.actionButton, ...styles.versionsBtn }}
                    disabled={loading}
                  >
                    📦 Versions & Restore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
