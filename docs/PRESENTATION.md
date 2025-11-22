---
marp: true
theme: default
paginate: true
header: 'SafeBase'
footer: 'Présentation Projet'
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  :root {
    --bg-dark: #0a0a0a;
    --bg-card: #161616;
    --bg-elev: #1f1f1f;
    --text: #ffffff;
    --text-secondary: #b3b3b3;
    --text-muted: #737373;
    --accent-blue: #3b82f6;
    --accent-green: #10b981;
    --accent-red: #ef4444;
    --accent-orange: #f59e0b;
    --border: #2a2a2a;
  }
  
  section {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg-dark);
    color: var(--text);
    padding: 60px 80px;
    position: relative;
    overflow: hidden;
  }
  
  section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  section > * {
    position: relative;
    z-index: 1;
  }
  
  h1 {
    color: var(--text);
    font-size: 4em;
    font-weight: 800;
    letter-spacing: -2px;
    margin: 0 0 20px 0;
    line-height: 1.1;
  }
  
  h2 {
    color: var(--text);
    font-size: 2.2em;
    font-weight: 700;
    letter-spacing: -1px;
    margin: 0 0 30px 0;
    line-height: 1.2;
  }
  
  h3 {
    color: var(--text);
    font-size: 1.5em;
    font-weight: 600;
    margin: 0 0 20px 0;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.1em;
    line-height: 1.7;
    margin: 0 0 20px 0;
  }
  
  strong {
    color: var(--text);
    font-weight: 600;
  }
  
  ul, ol {
    color: var(--text-secondary);
    font-size: 1.1em;
    line-height: 1.8;
    margin: 0;
    padding-left: 30px;
  }
  
  li {
    margin: 12px 0;
  }
  
  code {
    background: var(--bg-elev);
    color: var(--accent-blue);
    padding: 4px 10px;
    border-radius: 6px;
    font-family: 'SF Mono', Monaco, 'Cascadia Mono', monospace;
    font-size: 0.9em;
    border: 1px solid var(--border);
  }
  
  pre {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    overflow-x: auto;
    margin: 20px 0;
  }
  
  pre code {
    background: transparent;
    border: none;
    padding: 0;
    color: var(--text-secondary);
    font-size: 0.95em;
    line-height: 1.6;
  }
  
  /* Badges et accents colorés */
  .badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: 600;
    letter-spacing: 0.3px;
  }
  
  .badge-blue {
    background: rgba(59, 130, 246, 0.15);
    color: var(--accent-blue);
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
  
  .badge-green {
    background: rgba(16, 185, 129, 0.15);
    color: var(--accent-green);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  
  .badge-red {
    background: rgba(239, 68, 68, 0.15);
    color: var(--accent-red);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .badge-orange {
    background: rgba(245, 158, 11, 0.15);
    color: var(--accent-orange);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }
  
  /* Titre de page avec accent coloré */
  .title-accent {
    display: inline-block;
    width: 6px;
    height: 60px;
    background: linear-gradient(180deg, var(--accent-blue) 0%, var(--accent-green) 100%);
    border-radius: 3px;
    margin-right: 20px;
    vertical-align: middle;
  }
  
  /* Cards modernes */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    margin: 20px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  /* Grid moderne */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin: 30px 0;
  }
  
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 30px 0;
  }
  
  /* Accent coloré pour les listes */
  ul li::marker {
    color: var(--accent-blue);
  }
  
  /* Highlight coloré */
  .highlight-blue {
    color: var(--accent-blue);
    font-weight: 600;
  }
  
  .highlight-green {
    color: var(--accent-green);
    font-weight: 600;
  }
  
  /* Séparateur avec couleur */
  hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--accent-blue) 50%, transparent 100%);
    margin: 40px 0;
  }
  
  /* Header et footer */
  header {
    color: var(--text-muted);
    font-size: 0.85em;
    font-weight: 500;
  }
  
  footer {
    color: var(--text-muted);
    font-size: 0.85em;
    font-weight: 500;
  }
  
  /* Emoji plus grand */
  section[data-marpit-pagination]::before {
    font-size: 1.2em;
  }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# <span class="title-accent"></span>SafeBase

## Plateforme de Sauvegarde Automatisée

**Parce qu'un DROP DATABASE est vite arrivé...**

**SafeBase, I'll be back(up)** 💾

---

# <span class="title-accent"></span>🎯 Objectif du Projet

Développer une **plateforme complète** de sauvegarde automatisée pour :

<div class="grid-2">

<div>

- ✅ Bases de données **MySQL** et **PostgreSQL**
- ✅ API REST sécurisée
- ✅ Interface utilisateur moderne
- ✅ Scheduler automatisé (cron)

</div>

<div>

- ✅ Gestion des versions de backups
- ✅ Tests unitaires
- ✅ Conteneurisation Docker
- ✅ Monitoring et alertes

</div>

</div>

---

# <span class="title-accent"></span>🏗️ Architecture Technique

## 5 Composants Docker

<div class="grid-2">

<div class="card">

**Backend (API)**
<span class="badge badge-blue">Fastify + TypeScript</span>

API REST performante

</div>

<div class="card">

**Frontend**
<span class="badge badge-green">React + Vite</span>

Interface utilisateur moderne

</div>

<div class="card">

**MySQL**
<span class="badge badge-orange">Base de test</span>

Support MySQL natif

</div>

<div class="card">

**PostgreSQL**
<span class="badge badge-blue">Base de test</span>

Support PostgreSQL natif

</div>

</div>

<div class="card" style="margin-top: 20px;">

**Scheduler**
<span class="badge badge-green">Alpine + Cron</span>

Automatisation des backups horaires

</div>

---

# <span class="title-accent"></span>📊 Vue d'ensemble

<div style="text-align: center; margin: 40px 0;">

```
Frontend (React) 
    ↓ HTTP REST API
Backend (Fastify)
    ↓
MySQL (mysqldump) | PostgreSQL (pg_dump)
    ↓
Scheduler (Cron - Backups horaires)
```

</div>

<div style="text-align: center; margin-top: 30px;">

<span class="badge badge-blue">TypeScript</span> pour la sécurité de types

<span class="badge badge-green">Architecture REST</span> avec séparation des couches

</div>

---

# <span class="title-accent"></span>🔌 API REST

## <span class="highlight-blue">13 Endpoints</span> Documentés

<div class="grid-2">

<div>

### Gestion des Bases
- `GET /databases`
- `POST /databases`
- `GET /databases/available`

### Backups
- `POST /backup/:id`
- `POST /backup-all`
- `GET /backups/:id`

</div>

<div>

### Restauration & Versions
- `POST /restore/:versionId`
- `POST /versions/:versionId/pin`
- `POST /versions/:versionId/unpin`
- `GET /versions/:versionId/download`
- `DELETE /versions/:versionId`

### Monitoring
- `GET /health`
- `GET /scheduler/heartbeat`

</div>

</div>

---

# <span class="title-accent"></span>🎨 Interface Utilisateur

<div class="grid-2">

<div>

## Design Moderne

- ✅ <span class="highlight-blue">Gradient</span> noir avec glassmorphism
- ✅ <span class="highlight-green">Badges</span> et icônes (🐬 MySQL, 🐘 PostgreSQL)
- ✅ <span class="highlight-blue">Animations</span> et transitions fluides
- ✅ <span class="highlight-green">États</span> de chargement
- ✅ <span class="highlight-blue">Design responsive</span>

</div>

<div class="card">

**URL d'accès :**

<span class="badge badge-blue" style="font-size: 1.2em; padding: 12px 20px; margin: 10px 0; display: block; text-align: center;">
http://localhost:5173
</span>

**Thème :**
- Mode sombre (par défaut)
- Mode clair disponible

</div>

</div>

---

# <span class="title-accent"></span>🔐 Sécurité

<div class="grid-2">

<div>

## Mesures Implémentées

1. <span class="badge badge-blue">API Key</span> - Protection des endpoints
2. <span class="badge badge-green">CORS</span> - Configuré pour le frontend
3. <span class="badge badge-blue">Headers sécurisés</span>
4. <span class="badge badge-green">Validation Zod</span> - Toutes les entrées
5. <span class="badge badge-blue">Chiffrement AES-256-GCM</span>
6. <span class="badge badge-orange">Alertes Webhook</span>
7. <span class="badge badge-green">Rétention</span> - 10 versions max

</div>

<div class="card">

**Headers sécurisés :**

```http
X-Frame-Options: DENY
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
```

**Chiffrement :**

Mots de passe chiffrés avec **AES-256-GCM** avant stockage

Clé gérée via variable d'environnement

</div>

</div>

---

# <span class="title-accent"></span>⚙️ Fonctionnalités Avancées

<div class="grid-2">

<div class="card">

## <span class="highlight-green">Backup Automatique</span>

- Scheduler exécute les backups **toutes les heures**
- Configurable via crontab
- Heartbeat pour monitorer l'activité
- Support MAMP MySQL

</div>

<div class="card">

## <span class="highlight-blue">Gestion des Versions</span>

- **Pin/Unpin** - Protéger des versions importantes
- **Download** - Télécharger un backup
- **Politique de rétention** - 10 versions par défaut
- Versions épinglées jamais supprimées

</div>

</div>

---

# <span class="title-accent"></span>🧪 Tests et Qualité

<div class="grid-2">

<div>

## Tests Unitaires

**Backend :**
```bash
cd backend
npm test
```

**Frontend :**
```bash
cd frontend
npm test
```

</div>

<div class="card">

## Résultats

- ✅ <span class="badge badge-green">Health check</span>
- ✅ <span class="badge badge-blue">Protection API Key</span>
- ✅ <span class="badge badge-green">Scheduler heartbeat</span>
- ✅ <span class="badge badge-blue">Tests d'intégration</span>
- ✅ <span class="badge badge-green">Tests de sécurité</span>

**<span class="highlight-green">100% des tests passent</span>** ✓

</div>

</div>

---

# <span class="title-accent"></span>💻 Stack Technique

<div class="grid-3">

<div class="card">

## Backend

- <span class="badge badge-blue">Fastify</span> - Framework performant
- <span class="badge badge-green">TypeScript</span> - Typage statique
- <span class="badge badge-blue">Zod</span> - Validation

</div>

<div class="card">

## Frontend

- <span class="badge badge-green">React</span> - Framework UI
- <span class="badge badge-blue">Vite</span> - Build tool rapide
- <span class="badge badge-green">TypeScript</span> - Typage

</div>

<div class="card">

## DevOps

- <span class="badge badge-orange">Docker</span> - Conteneurisation
- <span class="badge badge-blue">Docker Compose</span> - Orchestration
- <span class="badge badge-green">Alpine Linux</span> - Image légère

</div>

</div>

---

# <span class="title-accent"></span>📈 Statistiques du Projet

<div class="grid-2">

<div>

- ✅ <span class="highlight-blue">13 endpoints REST</span> documentés
- ✅ <span class="highlight-green">5 services Docker</span> orchestrés
- ✅ <span class="highlight-blue">100% des tests</span> passent
- ✅ <span class="highlight-green">Support</span> MySQL + PostgreSQL

</div>

<div>

- ✅ <span class="highlight-blue">Automatisation</span> complète via cron
- ✅ <span class="highlight-green">Sécurité</span> : API Key + headers
- ✅ <span class="highlight-blue">Monitoring</span> : heartbeat + alertes
- ✅ <span class="highlight-green">Chiffrement</span> AES-256-GCM

</div>

</div>

---

# <span class="title-accent"></span>🎓 Compétences Démontrées

<div class="grid-3">

<div class="card">

## Backend

- ✅ Architecture REST propre
- ✅ Sécurité (API Key, validation)
- ✅ Tests unitaires
- ✅ Code TypeScript typé
- ✅ Gestion d'erreurs

</div>

<div class="card">

## Frontend

- ✅ Interface React moderne
- ✅ Design responsive
- ✅ Intégration API
- ✅ Gestion d'état
- ✅ UX optimisée

</div>

<div class="card">

## DevOps

- ✅ Docker & Docker Compose
- ✅ Orchestration de services
- ✅ Volumes persistants
- ✅ CI/CD avec GitHub Actions
- ✅ Documentation complète

</div>

</div>

---

# <span class="title-accent"></span>🚀 Démonstration

<div class="grid-2">

<div class="card">

## URLs d'accès

- <span class="badge badge-blue">API</span> : http://localhost:8080
- <span class="badge badge-green">Frontend</span> : http://localhost:5173
- <span class="badge badge-blue">Health</span> : http://localhost:8080/health

</div>

<div class="card">

## Fonctionnalités à montrer

1. Ajouter une base de données
2. Créer un backup manuel
3. Gérer les versions (pin/unpin)
4. Restaurer une version

</div>

</div>

---

# <span class="title-accent"></span>🔄 Flux de Données

<div class="grid-2">

<div class="card">

## Ajout d'une base

```
Frontend → POST /databases 
→ Validation → Store → JSON
```

</div>

<div class="card">

## Backup

```
API → mysqldump/pg_dump 
→ Fichier SQL → Store
```

</div>

<div class="card">

## Restauration

```
API → mysql/psql < backup.sql 
→ Base restaurée
```

</div>

<div class="card">

## Scheduler

```
Cron (1h) → backup_all.sh 
→ POST /backup-all
```

</div>

</div>

---

# <span class="title-accent"></span>📝 Stockage des Données

<div class="grid-2">

<div class="card">

## Format JSON (file-based)

- **databases.json** - Liste des bases
- **versions.json** - Métadonnées des backups
- **scheduler.json** - État du scheduler

</div>

<div class="card">

## Structure des backups

```
backups/
  └── {database-id}/
      └── {database-name}_{timestamp}.sql
```

**Simple et efficace pour un MVP**

</div>

</div>

---

# <span class="title-accent"></span>🎯 Points Forts

<div class="grid-2">

<div>

1. <span class="highlight-blue">Complétude</span> - Solution end-to-end fonctionnelle
2. <span class="highlight-green">Sécurité</span> - API Key, validation, headers sécurisés
3. <span class="highlight-blue">Automatisation</span> - Scheduler avec cron

</div>

<div>

4. <span class="highlight-green">Flexibilité</span> - Support MySQL + PostgreSQL
5. <span class="highlight-blue">Modernité</span> - Design à la pointe
6. <span class="highlight-green">Maintenabilité</span> - Code testé et documenté

</div>

</div>

---

# <span class="title-accent"></span>🔮 Évolutions Futures

<div class="grid-2">

<div>

1. <span class="badge badge-blue">Base de données relationnelle</span> - Migrer de JSON vers PostgreSQL
2. <span class="badge badge-green">Authentification utilisateurs</span> - Système de login/roles
3. <span class="badge badge-blue">Compression</span> - Gzip des backups

</div>

<div>

4. <span class="badge badge-green">Chiffrement</span> - Chiffrer les backups sensibles
5. <span class="badge badge-blue">Monitoring</span> - Dashboard avec métriques
6. <span class="badge badge-green">Notifications</span> - Email/SMS en plus des webhooks

</div>

</div>

---

# <span class="title-accent"></span>❓ Questions & Réponses

<div class="grid-2">

<div class="card">

## Pourquoi Fastify plutôt qu'Express ?

**R:** Fastify est plus performant et offre une meilleure validation native.

</div>

<div class="card">

## Pourquoi stocker en JSON ?

**R:** Simplification pour le MVP. Une vraie base serait le prochain pas.

</div>

<div class="card">

## Sécurité des mots de passe ?

**R:** Chiffrés avec AES-256-GCM avant stockage. Clé via variable d'environnement.

</div>

</div>

---

# <span class="title-accent"></span>🎉 Conclusion

## SafeBase est une solution complète et opérationnelle

<div class="grid-2">

<div>

- ✅ Répond à tous les objectifs du cahier des charges
- ✅ Prête pour la production avec des améliorations possibles

</div>

<div>

- ✅ Code testé, documenté et maintenable
- ✅ Architecture moderne et scalable

</div>

</div>

<div style="text-align: center; margin-top: 40px;">

**<span class="highlight-blue">Merci pour votre attention !</span>** 🙏

</div>

---

# <span class="title-accent"></span>📞 Contact & Ressources

<div class="grid-2">

<div class="card">

## Documentation

- **README.md** - Documentation technique
- **docs/SOUTENANCE.md** - Guide de soutenance
- **docs/ARCHITECTURE.md** - Architecture détaillée

</div>

<div class="card">

## Démarrage

```bash
./scripts/LANCER-PROJET.sh
```

**Questions ?** 💬

</div>

</div>
