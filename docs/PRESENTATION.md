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
    --bg-gradient: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
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
    font-size: 3.5em;
    font-weight: 800;
    color: var(--text-main);
    margin-bottom: 0.2em;
  }

  h2 {
    font-size: 2em;
    color: var(--blue);
    margin-bottom: 0.8em;
    font-weight: 700;
  }

  h3 {
    font-size: 1.4em;
    color: var(--text-main);
    margin-bottom: 0.5em;
    font-weight: 600;
    border-bottom: 2px solid var(--blue);
    display: inline-block;
    padding-bottom: 5px;
  }

  p, li {
    font-size: 1.2em;
    line-height: 1.5;
    color: var(--text-main);
    margin-bottom: 0.5em;
  }

  strong {
    color: var(--blue);
    font-weight: 700;
  }

  .card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    margin-bottom: 20px;
  }
  
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
  }

  .icon {
    font-size: 2em;
    margin-bottom: 10px;
    display: block;
  }

  .highlight {
    background-color: #eff6ff;
    padding: 2px 5px;
    border-radius: 4px;
    color: var(--blue);
    font-weight: 600;
  }

---

<!-- _class: lead -->

# SafeBase
## Sauvegardez vos données, dormez tranquille.

**"Parce qu'un DROP DATABASE est vite arrivé..."**

---

# 1. Le Problème

Pourquoi ce projet ?

<div class="grid-2">

<div class="card">
<span class="icon">⚠️</span>
<h3>Risques Majeurs</h3>

*   **Erreur humaine** : Suppression accidentelle.
*   **Panne système** : Crash serveur.
*   **Cyberattaque** : Ransomware.
</div>

<div class="card">
<span class="icon">😫</span>
<h3>Gestion Manuelle</h3>

*   C'est **long** et fastidieux.
*   On **oublie** souvent de le faire.
*   C'est **compliqué** à restaurer.
</div>

</div>

---

# 2. La Solution : SafeBase

Une plateforme web simple pour tout gérer.

<div class="grid-2">

<div class="card">
<span class="icon">✅</span>
<h3>Automatique</h3>

SafeBase sauvegarde vos bases de données **toutes les heures**, sans que vous n'ayez rien à faire.
</div>

<div class="card">
<span class="icon">🖱️</span>
<h3>Simple</h3>

Une interface graphique claire pour **sauvegarder** et **restaurer** en un clic. Fini les lignes de commande !
</div>

</div>

---

# 3. Comment ça marche ?

<div class="grid-2">

<div>
<h3>🛠️ Architecture Docker</h3>

Le projet est composé de 5 services isolés :
1.  **Backend** (API Node.js)
2.  **Frontend** (Interface React)
3.  **Scheduler** (Planificateur)
4.  **MySQL** (Base de test)
5.  **PostgreSQL** (Base de test)
</div>

<div>
<h3>🔄 Flux de données</h3>

1.  Le **Scheduler** lance un backup.
2.  L'**API** crée un fichier SQL (`mysqldump`).
3.  Le fichier est **stocké** et sécurisé.
4.  L'utilisateur peut le **restaurer** via l'interface.
</div>

</div>

---

# 4. Fonctionnalités Clés

Ce que vous pouvez faire avec SafeBase :

*   📅 **Planification** : Sauvegardes automatiques horaires.
*   🗂️ **Versions** : Historique des 10 dernières sauvegardes.
*   📌 **Épingler** : Garder une version importante indéfiniment.
*   🔙 **Restauration** : Remettre la base en état en 1 clic.
*   📥 **Téléchargement** : Récupérer le fichier SQL sur votre poste.

---

# 5. Sécurité

Vos données sont précieuses, on les protège.

<div class="grid-2">

<div class="card">
<span class="icon">🔒</span>
<h3>Chiffrement</h3>

Les mots de passe de connexion à vos bases de données sont **chiffrés** (AES-256) avant d'être enregistrés.
</div>

<div class="card">
<span class="icon">🛡️</span>
<h3>Validation</h3>

Toutes les données envoyées à l'API sont **vérifiées** strictement pour éviter les piratages (injections SQL, etc.).
</div>

</div>

---

# 6. Technologies Utilisées

Une stack moderne et performante.

<div class="grid-2">

<div>
<h3>Backend</h3>

*   **Node.js** & **Fastify** : Rapidité.
*   **TypeScript** : Fiabilité du code.
*   **Zod** : Validation des données.
</div>

<div>
<h3>Frontend</h3>

*   **React** : Interface dynamique.
*   **Vite** : Outil de build rapide.
*   **CSS Modules** : Styles propres.
</div>

</div>

---

# 7. Démonstration

Place à la pratique !

<div class="card">
<h3>🎯 Scénario</h3>

1.  On ajoute une base de données à SafeBase.
2.  On lance une sauvegarde manuelle.
3.  On supprime des données (aïe !).
4.  On restaure la sauvegarde : tout est revenu ! 🎉
</div>

---

# Conclusion

SafeBase remplit tous les objectifs :

*   ✅ **Compatible** MySQL et PostgreSQL.
*   ✅ **Automatisé** et fiable.
*   ✅ **Sécurisé** (Chiffrement).
*   ✅ **Facile à utiliser** (Interface Web).

**Un outil indispensable pour ne plus jamais perdre de données.**

---

<!-- _class: lead -->

# Merci !

### Avez-vous des questions ?

<br>
<small>Documentation complète disponible sur le dépôt GitHub.</small>
