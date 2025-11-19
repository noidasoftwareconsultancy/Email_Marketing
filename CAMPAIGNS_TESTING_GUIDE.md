# Campaigns Feature - Testing Guide

## Pre-Testing Setup

### 1. Database Setup
```bash
# Run Prisma migrations
npx prisma migrate dev

# Seed database with test data
npx prisma db seed
```

### 2. Environment Variables
Ensure `.env` has:
```
DATABASE_URL="your_postgresql_url"
```

### 3. Gmail Connection
1. Go to `/dashboard/settings`
2. Connect Gmail account with SMTP credentials
3. Verify connection is successful

### 4. Test Data Requirements
- At least 5 contacts in database
- At least 2 email templates
- Contacts with various tags (e.g., "customer", "lead", "vip")

## Test Scenarios

### Scenario 1: Create Campaign (Basic)
**Steps:**
1. Navigate to `/dashboard/campaigns`
2. Click "Create Campaign" button
3. Fill in form:
   - Name: "Test Campaign 1"
   - Description: "Testing basic campaign creation"
   - Template: Select any template
   - Target Tags: Leave empty
4. Click "Create Campaign"

**Expected Result:**
- ✅ Success toast appears
- ✅ Campaign appears in list with DRAFT status
- ✅ Total recipients shows count of all active contacts
- ✅ Modal closes automatically

### Scenario 2: Create Campaign (With Tags)
**Steps:**
1. Click "Create Campaign"
2. Fill in form:
   - Name: "VIP Campaign"
   - Template: Select template
   - Target Tags: "vip, customer"
3. Click "Create Campaign"

**Expected Result:**
- ✅ Campaign created with DRAFT status
- ✅ Total recipients shows only contacts with "vip" OR "customer" tags
- ✅ Tags are properly saved

### Scenario 3: Create Scheduled Campaign
**Steps:**
1. Click "Create Campaign"
2. Fill in form with all details
3. Set "Schedule Date & Time" to tomorrow at 10:00 AM
4. Click "Create Campaign"

**Expected Result:**
- ✅ Campaign created with SCHEDULED status
- ✅ scheduledAt field is set correctly
- ✅ Campaign shows scheduled time in list

### Scenario 4: Edit Draft Campaign
**Steps:**
1. Find a DRAFT campaign
2. Click pencil (edit) icon
3. Change name to "Updated Campaign Name"
4. Change description
5. Click "Update Campaign"

**Expected Result:**
- ✅ Success toast appears
- ✅ Campaign name updated in list
- ✅ Description updated
- ✅ Other fields remain unchanged

### Scenario 5: Delete Single Campaign
**Steps:**
1. Find any campaign
2. Click trash (delete) icon
3. Confirm deletion in dialog

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ After confirmation, success toast appears
- ✅ Campaign removed from list
- ✅ Campaign deleted from database

### Scenario 6: Duplicate Campaign
**Steps:**
1. Find any campaign
2. Click duplicate icon
3. Wait for operation to complete

**Expected Result:**
- ✅ Success toast appears
- ✅ New campaign appears with "(Copy)" suffix
- ✅ New campaign has DRAFT status
- ✅ All other fields copied correctly

### Scenario 7: Search Campaigns
**Steps:**
1. Type "Test" in search box
2. Observe filtered results
3. Clear search box
4. Type "VIP"
5. Observe filtered results

**Expected Result:**
- ✅ Only campaigns matching search term shown
- ✅ Search is case-insensitive
- ✅ Searches both name and description
- ✅ Results update in real-time

### Scenario 8: Filter by Status
**Steps:**
1. Select "DRAFT" from status filter
2. Observe results
3. Select "SCHEDULED"
4. Observe results
5. Select "ALL"

**Expected Result:**
- ✅ Only campaigns with selected status shown
- ✅ Filter works correctly for all statuses
- ✅ "ALL" shows all campaigns

### Scenario 9: Bulk Select and Delete
**Steps:**
1. Check "Select All" checkbox
2. Verify all campaigns selected
3. Click "Delete (X)" button
4. Confirm deletion

**Expected Result:**
- ✅ All campaigns selected
- ✅ Delete button shows correct count
- ✅ Confirmation dialog appears
- ✅ All selected campaigns deleted
- ✅ Success toast shows count

### Scenario 10: Send Campaign Immediately
**Steps:**
1. Find a DRAFT campaign
2. Click "Send" button
3. In scheduler modal, ensure "Send Now" is selected
4. Review recipient count
5. Click "Send Now" button
6. Wait for completion

**Expected Result:**
- ✅ Scheduler modal opens
- ✅ Recipient count displayed correctly
- ✅ Sending starts immediately
- ✅ Success toast shows sent count
- ✅ Campaign status changes to COMPLETED
- ✅ totalSent field updated

### Scenario 11: Schedule Campaign for Later
**Steps:**
1. Find a DRAFT campaign
2. Click "Send" button
3. Select "Schedule for Later"
4. Click "Tomorrow" quick select
5. Select "10:00 AM" optimal time
6. Review scheduled time preview
7. Click "Schedule Campaign"

**Expected Result:**
- ✅ Date and time selected correctly
- ✅ Preview shows formatted date/time
- ✅ Campaign status changes to SCHEDULED
- ✅ scheduledAt field set correctly
- ✅ Success toast appears

### Scenario 12: Pause Sending Campaign
**Steps:**
1. Find a SENDING or SCHEDULED campaign
2. Click pause icon
3. Wait for operation

**Expected Result:**
- ✅ Campaign status changes to PAUSED
- ✅ Success toast appears
- ✅ Pause icon replaced with play icon

### Scenario 13: Resume Paused Campaign
**Steps:**
1. Find a PAUSED campaign
2. Click play (resume) icon
3. Wait for operation

**Expected Result:**
- ✅ Campaign status changes to SENDING or SCHEDULED
- ✅ Success toast appears
- ✅ Play icon replaced with pause icon

### Scenario 14: View Campaign Analytics
**Steps:**
1. Find a COMPLETED campaign
2. Click chart (analytics) icon
3. Review analytics page

**Expected Result:**
- ✅ Analytics page loads
- ✅ All metrics displayed correctly:
  - Delivery Rate
  - Open Rate
  - Click Rate
  - Bounce Rate
- ✅ Status breakdown shows counts
- ✅ Recent activity table populated
- ✅ Advanced metrics with progress bars
- ✅ Back button returns to campaigns list

### Scenario 15: View Analytics for Campaign with No Activity
**Steps:**
1. Create and send a campaign to test contacts
2. Immediately view analytics

**Expected Result:**
- ✅ Analytics page loads
- ✅ Metrics show 0% for engagement
- ✅ Status breakdown shows only "Sent"
- ✅ No errors displayed
- ✅ "No activity yet" message for timeline

### Scenario 16: Template Preview in Create Modal
**Steps:**
1. Click "Create Campaign"
2. Select different templates from dropdown
3. Observe preview section

**Expected Result:**
- ✅ Preview updates when template changes
- ✅ Subject line displayed
- ✅ Preview text displayed (if available)
- ✅ Template name shown

### Scenario 17: Gmail Not Connected Warning
**Steps:**
1. Disconnect Gmail in settings
2. Navigate to campaigns page
3. Try to send a campaign

**Expected Result:**
- ✅ Yellow warning banner displayed at top
- ✅ Warning explains Gmail not connected
- ✅ Link to settings provided
- ✅ Send button disabled or shows error

### Scenario 18: Campaign with No Recipients
**Steps:**
1. Create campaign with tags that match no contacts
2. Try to send campaign

**Expected Result:**
- ✅ Campaign shows 0 recipients
- ✅ Warning displayed about no recipients
- ✅ Send operation fails with error message
- ✅ User prompted to adjust targeting

### Scenario 19: Combine Search and Filter
**Steps:**
1. Type "Test" in search
2. Select "DRAFT" from filter
3. Observe results
4. Change filter to "COMPLETED"
5. Observe results

**Expected Result:**
- ✅ Both filters applied simultaneously
- ✅ Only campaigns matching both criteria shown
- ✅ Results update correctly when either changes

### Scenario 20: Mobile Responsiveness
**Steps:**
1. Open campaigns page on mobile device or resize browser
2. Test all features:
   - Create campaign
   - View campaign list
   - Search and filter
   - View analytics

**Expected Result:**
- ✅ Layout adapts to screen size
- ✅ All buttons accessible
- ✅ Modals display correctly
- ✅ Tables scroll horizontally if needed
- ✅ No overlapping elements

## Error Handling Tests

### Test 1: Invalid Template ID
**Steps:**
1. Manually send POST request with invalid templateId
2. Observe error response

**Expected Result:**
- ✅ 500 error returned
- ✅ Error message explains issue
- ✅ No campaign created

### Test 2: Delete Non-Existent Campaign
**Steps:**
1. Manually send DELETE request with fake campaign ID
2. Observe error response

**Expected Result:**
- ✅ 404 or 500 error returned
- ✅ Error message explains issue

### Test 3: Pause Completed Campaign
**Steps:**
1. Try to pause a COMPLETED campaign
2. Observe error

**Expected Result:**
- ✅ Error message explains only SENDING/SCHEDULED can be paused
- ✅ Campaign status unchanged

### Test 4: Resume Non-Paused Campaign
**Steps:**
1. Try to resume a DRAFT campaign
2. Observe error

**Expected Result:**
- ✅ Error message explains only PAUSED can be resumed
- ✅ Campaign status unchanged

## Performance Tests

### Test 1: Large Campaign List
**Steps:**
1. Create 100+ campaigns
2. Navigate to campaigns page
3. Test search and filter

**Expected Result:**
- ✅ Page loads in reasonable time (<2s)
- ✅ Search is responsive
- ✅ Filter updates quickly
- ✅ No UI lag

### Test 2: Campaign with Many Recipients
**Steps:**
1. Create campaign targeting all contacts (1000+)
2. Send campaign
3. Monitor progress

**Expected Result:**
- ✅ Sending completes successfully
- ✅ All emails logged
- ✅ Analytics accurate
- ✅ No timeout errors

### Test 3: Bulk Delete Many Campaigns
**Steps:**
1. Select 50+ campaigns
2. Bulk delete
3. Monitor operation

**Expected Result:**
- ✅ Operation completes successfully
- ✅ All campaigns deleted
- ✅ No partial deletions
- ✅ Success message accurate

## Integration Tests

### Test 1: Campaign → Template Integration
**Steps:**
1. Create campaign with template
2. Delete template
3. Try to view campaign

**Expected Result:**
- ✅ Campaign still exists
- ✅ Template relation handled gracefully
- ✅ Error message if template missing

### Test 2: Campaign → Contact Integration
**Steps:**
1. Create campaign targeting specific contacts
2. Delete some target contacts
3. Send campaign

**Expected Result:**
- ✅ Campaign sends to remaining contacts
- ✅ Deleted contacts skipped
- ✅ No errors for missing contacts

### Test 3: Campaign → EmailLog Integration
**Steps:**
1. Send campaign
2. View analytics
3. Delete campaign
4. Check email logs

**Expected Result:**
- ✅ Email logs created during send
- ✅ Analytics display correctly
- ✅ Email logs deleted with campaign (cascade)

## Accessibility Tests

### Test 1: Keyboard Navigation
**Steps:**
1. Navigate campaigns page using only keyboard
2. Tab through all interactive elements
3. Use Enter/Space to activate buttons

**Expected Result:**
- ✅ All elements reachable via keyboard
- ✅ Focus indicators visible
- ✅ Logical tab order
- ✅ Modals can be closed with Escape

### Test 2: Screen Reader
**Steps:**
1. Use screen reader to navigate page
2. Listen to announcements

**Expected Result:**
- ✅ All content announced correctly
- ✅ Button purposes clear
- ✅ Form labels associated
- ✅ Status changes announced

## Security Tests

### Test 1: User Isolation
**Steps:**
1. Create campaign as User A
2. Try to access as User B (different user ID)

**Expected Result:**
- ✅ User B cannot see User A's campaigns
- ✅ User B cannot edit User A's campaigns
- ✅ User B cannot delete User A's campaigns

### Test 2: SQL Injection
**Steps:**
1. Try to inject SQL in search field
2. Try to inject SQL in campaign name

**Expected Result:**
- ✅ No SQL executed
- ✅ Input sanitized
- ✅ No database errors

### Test 3: XSS Prevention
**Steps:**
1. Create campaign with `<script>` in name
2. View campaign list

**Expected Result:**
- ✅ Script not executed
- ✅ Content escaped properly
- ✅ No XSS vulnerability

## Regression Tests

After any code changes, run these quick tests:

1. ✅ Create campaign
2. ✅ Edit campaign
3. ✅ Delete campaign
4. ✅ Send campaign
5. ✅ View analytics
6. ✅ Search campaigns
7. ✅ Filter campaigns
8. ✅ Bulk delete

## Test Data Cleanup

After testing:
```sql
-- Delete test campaigns
DELETE FROM "Campaign" WHERE name LIKE 'Test%';

-- Delete test email logs
DELETE FROM "EmailLog" WHERE "campaignId" NOT IN (SELECT id FROM "Campaign");

-- Reset sequences if needed
```

## Automated Testing (Future)

### Unit Tests
- [ ] Campaign validation
- [ ] Date/time calculations
- [ ] Recipient counting
- [ ] Status transitions

### Integration Tests
- [ ] API endpoint tests
- [ ] Database operations
- [ ] Email sending flow

### E2E Tests
- [ ] Complete campaign creation flow
- [ ] Complete sending flow
- [ ] Analytics viewing flow

## Bug Reporting Template

If you find a bug:

```
**Bug Title:** [Brief description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Environment:**
- Browser: 
- OS: 
- Screen Size: 

**Screenshots:**
[Attach if applicable]

**Console Errors:**
[Copy any errors from browser console]
```

## Test Sign-Off

- [ ] All basic CRUD operations tested
- [ ] All campaign management features tested
- [ ] Search and filter tested
- [ ] Bulk operations tested
- [ ] Analytics tested
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Accessible
- [ ] Secure

**Tested By:** _______________
**Date:** _______________
**Version:** _______________
