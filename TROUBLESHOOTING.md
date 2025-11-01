# Subscription Troubleshooting Guide

## Quick Fix Checklist

### Step 1: Verify `.env.local` exists and has credentials

Check if `.env.local` exists in your project root:

```bash
# Check if file exists
ls .env.local
```

Your `.env.local` should look like this:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get your credentials:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" and "anon/public" key

### Step 2: Create database tables

Run the SQL in `supabase-schema.sql`:

1. Open Supabase Dashboard → SQL Editor
2. Copy ALL contents from `supabase-schema.sql`
3. Paste and click "Run" (or press Ctrl+Enter)
4. Verify tables were created:
   ```sql
   SELECT * FROM trial_subscriptions;
   SELECT * FROM newsletter_subscriptions;
   ```

### Step 3: Restart your dev server

After adding `.env.local`:
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## Common Errors

### Error: "Server configuration error"
❌ **Cause:** `.env.local` file missing or empty
✅ **Fix:** Create `.env.local` with your Supabase credentials

### Error: "Database table not found"
❌ **Cause:** SQL schema not run in Supabase
✅ **Fix:** Run `supabase-schema.sql` in Supabase SQL Editor

### Error: "Invalid API credentials"
❌ **Cause:** Wrong Supabase URL or anon key
✅ **Fix:** Double-check credentials from Supabase Dashboard

### Error: "Email already subscribed"
✅ **This is normal** - Email was already added to database

## Test Your Setup

### Browser Console Check
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try subscribing with an email
4. Look for console logs showing:
   - "Subscription request: ..."
   - Any error details

### API Test (Manual)
Test the API directly:
```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "type": "trial",
    "source": "test"
  }'
```

Expected success response:
```json
{
  "message": "Successfully subscribed!",
  "type": "trial",
  "data": { ... }
}
```

## Still Not Working?

Check these in order:

1. **Server logs** - Look at terminal where `npm run dev` is running
2. **Browser console** - Check for JavaScript errors (F12)
3. **Network tab** - Look at the `/api/subscribe` request/response
4. **Supabase logs** - Dashboard → Logs → API logs

## Quick Debug Command

Run this in your project root to check setup:
```bash
# Check if env file exists
cat .env.local 2>/dev/null || echo "❌ .env.local not found"

# Check if running on port 3000
curl -I http://localhost:3000 2>/dev/null || echo "❌ Dev server not running"
```
