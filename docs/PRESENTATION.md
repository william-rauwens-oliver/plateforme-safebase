---
marp: true
theme: default
paginate: true
header: 'SafeBase'
footer: 'Présentation Projet'
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800&display=swap');
  
  :root {
    --blue: #3b82f6;
    --green: #10b981;
    --red: #ef4444;
    --orange: #f59e0b;
    --purple: #8b5cf6;
    --pink: #ec4899;
  }
  
  section {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    color: #1e293b;
    padding: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  section > * {
    position: relative;
    z-index: 1;
  }
  
  h1 {
    color: #0f172a;
    font-size: 5em;
    font-weight: 800;
    letter-spacing: -3px;
    margin: 0;
    line-height: 1;
    background: linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  h2 {
    color: #0f172a;
    font-size: 3em;
    font-weight: 700;
    letter-spacing: -2px;
    margin: 0 0 40px 0;
    line-height: 1.1;
  }
  
  h3 {
    color: #0f172a;
    font-size: 2em;
    font-weight: 700;
    margin: 0 0 20px 0;
  }
  
  p {
    color: #475569;
    font-size: 1.4em;
    line-height: 1.6;
    margin: 0;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    font-size: 1.5em;
    color: #475569;
    margin: 20px 0;
    padding-left: 50px;
    position: relative;
  }
  
  li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--green);
    font-weight: 700;
    font-size: 1.2em;
  }
  
  code {
    background: #f1f5f9;
    color: var(--blue);
    padding: 6px 12px;
    border-radius: 8px;
    font-family: 'SF Mono', monospace;
    font-size: 0.9em;
    border: 2px solid var(--blue);
  }
  
  pre {
    background: #0f172a;
    border-radius: 16px;
    padding: 30px;
    margin: 30px 0;
    overflow-x: auto;
  }
  
  pre code {
    background: transparent;
    border: none;
    color: #e2e8f0;
    font-size: 1.1em;
  }
  
  .big-number {
    font-size: 6em;
    font-weight: 800;
    background: linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin: 0;
  }
  
  .emoji-big {
    font-size: 4em;
    display: block;
    margin: 20px 0;
  }
  
  .card {
    background: white;
    border-radius: 24px;
    padding: 40px;
    margin: 20px 0;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border: 3px solid;
  }
  
  .card-blue {
    border-color: var(--blue);
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, white 100%);
  }
  
  .card-green {
    border-color: var(--green);
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, white 100%);
  }
  
  .card-purple {
    border-color: var(--purple);
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, white 100%);
  }
  
  .card-orange {
    border-color: var(--orange);
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, white 100%);
  }
  
  .badge {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 1.2em;
    font-weight: 700;
    margin: 10px;
  }
  
  .badge-blue {
    background: var(--blue);
    color: white;
  }
  
  .badge-green {
    background: var(--green);
    color: white;
  }
  
  .badge-purple {
    background: var(--purple);
    color: white;
  }
  
  .badge-orange {
    background: var(--orange);
    color: white;
  }
  
  .badge-red {
    background: var(--red);
    color: white;
  }
  
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin: 40px 0;
  }
  
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin: 40px 0;
  }
  
  .highlight-blue {
    color: var(--blue);
    font-weight: 700;
  }
  
  .highlight-green {
    color: var(--green);
    font-weight: 700;
  }
  
  .highlight-purple {
    color: var(--purple);
    font-weight: 700;
  }
  
  header, footer {
    color: #94a3b8;
    font-size: 0.9em;
  }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# SafeBase

## 💾 Plateforme de Sauvegarde Automatisée

**Parce qu'un DROP DATABASE est vite arrivé...**

---

# 🎯 Objectif

<div class="grid-2">

<div>

<span class="emoji-big">💾</span>

**Sauvegarder** automatiquement vos bases de données

</div>

<div>

<span class="emoji-big">🔄</span>

**Restaurer** en cas de problème

</div>

<div>

<span class="emoji-big">📦</span>

**Gérer** les versions de backups

</div>

<div>

<span class="emoji-big">🔒</span>

**Sécuriser** vos données

</div>

</div>

---

# 🏗️ Architecture

<div class="grid-3">

<div class="card card-blue">

<span class="emoji-big">⚙️</span>

**Backend**
Fastify + TypeScript

</div>

<div class="card card-green">

<span class="emoji-big">🎨</span>

**Frontend**
React + Vite

</div>

<div class="card card-purple">

<span class="emoji-big">🐳</span>

**Docker**
5 services

</div>

</div>

---

# 📊 Vue d'ensemble

```
Frontend (React) 
    ↓
Backend (Fastify)
    ↓
MySQL | PostgreSQL
    ↓
Scheduler (Cron)
```

<span class="badge badge-blue">TypeScript</span>
<span class="badge badge-green">REST API</span>
<span class="badge badge-purple">Docker</span>

---

# 🔌 API REST

<span class="big-number">13</span>

## Endpoints

<div class="grid-2">

<div>

- `GET /databases`
- `POST /databases`
- `POST /backup/:id`
- `POST /backup-all`
- `GET /backups/:id`

</div>

<div>

- `POST /restore/:versionId`
- `POST /versions/:id/pin`
- `GET /versions/:id/download`
- `DELETE /versions/:id`
- `GET /health`

</div>

</div>

---

# 🎨 Interface

<div class="card card-green">

<span class="emoji-big">✨</span>

**Design moderne**

- Gradient et glassmorphism
- Animations fluides
- Responsive
- Thème clair/sombre

</div>

**http://localhost:5173**

---

# 🔐 Sécurité

<div class="grid-2">

<div class="card card-blue">

**API Key**
Protection des endpoints

</div>

<div class="card card-green">

**Chiffrement**
AES-256-GCM

</div>

<div class="card card-purple">

**Validation**
Zod pour toutes les entrées

</div>

<div class="card card-orange">

**Headers**
Sécurisés

</div>

</div>

---

# ⚙️ Fonctionnalités

<div class="grid-2">

<div class="card card-green">

<span class="emoji-big">⏰</span>

**Backup Automatique**

Toutes les heures via cron

</div>

<div class="card card-blue">

<span class="emoji-big">📌</span>

**Gestion Versions**

Pin, Download, Restore

</div>

</div>

---

# 🧪 Tests

<div class="card card-green">

<span class="big-number">100%</span>

## Tests passent

- Health check
- API Key
- Scheduler
- Intégration

</div>

---

# 💻 Stack

<div class="grid-3">

<div class="card card-blue">

**Backend**
Fastify
TypeScript
Zod

</div>

<div class="card card-green">

**Frontend**
React
Vite
TypeScript

</div>

<div class="card card-purple">

**DevOps**
Docker
Compose
Alpine

</div>

</div>

---

# 📈 Statistiques

<div class="grid-2">

<div>

<span class="big-number">13</span>
Endpoints REST

</div>

<div>

<span class="big-number">5</span>
Services Docker

</div>

<div>

<span class="big-number">2</span>
Bases supportées
MySQL + PostgreSQL

</div>

<div>

<span class="big-number">100%</span>
Tests passent

</div>

</div>

---

# 🎓 Compétences

<div class="grid-3">

<div class="card card-blue">

**Backend**
REST API
Sécurité
Tests

</div>

<div class="card card-green">

**Frontend**
React
Responsive
UX

</div>

<div class="card card-purple">

**DevOps**
Docker
CI/CD
Monitoring

</div>

</div>

---

# 🚀 Démonstration

<div class="card card-green">

**URLs**

- API : http://localhost:8080
- Frontend : http://localhost:5173

**Actions**

1. Ajouter une base
2. Créer un backup
3. Gérer les versions
4. Restaurer

</div>

---

# 🔄 Flux

<div class="grid-2">

<div class="card card-blue">

**Backup**
```
API → mysqldump/pg_dump
→ Fichier SQL
```

</div>

<div class="card card-green">

**Restore**
```
API → mysql/psql
→ Base restaurée
```

</div>

</div>

---

# 🎯 Points Forts

<div class="grid-2">

<div>

1. <span class="highlight-blue">Complétude</span>
2. <span class="highlight-green">Sécurité</span>
3. <span class="highlight-purple">Automatisation</span>

</div>

<div>

4. <span class="highlight-blue">Flexibilité</span>
5. <span class="highlight-green">Modernité</span>
6. <span class="highlight-purple">Maintenabilité</span>

</div>

</div>

---

# 🔮 Évolutions

<div class="grid-2">

<div>

- Base relationnelle
- Authentification
- Compression

</div>

<div>

- Chiffrement backups
- Dashboard métriques
- Notifications

</div>

</div>

---

# 🎉 Conclusion

<div class="card card-green">

<span class="emoji-big">✅</span>

**SafeBase**

Solution complète et opérationnelle

- Répond au cahier des charges
- Prête pour la production
- Code testé et documenté

</div>

---

# 📞 Questions ?

<div class="card card-blue">

**Documentation**

- README.md
- docs/ARCHITECTURE.md
- docs/SOUTENANCE.md

**Merci !** 🙏

</div>
