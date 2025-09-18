const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

async function runPolicies() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log("🚀 Running DELETE policies directly...");

  // Since we can't execute DDL via Supabase client, let's use a workaround
  // We'll create a stored procedure that creates the policies

  const createPolicyFunction = `
    CREATE OR REPLACE FUNCTION create_admin_delete_policies()
    RETURNS TEXT AS $$
    BEGIN
      -- Drop existing policies
      DROP POLICY IF EXISTS "Users and admins can delete profiles" ON profiles;
      DROP POLICY IF EXISTS "Users and admins can delete progress" ON user_progress;
      DROP POLICY IF EXISTS "Users and admins can delete comprehensive assessments" ON comprehensive_assessments;
      DROP POLICY IF EXISTS "Users and admins can delete spi assessments" ON spi_assessments;
      
      -- Create new policies
      CREATE POLICY "Users and admins can delete profiles" 
      ON profiles FOR DELETE TO authenticated
      USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

      CREATE POLICY "Users and admins can delete progress" 
      ON user_progress FOR DELETE TO authenticated
      USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

      CREATE POLICY "Users and admins can delete comprehensive assessments" 
      ON comprehensive_assessments FOR DELETE TO authenticated
      USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

      CREATE POLICY "Users and admins can delete spi assessments" 
      ON spi_assessments FOR DELETE TO authenticated
      USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

      RETURN 'DELETE policies created successfully';
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  try {
    console.log("📝 Creating policy function...");

    // Try to create the function using a direct HTTP request
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
      body: JSON.stringify({ sql: createPolicyFunction }),
    });

    if (!response.ok) {
      console.log("❌ Function creation failed, trying alternative...");

      // Alternative: Use the SQL directly via curl
      const fs = require("fs");
      fs.writeFileSync(
        "temp_policies.sql",
        `
-- Admin DELETE Policies
DROP POLICY IF EXISTS "Users and admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Users and admins can delete progress" ON user_progress;
DROP POLICY IF EXISTS "Users and admins can delete comprehensive assessments" ON comprehensive_assessments;
DROP POLICY IF EXISTS "Users and admins can delete spi assessments" ON spi_assessments;

CREATE POLICY "Users and admins can delete profiles" 
ON profiles FOR DELETE TO authenticated
USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Users and admins can delete progress" 
ON user_progress FOR DELETE TO authenticated
USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Users and admins can delete comprehensive assessments" 
ON comprehensive_assessments FOR DELETE TO authenticated
USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Users and admins can delete spi assessments" 
ON spi_assessments FOR DELETE TO authenticated
USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
      `
      );

      console.log("📄 Created temp_policies.sql file");
      console.log(
        "🔧 You need to run this SQL in your Supabase Dashboard → SQL Editor"
      );
      console.log("📋 The SQL has been saved to temp_policies.sql");

      return;
    }

    console.log("✅ Function created, now executing...");

    const { data, error } = await supabase.rpc("create_admin_delete_policies");

    if (error) {
      console.error("❌ Error executing function:", error);
    } else {
      console.log("🎉 Success:", data);
    }
  } catch (err) {
    console.error("❌ Exception:", err.message);
  }
}

runPolicies();
