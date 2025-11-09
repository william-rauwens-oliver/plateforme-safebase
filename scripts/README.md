# 🔧 Scripts SafeBase

Ce dossier contient tous les scripts utilitaires du projet.

## 📜 Scripts Disponibles

### Scripts de Test
- **test-fonctionnalites.sh** - Teste toutes les fonctionnalités de l'API
- **test-scheduler.sh** - Teste le scheduler et les sauvegardes automatiques

### Scripts de Démarrage
- **LANCER-PROJET.sh** - Lance le projet (backend + frontend)

### Scripts de Maintenance
- **corriger-mamp.sh** - Corrige les permissions MySQL MAMP

## 🚀 Utilisation

Tous les scripts sont exécutables. Pour les utiliser :

```bash
# Rendre exécutable (si nécessaire)
chmod +x scripts/nom-du-script.sh

# Exécuter
./scripts/nom-du-script.sh
```

## 📝 Notes

- Les scripts utilisent `bash` et nécessitent les outils standards (curl, jq, etc.)
- Certains scripts nécessitent des permissions spécifiques (sudo pour corriger-mamp.sh)

