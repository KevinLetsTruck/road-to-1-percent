# Admin Guide - Handling User Registration & Login Issues

## Quick Solutions for Common Problems

### 1. User Can't Login Due to Email Confirmation

**Solution: Manual Verification**
1. Go to `/admin/verify-users` while logged in as admin
2. Enter the user's email address
3. Click "Verify User"
4. The user can now log in immediately

### 2. Disabling Email Confirmation in Supabase (Recommended)

To permanently disable email confirmation for all new users:

1. **Go to your Supabase Dashboard**
   - Navigate to Authentication → Settings

2. **Disable Email Confirmations**
   - Under "Email Settings", turn OFF "Enable email confirmations"
   - This allows users to log in immediately after registration

3. **Update Email Templates (Optional)**
   - Remove or customize the confirmation email template since it won't be used

### 3. Common Error Messages and Solutions

| Error Message | Solution |
|--------------|----------|
| "Email not confirmed" | Use the admin verify tool at `/admin/verify-users` |
| "Invalid login credentials" | User is entering wrong email/password |
| "User not found" | User needs to register first |

### 4. Admin Access

To grant admin access to a user:
1. Go to Supabase Dashboard → Table Editor → profiles
2. Find the user by email
3. Set `is_admin` to `true`

### 5. Bulk User Verification (SQL)

If you need to verify multiple users at once, run this in Supabase SQL Editor:

```sql
-- Verify all unconfirmed users
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
```

### 6. Testing Registration Flow

1. Create a test account with a fake email (e.g., test@example.com)
2. If it gets stuck on email confirmation, use the admin verify tool
3. The user should be able to log in immediately after verification

## Important Notes

- The system now attempts to auto-login users after registration
- If email confirmation is disabled in Supabase, users can log in immediately
- The admin verify tool bypasses all email confirmation requirements
- Always verify the user's identity through other means before manual verification 