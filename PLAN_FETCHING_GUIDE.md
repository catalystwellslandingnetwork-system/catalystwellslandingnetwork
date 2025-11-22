# Plan Fetching Configuration Guide

## Overview
Guide to configure dynamic plan fetching from main app database instead of hardcoded plans.

---

## 🎯 Current vs Dynamic Plans

### **Current (Static)**
Plans hardcoded in `app/checkout/page.tsx`

**Pros:**
- ✅ Fast loading
- ✅ No database dependency
- ✅ Simple to maintain

**Cons:**
- ❌ Requires code deployment to change plans
- ❌ Can't update pricing instantly
- ❌ Not synced with main app

### **Dynamic (Database)**
Plans fetched from main app database

**Pros:**
- ✅ Centralized plan management
- ✅ Update plans without code changes
- ✅ Always synced with main app
- ✅ Can add/remove plans dynamically

**Cons:**
- ❌ Requires database query
- ❌ Network dependency
- ❌ Need fallback for errors

---

## 📋 Implementation Steps

### **Step 1: Create Plans Table in Main App**

Run this in your **main app** Supabase:

```sql
-- Create plans table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  price_per_student NUMERIC(10,2) NOT NULL,
  icon TEXT DEFAULT 'Zap',
  gradient TEXT DEFAULT 'from-neon-blue to-neon-cyan',
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_plans_active ON plans(is_active);
CREATE INDEX idx_plans_sort ON plans(sort_order);

-- Insert default plans
INSERT INTO plans (name, display_name, price_per_student, icon, gradient, features, sort_order) VALUES
('catalyst-ai', 'Catalyst AI', 15.00, 'Zap', 'from-neon-blue to-neon-cyan', 
 '["Luminex Pro", "70 AI Credits per Student (Daily)", "All Dashboards", "Core Modules", "On-Demand Report Cards"]'::jsonb, 1),

('catalyst-ai-pro', 'Catalyst AI Pro', 25.00, 'Building2', 'from-neon-purple via-neon-pink to-premium-purple',
 '["Luminex AI Pro Plus", "150 AI Credits per Student (Daily)", "All Dashboards", "Expanded AI Tools", "Enterprise Security"]'::jsonb, 2),

('catalyst-ai-extreme', 'Catalyst AI Extreme', 500.00, 'Crown', 'from-premium-gold via-premium-pink to-neon-pink',
 '["Luminex AI Extreme", "UNLIMITED AI Credits", "All Premium Resources", "Van Tracking Module", "24/7 Priority Support", "Dedicated Account Manager"]'::jsonb, 3);

-- Add RLS policies (if using RLS)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are viewable by everyone"
  ON plans FOR SELECT
  USING (is_active = true);
```

### **Step 2: Add API Function**

Add to `lib/main-app-supabase.ts`:

```typescript
/**
 * Get active plans from main app database
 */
export async function getActivePlans() {
  if (!mainAppSupabase) {
    throw new Error('Main app database not configured');
  }

  const { data, error } = await mainAppSupabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }

  return data;
}
```

### **Step 3: Create API Endpoint**

Create `app/api/plans/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getActivePlans } from '@/lib/main-app-supabase';

export async function GET(req: NextRequest) {
  try {
    const plans = await getActivePlans();
    
    return NextResponse.json({ 
      success: true,
      plans 
    });
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch plans' 
      },
      { status: 500 }
    );
  }
}

// Optional: Add caching
export const revalidate = 300; // Cache for 5 minutes
```

### **Step 4: Update Checkout Page**

Modify `app/checkout/page.tsx`:

```typescript
import { useState, useEffect } from "react";
import { Zap, Building2, Crown } from "lucide-react";

// Map icon names to components
const iconMap: Record<string, any> = {
  Zap,
  Building2,
  Crown,
};

// Default fallback plans (same as current static plans)
const defaultPricingPlans = [
  {
    name: "Catalyst AI",
    icon: Zap,
    price: 15,
    gradient: "from-neon-blue to-neon-cyan",
    features: [
      "Luminex Pro",
      "70 AI Credits per Student (Daily)",
      "All Dashboards",
      "Core Modules",
      "On-Demand Report Cards",
    ],
  },
  // ... other plans
];

export default function CheckoutPage() {
  const [pricingPlans, setPricingPlans] = useState(defaultPricingPlans);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    // Fetch plans from main app database
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      const data = await response.json();
      
      if (data.success && data.plans && data.plans.length > 0) {
        // Transform database plans to component format
        const transformedPlans = data.plans.map((plan: any) => ({
          name: plan.display_name,
          icon: iconMap[plan.icon] || Zap,
          price: Number(plan.price_per_student),
          gradient: plan.gradient,
          features: plan.features || [],
        }));
        
        setPricingPlans(transformedPlans);
        console.log('✅ Loaded plans from database');
      } else {
        console.warn('⚠️ Using default static plans');
      }
    } catch (error) {
      console.error('❌ Error fetching plans, using defaults:', error);
    } finally {
      setPlansLoading(false);
    }
  };

  // ... rest of component
}
```

### **Step 5: Add Loading State (Optional)**

```typescript
{plansLoading ? (
  <div className="text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto"></div>
    <p className="text-gray-400 mt-4">Loading plans...</p>
  </div>
) : (
  // Plan selection UI
)}
```

---

## 🔧 Managing Plans

### **Add New Plan**

```sql
INSERT INTO plans (name, display_name, price_per_student, icon, gradient, features, sort_order)
VALUES (
  'enterprise',
  'Enterprise',
  1000.00,
  'Building2',
  'from-blue-500 to-purple-600',
  '["Custom Features", "Dedicated Support", "SLA Guarantee"]'::jsonb,
  4
);
```

### **Update Plan Pricing**

```sql
UPDATE plans
SET price_per_student = 30.00,
    updated_at = NOW()
WHERE name = 'catalyst-ai-pro';
```

### **Disable Plan**

```sql
UPDATE plans
SET is_active = false
WHERE name = 'old-plan';
```

### **Change Plan Order**

```sql
UPDATE plans
SET sort_order = 1
WHERE name = 'catalyst-ai-extreme';

UPDATE plans
SET sort_order = 3
WHERE name = 'catalyst-ai';
```

---

## 🎨 Plan Schema Reference

### **Database Fields**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | UUID | Unique identifier | auto-generated |
| `name` | TEXT | Internal name (unique) | `'catalyst-ai-pro'` |
| `display_name` | TEXT | Shown to users | `'Catalyst AI Pro'` |
| `description` | TEXT | Plan description | `'Best for medium schools'` |
| `price_per_student` | NUMERIC | Price per student/month | `25.00` |
| `icon` | TEXT | Icon component name | `'Building2'` |
| `gradient` | TEXT | Tailwind gradient class | `'from-neon-purple to-neon-pink'` |
| `features` | JSONB | Array of features | `["Feature 1", "Feature 2"]` |
| `is_active` | BOOLEAN | Show plan | `true` |
| `sort_order` | INTEGER | Display order | `1` |

### **Frontend Format**

```typescript
interface Plan {
  name: string;           // display_name from DB
  icon: LucideIcon;       // Mapped from icon name
  price: number;          // price_per_student
  gradient: string;       // Tailwind classes
  features: string[];     // From JSONB array
}
```

---

## 🧪 Testing

### **Test Plan Fetching**

```bash
# Test API endpoint
curl http://localhost:3004/api/plans

# Expected response:
{
  "success": true,
  "plans": [
    {
      "id": "uuid",
      "name": "catalyst-ai",
      "display_name": "Catalyst AI",
      "price_per_student": 15.00,
      "features": ["Feature 1", "Feature 2"],
      "is_active": true,
      "sort_order": 1
    }
  ]
}
```

### **Test Fallback**

```typescript
// Temporarily break API to test fallback
// Should still show default static plans
```

---

## ⚡ Performance Optimization

### **1. Add Caching**

```typescript
// In app/api/plans/route.ts
export const revalidate = 300; // Cache for 5 minutes
```

### **2. Use SWR for Client-Side**

```typescript
import useSWR from 'swr';

const { data, error } = useSWR('/api/plans', fetcher, {
  fallbackData: { plans: defaultPricingPlans },
  revalidateOnFocus: false,
  dedupingInterval: 60000 // 1 minute
});
```

### **3. Preload on Page Load**

```typescript
// In app/checkout/page.tsx
export async function generateStaticParams() {
  // Fetch plans at build time
  const plans = await getActivePlans();
  return { plans };
}
```

---

## 🔄 Migration Path

### **Phase 1: Dual Mode (Recommended)**
- Keep static plans as fallback
- Fetch from database if available
- No breaking changes

### **Phase 2: Database Only**
- Remove static plans
- Require database connection
- Better for production

### **Rollback Plan**
If issues arise:
1. Set `is_active = false` for all plans in DB
2. System automatically falls back to static plans
3. Fix issues
4. Re-enable plans in DB

---

## 📝 Checklist

- [ ] Plans table created in main app
- [ ] Default plans inserted
- [ ] `getActivePlans()` function added
- [ ] API endpoint created (`/api/plans`)
- [ ] Checkout page updated to fetch plans
- [ ] Fallback to static plans works
- [ ] Loading state implemented
- [ ] Tested adding new plan
- [ ] Tested updating pricing
- [ ] Tested disabling plan

---

## 💡 Best Practices

1. **Always Have Fallback:** Keep static plans as backup
2. **Cache Aggressively:** Plans don't change often
3. **Validate Data:** Ensure price > 0, features exist
4. **Log Errors:** Track when fallback is used
5. **Version Plans:** Consider adding version field for history
6. **A/B Testing:** Add `variant` field for experiments

---

## 🚀 Advanced Features

### **Plan Variants (A/B Testing)**

```sql
ALTER TABLE plans ADD COLUMN variant TEXT DEFAULT 'default';

-- Test different pricing
INSERT INTO plans (name, display_name, price_per_student, variant)
VALUES ('catalyst-ai-pro', 'Catalyst AI Pro', 20.00, 'discount-test');
```

### **Regional Pricing**

```sql
ALTER TABLE plans ADD COLUMN region TEXT DEFAULT 'IN';
ALTER TABLE plans ADD COLUMN currency TEXT DEFAULT 'INR';

-- Different pricing for different regions
INSERT INTO plans (name, display_name, price_per_student, region, currency)
VALUES ('catalyst-ai-pro', 'Catalyst AI Pro', 3.00, 'US', 'USD');
```

### **Time-Limited Offers**

```sql
ALTER TABLE plans 
  ADD COLUMN offer_start TIMESTAMPTZ,
  ADD COLUMN offer_end TIMESTAMPTZ,
  ADD COLUMN offer_price NUMERIC(10,2);

-- Show offer price if within date range
```

---

## Summary

**Static Plans:** Simple, fast, but requires code changes  
**Dynamic Plans:** Flexible, centralized, requires database

**Recommended:** Implement dynamic with static fallback for best of both worlds.

See `LANDING_PAGE_MAIN_APP_INTEGRATION.md` for complete integration guide.
