# ✅ Campaign Runs Feature - Complete Implementation

## Overview
Redesigned the campaign system to track each execution separately while preserving all historical data. Now when you rerun a campaign, it creates a new "run" instead of resetting the data.

## What This Solves

### Problem
Previously, rerunning a campaign would reset all statistics, losing valuable historical data about previous sends.

### Solution
Each campaign execution is now tracked as a separate "Campaign Run" with its own statistics, while the campaign maintains lifetime totals across all runs.

## Architecture

### Data Model

```
Campaign (Parent)
├── Run #1 (First send)
│   ├── 100 sent
│   ├── 50 opened
│   └── 10 clicked
├── Run #2 (Second send)
│   ├── 120 sent
│   ├── 60 opened
│   └── 15 clicked
└── Run #3 (Third send)
    ├── 110 sent
    ├── 55 opened
    └── 12 clicked

Lifetime Stats:
- Total Runs: 3
- Total Sent: 330
- Total Opened: 165
- Total Clicked: 37
```

### Database Schema

#### New Table: CampaignRun
```prisma
model CampaignRun {
  id              String   @id
  campaignId      String
  runNumber       Int      // 1, 2, 3, etc.
  status          CampaignRunStatus
  scheduledAt     DateTime?
  startedAt       DateTime?
  completedAt     DateTime?
  totalRecipients Int
  totalSent       Int
  totalFailed     Int
  totalOpened     Int
  totalClicked    Int
  emailLogs       EmailLog[]
}
```

#### Updated: Campaign
```prisma
model Campaign {
  // ... existing fields ...
  currentRunId     String?   // Active run
  lifetimeRuns     Int       // Total runs
  lifetimeSent     Int       // Total sent (all runs)
  lifetimeOpened   Int       // Total opened (all runs)
  lifetimeClicked  Int       // Total clicked (all runs)
  lastRunAt        DateTime? // Last run timestamp
  runs             CampaignRun[]
}
```

#### Updated: EmailLog
```prisma
model EmailLog {
  // ... existing fields ...
  runId    String?        // Links to specific run
  run      CampaignRun?
}
```

## Features

### 1. Campaign Rerun
- Click rerun button on completed/failed campaigns
- Creates new run with incremented run number
- Recalculates recipients (includes new contacts)
- Preserves all previous run data
- Updates lifetime statistics

### 2. Run History Page
**URL:** `/dashboard/campaigns/[id]/runs`

**Shows:**
- List of all runs for a campaign
- Run number, status, and timing
- Individual run statistics
- Performance metrics per run
- Comparison across runs

**Features:**
- View detailed metrics for each run
- See start/end times and duration
- Compare open/click rates across runs
- Access run-specific analytics

### 3. Lifetime Statistics
**Campaign List Shows:**
- Current run stats (latest execution)
- Lifetime totals (all runs combined)
- Total number of runs
- Last run timestamp

**Example Display:**
```
Current Run:
- Sent: 100
- Opened: 50
- Clicked: 10

Lifetime:
- 3 runs • 330 sent • 165 opened
```

### 4. Run-Specific Analytics
- Filter analytics by specific run
- Compare performance across runs
- Track improvement over time
- Identify best-performing runs

## User Flow

### Rerun a Campaign

```
1. User finds completed campaign
   ↓
2. Clicks rerun button (circular arrow)
   ↓
3. Confirms action
   ↓
4. System creates Run #2
   ↓
5. Campaign resets to DRAFT
   ↓
6. User clicks Send
   ↓
7. Run #2 executes
   ↓
8. Both runs preserved in history
```

### View Run History

```
1. User sees campaign with multiple runs
   ↓
2. Clicks clock icon (run history)
   ↓
3. Views list of all runs
   ↓
4. Sees metrics for each run
   ↓
5. Can click to view run-specific analytics
```

## API Endpoints

### New Endpoints

#### Get Campaign Runs
```
GET /api/campaigns/[id]/runs

Response:
[
  {
    id: "run_1",
    runNumber: 1,
    status: "COMPLETED",
    totalSent: 100,
    totalOpened: 50,
    metrics: {
      openRate: 50.0,
      clickRate: 10.0,
      bounceRate: 2.0
    }
  },
  {
    id: "run_2",
    runNumber: 2,
    status: "COMPLETED",
    totalSent: 120,
    totalOpened: 60,
    metrics: {
      openRate: 50.0,
      clickRate: 12.5,
      bounceRate: 1.5
    }
  }
]
```

### Updated Endpoints

#### Rerun Campaign
```
POST /api/campaigns/[id]/rerun

Response:
{
  campaign: { /* updated campaign */ },
  run: {
    id: "run_2",
    runNumber: 2,
    status: "PENDING"
  },
  message: "Campaign ready for run #2"
}
```

#### Send Campaign
```
POST /api/campaigns/send
{
  campaignId: "campaign_id"
}

Response:
{
  sent: 120,
  failed: 5,
  runNumber: 2
}
```

## UI Components

### Campaign List
- Shows current run stats
- Shows lifetime stats (if multiple runs)
- Clock icon to view run history (if runs exist)
- Rerun button on completed/failed campaigns

### Run History Page
- Summary statistics across all runs
- List of individual runs with details
- Performance metrics per run
- Links to run-specific analytics

### Campaign Card
```
┌─────────────────────────────────────┐
│ Campaign Name              [COMPLETED]│
│ Description here                     │
│                                      │
│ Current Run:                         │
│ Recipients: 120  Sent: 115           │
│ Opened: 60      Clicked: 15          │
│                                      │
│ Lifetime: 3 runs • 330 sent • 165 opened│
│                                      │
│ [Rerun] [Duplicate] [Analytics] [Runs]│
└─────────────────────────────────────┘
```

## Benefits

### Data Preservation
✅ Never lose historical data
✅ Track campaign evolution
✅ Compare performance over time
✅ Audit trail of all sends

### Analytics
✅ Run-specific metrics
✅ Lifetime aggregates
✅ Performance trends
✅ A/B testing capability

### User Experience
✅ Easy to rerun campaigns
✅ Clear run history
✅ Transparent statistics
✅ Better decision making

### Business Value
✅ Optimize send times
✅ Improve content based on trends
✅ Track ROI per run
✅ Better reporting

## Migration Required

⚠️ **Important:** This feature requires database migration.

### Quick Start
```bash
# 1. Generate migration
npx prisma migrate dev --name add_campaign_runs

# 2. Generate Prisma client
npx prisma generate

# 3. Restart server
npm run dev
```

See `MIGRATION_REQUIRED.md` for detailed instructions.

## Use Cases

### 1. Newsletter Campaigns
Send monthly newsletter, track performance each month:
- Run #1: January newsletter
- Run #2: February newsletter
- Run #3: March newsletter
- Compare open rates across months

### 2. Promotional Campaigns
Rerun same promotion to different segments:
- Run #1: VIP customers
- Run #2: Regular customers
- Run #3: New subscribers
- Compare conversion rates

### 3. A/B Testing
Test different send times:
- Run #1: Monday 9 AM
- Run #2: Wednesday 2 PM
- Run #3: Friday 7 PM
- Find optimal send time

### 4. Retry Failed Campaigns
If campaign fails, fix issue and rerun:
- Run #1: Failed (Gmail disconnected)
- Run #2: Success (after reconnecting)
- Track recovery metrics

## Comparison: Old vs New

### Old System (Reset on Rerun)
```
Campaign: "Welcome Email"
├── First Send: 100 sent, 50 opened
└── Rerun: RESETS TO 0
    └── Second Send: 120 sent, 60 opened
    └── LOST: First send data ❌
```

### New System (Separate Runs)
```
Campaign: "Welcome Email"
├── Run #1: 100 sent, 50 opened ✅
├── Run #2: 120 sent, 60 opened ✅
└── Lifetime: 220 sent, 110 opened ✅
```

## Statistics Tracking

### Per Run
- Recipients count
- Sent count
- Failed count
- Opened count
- Clicked count
- Bounced count
- Open rate
- Click rate
- Bounce rate
- Start/end time
- Duration

### Lifetime (Campaign)
- Total runs
- Total sent (all runs)
- Total opened (all runs)
- Total clicked (all runs)
- Last run timestamp
- Average open rate
- Average click rate

## Future Enhancements

### Planned
- [ ] Compare runs side-by-side
- [ ] Export run data to CSV
- [ ] Schedule recurring runs
- [ ] Auto-rerun on schedule
- [ ] Run templates
- [ ] Performance predictions

### Under Consideration
- [ ] Run tags/labels
- [ ] Run notes/comments
- [ ] Run approval workflow
- [ ] Run cost tracking
- [ ] Run ROI calculation

## Testing

### Test Scenarios

1. **Create and Send Campaign**
   - Creates Run #1
   - Tracks statistics
   - Updates lifetime stats

2. **Rerun Campaign**
   - Creates Run #2
   - Preserves Run #1 data
   - Updates lifetime stats

3. **View Run History**
   - Shows all runs
   - Displays metrics
   - Allows comparison

4. **Multiple Reruns**
   - Creates Run #3, #4, etc.
   - All data preserved
   - Lifetime stats accurate

## Files Changed

### New Files
1. `app/api/campaigns/[id]/runs/route.ts` - Get run history
2. `app/dashboard/campaigns/[id]/runs/page.tsx` - Run history page
3. `MIGRATION_REQUIRED.md` - Migration guide
4. `CAMPAIGN_RUNS_FEATURE.md` - This file

### Modified Files
1. `prisma/schema.prisma` - Added CampaignRun model
2. `app/api/campaigns/[id]/rerun/route.ts` - Creates runs
3. `app/api/campaigns/send/route.ts` - Works with runs
4. `app/dashboard/campaigns/page.tsx` - Shows lifetime stats
5. `lib/types.ts` - Added CampaignRun type

## Status

**Feature Status:** ✅ IMPLEMENTED
**Migration Status:** ⚠️ PENDING
**Testing Status:** ⏳ READY FOR TESTING

**Next Steps:**
1. Run database migration
2. Test rerun functionality
3. Test run history page
4. Verify lifetime statistics
5. Test with multiple runs

---

**Version:** 2.0.0
**Breaking Changes:** Yes (requires migration)
**Last Updated:** November 2024
