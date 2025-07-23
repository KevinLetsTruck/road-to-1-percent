# Supabase Email Confirmation Settings Guide

## How to Disable Email Confirmation

### Step 1: Navigate to Authentication
- In your Supabase Dashboard, click **"Authentication"** in the left sidebar

### Step 2: Go to Providers
- Under the **CONFIGURATION** section, click **"Providers"**

### Step 3: Configure Email Provider
- Find **"Email"** in the list of providers
- Click on **"Email"** to expand its settings

### Step 4: Disable Email Confirmation
- Look for the **"Confirm email"** toggle
- Switch it to **OFF** (disabled)
- The toggle should turn from green/blue to gray

### What This Does:
- New users can log in immediately after registration
- No email verification required
- Users won't receive confirmation emails
- Existing unconfirmed users will still need manual verification

### Alternative: SQL Solution
If you prefer to handle this via SQL, you can run this query in the SQL Editor:

```sql
-- This will mark all existing unconfirmed users as confirmed
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
```

### Manual User Verification
For individual users who are stuck:
1. Go to `/admin/verify-users` in your app
2. Enter the user's email
3. Click "Verify User"

### Important Notes:
- Disabling email confirmation is perfect for testing and development
- For production, consider your security requirements
- You can always re-enable email confirmation later if needed 