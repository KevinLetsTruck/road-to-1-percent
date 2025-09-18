#!/usr/bin/env node

// Script to run SQL using Supabase client
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function runSQL(sqlFile) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Read SQL file
  if (!fs.existsSync(sqlFile)) {
    console.error(`❌ SQL file not found: ${sqlFile}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFile, 'utf8');
  console.log(`📄 Running SQL script: ${sqlFile}`);
  console.log(`🔗 Connecting to: ${supabaseUrl}`);

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Split SQL into individual statements and execute them
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));

    console.log(`📊 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;

      console.log(`\n🔄 Executing statement ${i + 1}/${statements.length}:`);
      console.log(`   ${statement.substring(0, 80)}${statement.length > 80 ? '...' : ''}`);

      try {
        // Use rpc to execute raw SQL
        const { data, error } = await supabase.rpc('exec', { sql: statement });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error);
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          if (data) {
            console.log(`📊 Result:`, JSON.stringify(data, null, 2));
          }
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${i + 1}:`, err.message);
        // Continue with other statements
      }
    }

    console.log('\n🎉 SQL script execution completed!');
    
  } catch (error) {
    console.error('❌ Script execution error:', error.message);
    process.exit(1);
  }
}

// Get SQL file from command line arguments
const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error('Usage: node run_sql_direct.js <sql_file>');
  console.error('Example: node run_sql_direct.js fix_admin_delete_policies.sql');
  process.exit(1);
}

runSQL(sqlFile);
