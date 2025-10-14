#!/bin/bash
set -e

# Perform all commands as the postgres user
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE kratos;
    CREATE DATABASE hydra;
EOSQL
