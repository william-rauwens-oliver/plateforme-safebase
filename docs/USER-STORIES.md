# 📖 User Stories - SafeBase

## Vue d'Ensemble

Les user stories décrivent les fonctionnalités du point de vue de l'utilisateur final.

## User Stories Principales

### US-1 : Enregistrer une Base de Données
**En tant que** administrateur système  
**Je veux** enregistrer une nouvelle base de données MySQL ou PostgreSQL  
**Afin de** pouvoir la sauvegarder automatiquement

**Critères d'acceptation** :
- ✅ Formulaire avec tous les champs nécessaires
- ✅ Validation de la connexion avant enregistrement
- ✅ Support MySQL et PostgreSQL
- ✅ Message d'erreur clair si la connexion échoue

---

### US-2 : Sauvegarder une Base de Données
**En tant que** administrateur système  
**Je veux** créer une sauvegarde manuelle d'une base de données  
**Afin de** avoir un point de restauration à un moment précis

**Critères d'acceptation** :
- ✅ Bouton "Sauvegarder" sur chaque base
- ✅ Sauvegarde complète avec mysqldump/pg_dump
- ✅ Notification de succès/échec
- ✅ Fichier SQL créé dans le dossier backups

---

### US-3 : Sauvegarder Toutes les Bases
**En tant que** administrateur système  
**Je veux** sauvegarder toutes les bases enregistrées d'un coup  
**Afin de** gagner du temps lors d'une maintenance

**Critères d'acceptation** :
- ✅ Bouton "Sauvegarder toutes les bases"
- ✅ Sauvegarde séquentielle de toutes les bases
- ✅ Feedback sur la progression
- ✅ Notification globale à la fin

---

### US-4 : Consulter l'Historique des Sauvegardes
**En tant que** administrateur système  
**Je veux** voir toutes les versions sauvegardées d'une base  
**Afin de** choisir quelle version restaurer

**Critères d'acceptation** :
- ✅ Modal avec liste des versions
- ✅ Affichage de la date, taille, statut (épinglé)
- ✅ Tri avec versions épinglées en premier
- ✅ Recherche/filtrage possible

---

### US-5 : Restaurer une Version
**En tant que** administrateur système  
**Je veux** restaurer une version spécifique d'une base de données  
**Afin de** revenir à un état antérieur en cas de problème

**Critères d'acceptation** :
- ✅ Bouton "Restaurer" sur chaque version
- ✅ Confirmation avant restauration
- ✅ Restauration avec mysql/psql
- ✅ Notification de succès/échec

---

### US-6 : Épingler une Version
**En tant que** administrateur système  
**Je veux** épingler une version importante  
**Afin de** la protéger de la suppression automatique

**Critères d'acceptation** :
- ✅ Bouton "Épingler" sur chaque version
- ✅ Badge "Épinglé" visible
- ✅ Versions épinglées en haut de la liste
- ✅ Versions épinglées non supprimées automatiquement

---

### US-7 : Télécharger une Sauvegarde
**En tant que** administrateur système  
**Je veux** télécharger un fichier de sauvegarde  
**Afin de** l'archiver ou le restaurer manuellement

**Critères d'acceptation** :
- ✅ Bouton "Télécharger" sur chaque version
- ✅ Téléchargement du fichier SQL
- ✅ Nom de fichier descriptif

---

### US-8 : Supprimer une Version
**En tant que** administrateur système  
**Je veux** supprimer une version de sauvegarde  
**Afin de** libérer de l'espace disque

**Critères d'acceptation** :
- ✅ Bouton "Supprimer" sur les versions non épinglées
- ✅ Confirmation avant suppression
- ✅ Suppression du fichier et des métadonnées
- ✅ Versions épinglées non supprimables

---

### US-9 : Recevoir des Alertes
**En tant que** administrateur système  
**Je veux** recevoir des alertes en cas d'échec de sauvegarde/restauration  
**Afin de** être informé rapidement des problèmes

**Critères d'acceptation** :
- ✅ Webhook configurable
- ✅ Alertes sur backup failed
- ✅ Alertes sur restore failed
- ✅ Logs structurés

---

### US-10 : Sauvegardes Automatiques
**En tant que** administrateur système  
**Je veux** que les sauvegardes se fassent automatiquement  
**Afin de** ne pas avoir à m'en occuper manuellement

**Critères d'acceptation** :
- ✅ Scheduler cron configuré (toutes les heures)
- ✅ Sauvegarde automatique de toutes les bases
- ✅ Heartbeat pour monitoring
- ✅ Logs des exécutions

---

### US-11 : Rechercher et Trier les Bases
**En tant que** utilisateur  
**Je veux** rechercher et trier les bases de données  
**Afin de** trouver rapidement celle que je cherche

**Critères d'acceptation** :
- ✅ Barre de recherche en temps réel
- ✅ Tri par nom, moteur, date
- ✅ Filtrage instantané

---

### US-12 : Changer de Thème
**En tant que** utilisateur  
**Je veux** basculer entre thème clair et sombre  
**Afin de** travailler confortablement selon mes préférences

**Critères d'acceptation** :
- ✅ Toggle thème clair/sombre
- ✅ Préférence sauvegardée dans localStorage
- ✅ Application immédiate

---

## Priorisation

### Priorité Haute (MVP)
- US-1 : Enregistrer une base
- US-2 : Sauvegarder une base
- US-4 : Consulter l'historique
- US-5 : Restaurer une version

### Priorité Moyenne
- US-3 : Sauvegarder toutes les bases
- US-6 : Épingler une version
- US-7 : Télécharger une sauvegarde
- US-10 : Sauvegardes automatiques

### Priorité Basse
- US-8 : Supprimer une version
- US-9 : Recevoir des alertes
- US-11 : Rechercher et trier
- US-12 : Changer de thème

---

**Toutes ces user stories ont été implémentées dans le projet SafeBase.**

