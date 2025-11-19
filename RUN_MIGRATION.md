# 🚀 Quick Migration Guide

## The Error You're Seeing

```
The column `Campaign.currentRunId` does not exist in the current database.
```

This means the database schema needs to be updated with the new fields.

## Quick Fix - Run This Command

Open your terminal and run:

```bash
npx prisma migrate dev --name add_campaign_runs
```

This will:
1. Create the migration SQL file
2. Apply it to your database
3. Update the Prisma Client

## If That Doesn't Work

### Option 1: Reset Database (⚠️ Deletes all data)
```bash
npx prisma migrate reset
```

### Option 2: Push Schema Directly
```bash
npx prisma db push
```

### Option 3: Manual SQL Migration

If you want to preserve existing data, run this SQL in your database:

```sql
-- Add new enum
CREATE TYPE "CampaignRunStatus" AS ENUM ('PENDING', 'SCHEDULED', 'SENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- Create CampaignRun table
CREATE TABLE "CampaignRun" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "runNumber" INTEGER NOT NULL,
    "status" "CampaignRunStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "totalSent" INTEGER NOT NULL DEFAULT 0,
    "totalFailed" INTEGER NOT NULL DEFAULT 0,
    "totalOpened" INTEGER NOT NULL DEFAULT 0,
    "totalClicked" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignRun_pkey" PRIMARY KEY ("id")
);

-- Add new fields to Campaign
ALTER TABLE "Campaign" ADD COLUMN "currentRunId" TEXT;
ALTER TABLE "Campaign" ADD COLUMN "lifetimeRuns" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Campaign" ADD COLUMN "lifetimeSent" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Campaign" ADD COLUMN "lifetimeOpened" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Campaign" ADD COLUMN "lifetimeClicked" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Campaign" ADD COLUMN "lastRunAt" TIMESTAMP(3);

-- Remove old fields from Campaign (optional - can keep for backward compatibility)
-- ALTER TABLE "Campaign" DROP COLUMN "sentAt";
-- ALTER TABLE "Campaign" DROP COLUMN "completedAt";

-- Add runId to EmailLog
ALTER TABLE "EmailLog" ADD COLUMN "runId" TEXT;

-- Create indexes
CREATE INDEX "CampaignRun_campaignId_idx" ON "CampaignRun"("campaignId");
CREATE INDEX "CampaignRun_status_idx" ON "CampaignRun"("status");
CREATE UNIQUE INDEX "CampaignRun_campaignId_runNumber_key" ON "CampaignRun"("campaignId", "runNumber");
CREATE INDEX "EmailLog_runId_idx" ON "EmailLog"("runId");

-- Add foreign keys
ALTER TABLE "CampaignRun" ADD CONSTRAINT "CampaignRun_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_runId_fkey" FOREIGN KEY ("runId") REFERENCES "CampaignRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

## After Migration

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Verify it works:**
   - Go to `/dashboard/campaigns`
   - Page should load without errors
   - Try creating and sending a campaign

## Migrate Existing Data (Optional)

If you have existing campaigns with data, run this after the schema migration:

```sql
-- Create initial runs for existing completed campaigns
INSERT INTO "CampaignRun" (
  id,
  "campaignId",
  "runNumber",
  status,
  "startedAt",
  "completedAt",
  "totalRecipients",
  "totalSent",
  "totalFailed",
  "totalOpened",
  "totalClicked",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  id,
  1,
  CASE 
    WHEN status = 'COMPLETED' THEN 'COMPLETED'::\"CampaignRunStatus\"
    WHEN status = 'FAILED' THEN 'FAILED'::\"CampaignRunStatus\"
    ELSE 'PENDING'::\"CampaignRunStatus\"
  END,
  "createdAt",
  "updatedAt",
  "totalRecipients",
  "totalSent",
  "totalFailed",
  "totalOpened",
  "totalClicked",
  "createdAt",
  "updatedAt"
FROM "Campaign"
WHERE status IN ('COMPLETED', 'FAILED');

-- Update campaigns with lifetime stats
UPDATE "Campaign" c
SET
  "lifetimeRuns" = 1,
  "lifetimeSent" = c."totalSent",
  "lifetimeOpened" = c."totalOpened",
  "lifetimeClicked" = c."totalClicked",
  "lastRunAt" = c."createdAt",
  "currentRunId" = (
    SELECT id FROM "CampaignRun" cr 
    WHERE cr."campaignId" = c.id 
    LIMIT 1
  )
WHERE status IN ('COMPLETED', 'FAILED');

-- Link existing email logs to their runs
UPDATE "EmailLog" el
SET "runId" = (
  SELECT cr.id 
  FROM "CampaignRun" cr 
  WHERE cr."campaignId" = el."campaignId" 
  LIMIT 1
)
WHERE "runId" IS NULL;
```

## Troubleshooting

### Error: "relation already exists"
The table might already be partially created. Try:
```bash
npx prisma db push --force-reset
```

### Error: "migration failed"
Check your database connection in `.env`:
```
DATABASE_URL="postgresql://..."
```

### Still Having Issues?
1. Check database is running
2. Verify DATABASE_URL in .env
3. Try `npx prisma studio` to see current schema
4. Check PostgreSQL logs for errors

## Quick Commands Reference

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_campaign_runs

# Push schema without migration
npx prisma db push

# Reset database (deletes data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# View migration status
npx prisma migrate status
```

## What's Next?

After successful migration:
1. ✅ Campaigns page will load
2. ✅ You can create campaigns
3. ✅ You can send campaigns (creates Run #1)
4. ✅ You can rerun campaigns (creates Run #2, #3, etc.)
5. ✅ View run history at `/dashboard/campaigns/[id]/runs`

---

**Need Help?** Check the error message and try the solutions above in order.
