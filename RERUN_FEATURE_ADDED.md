# ✅ Rerun Campaign Feature - Added

## Overview
Added the ability to rerun completed or failed campaigns, allowing users to resend campaigns without creating duplicates.

## What Was Added

### 1. New API Endpoint
**File:** `app/api/campaigns/[id]/rerun/route.ts`

**Endpoint:** `POST /api/campaigns/[id]/rerun`

**Functionality:**
- Resets campaign status to DRAFT
- Clears all statistics (sent, opened, clicked, failed)
- Recalculates recipient count (in case contacts changed)
- Clears scheduling information
- Preserves old email logs for historical reference
- Only works for COMPLETED or FAILED campaigns

**Response:**
```json
{
  "campaign": { /* updated campaign object */ },
  "message": "Campaign reset and ready to rerun"
}
```

### 2. UI Updates
**File:** `app/dashboard/campaigns/page.tsx`

**Changes:**
- Added `ArrowPathIcon` import from Heroicons
- Added `handleRerun()` function with confirmation dialog
- Added rerun button for COMPLETED and FAILED campaigns
- Button appears with green color and circular arrow icon
- Shows confirmation before resetting campaign

**Button Placement:**
- Appears only on campaigns with status COMPLETED or FAILED
- Located in the action buttons row
- Positioned before duplicate button

### 3. Documentation Updates

**Updated Files:**
- `CAMPAIGNS_FEATURE.md` - Added rerun to managing campaigns section
- `CAMPAIGNS_QUICK_REFERENCE.md` - Updated API endpoints and status flow
- `CAMPAIGNS_TESTING_GUIDE.md` - Added test scenario for rerun

## How It Works

### User Flow
```
1. User finds completed/failed campaign
2. Clicks rerun icon (circular arrow)
3. Confirms action in dialog
4. Campaign resets to DRAFT status
5. All stats reset to 0
6. Recipient count recalculated
7. User can now send campaign again
```

### Status Flow
```
COMPLETED ──(rerun)──> DRAFT ──(send)──> SENDING ──> COMPLETED
    ↑                                                      │
    └──────────────────(rerun again)─────────────────────┘

FAILED ──(rerun)──> DRAFT ──(send)──> SENDING ──> COMPLETED/FAILED
```

### Data Handling
- **Preserved:** Old email logs (for historical analytics)
- **Reset:** totalSent, totalFailed, totalOpened, totalClicked
- **Cleared:** scheduledAt, sentAt, completedAt
- **Recalculated:** totalRecipients (based on current active contacts)
- **Changed:** status (COMPLETED/FAILED → DRAFT)

## Use Cases

### 1. Retry Failed Campaign
If a campaign failed due to temporary issues (Gmail connection, rate limits), users can fix the issue and rerun.

### 2. Resend to Updated List
If new contacts were added with the same tags, rerun will include them automatically.

### 3. Periodic Campaigns
For recurring campaigns (newsletters, updates), rerun instead of creating new campaigns.

### 4. A/B Testing
Run the same campaign multiple times with different timing or slight modifications.

## Benefits

### vs. Duplicate
- **Rerun:** Keeps same campaign ID, preserves history, updates recipient count
- **Duplicate:** Creates new campaign, starts fresh, no history

### vs. Manual Recreation
- **Rerun:** One click, automatic reset, preserves configuration
- **Manual:** Multiple steps, prone to errors, time-consuming

## Security & Validation

### Checks
- ✅ Campaign must exist
- ✅ Campaign must be COMPLETED or FAILED
- ✅ User must own the campaign (via userId scoping)
- ✅ Confirmation required before reset

### Error Handling
- 404 if campaign not found
- 400 if campaign status is not COMPLETED/FAILED
- 500 for database errors
- User-friendly error messages

## Testing

### Test Scenario
```
1. Create and send a campaign
2. Wait for completion
3. Click rerun icon
4. Confirm dialog
5. Verify status changed to DRAFT
6. Verify stats reset to 0
7. Verify recipient count updated
8. Send campaign again
9. Verify new email logs created
10. Verify old logs still exist
```

### Edge Cases
- ✅ Rerun with no active contacts
- ✅ Rerun with changed contact list
- ✅ Rerun multiple times
- ✅ Rerun after contacts deleted
- ✅ Rerun with different Gmail connection

## UI/UX Details

### Icon
- **Icon:** ArrowPathIcon (circular arrow)
- **Color:** Green (`text-green-600`)
- **Hover:** Light green background (`hover:bg-green-50`)
- **Tooltip:** "Rerun Campaign"

### Confirmation Dialog
- **Message:** "This will reset the campaign and allow you to send it again. Continue?"
- **Buttons:** Cancel / OK
- **Prevents:** Accidental resets

### Toast Notifications
- **Success:** "Campaign reset and ready to rerun"
- **Error:** Specific error message from API

## Analytics Impact

### Historical Data
- Old email logs are **preserved**
- Previous campaign run data remains in analytics
- New run will create new email logs
- Analytics will show combined data from all runs

### Metrics After Rerun
- Campaign stats reset to 0
- Ready for new tracking
- Previous run data still accessible via email logs

## API Details

### Request
```typescript
POST /api/campaigns/[id]/rerun
// No body required
```

### Success Response (200)
```json
{
  "campaign": {
    "id": "clx...",
    "name": "Campaign Name",
    "status": "DRAFT",
    "totalRecipients": 150,
    "totalSent": 0,
    "totalFailed": 0,
    "totalOpened": 0,
    "totalClicked": 0,
    "scheduledAt": null,
    "sentAt": null,
    "completedAt": null
  },
  "message": "Campaign reset and ready to rerun"
}
```

### Error Responses
```json
// 404 - Not Found
{
  "error": "Campaign not found"
}

// 400 - Invalid Status
{
  "error": "Only completed or failed campaigns can be rerun"
}

// 500 - Server Error
{
  "error": "Failed to rerun campaign",
  "details": "Error message"
}
```

## Code Example

### Frontend Usage
```typescript
const handleRerun = async (campaignId: string) => {
  if (!confirm('This will reset the campaign and allow you to send it again. Continue?')) {
    return;
  }

  try {
    const response = await fetch(`/api/campaigns/${campaignId}/rerun`, {
      method: 'POST',
    });

    if (response.ok) {
      toast.success('Campaign reset and ready to rerun');
      fetchCampaigns(); // Refresh list
    } else {
      const error = await response.json();
      toast.error(error.error || 'Failed to rerun campaign');
    }
  } catch (error) {
    toast.error('An error occurred');
  }
};
```

### Backend Logic
```typescript
// 1. Validate campaign exists and status
// 2. Recalculate recipients
// 3. Reset campaign fields
// 4. Keep old email logs
// 5. Return updated campaign
```

## Performance Considerations

### Database Operations
- 1 SELECT (find campaign)
- 1 COUNT (recalculate recipients)
- 1 UPDATE (reset campaign)
- Total: 3 queries (very efficient)

### No Data Loss
- Email logs preserved
- Historical analytics intact
- Audit trail maintained

## Future Enhancements

### Potential Additions
- [ ] Rerun with modified template
- [ ] Rerun to different audience
- [ ] Schedule rerun for later
- [ ] Automatic periodic reruns
- [ ] Rerun only to unopened recipients
- [ ] Rerun with A/B test variants

## Comparison with Other Features

| Feature | Purpose | Creates New Campaign | Preserves History |
|---------|---------|---------------------|-------------------|
| **Rerun** | Resend same campaign | No | Yes |
| **Duplicate** | Clone campaign | Yes | No |
| **Edit** | Modify draft | No | N/A |
| **Resume** | Continue paused | No | Yes |

## Documentation Updates

### Files Updated
1. ✅ `CAMPAIGNS_FEATURE.md` - Added to managing campaigns
2. ✅ `CAMPAIGNS_QUICK_REFERENCE.md` - Updated API list and status flow
3. ✅ `CAMPAIGNS_TESTING_GUIDE.md` - Added test scenario
4. ✅ `RERUN_FEATURE_ADDED.md` - This file (detailed documentation)

## Checklist

- ✅ API endpoint created
- ✅ UI button added
- ✅ Confirmation dialog implemented
- ✅ Error handling complete
- ✅ Toast notifications added
- ✅ Documentation updated
- ✅ No TypeScript errors
- ✅ Security validated
- ✅ User flow tested

## Status

**Feature Status:** ✅ COMPLETE & READY TO USE

**Files Modified:**
- `app/api/campaigns/[id]/rerun/route.ts` (NEW)
- `app/dashboard/campaigns/page.tsx` (UPDATED)
- `CAMPAIGNS_FEATURE.md` (UPDATED)
- `CAMPAIGNS_QUICK_REFERENCE.md` (UPDATED)
- `CAMPAIGNS_TESTING_GUIDE.md` (UPDATED)

**Total Changes:**
- 1 new API route
- 1 new function in UI
- 1 new button in UI
- 4 documentation updates

---

**Last Updated:** November 2024
**Version:** 1.1.0
**Status:** Production Ready ✅
