---
marp: true
theme: default
paginate: true
header: 'SafeBase - Plateforme de Sauvegarde'
footer: 'Présentation Projet'
style: |
  section {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  h1 {
    color: white;
    font-size: 3em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  h2 {
    color: #ffd700;
    font-size: 2em;
  }
  code {
    background: rgba(0,0,0,0.3);
    padding: 2px 6px;
    border-radius: 3px;
  }
---

# SafeBase
## Plateforme de Sauvegarde Automatisée

**Parce qu'un DROP DATABASE est vite arrivé...**
**SafeBase, I'll be back(up)** 💾

---

# 🎯 Objectif du Projet

Développer une **plateforme complète** de sauvegarde automatisée pour :

- ✅ Bases de données **MySQL** et **PostgreSQL**
- ✅ API REST sécurisée
- ✅ Interface utilisateur moderne
- ✅ Scheduler automatisé (cron)
- ✅ Gestion des versions de backups
- ✅ Tests unitaires
- ✅ Conteneurisation Docker

---

# 🏗️ Architecture Technique

## 5 Composants Docker

1. **Backend (API)** : Fastify + TypeScript - API REST
2. **Frontend** : React + Vite - Interface utilisateur  
3. **MySQL** : Base de données de test
4. **PostgreSQL** : Base de données de test
5. **Scheduler** : Alpine + Cron - Automatisation

**Architecture REST avec séparation des couches**

---

# 📊 Vue d'ensemble de l'Architecture

```
Frontend (React) 
    ↓ HTTP REST API
Backend (Fastify)
    ↓
MySQL (mysqldump) | PostgreSQL (pg_dump)
    ↓
Scheduler (Cron - Backups horaires)
```

**TypeScript pour la sécurité de types**

---

# 🔌 API REST - 13 Endpoints

## Gestion des Bases
- `GET /databases` - Liste des bases
- `POST /databases` - Ajouter une base
- `GET /databases/available` - Bases disponibles (MySQL/PostgreSQL)

## Backups
- `POST /backup/:id` - Backup d'une base
- `POST /backup-all` - Backup de toutes les bases
- `GET /backups/:id` - Liste des versions

## Restauration & Versions
- `POST /restore/:versionId` - Restaurer
- `POST /versions/:versionId/pin` - Épingler
- `POST /versions/:versionId/unpin` - Désépingler
- `GET /versions/:versionId/download` - Télécharger
- `DELETE /versions/:versionId` - Supprimer

## Monitoring
- `GET /health` - Santé de l'API
- `GET /scheduler/heartbeat` - État du scheduler

---

# 🎨 Interface Utilisateur

## Design Moderne

- ✅ Gradient violet avec glassmorphism
- ✅ Badges et icônes (🐬 MySQL, 🐘 PostgreSQL)
- ✅ Animations et transitions fluides
- ✅ États de chargement
- ✅ Design responsive

**URL : http://localhost:5173**

---

# 🔐 Sécurité

## Mesures Implémentées

1. **API Key** - Protection des endpoints
2. **CORS** - Configuré pour le frontend
3. **Headers sécurisés** :
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: no-referrer`
   - `X-Content-Type-Options: nosniff`
4. **Validation** - Zod pour toutes les entrées
5. **Chiffrement** - Mots de passe chiffrés (AES-256-GCM)
6. **Alertes** - Webhook en cas d'échec
7. **Rétention** - Limite l'espace disque (10 versions)

---

# ⚙️ Fonctionnalités Avancées

## Backup Automatique

- Scheduler exécute les backups **toutes les heures**
- Configurable via crontab
- Heartbeat pour monitorer l'activité

## Gestion des Versions

- **Pin/Unpin** - Protéger des versions importantes
- **Download** - Télécharger un backup
- **Politique de rétention** - 10 versions par défaut
- Versions épinglées jamais supprimées

---

# 🧪 Tests et Qualité

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

**Résultats :**
- ✅ Health check
- ✅ Protection API Key
- ✅ Scheduler heartbeat
- ✅ Tests d'intégration
- ✅ Tests de sécurité

**100% des tests passent** ✓

---

# 💻 Stack Technique

## Backend
- **Fastify** - Framework performant
- **TypeScript** - Typage statique
- **Zod** - Validation des données

## Frontend
- **React** - Framework UI
- **Vite** - Build tool rapide
- **TypeScript** - Typage

## DevOps
- **Docker & Docker Compose** - Conteneurisation
- **Alpine Linux** - Image légère pour scheduler

---

# 📈 Statistiques du Projet

- ✅ **13 endpoints REST** documentés
- ✅ **5 services Docker** orchestrés
- ✅ **100% des tests** passent
- ✅ **Support** MySQL + PostgreSQL
- ✅ **Automatisation** complète via cron
- ✅ **Sécurité** : API Key + headers
- ✅ **Monitoring** : heartbeat + alertes

---

# 🎓 Compétences Démontrées

## Backend
✅ Architecture REST propre  
✅ Sécurité (API Key, validation)  
✅ Tests unitaires  
✅ Code TypeScript typé  
✅ Gestion d'erreurs  

## Frontend
✅ Interface React moderne  
✅ Design responsive  
✅ Intégration API  

## DevOps
✅ Docker & Docker Compose  
✅ Orchestration de services  
✅ Volumes persistants  

---

# 🚀 Démonstration

## URLs d'accès

- **API** : http://localhost:8080
- **Frontend** : http://localhost:5173
- **Health Check** : http://localhost:8080/health

## Fonctionnalités à montrer

1. Ajouter une base de données
2. Créer un backup manuel
3. Gérer les versions (pin/unpin)
4. Restaurer une version

---

# 🔄 Flux de Données

## Ajout d'une base
```
Frontend → POST /databases → Validation → Store → JSON
```

## Backup
```
API → mysqldump/pg_dump → Fichier SQL → Store
```

## Restauration
```
API → mysql/psql < backup.sql → Base restaurée
```

## Scheduler
```
Cron (1h) → backup_all.sh → POST /backup-all
```

---

# 📝 Stockage des Données

## Format JSON (file-based)

- **databases.json** - Liste des bases enregistrées
- **versions.json** - Métadonnées des backups
- **scheduler.json** - État du scheduler

## Structure des backups

```
backups/
  └── {database-id}/
      └── {database-name}_{timestamp}.sql
```

**Simple et efficace pour un MVP**

---

# 🎯 Points Forts

1. **Complétude** - Solution end-to-end fonctionnelle
2. **Sécurité** - API Key, validation, headers sécurisés
3. **Automatisation** - Scheduler avec cron
4. **Flexibilité** - Support MySQL + PostgreSQL
5. **Modernité** - Design à la pointe
6. **Maintenabilité** - Code testé et documenté

---

# 🔮 Évolutions Futures

1. **Base de données relationnelle** - Migrer de JSON vers PostgreSQL
2. **Authentification utilisateurs** - Système de login/roles
3. **Compression** - Gzip des backups
4. **Chiffrement** - Chiffrer les backups sensibles
5. **Monitoring** - Dashboard avec métriques
6. **Notifications** - Email/SMS en plus des webhooks

---

# ❓ Questions & Réponses

## Pourquoi Fastify plutôt qu'Express ?
**R:** Fastify est plus performant et offre une meilleure validation native.

## Pourquoi stocker en JSON au lieu d'une vraie base ?
**R:** Simplification pour le MVP. Une vraie base serait le prochain pas.

## Comment gérez-vous la sécurité des mots de passe ?
**R:** Les mots de passe sont chiffrés avec AES-256-GCM avant stockage. La clé de chiffrement est gérée via variable d'environnement.

---

# 🎉 Conclusion

## SafeBase est une solution complète et opérationnelle

- ✅ Répond à tous les objectifs du cahier des charges
- ✅ Prête pour la production avec des améliorations possibles
- ✅ Code testé, documenté et maintenable
- ✅ Architecture moderne et scalable

**Merci pour votre attention !** 🙏

---

# 📞 Contact & Ressources

## Documentation

- **README.md** - Documentation technique complète
- **docs/SOUTENANCE.md** - Guide de soutenance
- **docs/ARCHITECTURE.md** - Architecture détaillée

## Démarrage

```bash
./scripts/LANCER-PROJET.sh
```

**Questions ?** 💬

