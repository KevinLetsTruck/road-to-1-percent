#!/bin/bash

# Script to run SQL files against Supabase database
# Usage: ./run_sql_script.sh <sql_file>

# Check if SQL file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <sql_file>"
    echo "Example: $0 fix_admin_delete_policies.sql"
    exit 1
fi

SQL_FILE="$1"

# Check if file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "Error: SQL file '$SQL_FILE' not found"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Error: .env.local file not found"
    echo "Please create .env.local with your Supabase database connection string"
    echo "Example: DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres"
    exit 1
fi

# Source environment variables
source .env.local

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not found in .env.local"
    echo "Please add your Supabase database connection string to .env.local"
    echo "Example: DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres"
    exit 1
fi

echo "Running SQL script: $SQL_FILE"
echo "Connecting to database..."

# Run the SQL file
psql "$DATABASE_URL" -f "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo "✅ SQL script executed successfully!"
else
    echo "❌ Error executing SQL script"
    exit 1
fi
