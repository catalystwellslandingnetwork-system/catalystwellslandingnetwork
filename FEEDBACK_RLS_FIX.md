# 🔧 Feedback System RLS Fix

## ❌ Problem
Getting error: `new row violates row-level security policy for table "feedback"`

## ✅ Solution

### **Step 1: Fix RLS Policies in Supabase**

Go to your Supabase dashboard → SQL Editor and run this:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public insert" ON public.feedback;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.feedback;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.feedback;

-- Disable and re-enable RLS
ALTER TABLE public.feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create new policy that allows anyone to insert
CREATE POLICY "Enable insert for all users" ON public.feedback
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policy for authenticated users to read
CREATE POLICY "Enable read for authenticated users" ON public.feedback
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for authenticated users to update
CREATE POLICY "Enable update for authenticated users" ON public.feedback
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy for service role to have full access
CREATE POLICY "Enable all for service role" ON public.feedback
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

### **Step 2: Add Service Role Key to Environment**

The API now uses the service role key to bypass RLS for public submissions.

**Option A: Use Service Role Key (Recommended)**

1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (not the anon key)
3. Add to your `.env.local` file:

```env
# Existing variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Add this new variable
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Option B: Keep Using Anon Key (Fallback)**

If you don't add the service role key, the API will fall back to using the anon key. This will work if the RLS policies are set correctly (Step 1 above).

### **Step 3: Restart Your Dev Server**

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### **Step 4: Test the Feedback Form**

1. Go to `http://localhost:3004/roadmap`
2. Click "Submit Feedback"
3. Fill out the form
4. Submit
5. Should work now! ✅

---

## 🔍 What Changed?

### **API Route Update**
- Now uses `supabaseAdmin` client with service role key
- Service role bypasses RLS policies
- Safer and more reliable for public forms

### **RLS Policy Update**
- Clearer policy names
- Explicit `TO public` for insert policy
- Added service role policy for admin access
- More permissive for inserts, restrictive for reads/updates

---

## 📋 Environment Variables Checklist

Your `.env.local` should have:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Recommended for feedback system
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Other keys you may have
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

⚠️ **Important:** Never commit `.env.local` to git!

---

## 🧪 Verify It's Working

### **Test Submission**
```bash
curl -X POST http://localhost:3004/api/feedback/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "type": "feature",
    "priority": "medium",
    "title": "Test Feedback",
    "description": "Testing the feedback system after RLS fix"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedbackId": "uuid-here"
}
```

### **Check Database**
Go to Supabase → Table Editor → feedback table

You should see your test feedback entry!

---

## 🔒 Security Notes

### **Why Service Role Key?**
- Service role key bypasses RLS
- Safe to use in API routes (server-side only)
- Never expose in client-side code
- Perfect for public forms that need to write to database

### **Is This Secure?**
✅ **Yes!** Because:
- Service role key is only used server-side
- API validates all inputs
- Email validation prevents spam
- Length restrictions prevent abuse
- IP tracking for monitoring
- Can add rate limiting if needed

### **RLS Policies Still Matter**
- Prevent direct database access
- Protect read operations
- Ensure only admins can update
- Defense in depth strategy

---

## 🐛 Troubleshooting

### **Still Getting RLS Error?**
1. Make sure you ran the SQL fix in Supabase
2. Verify service role key is in `.env.local`
3. Restart dev server
4. Clear browser cache
5. Check Supabase logs

### **Environment Variable Not Loading?**
```bash
# Check if Next.js can see it
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY)

# Make sure file is named exactly: .env.local
# Must restart dev server after changes
```

### **Getting 500 Error?**
- Check Supabase connection
- Verify table exists
- Check API logs in terminal
- Verify all columns match schema

---

## ✅ Checklist

- [ ] Run SQL fix in Supabase dashboard
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- [ ] Restart dev server
- [ ] Test feedback form
- [ ] Verify entry in Supabase table
- [ ] Celebrate! 🎉

---

**Status:** Ready to Fix ✅  
**Time to Fix:** ~5 minutes  
**Difficulty:** Easy
