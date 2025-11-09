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

/**
 * Hook personnalisé pour gérer un état persistant dans localStorage
 * @param key - Clé de stockage dans localStorage
 * @param initial - Valeur initiale si aucune valeur n'est trouvée
 * @returns Tuple [value, setValue] similaire à useState
 */
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
      // Ignore localStorage errors (private mode)
    }
  }, [key, value])
  return [value, setValue] as const
}

interface ImportMetaEnv {
  VITE_API_URL?: string;
  VITE_API_KEY?: string;
}

interface ImportMeta {
  env?: ImportMetaEnv;
}

/**
 * Composant principal de l'application SafeBase
 * Gère l'interface utilisateur complète pour la gestion des bases de données
 * @returns Composant React de l'application
 */
export function App() {
  const [config, setConfig] = usePersistentState('safebase-config', {
    apiUrl: (import.meta as ImportMeta).env?.VITE_API_URL || 'http://localhost:8080',
    apiKey: (import.meta as ImportMeta).env?.VITE_API_KEY || ''
  })
  const [health, setHealth] = useState<'pending'|'ok'|'down'>('pending')
  const [dbs, setDbs] = useState<Db[]>([])
  const [loading, setLoading] = useState(false)
  const [globalBusy, setGlobalBusy] = useState(false)
  const [form, setForm] = useState<{
    name: string;
    engine: 'mysql' | 'postgres';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }>({
    name: '', engine: 'mysql', host: '127.0.0.1', port: 8889,
    username: 'root', password: 'root', database: ''
  })
  const [availableDatabases, setAvailableDatabases] = useState<string[]>([])
  const [loadingDatabases, setLoadingDatabases] = useState(false)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiUrl, config.apiKey, headers])

  /**
   * Vérifie l'état de santé de l'API
   */
  function checkHealth() {
    setHealth('pending')
    fetch(`${config.apiUrl}/health`).then(r => r.json()).then(() => setHealth('ok')).catch(() => setHealth('down'))
  }

  /**
   * Rafraîchit la liste des bases de données depuis l'API
   */
  function refresh() {
    setIsLoadingList(true)
    fetch(`${config.apiUrl}/databases`, { headers })
      .then(r => r.json())
      .then(setDbs)
      .catch(() => setDbs([]))
      .finally(() => setIsLoadingList(false))
  }

  /**
   * Soumet le formulaire d'ajout d'une nouvelle base de données
   * @param e - Événement de soumission du formulaire
   */
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
        // Afficher le message d'erreur détaillé du backend
        const errorMsg = errorData.error || errorData.message || 'Erreur lors de la création'
        const hint = errorData.hint ? `\n\n${errorData.hint}` : ''
        throw new Error(`${errorMsg}${hint}`)
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
    navigator.clipboard.writeText(dsn).then(() => pushToast('DSN copié', 'success')).catch(() => {
      // Ignore clipboard errors
    })
  }

  /**
   * Supprime une base de données et toutes ses sauvegardes
   * @param id - ID de la base de données à supprimer
   */
  async function deleteDatabase(id: string) {
    const db = dbs.find(d => d.id === id);
    if (!db) return;
    
    if (!confirm(`Supprimer définitivement la base "${db.name}" et toutes ses sauvegardes ?`)) {
      return;
    }
    
    try {
      const res = await fetch(`${config.apiUrl}/databases/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
      
      pushToast('Base supprimée', 'success');
      refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      pushToast(errorMsg, 'error');
      console.error(err);
    }
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
    // Garder les erreurs plus longtemps pour qu'elles soient lisibles
    const duration = type === 'error' ? 8000 : 3500
    setTimeout(() => {
      setToasts(ts => ts.filter(t => t.id !== id))
    }, duration)
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
        <div className="header-actions">
          <span className={`status-badge ${health === 'ok' ? 'success' : health === 'down' ? 'danger' : ''}`}>
            {health === 'ok' ? 'API en ligne' : health === 'down' ? 'API hors ligne' : 'Vérification...'}
          </span>
          <button className="btn btn-ghost" onClick={checkHealth}>Rafraîchir</button>
          <button className="btn btn-ghost" aria-pressed={theme==='dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Clair' : 'Sombre'}
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Ajouter une base de données</h2>
          <form onSubmit={submit} className="form-grid">
            <div className="form-col-6"><input placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-col-6">
              <select value={form.engine} onChange={e => {
                const newEngine = e.target.value as 'mysql' | 'postgres';
                // Mettre à jour les valeurs par défaut selon le moteur (bases locales)
                if (newEngine === 'mysql') {
                  // MAMP MySQL par défaut
                  setForm({ ...form, engine: newEngine, host: '127.0.0.1', port: 8889, username: 'root', password: 'root', database: '' });
                } else {
                  // PostgreSQL Homebrew par défaut
                  setForm({ ...form, engine: newEngine, host: 'localhost', port: 5432, username: 'postgres', password: 'postgres', database: '' });
                }
                setAvailableDatabases([]); // Réinitialiser la liste
              }}>
                <option value="mysql">MySQL</option>
                <option value="postgres">PostgreSQL</option>
              </select>
            </div>
            <div className="form-col-6"><input placeholder="Hôte" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} required /></div>
            <div className="form-col-6"><input type="number" placeholder="Port" value={form.port} onChange={e => setForm({ ...form, port: Number(e.target.value) })} required /></div>
            <div className="form-col-6"><input placeholder="Utilisateur" value={form.username} onChange={e => setForm({ ...form, username: e.target.value, database: '' })} required /></div>
            <div className="form-col-6"><input type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm({ ...form, password: e.target.value, database: '' })} required /></div>
            <div className="form-col-12" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <select 
                value={form.database} 
                onChange={e => setForm({ ...form, database: e.target.value })} 
                required
                style={{ flex: 1 }}
                disabled={loadingDatabases || availableDatabases.length === 0}
              >
                <option value="">{loadingDatabases ? 'Chargement...' : availableDatabases.length === 0 ? 'Cliquez sur "Récupérer les bases"' : 'Sélectionnez une base'}</option>
                {availableDatabases.map(db => (
                  <option key={db} value={db}>{db}</option>
                ))}
              </select>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={async () => {
                  if (!form.host || !form.port || !form.username) {
                    pushToast('Remplissez d\'abord hôte, port et utilisateur', 'error');
                    return;
                  }
                  setLoadingDatabases(true);
                  try {
                    const params = new URLSearchParams({
                      engine: form.engine,
                      host: form.host,
                      port: String(form.port),
                      username: form.username,
                      password: form.password
                    });
                    const res = await fetch(`${config.apiUrl}/databases/available?${params}`, { headers });
                    if (!res.ok) {
                      const errorData = await res.json().catch(() => ({}));
                      throw new Error(errorData.error || errorData.message || 'Erreur lors de la récupération');
                    }
                    const data = await res.json();
                    setAvailableDatabases(data.databases || []);
                    if (data.databases && data.databases.length > 0) {
                      pushToast(`${data.databases.length} base(s) trouvée(s)`, 'success');
                    } else {
                      pushToast('Aucune base de données trouvée', 'info');
                    }
                  } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la récupération';
                    pushToast(errorMsg, 'error');
                    setAvailableDatabases([]);
                  } finally {
                    setLoadingDatabases(false);
                  }
                }}
                disabled={loadingDatabases || !form.host || !form.port || !form.username}
                style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
              >
                {loadingDatabases ? '...' : 'Récupérer'}
              </button>
            </div>
            {form.database && (
              <div className="form-col-12">
                <input 
                  placeholder="Ou tapez le nom de la base manuellement" 
                  value={form.database} 
                  onChange={e => setForm({ ...form, database: e.target.value })} 
                />
              </div>
            )}
            <div className="form-col-12"><button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Ajout...' : 'Ajouter la base'}</button></div>
          </form>
        </div>

        <div className="card">
          <h2>Réglages</h2>
          <div className="form-grid">
            <div className="form-col-12"><input placeholder="API URL" value={config.apiUrl} onChange={e => setConfig({ ...config, apiUrl: e.target.value })} /></div>
            <div className="form-col-12"><input placeholder="API Key (optionnel)" value={config.apiKey} onChange={e => setConfig({ ...config, apiKey: e.target.value })} /></div>
            <div className="form-col-12" style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={refresh}>Recharger</button>
              <button className="btn btn-primary" onClick={triggerBackupAll} disabled={globalBusy || dbs.length === 0}>Backup All</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="search-filter-bar">
          <h2 style={{ margin: 0, flex: 1 }}>Bases de données {dbs.length > 0 ? `(${filtered.length}/${dbs.length})` : ''}</h2>
          <input aria-label="Rechercher" placeholder="Rechercher…" value={query} onChange={e => setQuery(e.target.value)} />
          <select aria-label="Trier par" value={sort} onChange={e => setSort(e.target.value as 'name' | 'engine' | 'created')}>
            <option value="name">Nom</option>
            <option value="engine">Moteur</option>
          </select>
        </div>
        {isLoadingList ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-text">Chargement…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-text">Aucune base configurée. Ajoutez-en une pour commencer.</div>
          </div>
        ) : (
          <div className="db-grid">
            {filtered.map(db => (
              <div key={db.id} className="db-card">
                <div className="db-header">
                  <h3 className="db-title">{db.name}</h3>
                  <span className="db-badge">{db.engine === 'mysql' ? 'MySQL' : 'Postgres'}</span>
                </div>
                <div className="db-info">{db.username}@{db.host}:{db.port}/{db.database}</div>
                <div className="db-actions">
                  <button className="btn btn-secondary" onClick={() => copyDsn(db)}>DSN</button>
                  <button className="btn btn-primary" onClick={() => triggerBackup(db.id)} disabled={globalBusy}>Backup</button>
                  <button className="btn btn-secondary" onClick={() => openVersions(db)}>Versions</button>
                  <button className="btn btn-danger" onClick={() => deleteDatabase(db.id)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {versionsModal.open && (
        <div className="modal-backdrop" onClick={() => setVersionsModal({ open: false, items: [] })}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <strong>Versions</strong>
                {versionsModal.db && <span className="status-badge">{versionsModal.db.name}</span>}
              </div>
              <button className="btn btn-ghost" onClick={() => setVersionsModal({ open: false, items: [] })}>Fermer</button>
            </div>
            <div className="modal-body">
              {versionsModal.items.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📦</div>
                  <div className="empty-state-text">Aucune version disponible.</div>
                </div>
              ) : (
                versionsModal.items.map(v => (
                  <div key={v.id} className="version-item">
                    <div className="version-info">
                      <div className="version-id">{v.id}</div>
                      <div className="version-meta">
                        {new Date(v.createdAt).toLocaleString()} · {(v.sizeBytes||0).toLocaleString()} octets {v.pinned ? '· Épinglée' : ''}
                      </div>
                    </div>
                    <div className="version-actions">
                      <button className="btn btn-secondary" onClick={() => actOnVersion('download', v.id)}>Télécharger</button>
                      {v.pinned ? (
                        <button className="btn btn-secondary" onClick={() => actOnVersion('unpin', v.id)}>Retirer</button>
                      ) : (
                        <button className="btn btn-secondary" onClick={() => actOnVersion('pin', v.id)}>Épingler</button>
                      )}
                      <button className="btn btn-primary" onClick={() => actOnVersion('restore', v.id)}>Restaurer</button>
                      {!v.pinned && <button className="btn btn-danger" onClick={() => actOnVersion('delete', v.id)}>Supprimer</button>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type || 'info'}`}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
