#!/bin/bash

# URL de l'API d'administration de Kratos via Caddy
KRATOS_ADMIN_URL="http://localhost/kratos-admin/admin"

# Vérifie si jq est installé
if ! command -v jq &> /dev/null
then
    echo "Erreur: jq n'est pas installé. Veuillez l'installer avec 'sudo apt-get install jq'"
    exit 1
fi

echo "Récupération de toutes les identités..."
# Récupère la liste de tous les IDs d'identité
IDS=$(curl -s "$KRATOS_ADMIN_URL/identities" | jq -r '.[].id')

# Vérifie si la commande curl a réussi et si des IDs ont été trouvés
if [ -z "$IDS" ]; then
  echo "Aucune identité trouvée ou erreur lors de la récupération."
  exit 0
fi

echo ""
echo "ATTENTION ! Les identités suivantes vont être supprimées de manière irréversible :"
echo "$IDS"
echo ""

# Demande de confirmation
read -p "Êtes-vous absolument certain de vouloir continuer ? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Opération annulée."
    exit 1
fi

# Boucle sur chaque ID et le supprime
for id in $IDS; do
  echo -n "Suppression de l'identité : $id ... "
  curl -s -o /dev/null -X DELETE "$KRATOS_ADMIN_URL/identities/$id"
  echo "Fait."
done

echo ""
echo "Toutes les identités ont été supprimées."
