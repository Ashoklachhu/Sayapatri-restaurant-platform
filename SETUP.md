# Sayapatri – Setup Guide

## 1. Install dependencies
```bash
npm install
```

## 2. Configure environment variables
Copy `.env.local.example` to `.env.local` and fill in:
- **Supabase**: Create project at supabase.com → copy URL + anon key + service role key
- **Stripe**: Create account at stripe.com → copy publishable + secret keys

## 3. Set up database
Go to Supabase → SQL Editor → paste contents of `supabase/schema.sql` → Run

## 4. Create dashboard users
In Supabase → Authentication → Add user (email/password for each branch manager)
Then in SQL Editor:
```sql
INSERT INTO dashboard_users (id, email, full_name, role, branch_id)
VALUES ('<user-uuid-from-auth>', 'manager@email.com', 'Manager Name', 'branch_manager', '<branch-uuid>');
```

## 5. Run development server
```bash
npm run dev
```

## Routes
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/menu` | Menu + ordering |
| `/checkout` | Payment (Stripe) |
| `/track/[orderId]` | Order tracking |
| `/dashboard/login` | Staff login |
| `/dashboard/orders` | Order management |
| `/dashboard/menu` | Menu management |
| `/dashboard/analytics` | Sales analytics |

## Stripe Setup (UAE)
1. Enable AED currency in Stripe dashboard
2. Enable Apple Pay domain: `sayapatristar.com`
3. Set webhook endpoint to `https://sayapatristar.com/api/webhook`

## Deploy to Vercel
```bash
npx vercel
```
Point `sayapatristar.com` DNS to Vercel.
