# Razorpay Integration Setup Guide

## 🎯 Overview

This guide will help you integrate Razorpay payment gateway into VisualDocs. Razorpay is **FREE to start** with only 2% fees on successful transactions - perfect for Indian developers and businesses.

## 📋 Prerequisites

- Indian business/individual (KYC required for live mode)
- Valid PAN card
- Bank account details
- Business documents (if applicable)

## 🚀 Step 1: Create Razorpay Account

### 1.1 Sign Up
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. Enter your email and create password
3. Verify your email address
4. Complete basic profile information

### 1.2 Test Mode (Immediate Access)
- You get instant access to **Test Mode**
- Use test mode for development and testing
- No KYC required for test mode
- Test mode has full features for integration

### 1.3 KYC Verification (For Live Mode)
**Required Documents:**
- PAN Card
- Business Registration Certificate (if company)
- GST Certificate (if applicable)
- Bank Account Statement
- Address Proof

**Timeline:** Usually 24-48 hours for KYC approval

## 🔑 Step 2: Get API Keys

### 2.1 Navigate to API Keys
1. Go to [API Keys Section](https://dashboard.razorpay.com/app/keys)
2. You'll see two sets of keys:
   - **Test Keys** (for development)
   - **Live Keys** (after KYC approval)

### 2.2 Generate Test Keys
```
Key ID (Public): rzp_test_1234567890abcd
Key Secret (Private): abcdefghijklmnopqrstuvwxyz123456
```

### 2.3 Update Environment Variables

**Server (.env)**
```bash
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

**Client (.env)**
```bash
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890abcd
```

⚠️ **NEVER** commit actual keys to version control!

## 📦 Step 3: Create Subscription Plans

### 3.1 Navigate to Plans
1. Go to [Subscriptions Plans](https://dashboard.razorpay.com/app/subscriptions/plans)
2. Click **"Create Plan"** button

### 3.2 Create Professional Monthly Plan
```
Plan Name: Professional Monthly
Billing Interval: Monthly
Billing Amount: ₹2,000
Currency: INR
Description: Professional plan with advanced documentation features
Plan Type: Subscription
Billing Cycles: Until Cancelled
```

**After creation, copy the Plan ID:**
```
plan_xxxxxxxxxxxxxxxx
```

### 3.3 Create Professional Annual Plan
```
Plan Name: Professional Annual
Billing Interval: Yearly
Billing Amount: ₹19,200  (20% discount - ₹1,600/month)
Currency: INR
Description: Professional plan billed annually with 20% savings
Plan Type: Subscription
Billing Cycles: Until Cancelled
```

### 3.4 Create Enterprise Monthly Plan
```
Plan Name: Enterprise Monthly
Billing Interval: Monthly
Billing Amount: ₹20,000
Currency: INR
Description: Enterprise plan for large teams
Plan Type: Subscription
Billing Cycles: Until Cancelled
```

### 3.5 Create Enterprise Annual Plan
```
Plan Name: Enterprise Annual
Billing Interval: Yearly
Billing Amount: ₹1,92,000  (20% discount - ₹16,000/month)
Currency: INR
Description: Enterprise plan billed annually with 20% savings
Plan Type: Subscription
Billing Cycles: Until Cancelled
```

### 3.6 Update Environment Variables
Add all plan IDs to your `.env` file:

```bash
RAZORPAY_PLAN_PROFESSIONAL_MONTHLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_PROFESSIONAL_ANNUAL=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_ENTERPRISE_MONTHLY=plan_xxxxxxxxxxxxx
RAZORPAY_PLAN_ENTERPRISE_ANNUAL=plan_xxxxxxxxxxxxx
```

## 🔔 Step 4: Setup Webhooks

### 4.1 Why Webhooks?
Webhooks notify your server about payment events in real-time:
- Subscription activated
- Payment charged
- Subscription cancelled
- Payment failed
- Subscription paused/resumed

### 4.2 Configure Webhook
1. Go to [Webhooks](https://dashboard.razorpay.com/app/webhooks)
2. Click **"Add New Webhook"**
3. Enter webhook URL:
   ```
   Development: http://your-ngrok-url.ngrok.io/api/payment/webhook
   Production: https://yourdomain.com/api/payment/webhook
   ```

### 4.3 Select Events
Check these events:
- ✅ `subscription.activated`
- ✅ `subscription.charged`
- ✅ `subscription.cancelled`
- ✅ `subscription.paused`
- ✅ `subscription.resumed`
- ✅ `payment.failed`

### 4.4 Get Webhook Secret
After creating webhook, copy the **Secret**:
```
whsec_xxxxxxxxxxxxxxxxxxxxxxxx
```

Update `.env`:
```bash
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.5 Testing Webhooks Locally (Using ngrok)

**Install ngrok:**
```bash
npm install -g ngrok
```

**Start ngrok tunnel:**
```bash
ngrok http 3004
```

**Update webhook URL** with ngrok URL in Razorpay dashboard

## 🗄️ Step 5: Database Migration

### 5.1 Review Schema Changes
The User model has been updated with subscription fields:
```prisma
model User {
  // ... existing fields
  
  razorpayCustomerId    String?
  subscriptionId        String?   @unique
  subscriptionStatus    String?
  subscriptionPlan      String?
  billingPeriod         String?
  subscriptionStartedAt DateTime?
  subscriptionEndsAt    DateTime?
  trialEndsAt           DateTime?
}
```

### 5.2 Run Migration
```bash
cd server
npx prisma migrate dev --name add_razorpay_subscriptions
```

This will:
1. Create migration files
2. Apply changes to database
3. Regenerate Prisma Client

## 🧪 Step 6: Test Payment Flow

### 6.1 Test Cards (Razorpay Test Mode)

**Successful Payment:**
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
```

**Failed Payment:**
```
Card Number: 4000 0000 0000 0002
```

**Insufficient Funds:**
```
Card Number: 4000 0000 0000 9995
```

### 6.2 Testing Steps

1. **Start Backend:**
```bash
cd server
npm run dev
```

2. **Start Frontend:**
```bash
cd client
npm run dev
```

3. **Test Checkout Flow:**
   - Visit pricing page: `http://localhost:5173/pricing`
   - Click "Get Started" on Professional plan
   - Login if not authenticated
   - Complete Razorpay checkout with test card
   - Verify payment success redirect

4. **Check Database:**
```bash
npx prisma studio
```
Verify user has updated subscription fields

5. **Check Webhook Events:**
   - Go to [Razorpay Dashboard Webhooks](https://dashboard.razorpay.com/app/webhooks)
   - Click on your webhook
   - View event history and payloads

## 📊 Step 7: Monitor Payments

### 7.1 Razorpay Dashboard
- **Payments:** View all transactions
- **Subscriptions:** Manage active/cancelled subscriptions
- **Customers:** View customer profiles
- **Reports:** Download settlement reports
- **Analytics:** Track conversion rates

### 7.2 Application Logs
Check server logs for payment events:
```bash
tail -f server/logs/app.log
```

## 🚀 Step 8: Go Live

### 8.1 Complete KYC
1. Submit all required documents
2. Wait for approval (24-48 hours)
3. Verify bank account

### 8.2 Switch to Live Mode
1. Generate **Live Keys** in dashboard
2. Update `.env` files:
```bash
# Server
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Client
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
```

3. **Recreate Plans** in Live Mode (plan IDs are different)
4. Update plan IDs in `.env`
5. Update webhook URL to production domain

### 8.3 Final Testing
- Test with real card (small amount)
- Verify webhook delivery
- Check database updates
- Test cancellation flow
- Verify refund process

## 💰 Pricing & Fees

### Transaction Fees
- **Indian Cards:** 2% per transaction
- **International Cards:** 3% + ₹2
- **Net Banking:** 2% per transaction
- **UPI:** 2% per transaction
- **Wallets:** 2% per transaction

### No Hidden Costs
- ✅ **Zero** setup fees
- ✅ **Zero** monthly/annual fees
- ✅ **Zero** maintenance charges
- ✅ Pay only on successful transactions

### Settlement
- Automatic settlement to bank account
- T+3 days settlement cycle
- Instant settlements available (paid feature)

## 🛠️ Troubleshooting

### Common Issues

**1. Payment Fails Immediately**
- Check if using test keys in test mode
- Verify plan IDs are correct
- Check server logs for errors

**2. Webhooks Not Received**
- Verify webhook URL is accessible
- Check webhook secret is correct
- Use ngrok for local testing
- Check server logs for webhook errors

**3. Signature Verification Fails**
- Ensure webhook secret matches
- Check request body is not modified
- Verify raw body is used for verification

**4. Subscription Not Activating**
- Check webhook events are selected
- Verify database updates in webhook handler
- Check Prisma Client is generated

### Debug Mode
Enable debug logging:
```typescript
// paymentService.ts
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

console.log('Razorpay initialized:', {
  keyId: process.env.RAZORPAY_KEY_ID,
  mode: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test') ? 'TEST' : 'LIVE'
});
```

## 📚 Resources

### Official Documentation
- [Razorpay Docs](https://razorpay.com/docs/)
- [Subscriptions API](https://razorpay.com/docs/api/subscriptions/)
- [Webhooks](https://razorpay.com/docs/webhooks/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

### Support
- Email: support@razorpay.com
- Phone: +91-80-6993-0140
- Chat: Available in dashboard

### Community
- [Razorpay Community](https://community.razorpay.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/razorpay)

## ✅ Checklist

Before going live, ensure:

- [ ] Razorpay account created
- [ ] KYC completed and approved
- [ ] API keys (test & live) generated
- [ ] All 4 subscription plans created
- [ ] Plan IDs updated in .env
- [ ] Webhook configured with correct URL
- [ ] Webhook secret updated in .env
- [ ] Database migration completed
- [ ] Test payment flow works
- [ ] Webhooks are being received
- [ ] Subscription status updates correctly
- [ ] Cancellation flow works
- [ ] Error handling tested
- [ ] Production environment variables set
- [ ] SSL certificate configured
- [ ] Domain pointed to server
- [ ] Payment confirmation emails set up
- [ ] Tested with real card (small amount)

## 🎉 Success!

Your Razorpay integration is now complete! Users can now:
- Select subscription plans
- Complete secure payments
- Receive instant activation
- Manage subscriptions
- Get automatic renewals

**Need Help?** Open an issue or contact the development team.

---

**Note:** This integration follows Razorpay best practices and PCI compliance standards. Keep your secret keys secure and never expose them in client-side code.
