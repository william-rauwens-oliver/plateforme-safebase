---
marp: true
theme: default
paginate: true
header: 'SafeBase'
footer: 'Présentation'
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap');

  :root {
    --blue: #3b82f6;
    --green: #10b981;
    --orange: #f59e0b;
    --purple: #8b5cf6;
  }

  section {
    font-family: 'Inter', system-ui, sans-serif;
    background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
    color: #0f172a;
    padding: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    font-size: 4.8rem;
    font-weight: 800;
    letter-spacing: -0.08em;
    margin: 0 0 20px 0;
    background: linear-gradient(135deg, var(--blue), var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h2 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 24px 0;
  }

  p {
    font-size: 1.4rem;
    color: #475569;
    margin: 8px 0;
  }

  ul {
    margin: 16px 0 0 0;
    padding-left: 22px;
    color: #475569;
    font-size: 1.4rem;
  }

  li {
    margin: 8px 0;
  }

  .tagline {
    font-size: 1.4rem;
    color: #64748b;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .card {
    background: #ffffff;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
    border: 1px solid #e5e7eb;
  }

  .badge-row {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .badge {
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #0f172a;
    background: #e5f0ff;
  }

  .badge-blue { background: rgba(59, 130, 246, 0.12); color: #1d4ed8; }
  .badge-green { background: rgba(16, 185, 129, 0.12); color: #047857; }
  .badge-orange { background: rgba(245, 158, 11, 0.12); color: #c05621; }
  .badge-purple { background: rgba(139, 92, 246, 0.12); color: #6d28d9; }

  .big-number {
    font-size: 4.5rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  .big-number-caption {
    font-size: 1.2rem;
    color: #64748b;
  }

  .center {
    text-align: center;
  }

  header, footer {
    color: #94a3b8;
    font-size: 0.9rem;
  }
---

<!-- Slide 1 -->
<!-- _class: lead -->
<!-- _paginate: false -->

# SafeBase

## Plateforme de sauvegarde de bases de données

<p class="tagline">« Parce qu'un DROP DATABASE est vite arrivé... »</p>

---

<!-- Slide 2 -->

# Problème & Objectif

- Une erreur ou un DROP peut faire perdre **toutes les données** en quelques secondes.
- Les sauvegardes manuelles sont **oubliées**, **non testées** ou **mal organisées**.
- Objectif : avoir une solution **simple** pour sauvegarder, restaurer et gérer l'historique des bases.

---

<!-- Slide 3 -->

# Idée de SafeBase

- **Enregistrer** des bases MySQL / PostgreSQL déjà existantes.
- **Planifier automatiquement** les sauvegardes avec cron.
- **Restaurer en 1 clic** une version précédente en cas de problème.

---

<!-- Slide 4 -->

# Architecture globale

<div class="grid-2">

<div>

- Frontend : interface React + Vite.
- Backend : API REST en Fastify + TypeScript.
- Bases de données : MySQL et PostgreSQL.
- Scheduler : conteneur dédié qui lance les backups périodiques.

</div>

<div class="card">

```text
Interface (React)
      ↓
API (Fastify)
      ↓
MySQL / PostgreSQL
      ↓
Scheduler (Cron)
```

</div>

</div>

---

<!-- Slide 5 -->

# Fonctionnalités principales

- Ajouter une **connexion** à une base existante.
- Lancer un **backup manuel** ou **toutes les bases**.
- Voir la **liste des versions** et leur date.
- **Restaurer**, **télécharger** ou **épingler** une version importante.

---

<!-- Slide 6 -->

# Interface utilisateur

<div class="grid-2">

<div>

- Une seule page qui regroupe **tout le flux** : ajout, sauvegarde, versions.
- Design moderne : fond clair, cartes, badges colorés.
- Statut de l'API, thème clair/sombre, messages de succès/erreur.

</div>

<div class="card">

- URL : `http://localhost:5173`
- Action typique :
  - Configurer l'API URL et la clé.
  - Enregistrer une base.
  - Cliquer sur **Backup** puis **Versions**.

</div>

</div>

---

<!-- Slide 7 -->

# Sécurité

- **API Key** obligatoire pour appeler l'API.
- **Validation** des données avec Zod côté backend.
- **Mots de passe chiffrés** (AES‑256‑GCM) avant stockage.
- Headers de sécurité : anti‑iframe, anti‑sniff, politique de referer.

---

<!-- Slide 8 -->

# Backups automatiques

- Un service `scheduler` dédié dans Docker.
- Cron lance un script qui appelle `POST /backup-all` toutes les heures.
- Les fichiers `.sql` sont rangés par base + horodatage.
- Une **règle de rétention** limite le nombre de versions par base.

---

<!-- Slide 9 -->

# Tests & Qualité

<div class="grid-2">

<div>

- Tests backend : santé de l'API, sécurité, flux de sauvegarde.
- Tests frontend : rendu du composant principal, scénarios de base.
- CI/CD GitHub Actions : lancement des tests et du lint à chaque push.

</div>

<div class="card center">

<p class="big-number">100%</p>
<p class="big-number-caption">des tests passent sur la branche principale</p>

</div>

</div>

---

<!-- Slide 10 -->

# Stack technique

<div class="badge-row">
  <span class="badge badge-blue">Fastify</span>
  <span class="badge badge-blue">TypeScript</span>
  <span class="badge badge-blue">Zod</span>
  <span class="badge badge-green">React</span>
  <span class="badge badge-green">Vite</span>
  <span class="badge badge-purple">Docker & Compose</span>
</div>

---

<!-- Slide 11 -->

# Plan de démonstration

- Lancer les services (Docker ou `npm run dev`).
- **1.** Ajouter une base MySQL ou PostgreSQL dans l'interface.
- **2.** Lancer un backup manuel.
- **3.** Ouvrir la liste des versions et en restaurer une.

---

<!-- Slide 12 -->

# Conclusion

- SafeBase apporte une **solution complète** de sauvegarde / restauration.
- L'interface permet de tout piloter **sans ligne de commande**.
- Le projet montre des compétences en **frontend, backend et DevOps**.

---

<!-- Slide 13 -->

# Questions ?

- Documentation : `README.md`, `docs/ARCHITECTURE.md`, `docs/SOUTENANCE.md`.
- Le dépôt GitHub contient tout le code et la configuration Docker.

