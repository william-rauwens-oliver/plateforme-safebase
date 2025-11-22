#!/bin/bash
# Script pour donner les permissions nécessaires à l'utilisateur postgres sur une base PostgreSQL
# IMPORTANT: Ce script doit être exécuté en tant que propriétaire de la base (superuser)

echo "=== Fix des permissions PostgreSQL ==="
echo ""

# Paramètres (modifiez selon votre configuration)
DB_NAME="${1:-fittracker}"
DB_USER="${2:-postgres}"
DB_HOST="${3:-127.0.0.1}"
DB_PORT="${4:-5432}"
OWNER_USER="${5:-WilliamPro}"  # Propriétaire des tables (modifiez selon votre cas)

echo "Base de données: $DB_NAME"
echo "Utilisateur à qui donner les permissions: $DB_USER"
echo "Propriétaire des tables: $OWNER_USER"
echo "Hôte: $DB_HOST"
echo "Port: $DB_PORT"
echo ""
echo "⚠️  IMPORTANT: Ce script doit être exécuté en tant que propriétaire de la base ($OWNER_USER) ou superuser"
echo ""

# Commande SQL pour donner les permissions
# Utiliser le propriétaire pour donner les permissions
SQL_COMMANDS="
-- Donner les permissions SELECT sur toutes les tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO $DB_USER;
"

echo "Exécution des commandes SQL en tant que $OWNER_USER..."
echo ""

# Exécuter les commandes avec le propriétaire
# Note: Vous devrez peut-être modifier PGPASSWORD pour le propriétaire
PGPASSWORD="${PGPASSWORD_OWNER:-${PGPASSWORD:-root}}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$OWNER_USER" -d "$DB_NAME" <<EOF
$SQL_COMMANDS
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Permissions accordées avec succès !"
    echo ""
    echo "Vous pouvez maintenant faire un backup de la base $DB_NAME avec l'utilisateur $DB_USER."
else
    echo ""
    echo "❌ Erreur lors de l'attribution des permissions."
    echo ""
    echo "Solutions possibles:"
    echo "  1. Exécutez ce script en tant que propriétaire de la base ($OWNER_USER)"
    echo "  2. Ou connectez-vous manuellement et exécutez:"
    echo "     psql -h $DB_HOST -p $DB_PORT -U $OWNER_USER -d $DB_NAME"
    echo "     Puis exécutez les commandes GRANT manuellement"
    echo ""
    echo "Vérifiez que :"
    echo "  - PostgreSQL est démarré"
    echo "  - L'utilisateur $OWNER_USER existe et a les permissions"
    echo "  - La base $DB_NAME existe"
    echo "  - Le mot de passe est correct (définissez PGPASSWORD_OWNER ou PGPASSWORD)"
fi

