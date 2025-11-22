# Razorpay Payment Integration - Setup Guide

## ✅ Current Status

**Razorpay is already fully integrated in your checkout page!** 

The payment system is production-ready and includes:
- ✅ Razorpay SDK installed (`razorpay@2.9.4`)
- ✅ Frontend checkout form (`/app/checkout/page.tsx`)
- ✅ Backend API endpoints (`/api/payment/create-order` & `/api/payment/verify`)
- ✅ Secure payment verification with HMAC signature
- ✅ Database integration with Supabase
- ✅ 30-day free trial system

---

## 🔧 Setup Instructions

### Step 1: Create Razorpay Account

1. Visit [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Sign up with your business email
3. Complete KYC verification (required for live mode)
4. Activate your account

### Step 2: Get Your API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Generate API keys (you'll get two types):
   - **Test Keys** (for development)
   - **Live Keys** (for production - available after KYC)

**Test Keys Format:**
- Key ID: `rzp_test_xxxxxxxxxxxxx`
- Key Secret: `xxxxxxxxxxxxxxxxxxxxxx`

**Live Keys Format:**
- Key ID: `rzp_live_xxxxxxxxxxxxx`
- Key Secret: `xxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Update `.env.local` with your Razorpay keys:

```env
# Razorpay Test Keys (use these for development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Razorpay Live Keys (use these for production)
# RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
# RAZORPAY_KEY_SECRET=your_live_secret_key_here
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

⚠️ **IMPORTANT:** 
- Keep `RAZORPAY_KEY_SECRET` private - never commit it to Git
- Only `NEXT_PUBLIC_RAZORPAY_KEY_ID` should be exposed to the frontend
- Use Test keys for development, Live keys for production

### Step 4: Configure Supabase (Database)

Your payment data is stored in Supabase. Make sure you have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Required Tables:**
- `subscriptions` - Stores subscription details
- `payment_transactions` - Stores payment records

If tables don't exist, refer to `SUPABASE_SETUP.md` for schema.

### Step 5: Test the Payment Flow

1. Start your development server:
```bash
npm run dev
```

2. Navigate to: [http://localhost:3004/checkout](http://localhost:3004/checkout)

3. Fill in the checkout form with test details:
   - Email: `test@example.com`
   - School Name: `Test School`
   - Phone: `9876543210`
   - Address details

4. Click **"Proceed to Secure Payment"**

5. Use Razorpay test cards:

**Test Card Details:**
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

**Test UPI:**
```
UPI ID: success@razorpay
```

**Test Wallets:** All available in test mode

6. Complete payment - you'll be redirected to success page

---

## 📋 Payment Flow Architecture

### Frontend Flow (`/app/checkout/page.tsx`):

1. **User fills checkout form** with school details
2. **Form validation** ensures all required fields are correct
3. **Calculate total** based on plan, students, and billing cycle
4. **Click "Proceed to Secure Payment"** button
5. **API call to `/api/payment/create-order`**
6. **Razorpay modal opens** with payment options
7. **User completes payment** using card/UPI/wallet
8. **Payment verification** via `/api/payment/verify`
9. **Redirect to success page** on successful payment

### Backend Flow:

#### Create Order (`/api/payment/create-order/route.ts`):
```typescript
1. Validate user input (email, phone, student count)
2. Calculate amount in paise (₹15 × 75 students = ₹1,125 = 112,500 paise)
3. Create Razorpay order using API
4. Create subscription record in Supabase (status: 'pending')
5. Create payment transaction record
6. Return order details to frontend
```

#### Verify Payment (`/api/payment/verify/route.ts`):
```typescript
1. Receive payment response from Razorpay
2. Verify signature using HMAC SHA256
3. Update payment transaction (status: 'paid')
4. Activate subscription (status: 'trial' for 30 days)
5. Sync to main application (optional)
6. Return success response
```

---

## 🔒 Security Features

Your implementation includes:

✅ **Server-side validation** - All inputs validated on backend
✅ **HMAC signature verification** - Prevents payment tampering
✅ **Environment variables** - Secrets never exposed to client
✅ **IP tracking** - Logs user IP for fraud detection
✅ **User agent logging** - Tracks device information
✅ **Email/phone validation** - Regex patterns for Indian numbers
✅ **Amount verification** - Server calculates final amount
✅ **Transaction logging** - All payments recorded in database

---

## 💰 Pricing Configuration

Current plans in `pricingPlans` array:

| Plan | Price/Student/Month | Daily AI Credits |
|------|-------------------|------------------|
| Catalyst AI | ₹15 | 70 credits |
| Catalyst AI Pro | ₹25 | 150 credits |
| Catalyst AI Extreme | ₹500 | Unlimited |

**30-Day Free Trial:** Included with all plans (up to 75 students)

**Billing Cycles:**
- Monthly: No discount
- Yearly: 20% discount (10 months price for 12 months)

---

## 🧪 Testing in Development

### Test Mode Features:

- ✅ No real money involved
- ✅ Instant payment confirmation
- ✅ All payment methods available
- ✅ Full payment flow simulation
- ✅ Test webhooks supported

### Test Credentials:

**Successful Payment:**
```
Card: 4111 1111 1111 1111
UPI: success@razorpay
Wallet: Select any wallet
```

**Failed Payment:**
```
Card: 4000 0000 0000 0002
UPI: failure@razorpay
```

**Test International Card:**
```
Card: 5555 5555 5555 4444
(Use for testing international payments)
```

---

## 🚀 Going Live (Production)

### Pre-Launch Checklist:

- [ ] Complete Razorpay KYC verification
- [ ] Activate live mode in Razorpay dashboard
- [ ] Generate live API keys
- [ ] Update environment variables with live keys
- [ ] Test with small real transaction
- [ ] Set up webhook for auto-capture (optional)
- [ ] Configure email notifications
- [ ] Set up refund policy
- [ ] Enable fraud detection rules

### Update Environment Variables:

```env
# Production Keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

### Deployment:

1. Add environment variables to Vercel/hosting platform
2. Deploy with: `npm run build && npm start`
3. Test live payment with ₹1
4. Monitor first few transactions carefully

---

## 📊 Monitoring & Analytics

### Razorpay Dashboard:
- View all transactions
- Download settlement reports
- Track failed payments
- Set up alerts

### Supabase Database:
- Query subscription status
- Analyze payment patterns
- Track trial conversions
- Generate revenue reports

### Useful Queries:

**Total Revenue:**
```sql
SELECT SUM(amount) as total_revenue 
FROM payment_transactions 
WHERE status = 'paid';
```

**Active Subscriptions:**
```sql
SELECT COUNT(*) as active_subs 
FROM subscriptions 
WHERE status IN ('trial', 'active');
```

**Conversion Rate:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE status = 'paid') * 100.0 / COUNT(*) as conversion_rate
FROM payment_transactions;
```

---

## 🛠️ Troubleshooting

### Issue: Payment modal not opening

**Solution:**
- Check if Razorpay script loaded: `console.log(window.Razorpay)`
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` in `.env.local`
- Check browser console for errors
- Clear cache and reload

### Issue: Signature verification failed

**Solution:**
- Ensure `RAZORPAY_KEY_SECRET` matches your dashboard
- Check if using correct key (test vs live)
- Verify secret hasn't been regenerated

### Issue: Order creation failed

**Solution:**
- Check Supabase connection
- Verify tables exist (`subscriptions`, `payment_transactions`)
- Check environment variables are loaded
- Review API error logs

### Issue: Payment successful but subscription not activated

**Solution:**
- Check `/api/payment/verify` logs
- Verify webhook signature
- Check Supabase update permissions
- Manually update subscription status if needed

---

## 📞 Support Resources

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay API Reference:** https://razorpay.com/docs/api/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **Razorpay Support:** https://razorpay.com/support/

---

## 🔗 Quick Links

- **Test Dashboard:** https://dashboard.razorpay.com/test/payments
- **Live Dashboard:** https://dashboard.razorpay.com/app/payments
- **API Keys:** https://dashboard.razorpay.com/app/keys
- **Webhooks:** https://dashboard.razorpay.com/app/webhooks

---

## ✨ Next Steps

1. **Add your Razorpay keys to `.env.local`**
2. **Test the payment flow with test cards**
3. **Complete KYC for live payments**
4. **Deploy to production with live keys**
5. **Monitor first transactions carefully**

---

**Your Razorpay integration is complete and ready to accept payments! 🎉**

For questions or issues, check the Troubleshooting section or contact Razorpay support.
