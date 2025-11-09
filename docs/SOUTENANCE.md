# 🎤 Guide de Soutenance - SafeBase

## Préparation (5 minutes avant)

### Checklist
- [ ] Docker est installé et fonctionne
- [ ] Le projet est cloné/prêt
- [ ] Les navigateurs sont ouverts (si démonstration web)
- [ ] Terminal prêt avec plusieurs onglets
- [ ] Connection Internet fonctionnelle (pour télécharger les images Docker si nécessaire)

### Commandes de démarrage
```bash
cd /Applications/MAMP/htdocs/plateforme-safebase
docker compose up --build
```

## Structure de la Présentation (15-20 minutes)

### 1. Introduction (2 min)

**Ce que vous dites :**
- "Je vais présenter SafeBase, une plateforme complète de sauvegarde automatisée"
- "Objectif : éviter les pertes de données critiques"
- "Citation : 'Parce qu'un DROP DATABASE est vite arrivé... SafeBase, I'll be back(up)'"

**À montrer :**
- Le README.md
- La structure du projet

---

### 2. Architecture Technique (3 min)

**Ce que vous dites :**
"Le projet est organisé en 5 composants Docker :"

**À montrer :**
```bash
docker compose ps
```

1. **Backend (API)** : Fastify + TypeScript - API REST
2. **Frontend** : React + Vite - Interface utilisateur  
3. **MySQL** : Base de données de test
4. **PostgreSQL** : Base de données de test
5. **Scheduler** : Alpine + Cron - Automatisation

**Points clés à mentionner :**
- Architecture REST
- Séparation des couches
- Conteneurisation avec Docker Compose
- TypeScript pour la sécurité de types

---

### 3. Démonstration Interface (5 min) ⭐ PIÈCE MAÎTRESSE

**Ouvrir :** http://localhost:5173

#### A. Vue d'ensemble
- "Voici l'interface principale"
- "L'API est accessible (health check OK)"

#### B. Ajouter une base
1. Remplir le formulaire :
   - Nom : "base-production"
   - Engine : MySQL
   - Host : mysql
   - Port : 3306
   - User : safebase
   - Password : safebase
   - Database : safebase
2. Cliquer "Ajouter"
3. "La base apparaît dans la liste"

#### C. Backup manuel
1. Cliquer "Backup" sur une base
2. "Un message de confirmation s'affiche"
3. "Le backup est créé en arrière-plan"

#### D. Gestion des versions
1. Cliquer "Versions/Restore"
2. "Voici la liste des backups"
3. Tester une commande :
   ```
   pin [ID]
   ```
4. "Cette version est maintenant protégée"

---

### 4. Démonstration API (2 min)

**Ouvrir un terminal et montrer :**

```bash
# Vérifier la santé
curl http://localhost:8080/health

# Lister les bases
curl http://localhost:8080/databases | jq .

# Créer un backup
curl -X POST http://localhost:8080/backup-all

# Heartbeat
curl http://localhost:8080/scheduler/heartbeat | jq .
```

**À dire :**
- "L'API expose tous les endpoints REST"
- "Nous avons 13 endpoints au total"
- "Tous sont documentés dans le README"

---

### 5. Tests et Qualité (2 min)

```bash
cd backend
npm test
```

**Résultats attendus :**
```
✓ health
✓ requires API key for protected endpoints when configured
✓ scheduler heartbeat read/write

Test Files  1 passed (1)
     Tests  3 passed (3)
```

**À dire :**
- "Nous avons des tests unitaires"
- "Ils valident la sécurité, le health check, et le scheduler"
- "Code couvert et maintenable"

---

### 6. Sécurité (2 min)

**À montrer :**
- Le fichier `backend/src/server.ts` lignes 20-30
- Les headers sécurisés
- La protection par API Key

**Points à mentionner :**
1. **API Key** pour protéger les endpoints
2. **CORS** configuré pour le frontend
3. **Headers sécurisés** : X-Frame-Options, Referrer-Policy
4. **Validation** des entrées avec Zod
5. **Alertes** webhook en cas d'échec
6. **Rétention** pour limiter l'espace disque

---

### 7. Fonctionnalités Avancées (2 min)

#### Backup automatique
```bash
# Montrer le crontab
cat scheduler/crontab
```

**À dire :**
- "Le scheduler exécute les backups toutes les heures"
- "Configurable via crontab"
- "Heartbeat pour monitorer l'activité"

#### Gestion des versions
- Pin/Unpin pour protéger des versions importantes
- Download pour récupérer un backup
- Politique de rétention (10 versions par défaut)

---

### 8. Fonctionnement Interne (2 min)

**Montrer le code clé :**

```bash
# backend/src/routes.ts - Endpoint de backup
cat backend/src/routes.ts | grep -A 10 "app.post('/backup"
```

**À dire :**
- "Le backup utilise mysqldump ou pg_dump"
- "Les métadonnées sont stockées en JSON"
- "Le Store gère la persistance"

---

### 9. Compétences Démontrées (2 min)

**Récapitulatif :**

✅ **Backend**
- API REST sécurisée
- Architecture en couches
- Tests unitaires
- Gestion des erreurs

✅ **Frontend**
- Interface utilisateur
- Intégration API
- Gestion d'état

✅ **DevOps**
- Docker & Docker Compose
- Orchestration de services
- Volumes pour persistance

✅ **Sécurité**
- API Key
- Validation des données
- Headers sécurisés

---

### 10. Conclusion (1 min)

**À dire :**
- "SafeBase est une solution complète et opérationnelle"
- "Répond à tous les objectifs du cahier des charges"
- "Prête pour la production avec des améliorations possibles"

**Possibles questions :**
- Comment migrer vers une vraie base de données ?
- Comment ajouter l'authentification ?
- Comment sauvegarder vers le cloud ?
- Comment monitorer les performances ?

---

## Questions Probables et Réponses

### Q: "Pourquoi avoir choisi Fastify plutôt qu'Express ?"
**R:** "Fastify est plus performant et offre une meilleure validation native. Idéal pour une API REST."

### Q: "Pourquoi stocker les métadonnées en JSON au lieu d'une vraie base ?"
**R:** "Simplification pour le MVP. Une vraie base de données serait le prochain pas pour la production."

### Q: "Comment gérez-vous la sécurité des mots de passe ?"
**R:** "Actuellement stockés en clair dans la config. En production, il faudrait les chiffrer ou utiliser des secrets Docker."

### Q: "Que se passe-t-il si plusieurs backups échouent ?"
**R:** "Le système envoie des alertes via webhook. Les logs Docker permettent le debugging."

### Q: "Comment tester la restauration sans perdre de données ?"
**R:** "En utilisant des bases de test dédiées. Les vrais environnements restent intouchés."

---

## Dépannage Rapide

### Si Docker ne démarre pas
```bash
docker compose down
docker compose up --build
```

### Si le frontend ne charge pas
```bash
cd frontend
npm install
npm run dev
```

### Si l'API est down
```bash
cd backend
npm run dev
```

### Si les tests échouent
```bash
cd backend
npm run build
npm test
```

---

## 📊 Métriques à Mentionner

- ✅ **13 endpoints REST** documentés
- ✅ **5 services Docker** orchestrés
- ✅ **100% des tests** passent
- ✅ **Support** MySQL + PostgreSQL
- ✅ **Automatisation** complète via cron
- ✅ **Sécurité** : API Key + headers
- ✅ **Monitoring** : heartbeat + alertes

---

**Bonne chance pour votre soutenance ! 🚀**

