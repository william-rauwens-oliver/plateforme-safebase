import React, { useEffect, useMemo, useState } from 'react'
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
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])
  return [value, setValue] as const
}

function App() {
  const [config, setConfig] = usePersistentState('safebase-config', {
    apiUrl: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080',
    apiKey: (import.meta as any).env?.VITE_API_KEY || ''
  })
  const [health, setHealth] = useState<'pending'|'ok'|'down'>('pending')
  const [dbs, setDbs] = useState<Db[]>([])
  const [loading, setLoading] = useState(false)
  const [globalBusy, setGlobalBusy] = useState(false)
  const [form, setForm] = useState({
    name: '', engine: 'mysql', host: 'localhost', port: 3306,
    username: 'safebase', password: 'safebase', database: 'safebase'
  } as any)
  const [versionsModal, setVersionsModal] = useState<{ open: boolean, db?: Db, items: Version[] }>({ open: false, items: [] })
  const [toasts, setToasts] = useState<Array<{ id: string, text: string, type?: 'success'|'error'|'info' }>>([])
  const [theme, setTheme] = usePersistentState<'dark'|'light'>('safebase-theme', 'dark')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'name'|'engine'|'created'>('name')
  const [isLoadingList, setIsLoadingList] = useState(false)

  const headers = useMemo(() => {
    const h: Record<string, string> = {}
    if (config.apiKey) h['x-api-key'] = String(config.apiKey)
    return h
  }, [config.apiKey])

  useEffect(() => {
    checkHealth()
    refresh()
  }, [config.apiUrl, config.apiKey])

  function checkHealth() {
    setHealth('pending')
    fetch(`${config.apiUrl}/health`).then(r => r.json()).then(() => setHealth('ok')).catch(() => setHealth('down'))
  }

  function refresh() {
    setIsLoadingList(true)
    fetch(`${config.apiUrl}/databases`, { headers })
      .then(r => r.json())
      .then(setDbs)
      .catch(() => setDbs([]))
      .finally(() => setIsLoadingList(false))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${config.apiUrl}/databases`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, port: Number(form.port) })
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMsg = errorData.message || errorData.error || 'Erreur lors de la création'
        throw new Error(errorMsg)
      }
      setForm({ ...form, name: '' })
      pushToast('Base ajoutée', 'success')
      refresh()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur: ajout impossible'
      pushToast(errorMsg, 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function triggerBackup(id: string) {
    setGlobalBusy(true)
    try {
      const res = await fetch(`${config.apiUrl}/backup/${id}`, { method: 'POST', headers })
      if (!res.ok) throw new Error('backup failed')
      pushToast('Backup déclenché', 'success')
    } catch (err) {
      pushToast('Erreur lors du backup', 'error')
      console.error(err)
    } finally {
      setGlobalBusy(false)
    }
  }

  async function triggerBackupAll() {
    setGlobalBusy(true)
    try {
      const res = await fetch(`${config.apiUrl}/backup-all`, { method: 'POST', headers })
      if (!res.ok) throw new Error('backup all failed')
      pushToast('Backups lancés pour toutes les bases', 'success')
    } catch (err) {
      pushToast('Erreur lors des backups globaux', 'error')
    } finally {
      setGlobalBusy(false)
    }
  }

  function copyDsn(db: Db) {
    const dsn = db.engine === 'mysql'
      ? `mysql://${db.username}:${encodeURIComponent(db.password)}@${db.host}:${db.port}/${db.database}`
      : `postgres://${db.username}:${encodeURIComponent(db.password)}@${db.host}:${db.port}/${db.database}`
    navigator.clipboard.writeText(dsn).then(() => pushToast('DSN copié', 'success')).catch(() => {})
  }

  async function openVersions(db: Db) {
    try {
      const items = await fetch(`${config.apiUrl}/backups/${db.id}`, { headers }).then(r => r.json())
      // Trier : épinglées en premier, puis par date (plus récent d'abord)
      const sorted = items.sort((a: Version, b: Version) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      setVersionsModal({ open: true, db, items: sorted })
    } catch (e) {
      pushToast('Impossible de charger les versions', 'error')
    }
  }

  async function actOnVersion(cmd: 'restore'|'pin'|'unpin'|'delete'|'download', vid: string) {
    if (!versionsModal.db) return
    try {
      if (cmd === 'download') {
        window.location.href = `${config.apiUrl}/versions/${vid}/download`
        return
      }
      if (cmd === 'restore') {
        if (!confirm('Restaurer cette version ?')) return
        await fetch(`${config.apiUrl}/restore/${vid}`, { method: 'POST', headers })
      } else if (cmd === 'pin') {
        await fetch(`${config.apiUrl}/versions/${vid}/pin`, { method: 'POST', headers })
        pushToast('Version épinglée', 'success')
      } else if (cmd === 'unpin') {
        await fetch(`${config.apiUrl}/versions/${vid}/unpin`, { method: 'POST', headers })
        pushToast('Épingle retirée', 'success')
      } else if (cmd === 'delete') {
        if (!confirm('Supprimer définitivement cette version non épinglée ?')) return
        await fetch(`${config.apiUrl}/versions/${vid}`, { method: 'DELETE', headers })
        pushToast('Version supprimée', 'success')
      }
      const items = await fetch(`${config.apiUrl}/backups/${versionsModal.db.id}`, { headers }).then(r => r.json())
      // Trier : épinglées en premier, puis par date (plus récent d'abord)
      const sorted = items.sort((a: Version, b: Version) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      setVersionsModal(v => ({ ...v, items: sorted }))
    } catch (e) {
      pushToast('Erreur lors de l\'opération', 'error')
    }
  }

  function pushToast(text: string, type: 'success'|'error'|'info' = 'info') {
    const id = Math.random().toString(36).slice(2)
    setToasts(ts => [...ts, { id, text, type }])
    setTimeout(() => {
      setToasts(ts => ts.filter(t => t.id !== id))
    }, 3500)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = dbs.filter(db => {
      if (!q) return true
      return (
        db.name.toLowerCase().includes(q) ||
        db.engine.toLowerCase().includes(q) ||
        db.host.toLowerCase().includes(q) ||
        db.database.toLowerCase().includes(q)
      )
    })
    if (sort === 'name') out = out.sort((a,b) => a.name.localeCompare(b.name))
    if (sort === 'engine') out = out.sort((a,b) => a.engine.localeCompare(b.engine))
    return out
  }, [dbs, query, sort])

  return (
    <div className="container" data-theme={theme}>
      <div className="header">
        <div className="brand">
          <div className="logo">SB</div>
          <div>
            <h1>SafeBase</h1>
            <div className="muted">« Parce qu’un DROP DATABASE est vite arrivé… »</div>
          </div>
        </div>
        <div className="row-compact">
          <span className={`pill ${health === 'ok' ? 'success' : health === 'down' ? 'danger' : ''}`}>{health === 'ok' ? 'API en ligne' : health === 'down' ? 'API hors ligne' : 'Vérification...'}</span>
          <button className="ghost" onClick={checkHealth}>Rafraîchir</button>
          <button className="ghost" aria-pressed={theme==='dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Clair' : 'Sombre'}
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Ajouter une base de données</h2>
          <form onSubmit={submit} className="row">
            <div className="col-6"><input placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="col-6">
              <select value={form.engine} onChange={e => setForm({ ...form, engine: e.target.value })}>
                <option value="mysql">MySQL</option>
                <option value="postgres">PostgreSQL</option>
              </select>
            </div>
            <div className="col-6"><input placeholder="Hôte" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} required /></div>
            <div className="col-6"><input type="number" placeholder="Port" value={form.port} onChange={e => setForm({ ...form, port: Number(e.target.value) })} required /></div>
            <div className="col-6"><input placeholder="Utilisateur" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></div>
            <div className="col-6"><input type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
            <div className="col-12"><input placeholder="Nom de la base de données" value={form.database} onChange={e => setForm({ ...form, database: e.target.value })} required /></div>
            <div className="col-12"><button className="primary" type="submit" disabled={loading}>{loading ? 'Ajout...' : 'Ajouter la base'}</button></div>
          </form>
        </div>

        <div className="card">
          <h2>Réglages</h2>
          <div className="row">
            <div className="col-12"><input placeholder="API URL" value={config.apiUrl} onChange={e => setConfig({ ...config, apiUrl: e.target.value })} /></div>
            <div className="col-12"><input placeholder="API Key (optionnel)" value={config.apiKey} onChange={e => setConfig({ ...config, apiKey: e.target.value })} /></div>
            <div className="col-12 toolbar">
              <button className="ghost" onClick={refresh}>Recharger</button>
              <button className="primary" onClick={triggerBackupAll} disabled={globalBusy || dbs.length === 0}>Backup All</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Bases de données {dbs.length > 0 ? `(${filtered.length}/${dbs.length})` : ''}</h2>
          <div className="row-compact">
            <input aria-label="Rechercher" placeholder="Rechercher…" value={query} onChange={e => setQuery(e.target.value)} />
            <select aria-label="Trier par" value={sort} onChange={e => setSort(e.target.value as any)}>
              <option value="name">Nom</option>
              <option value="engine">Moteur</option>
            </select>
          </div>
        </div>
        {isLoadingList ? (
          <div className="empty">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div>Aucune base configurée. Ajoutez-en une pour commencer.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {filtered.map(db => (
              <div key={db.id} className="db">
                <div className="db-head">
                  <h3 className="db-title">{db.name}</h3>
                  <span className="badge">{db.engine === 'mysql' ? 'MySQL' : 'Postgres'}</span>
                </div>
                <div className="kbd muted">{db.username}@{db.host}:{db.port}/{db.database}</div>
                <div className="actions">
                  <button className="ghost" onClick={() => copyDsn(db)}>Copier DSN</button>
                  <button className="primary" onClick={() => triggerBackup(db.id)} disabled={globalBusy}>Backup</button>
                  <button onClick={() => openVersions(db)}>Versions</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {versionsModal.open && (
        <div className="modal-backdrop" onClick={() => setVersionsModal({ open: false, items: [] })}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="row-compact">
                <strong>Versions</strong>
                {versionsModal.db && <span className="pill">{versionsModal.db.name}</span>}
              </div>
              <button className="ghost" onClick={() => setVersionsModal({ open: false, items: [] })}>Fermer</button>
            </div>
            <div className="modal-body">
              {versionsModal.items.length === 0 ? (
                <div className="empty">Aucune version disponible.</div>
              ) : (
                versionsModal.items.map(v => (
                  <div key={v.id} className="version">
                    <div>
                      <div className="kbd">{v.id}</div>
                      <div className="muted">{new Date(v.createdAt).toLocaleString()} · {(v.sizeBytes||0)} octets {v.pinned ? '· Épinglée' : ''}</div>
                    </div>
                    <div className="row-compact">
                      <button onClick={() => actOnVersion('download', v.id)}>Télécharger</button>
                      {v.pinned ? (
                        <button onClick={() => actOnVersion('unpin', v.id)}>Retirer</button>
                      ) : (
                        <button onClick={() => actOnVersion('pin', v.id)}>Épingler</button>
                      )}
                      <button className="primary" onClick={() => actOnVersion('restore', v.id)}>Restaurer</button>
                      {!v.pinned && <button className="ghost" onClick={() => actOnVersion('delete', v.id)}>Supprimer</button>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div aria-live="polite" style={{ position: 'fixed', right: 24, bottom: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 2000 }}>
        {toasts.map(t => (
          <div key={t.id} className="pill">
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
