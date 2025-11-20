# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (Supabase recommended)
- SMTP credentials for sending emails

## Step 1: Prepare Your Repository
Your project is now ready for Vercel deployment with:
- ✅ Prisma generation in build script
- ✅ postinstall hook for Prisma client
- ✅ vercel.json configuration
- ✅ .env.example for reference

## Step 2: Set Up Database
1. If using Supabase (recommended):
   - Go to https://supabase.com
   - Create a new project
   - Get your connection string from Settings > Database
   - Use the **pooled connection** (port 6543) for production

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect Next.js
4. Add environment variables (see below)
5. Click "Deploy"

### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

## Step 4: Configure Environment Variables

In Vercel Dashboard > Settings > Environment Variables, add:

### Required Variables:
```
DATABASE_URL=postgresql://user:password@host:6543/database?pgbouncer=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SMTP_EMAIL=your_email@domain.com
SMTP_PASSWORD=your_app_password
NEXTAUTH_SECRET=generate_random_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Company Branding:
```
NEXT_PUBLIC_COMPANY_NAME=eWynk
NEXT_PUBLIC_COMPANY_EMAIL=hello@ewynk.com
NEXT_PUBLIC_COMPANY_WEBSITE=https://ewynk.com
NEXT_PUBLIC_COMPANY_ADDRESS=Digital Marketing Solutions
NEXT_PUBLIC_COMPANY_PHONE=support@ewynk.com
NEXT_PUBLIC_FROM_NAME=eWynk Mail
NEXT_PUBLIC_REPLY_TO_EMAIL=noreply@ewynk.com
NEXT_PUBLIC_UNSUBSCRIBE_URL=https://ewynk.com/unsubscribe
```

### Optional (Google OAuth):
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/auth/google/callback
```

## Step 5: Run Database Migrations

After deployment, run migrations:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link to your project
vercel link

# Run migration
vercel env pull .env.local
npx prisma db push
```

Or use Supabase SQL Editor to run migrations manually.

## Step 6: Verify Deployment

1. Visit your Vercel URL
2. Check that the app loads correctly
3. Test email sending functionality
4. Verify database connections

## Troubleshooting

### Build Fails with Prisma Error
- Ensure DATABASE_URL is set in environment variables
- Check that prisma is in devDependencies
- Verify postinstall script runs: `"postinstall": "prisma generate"`

### Database Connection Issues
- Use pooled connection (port 6543) for Supabase
- Ensure `?pgbouncer=true` is in connection string
- Check database credentials are correct

### Email Sending Fails
- Verify SMTP credentials
- Check SMTP_EMAIL and SMTP_PASSWORD are set
- Ensure your email provider allows app passwords

### Environment Variables Not Working
- Make sure to redeploy after adding env vars
- Check variable names match exactly (case-sensitive)
- Verify NEXT_PUBLIC_ prefix for client-side variables

## Post-Deployment

### Custom Domain (Optional)
1. Go to Vercel Dashboard > Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL

### Monitoring
- Check Vercel Dashboard for logs
- Monitor email sending limits
- Set up error tracking (Sentry, etc.)

## Important Notes

- Prisma Client is generated automatically during build
- Database migrations must be run separately
- Environment variables are encrypted by Vercel
- Free tier has usage limits (check Vercel pricing)
- Keep your .env file secure and never commit it

## Support

For issues:
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs
