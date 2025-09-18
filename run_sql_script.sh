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
    exit 1
fi

# Source environment variables
source .env.local

# Build DATABASE_URL from Supabase environment variables
if [ -n "$DATABASE_URL" ]; then
    # Use existing DATABASE_URL if available
    DB_URL="$DATABASE_URL"
elif [ -n "$NEXT_PUBLIC_SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    # Extract host from Supabase URL
    HOST=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co.*||')
    DB_URL="postgresql://postgres:$SUPABASE_SERVICE_ROLE_KEY@db.$HOST.supabase.co:5432/postgres"
elif [ -n "$SUPABASE_DB_PASSWORD" ] && [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    # Use DB password if available
    HOST=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co.*||')
    DB_URL="postgresql://postgres:$SUPABASE_DB_PASSWORD@db.$HOST.supabase.co:5432/postgres"
else
    echo "Error: Could not build database connection string"
    echo "Please ensure .env.local has either:"
    echo "  - DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres"
    echo "  - Or NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    echo "  - Or NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD"
    exit 1
fi

echo "Running SQL script: $SQL_FILE"
echo "Connecting to Supabase database..."

# Run the SQL file
psql "$DB_URL" -f "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo "✅ SQL script executed successfully!"
else
    echo "❌ Error executing SQL script"
    exit 1
fi
