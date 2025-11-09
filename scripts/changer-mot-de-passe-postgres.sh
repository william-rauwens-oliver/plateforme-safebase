#!/bin/bash
echo "🔐 Changer le mot de passe PostgreSQL"
echo "======================================"
echo ""

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé ou pas dans le PATH"
    echo "   Installez PostgreSQL avec: brew install postgresql@15"
    exit 1
fi

echo "📌 Informations actuelles:"
echo "   - Utilisateur: postgres"
echo "   - Port: 5432"
echo "   - Hôte: localhost"
echo ""

# Demander le nouveau mot de passe
read -sp "Entrez le nouveau mot de passe pour l'utilisateur 'postgres': " NEW_PASSWORD
echo ""
read -sp "Confirmez le mot de passe: " CONFIRM_PASSWORD
echo ""

if [ "$NEW_PASSWORD" != "$CONFIRM_PASSWORD" ]; then
    echo "❌ Les mots de passe ne correspondent pas"
    exit 1
fi

if [ -z "$NEW_PASSWORD" ]; then
    echo "❌ Le mot de passe ne peut pas être vide"
    exit 1
fi

echo ""
echo "🔄 Changement du mot de passe..."

# Méthode 1: Se connecter sans mot de passe (si trust auth)
if psql -h localhost -p 5432 -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD '$NEW_PASSWORD';" 2>/dev/null; then
    echo "✅ Mot de passe changé avec succès !"
    echo ""
    echo "📝 Nouveau mot de passe: $NEW_PASSWORD"
    echo ""
    echo "💡 Utilisez ce mot de passe dans SafeBase pour PostgreSQL"
    exit 0
fi

# Méthode 2: Via fichier pg_hba.conf temporairement en trust
echo "⚠️  Connexion directe échouée. Tentative avec modification pg_hba.conf..."

PG_HBA_PATH=""
if [ -f "/opt/homebrew/var/postgresql@15/pg_hba.conf" ]; then
    PG_HBA_PATH="/opt/homebrew/var/postgresql@15/pg_hba.conf"
elif [ -f "/usr/local/var/postgresql@15/pg_hba.conf" ]; then
    PG_HBA_PATH="/usr/local/var/postgresql@15/pg_hba.conf"
elif [ -f "/opt/homebrew/var/postgres/pg_hba.conf" ]; then
    PG_HBA_PATH="/opt/homebrew/var/postgres/pg_hba.conf"
elif [ -f "/usr/local/var/postgres/pg_hba.conf" ]; then
    PG_HBA_PATH="/usr/local/var/postgres/pg_hba.conf"
fi

if [ -z "$PG_HBA_PATH" ]; then
    echo "❌ Impossible de trouver pg_hba.conf"
    echo ""
    echo "🔍 Essayez de trouver le fichier manuellement:"
    echo "   find ~ -name pg_hba.conf 2>/dev/null"
    echo ""
    echo "📝 Ou changez le mot de passe manuellement:"
    echo "   1. Trouvez pg_hba.conf"
    echo "   2. Changez 'md5' ou 'scram-sha-256' en 'trust' pour localhost"
    echo "   3. Redémarrez PostgreSQL: brew services restart postgresql@15"
    echo "   4. Exécutez: psql -U postgres -c \"ALTER USER postgres WITH PASSWORD 'votre_mot_de_passe';\""
    echo "   5. Remettez 'md5' ou 'scram-sha-256' dans pg_hba.conf"
    echo "   6. Redémarrez PostgreSQL"
    exit 1
fi

echo "📁 Fichier trouvé: $PG_HBA_PATH"
echo "⚠️  Ce script va modifier temporairement pg_hba.conf"
read -p "Continuer ? (o/N): " CONFIRM
if [ "$CONFIRM" != "o" ] && [ "$CONFIRM" != "O" ]; then
    echo "❌ Annulé"
    exit 1
fi

# Sauvegarder
cp "$PG_HBA_PATH" "${PG_HBA_PATH}.backup"
echo "✅ Backup créé: ${PG_HBA_PATH}.backup"

# Modifier temporairement en trust
sed -i '' 's/^host.*127\.0\.0\.1.*md5/host    all             all             127.0.0.1\/32            trust/' "$PG_HBA_PATH"
sed -i '' 's/^host.*127\.0\.0\.1.*scram-sha-256/host    all             all             127.0.0.1\/32            trust/' "$PG_HBA_PATH"

# Redémarrer PostgreSQL
echo "🔄 Redémarrage de PostgreSQL..."
brew services restart postgresql@15 2>/dev/null || brew services restart postgresql 2>/dev/null || echo "⚠️  Redémarrez PostgreSQL manuellement"

sleep 3

# Changer le mot de passe
if psql -h localhost -p 5432 -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD '$NEW_PASSWORD';" 2>/dev/null; then
    echo "✅ Mot de passe changé !"
    
    # Restaurer pg_hba.conf
    cp "${PG_HBA_PATH}.backup" "$PG_HBA_PATH"
    echo "✅ pg_hba.conf restauré"
    
    # Redémarrer à nouveau
    brew services restart postgresql@15 2>/dev/null || brew services restart postgresql 2>/dev/null || echo "⚠️  Redémarrez PostgreSQL manuellement"
    
    echo ""
    echo "✅ Mot de passe changé avec succès !"
    echo "📝 Nouveau mot de passe: $NEW_PASSWORD"
    echo ""
    echo "💡 Utilisez ce mot de passe dans SafeBase pour PostgreSQL"
else
    echo "❌ Échec du changement de mot de passe"
    echo "🔄 Restauration de pg_hba.conf..."
    cp "${PG_HBA_PATH}.backup" "$PG_HBA_PATH"
    brew services restart postgresql@15 2>/dev/null || brew services restart postgresql 2>/dev/null
    exit 1
fi

