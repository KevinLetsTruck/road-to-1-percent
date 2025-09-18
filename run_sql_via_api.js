#!/usr/bin/env node

// Script to run SQL via Supabase REST API
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

async function runSQL(sqlFile) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    console.error(
      "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
    process.exit(1);
  }

  // Read SQL file
  if (!fs.existsSync(sqlFile)) {
    console.error(`❌ SQL file not found: ${sqlFile}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFile, "utf8");
  console.log(`📄 Running SQL script: ${sqlFile}`);
  console.log(`🔗 Connecting to: ${supabaseUrl}`);

  try {
    // Use Supabase REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
      body: JSON.stringify({
        sql: sqlContent,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ SQL executed successfully!");
      console.log("📊 Result:", JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.error("❌ SQL execution failed:");
      console.error("Status:", response.status, response.statusText);
      console.error("Error:", error);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Network error:", error.message);
    process.exit(1);
  }
}

// Get SQL file from command line arguments
const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("Usage: node run_sql_via_api.js <sql_file>");
  console.error(
    "Example: node run_sql_via_api.js fix_admin_delete_policies.sql"
  );
  process.exit(1);
}

runSQL(sqlFile);
