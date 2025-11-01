# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note down your project URL and anon key

## 2. Create Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create email_subscriptions table
CREATE TABLE email_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  subscription_type VARCHAR(20) NOT NULL CHECK (subscription_type IN ('newsletter', 'trial')),
  source_page VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_email_type UNIQUE (email, subscription_type)
);

-- Create index for faster lookups
CREATE INDEX idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX idx_email_subscriptions_type ON email_subscriptions(subscription_type);
CREATE INDEX idx_email_subscriptions_created ON email_subscriptions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for public signups)
CREATE POLICY "Allow public inserts" ON email_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow reads for authenticated users only
CREATE POLICY "Allow authenticated reads" ON email_subscriptions
  FOR SELECT
  TO authenticated
  USING (true);
```

## 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Get your credentials from:
   - Supabase Dashboard → Settings → API
   - Copy "Project URL" and "anon/public" key

## 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the homepage
3. Enter an email in the CTA section
4. Click "Start Free Trial"
5. Check Supabase Dashboard → Table Editor → email_subscriptions

## 5. Database Schema

### Table: `email_subscriptions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `email` | VARCHAR(255) | User's email address |
| `subscription_type` | VARCHAR(20) | Either 'newsletter' or 'trial' |
| `source_page` | VARCHAR(100) | Page where user subscribed (e.g., 'homepage-cta') |
| `metadata` | JSONB | Additional data (user_agent, referrer, etc.) |
| `created_at` | TIMESTAMP | Subscription timestamp (auto-generated) |

### Constraints:
- Unique combination of `email` + `subscription_type` (prevents duplicates)

## 6. API Endpoints

### POST `/api/subscribe`

Subscribe an email for newsletter or trial.

**Request Body:**
```json
{
  "email": "user@example.com",
  "type": "trial",
  "source": "homepage-cta"
}
```

**Response (Success):**
```json
{
  "message": "Successfully subscribed!",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "subscription_type": "trial",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Already Exists):**
```json
{
  "message": "Email already subscribed",
  "alreadyExists": true
}
```

**Response (Error):**
```json
{
  "error": "Invalid email address"
}
```

## 7. Security Notes

- ✅ Row Level Security (RLS) is enabled
- ✅ Only inserts are allowed from anonymous users
- ✅ Reads require authentication
- ✅ Environment variables are not committed to Git
- ✅ Anon key is safe to expose (read-only with RLS)

## 8. Next Steps

### Email Automation (Optional)

To send welcome emails automatically:

1. **Using Supabase Edge Functions:**
   ```bash
   supabase functions new send-welcome-email
   ```

2. **Or integrate with:**
   - SendGrid
   - Resend
   - Mailgun
   - AWS SES

3. **Trigger email on insert:**
   ```sql
   CREATE OR REPLACE FUNCTION trigger_welcome_email()
   RETURNS trigger AS $$
   BEGIN
     -- Call your email service here
     -- Or use Supabase Edge Functions
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER on_subscription_created
     AFTER INSERT ON email_subscriptions
     FOR EACH ROW
     EXECUTE FUNCTION trigger_welcome_email();
   ```

## 9. Troubleshooting

**Issue: "Invalid API key"**
- Check that your `.env.local` file exists
- Verify the Supabase URL and anon key are correct
- Restart your dev server after adding environment variables

**Issue: "Failed to subscribe"**
- Check Supabase Dashboard → Authentication → Policies
- Ensure RLS policies allow public inserts
- Check browser console for detailed errors

**Issue: Duplicates allowed**
- Verify the UNIQUE constraint was created
- Check SQL editor for any errors during table creation

## 10. Viewing Subscriptions

Access your subscriptions in Supabase:
1. Dashboard → Table Editor → email_subscriptions
2. Or query via SQL:
   ```sql
   SELECT * FROM email_subscriptions ORDER BY created_at DESC;
   ```

## 11. Export Data

Export subscriptions as CSV:
1. Supabase Dashboard → Table Editor
2. Select email_subscriptions table
3. Click "Export" → CSV
