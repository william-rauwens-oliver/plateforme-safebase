# ⚡ Démarrage Simple - SafeBase

## Ras-le-bol des commandes complexes ? Voici 2 façons de démarrer !

---

## 🚀 Méthode 1 : Script Automatique (RECOMMANDÉ)

```bash
# Une seule commande !
./LANCER-PROJET.sh
```

✅ **Tout démarre automatiquement**  
✅ Backend + Frontend  
✅ Vérifications incluses

**URLs :**
- API : http://localhost:8080
- Frontend : http://localhost:5173

**Pour arrêter :**
```bash
pkill -f 'tsx watch'
pkill -f 'vite'
```

---

## 🎯 Méthode 2 : Manuel (2 Terminaux)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Laissez-le tourner

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Laissez-le tourner

**C'est tout !**

---

## 🔍 Vérification

### Backend
```bash
curl http://localhost:8080/health
```
✅ Doit retourner : `{"status":"ok"}`

### Frontend
Ouvrez : http://localhost:5173  
✅ Doit afficher "SafeBase"

---

## 🛑 Arrêter le Projet

### Avec le script
Le script affiche les PIDs à la fin

### Manuellement
```bash
# Dans chaque terminal, Ctrl+C
# OU dans n'importe quel terminal :
pkill -f 'tsx watch'  # Backend
pkill -f 'vite'        # Frontend
```

---

## 🐛 Problèmes Courants

### "Port already in use"
```bash
# Trouver le processus
lsof -ti:8080  # Backend
lsof -ti:5173  # Frontend

# Le tuer
kill $(lsof -ti:8080)
kill $(lsof -ti:5173)
```

### "npm: command not found"
```bash
# Installer Node.js depuis nodejs.org
# Ou vérifier l'installation :
which npm
```

### Le frontend ne charge pas
```bash
cd frontend
npm install  # Réinstaller les dépendances
npm run dev
```

---

## ✅ C'est Bon Quand...

✅ Vous voyez dans le terminal :
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

✅ Vous ouvrez http://localhost:5173 et vous voyez "SafeBase"

✅ Vous avez l'interface avec le formulaire

---

**🎉 Voilà ! Le projet est démarré !**

**Prochaine étape :** Lisez `PRESENTATION-SANS-DOCKER.md` pour la présentation

