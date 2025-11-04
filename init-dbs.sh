#!/bin/bash
set -e

# Ejecuta el comando SQL para crear las bases de datos
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE plataforma_retail_inventory;
    CREATE DATABASE plataforma_retail_orders;
    CREATE DATABASE plataforma_retail_suppliers;
    CREATE DATABASE plataforma_retail_store_ops;
    CREATE DATABASE plataforma_retail_reports;
EOSQL