
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
      