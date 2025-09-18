const { createClient } = require('@supabase/supabase-js');

// You'll need to add your actual Supabase credentials here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyJosephData() {
  console.log('🔍 Verifying Joseph Lowry\'s Assessment Data...\n');

  try {
    // Find Joseph Lowry's profile
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', '%josephlowry66@yahoo.com%');

    if (profileError) {
      console.error('❌ Error fetching profiles:', profileError);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log('❌ No profile found for josephlowry66@yahoo.com');
      return;
    }

    const joseph = profiles[0];
    console.log('👤 PROFILE DATA:');
    console.log(`   ID: ${joseph.id}`);
    console.log(`   Name: ${joseph.first_name} ${joseph.last_name}`);
    console.log(`   Email: ${joseph.email}`);
    console.log(`   Created: ${joseph.created_at}`);
    console.log(`   Is Test User: ${joseph.is_test_user}`);

    // Get user progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', joseph.id)
      .maybeSingle();

    if (progressError) {
      console.error('❌ Error fetching user progress:', progressError);
    } else if (progress) {
      console.log('\n📊 USER PROGRESS DATA:');
      console.log(`   SPI Score: ${progress.spi_score}`);
      console.log(`   Current Tier: ${progress.current_tier}`);
      console.log(`   Last Assessment: ${progress.last_assessment_date}`);
      console.log(`   Financial Foundation: ${progress.financial_foundation_completed ? '✅' : '❌'} (Score: ${progress.financial_foundation_score})`);
      console.log(`   Market Intelligence: ${progress.market_intelligence_completed ? '✅' : '❌'} (Score: ${progress.market_intelligence_score})`);
      console.log(`   Personal Strengths: ${progress.personal_strengths_completed ? '✅' : '❌'} (Score: ${progress.personal_strengths_score})`);
      console.log(`   Risk Management: ${progress.risk_management_completed ? '✅' : '❌'} (Score: ${progress.risk_management_score})`);
      console.log(`   Support Systems: ${progress.support_systems_completed ? '✅' : '❌'} (Score: ${progress.support_systems_score})`);
      console.log(`   StandOut Completed: ${progress.standout_completed ? '✅' : '❌'} (Score: ${progress.standout_score})`);
    } else {
      console.log('\n📊 USER PROGRESS DATA: None found');
    }

    // Get comprehensive assessment
    const { data: comprehensive, error: comprehensiveError } = await supabase
      .from('comprehensive_assessments')
      .select('*')
      .eq('user_id', joseph.id)
      .order('assessment_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (comprehensiveError) {
      console.error('❌ Error fetching comprehensive assessment:', comprehensiveError);
    } else if (comprehensive) {
      console.log('\n💰 COMPREHENSIVE ASSESSMENT DATA:');
      console.log(`   Assessment Date: ${comprehensive.assessment_date}`);
      console.log(`   Total SPI Score: ${comprehensive.total_spi_score}`);
      console.log(`   Tier: ${comprehensive.tier}`);
      console.log(`   Net Worth: $${comprehensive.net_worth?.toLocaleString() || 'N/A'}`);
      console.log(`   Monthly Income: $${comprehensive.monthly_income?.toLocaleString() || 'N/A'}`);
      console.log(`   Monthly Expenses: $${comprehensive.monthly_expenses?.toLocaleString() || 'N/A'}`);
      console.log(`   Emergency Fund: $${comprehensive.emergency_fund?.toLocaleString() || 'N/A'}`);
      console.log(`   Primary Strength: ${comprehensive.standout_strength_1 || 'N/A'}`);
      console.log(`   Secondary Strength: ${comprehensive.standout_strength_2 || 'N/A'}`);
    } else {
      console.log('\n💰 COMPREHENSIVE ASSESSMENT DATA: None found');
    }

    // Get SPI assessment
    const { data: spiAssessment, error: spiError } = await supabase
      .from('spi_assessments')
      .select('*')
      .eq('user_id', joseph.id)
      .order('assessment_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (spiError) {
      console.error('❌ Error fetching SPI assessment:', spiError);
    } else if (spiAssessment) {
      console.log('\n🎯 SPI ASSESSMENT DATA:');
      console.log(`   Assessment Date: ${spiAssessment.assessment_date}`);
      console.log(`   Total Score: ${spiAssessment.total_score}`);
      console.log(`   Financial Score: ${spiAssessment.financial_score}`);
      console.log(`   Market Score: ${spiAssessment.market_score}`);
      console.log(`   Personal Score: ${spiAssessment.personal_score}`);
      console.log(`   Risk Score: ${spiAssessment.risk_score}`);
      console.log(`   Support Score: ${spiAssessment.support_score}`);
    } else {
      console.log('\n🎯 SPI ASSESSMENT DATA: None found');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the verification
verifyJosephData().then(() => {
  console.log('\n✅ Data verification complete');
}).catch(console.error);
