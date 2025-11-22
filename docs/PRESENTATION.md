---
marp: true
theme: default
paginate: true
header: 'SafeBase - Soutenance'
footer: 'Présentation du Projet'
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
  
  :root {
    --blue: #2563eb;
    --green: #059669;
    --purple: #7c3aed;
    --orange: #d97706;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
  
  section {
    font-family: 'Inter', sans-serif;
    background: var(--bg-gradient);
    color: var(--text-main);
    padding: 60px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    font-size: 4em;
    font-weight: 800;
    background: linear-gradient(to right, var(--blue), var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.2em;
  }

  h2 {
    font-size: 2.2em;
    color: var(--text-main);
    margin-bottom: 0.8em;
    font-weight: 700;
  }

  h3 {
    font-size: 1.4em;
    color: var(--blue);
    margin-bottom: 0.5em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p, li {
    font-size: 1.2em;
    line-height: 1.6;
    color: var(--text-main);
    margin-bottom: 0.5em;
  }

  strong {
    color: var(--blue);
    font-weight: 700;
  }

  .card {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    border-left: 6px solid var(--blue);
    margin-bottom: 20px;
  }
  
  .card.green { border-color: var(--green); }
  .card.purple { border-color: var(--purple); }
  .card.orange { border-color: var(--orange); }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
  }
  
  .badge {
    display: inline-block;
    padding: 8px 16px;
    background: #eff6ff;
    color: var(--blue);
    border-radius: 99px;
    font-weight: 600;
    font-size: 0.9em;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #dbeafe;
  }

  code {
    background: #1e293b;
    color: #e2e8f0;
    padding: 4px 8px;
    border-radius: 6px;
    font-family: monospace;
  }
  
  .intro-text {
    font-size: 1.5em;
    color: var(--text-muted);
    max-width: 800px;
  }

---

<!-- _class: lead -->

# SafeBase
## La solution de sauvegarde automatisée

**"Parce qu'un DROP DATABASE est vite arrivé..."**

---

# 1. Le Problème

<div class="grid-2">

<div>

### ⚠️ Les risques
Les données sont le cœur de l'entreprise. Une perte de données peut être catastrophique :
- Erreur humaine (suppression accidentelle)
- Panne système
- Cyberattaque

</div>

<div class="card orange">

### 🚫 La gestion manuelle
Actuellement, faire des backups manuellement est :
1. **Fastidieux** : Il faut penser à le faire.
2. **Risqué** : On peut oublier ou se tromper.
3. **Complexe** : Restaurer demande des compétences techniques.

</div>

</div>

---

# 2. Notre Solution : SafeBase

<p class="intro-text">
SafeBase est une plateforme web complète qui automatise la sécurisation de vos bases de données MySQL et PostgreSQL.
</p>

<div class="grid-2">

<div class="card green">
<strong>✅ Automatisation Totale</strong>
Fini les oublis. SafeBase sauvegarde vos bases toutes les heures grâce à un planificateur intégré.
</div>

<div class="card purple">
<strong>✅ Interface Intuitive</strong>
Gérez vos sauvegardes, surveillez l'état du système et restaurez vos données en quelques clics, sans ligne de commande.
</div>

</div>

---

# 3. Architecture Technique

Nous avons conçu une architecture moderne et modulaire basée sur Docker.

<div class="grid-2">

<div>

### 🛠️ Backend (API)
- **Fastify & TypeScript** : Pour une API rapide et typée.
- **Sécurité** : Validation stricte (Zod) et chiffrement des données sensibles.
- **Rôle** : Orchestre les backups via `mysqldump` et `pg_dump`.

### 🖥️ Frontend (UI)
- **React & Vite** : Interface utilisateur réactive.
- **Expérience** : Tableaux de bord clairs et notifications en temps réel.

</div>

<div class="card blue">

### 🐳 Conteneurisation
Le projet tourne entièrement sous **Docker** :
1. `backend` (Node.js)
2. `frontend` (Nginx/Vite)
3. `scheduler` (Cron Alpine)
4. `mysql-db` (Base test)
5. `postgres-db` (Base test)

</div>

</div>

---

# 4. Fonctionnalités Clés

<div class="grid-2">

<div>

### 🔄 Sauvegardes & Versions
- **Planification** : Backups automatiques horaires.
- **Historique** : Conservation des 10 dernières versions.
- **Épinglage** : Protégez ("Pin") des versions importantes pour qu'elles ne soient jamais supprimées.

</div>

<div>

### ⚡ Restauration Rapide
- **One-Click Restore** : Restaurez une base de données complète en un seul clic.
- **Sécurité** : Vérification automatique avant restauration pour éviter les erreurs.

</div>

</div>

---

# 5. Sécurité & Fiabilité

La sécurité a été une priorité tout au long du développement.

<div class="grid-2">

<div class="card purple">

### 🔒 Protection des Données
- **Chiffrement** : Les mots de passe des bases de données sont chiffrés (AES-256) avant stockage.
- **Validation** : Toutes les entrées API sont vérifiées avec Zod pour éviter les injections.

</div>

<div class="card green">

### 🛡️ Fiabilité
- **Tests Unitaires** : Couverture à 100% sur les fonctions critiques (Backend & Frontend).
- **Monitoring** : Système de "Heartbeat" pour vérifier que le planificateur fonctionne.

</div>

</div>

---

# 6. Stack Technique

Les technologies choisies pour performance et maintenabilité.

### Backend
<span class="badge">Node.js</span> <span class="badge">Fastify</span> <span class="badge">TypeScript</span> <span class="badge">Zod</span> <span class="badge">MySQL/PG Clients</span>

### Frontend
<span class="badge">React</span> <span class="badge">Vite</span> <span class="badge">CSS Modules</span> <span class="badge">TypeScript</span>

### DevOps
<span class="badge">Docker</span> <span class="badge">Docker Compose</span> <span class="badge">GitHub Actions (CI)</span> <span class="badge">Shell Scripts</span>

---

# 7. Démonstration

Nous allons maintenant voir le projet en action.

<div class="card blue">

### 🎯 Scénario de démo
1. **Enregistrement** : Ajout d'une base de données existante dans SafeBase.
2. **Backup** : Lancement d'une sauvegarde manuelle immédiate.
3. **Incident** : Suppression volontaire de données (simulation d'erreur).
4. **Restauration** : Remise en état de la base grâce à SafeBase.

</div>

---

# Conclusion

SafeBase répond à tous les objectifs du cahier des charges :

1. ✅ **Connexion SGBD** : Support MySQL et PostgreSQL.
2. ✅ **Automatisation** : Scheduler Cron fiable.
3. ✅ **Versions** : Gestion complète (Pin/Delete/Download).
4. ✅ **Interface** : Simple et moderne.
5. ✅ **Qualité** : Code testé et documenté.

**SafeBase transforme une tâche critique et complexe en une opération simple et sécurisée.**

---

<!-- _class: lead -->

# Merci de votre attention

### 📞 Questions / Réponses

<div style="font-size: 0.8em; margin-top: 50px; color: #64748b;">
Projet réalisé par [Votre Nom]<br>
Documentation complète disponible sur GitHub
</div>
