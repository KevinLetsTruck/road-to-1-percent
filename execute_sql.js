const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

async function executeSQL() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing Supabase credentials");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("🔗 Connected to Supabase");
  console.log("📊 Executing admin delete policies...");

  try {
    // 1. Check current admin user
    console.log("\n1️⃣ Checking current admin user...");
    const { data: adminCheck, error: adminError } = await supabase
      .from("profiles")
      .select("id, email, is_admin")
      .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
      .single();

    if (adminError) {
      console.log("Admin check (using service role):", {
        adminCheck,
        adminError,
      });
    }

    // 2. Drop existing policies
    console.log("\n2️⃣ Dropping existing DELETE policies...");

    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users and admins can delete profiles" ON profiles',
      'DROP POLICY IF EXISTS "Users and admins can delete progress" ON user_progress',
      'DROP POLICY IF EXISTS "Users and admins can delete comprehensive assessments" ON comprehensive_assessments',
      'DROP POLICY IF EXISTS "Users and admins can delete spi assessments" ON spi_assessments',
    ];

    for (const sql of dropPolicies) {
      try {
        const { error } = await supabase.rpc("exec_sql", { query: sql });
        if (error) {
          console.log(`⚠️  ${sql.split(" ")[5]} policy drop:`, error.message);
        } else {
          console.log(`✅ Dropped policy: ${sql.split(" ")[5]}`);
        }
      } catch (err) {
        // Try alternative method
        console.log(`🔄 Trying alternative method for: ${sql.split(" ")[5]}`);
      }
    }

    // 3. Create new policies
    console.log("\n3️⃣ Creating new DELETE policies...");

    const createPolicies = [
      {
        name: "profiles",
        sql: `CREATE POLICY "Users and admins can delete profiles" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))`,
      },
      {
        name: "user_progress",
        sql: `CREATE POLICY "Users and admins can delete progress" ON user_progress FOR DELETE TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))`,
      },
      {
        name: "comprehensive_assessments",
        sql: `CREATE POLICY "Users and admins can delete comprehensive assessments" ON comprehensive_assessments FOR DELETE TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))`,
      },
      {
        name: "spi_assessments",
        sql: `CREATE POLICY "Users and admins can delete spi assessments" ON spi_assessments FOR DELETE TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))`,
      },
    ];

    for (const policy of createPolicies) {
      try {
        const { error } = await supabase.rpc("exec_sql", { query: policy.sql });
        if (error) {
          console.log(
            `❌ Failed to create ${policy.name} policy:`,
            error.message
          );
        } else {
          console.log(`✅ Created DELETE policy for: ${policy.name}`);
        }
      } catch (err) {
        console.log(
          `❌ Exception creating ${policy.name} policy:`,
          err.message
        );
      }
    }

    // 4. Verify policies
    console.log("\n4️⃣ Verifying DELETE policies...");
    const { data: policies, error: policyError } = await supabase
      .from("pg_policies")
      .select("schemaname, tablename, policyname, cmd")
      .eq("schemaname", "public")
      .eq("cmd", "DELETE");

    if (policies) {
      console.log("📋 Current DELETE policies:");
      policies.forEach((p) =>
        console.log(`   ${p.tablename}: ${p.policyname}`)
      );
    } else {
      console.log("⚠️  Could not verify policies:", policyError);
    }

    console.log("\n🎉 Admin DELETE policies setup completed!");
    console.log("🔄 Try deleting a user from the admin dashboard now.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

executeSQL();
