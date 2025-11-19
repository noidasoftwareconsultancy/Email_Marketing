# 🔄 Database Migration Required - Campaign Runs Feature

## Overview
The Campaign Runs feature requires database schema changes to track each campaign execution separately while preserving historical data.

## What Changed

### New Model: CampaignRun
Tracks each individual execution of a campaign:
- `id` - Unique identifier
- `campaignId` - Reference to parent campaign
- `runNumber` - Sequential run number (1, 2, 3, etc.)
- `status` - Run status (PENDING, SENDING, COMPLETED, FAILED, CANCELLED)
- `scheduledAt`, `startedAt`, `completedAt` - Timing information
- `totalRecipients`, `totalSent`, `totalFailed`, `totalOpened`, `totalClicked` - Run metrics
- `createdAt`, `updatedAt` - Timestamps

### Updated Model: Campaign
Added fields to track lifetime statistics:
- `currentRunId` - Reference to active run
- `lifetimeRuns` - Total number of runs
- `lifetimeSent` - Total emails sent across all runs
- `lifetimeOpened` - Total opens across all runs
- `lifetimeClicked` - Total clicks across all runs
- `lastRunAt` - Timestamp of last run

Removed fields:
- `sentAt`, `completedAt` (moved to CampaignRun)

### Updated Model: EmailLog
Added field:
- `runId` - Reference to specific campaign run

### New Enum: CampaignRunStatus
- PENDING
- SCHEDULED
- SENDING
- COMPLETED
- FAILED
- CANCELLED

## Migration Steps

### Step 1: Generate Migration
```bash
npx prisma migrate dev --name add_campaign_runs
```

This will:
1. Create the `CampaignRun` table
2. Add new fields to `Campaign` table
3. Add `runId` field to `EmailLog` table
4. Create the `CampaignRunStatus` enum

### Step 2: Data Migration (Optional)
If you have existing campaigns with data, you may want to migrate them:

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
  "sentAt",
  "completedAt",
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
  "lastRunAt" = c."sentAt",
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

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

### Step 4: Restart Development Server
```bash
npm run dev
```

## Verification

### Check Tables Created
```sql
-- Check CampaignRun table
SELECT * FROM "CampaignRun" LIMIT 5;

-- Check Campaign updates
SELECT id, name, "lifetimeRuns", "lifetimeSent", "currentRunId" 
FROM "Campaign" 
LIMIT 5;

-- Check EmailLog updates
SELECT id, "campaignId", "runId", status 
FROM "EmailLog" 
LIMIT 5;
```

### Test in Application
1. Go to `/dashboard/campaigns`
2. Find a completed campaign
3. Click the rerun button
4. Verify new run is created
5. Send the campaign
6. Check run history at `/dashboard/campaigns/[id]/runs`

## Rollback (If Needed)

If you need to rollback:

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back add_campaign_runs

# Or reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

## Benefits of This Approach

### Data Preservation
- ✅ All historical campaign data preserved
- ✅ Each run tracked separately
- ✅ Email logs linked to specific runs
- ✅ Lifetime statistics maintained

### Analytics
- ✅ Compare performance across runs
- ✅ Track improvement over time
- ✅ Identify best-performing runs
- ✅ Analyze run-specific metrics

### User Experience
- ✅ View complete run history
- ✅ Rerun campaigns without losing data
- ✅ Track campaign evolution
- ✅ Better reporting capabilities

## API Changes

### New Endpoints
- `GET /api/campaigns/[id]/runs` - Get all runs for a campaign
- `POST /api/campaigns/[id]/rerun` - Create new run (updated)

### Updated Endpoints
- `POST /api/campaigns/send` - Now creates/updates runs
- `GET /api/campaigns/[id]/analytics` - Can filter by run

### New Pages
- `/dashboard/campaigns/[id]/runs` - View run history

## Schema Comparison

### Before (Old Schema)
```prisma
model Campaign {
  id              String
  name            String
  status          CampaignStatus
  totalSent       Int
  totalOpened     Int
  totalClicked    Int
  sentAt          DateTime?
  completedAt     DateTime?
  emailLogs       EmailLog[]
}

model EmailLog {
  id          String
  campaignId  String
  campaign    Campaign
  status      EmailStatus
}
```

### After (New Schema)
```prisma
model Campaign {
  id              String
  name            String
  status          CampaignStatus
  currentRunId    String?
  totalSent       Int          // Current run
  totalOpened     Int          // Current run
  totalClicked    Int          // Current run
  lifetimeRuns    Int          // All runs
  lifetimeSent    Int          // All runs
  lifetimeOpened  Int          // All runs
  lifetimeClicked Int          // All runs
  lastRunAt       DateTime?
  runs            CampaignRun[]
  emailLogs       EmailLog[]
}

model CampaignRun {
  id          String
  campaignId  String
  campaign    Campaign
  runNumber   Int
  status      CampaignRunStatus
  totalSent   Int
  totalOpened Int
  totalClicked Int
  startedAt   DateTime?
  completedAt DateTime?
  emailLogs   EmailLog[]
}

model EmailLog {
  id          String
  campaignId  String
  campaign    Campaign
  runId       String?
  run         CampaignRun?
  status      EmailStatus
}
```

## Testing Checklist

After migration:
- [ ] Create new campaign
- [ ] Send campaign (creates run #1)
- [ ] View run history
- [ ] Rerun campaign (creates run #2)
- [ ] Send again
- [ ] Verify both runs in history
- [ ] Check lifetime stats updated
- [ ] View analytics for specific run
- [ ] Verify email logs linked to runs

## Support

If you encounter issues:
1. Check Prisma migration logs
2. Verify database connection
3. Check for schema conflicts
4. Review error messages
5. Rollback if necessary

## Status

**Migration Status:** ⚠️ PENDING - Run migration commands above

**Files Updated:**
- `prisma/schema.prisma` ✅
- `app/api/campaigns/[id]/rerun/route.ts` ✅
- `app/api/campaigns/send/route.ts` ✅
- `app/api/campaigns/[id]/runs/route.ts` ✅ (NEW)
- `app/dashboard/campaigns/[id]/runs/page.tsx` ✅ (NEW)
- `app/dashboard/campaigns/page.tsx` ✅
- `lib/types.ts` ✅

**Next Steps:**
1. Run `npx prisma migrate dev --name add_campaign_runs`
2. Run `npx prisma generate`
3. Restart dev server
4. Test the feature

---

**Last Updated:** November 2024
**Version:** 2.0.0
**Breaking Changes:** Yes (requires migration)
