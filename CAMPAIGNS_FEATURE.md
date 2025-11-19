# Campaigns Feature - Complete Documentation

## Overview
The Campaigns feature provides a comprehensive email campaign management system with full CRUD operations, scheduling, analytics, and advanced features.

## Features Implemented

### 1. Core CRUD Operations
- ✅ **Create Campaign**: Create new campaigns with template selection and target audience
- ✅ **Read Campaign**: View campaign details and list all campaigns
- ✅ **Update Campaign**: Edit campaign details, template, and targeting
- ✅ **Delete Campaign**: Remove individual campaigns
- ✅ **Bulk Delete**: Delete multiple campaigns at once

### 2. Campaign Management
- ✅ **Draft Mode**: Save campaigns as drafts for later editing
- ✅ **Scheduling**: Schedule campaigns for future sending with date/time picker
- ✅ **Send Now**: Immediately send campaigns to target audience
- ✅ **Pause Campaign**: Pause ongoing or scheduled campaigns
- ✅ **Resume Campaign**: Resume paused campaigns
- ✅ **Duplicate Campaign**: Clone existing campaigns for reuse

### 3. Advanced Features
- ✅ **Search & Filter**: Search campaigns by name/description and filter by status
- ✅ **Bulk Selection**: Select multiple campaigns for bulk operations
- ✅ **Target Tags**: Target specific contact segments using tags
- ✅ **Recipient Count**: Automatic calculation of target recipients
- ✅ **Campaign Preview**: Preview email content and recipient list before sending
- ✅ **Template Preview**: View template details within campaign creation

### 4. Campaign Scheduler
- ✅ **Send Now or Later**: Choose immediate or scheduled sending
- ✅ **Quick Date Selection**: Pre-defined date options (Today, Tomorrow, etc.)
- ✅ **Optimal Times**: Suggested optimal sending times
- ✅ **Manual Selection**: Custom date and time picker
- ✅ **Schedule Preview**: Visual confirmation of scheduled time

### 5. Analytics & Reporting
- ✅ **Delivery Metrics**: Track sent, delivered, and failed emails
- ✅ **Engagement Metrics**: Monitor opens, clicks, and click-to-open rates
- ✅ **Status Breakdown**: Visual breakdown of email statuses
- ✅ **Recent Activity**: Real-time activity feed
- ✅ **Error Analysis**: Detailed error tracking and reporting
- ✅ **Engagement Timeline**: Chronological view of opens and clicks
- ✅ **Performance Visualization**: Progress bars and charts

### 6. User Experience
- ✅ **Gmail Connection Warning**: Alert users if Gmail is not connected
- ✅ **Loading States**: Proper loading indicators throughout
- ✅ **Error Handling**: Comprehensive error messages and validation
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Toast Notifications**: Success/error feedback for all actions
- ✅ **Confirmation Dialogs**: Prevent accidental deletions

## API Endpoints

### Campaign CRUD
```
GET    /api/campaigns              - List all campaigns
POST   /api/campaigns              - Create new campaign
GET    /api/campaigns/[id]         - Get campaign details
PUT    /api/campaigns/[id]         - Update campaign
DELETE /api/campaigns/[id]         - Delete campaign
```

### Campaign Actions
```
POST   /api/campaigns/send         - Send campaign immediately
POST   /api/campaigns/[id]/pause   - Pause campaign
POST   /api/campaigns/[id]/resume  - Resume paused campaign
POST   /api/campaigns/[id]/rerun   - Rerun completed/failed campaign
POST   /api/campaigns/[id]/duplicate - Duplicate campaign
POST   /api/campaigns/bulk-delete  - Delete multiple campaigns
```

### Analytics
```
GET    /api/campaigns/[id]/analytics - Get detailed campaign analytics
```

## Database Schema

### Campaign Model
```prisma
model Campaign {
  id              String         @id @default(cuid())
  name            String
  description     String?
  status          CampaignStatus @default(DRAFT)
  templateId      String
  template        Template       @relation(fields: [templateId], references: [id])
  userId          String
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  targetTags      String[]
  scheduledAt     DateTime?
  sentAt          DateTime?
  completedAt     DateTime?
  totalRecipients Int            @default(0)
  totalSent       Int            @default(0)
  totalFailed     Int            @default(0)
  totalOpened     Int            @default(0)
  totalClicked    Int            @default(0)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  emailLogs       EmailLog[]
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENDING
  COMPLETED
  FAILED
  PAUSED
}
```

## Component Structure

### Pages
- `app/dashboard/campaigns/page.tsx` - Main campaigns list and management
- `app/dashboard/campaigns/[id]/analytics/page.tsx` - Campaign analytics dashboard

### Components
- `components/campaigns/CampaignScheduler.tsx` - Campaign scheduling interface
- `components/campaigns/CampaignPreview.tsx` - Campaign preview before sending

### API Routes
- `app/api/campaigns/route.ts` - List and create campaigns
- `app/api/campaigns/[id]/route.ts` - Get, update, delete campaign
- `app/api/campaigns/send/route.ts` - Send campaign
- `app/api/campaigns/[id]/pause/route.ts` - Pause campaign
- `app/api/campaigns/[id]/resume/route.ts` - Resume campaign
- `app/api/campaigns/[id]/duplicate/route.ts` - Duplicate campaign
- `app/api/campaigns/bulk-delete/route.ts` - Bulk delete campaigns
- `app/api/campaigns/[id]/analytics/route.ts` - Campaign analytics

## Usage Guide

### Creating a Campaign
1. Click "Create Campaign" button
2. Enter campaign name and description
3. Select an email template
4. (Optional) Add target tags to filter recipients
5. (Optional) Schedule for later or save as draft
6. Click "Create Campaign"

### Sending a Campaign
1. Find your draft campaign in the list
2. Click the "Send" button
3. Choose "Send Now" or "Schedule for Later"
4. If scheduling:
   - Select date (quick select or manual)
   - Select time (optimal times or manual)
   - Review scheduled time
5. Confirm and send

### Viewing Analytics
1. Click the analytics icon (chart) on any campaign
2. View comprehensive metrics:
   - Delivery, open, click, and bounce rates
   - Status breakdown
   - Recent activity
   - Error analysis
   - Engagement timeline

### Managing Campaigns
- **Edit**: Click pencil icon on draft campaigns
- **Pause**: Click pause icon on sending/scheduled campaigns
- **Resume**: Click play icon on paused campaigns
- **Rerun**: Click rerun icon on completed/failed campaigns to reset and resend
- **Duplicate**: Click duplicate icon to clone campaign
- **Delete**: Click trash icon to remove campaign
- **Bulk Delete**: Select multiple campaigns and click bulk delete

### Search and Filter
- Use search bar to find campaigns by name or description
- Use status filter dropdown to filter by campaign status
- Combine search and filter for precise results

## Best Practices

### Campaign Creation
1. Always test templates before creating campaigns
2. Use descriptive campaign names
3. Target specific audiences with tags when possible
4. Review recipient count before sending

### Scheduling
1. Use optimal sending times for better engagement
2. Schedule campaigns during business hours
3. Avoid weekends unless targeting specific audiences
4. Allow time for review before scheduled send

### Analytics
1. Monitor campaigns regularly after sending
2. Track open and click rates for optimization
3. Analyze errors to improve deliverability
4. Use performance data to refine future campaigns

### Performance Optimization
1. Keep recipient lists clean and updated
2. Remove bounced and unsubscribed contacts
3. Use engaging subject lines
4. Test different sending times
5. Monitor and respect Gmail rate limits

## Error Handling

### Common Errors
- **Gmail Not Connected**: User must connect Gmail in settings
- **No Recipients**: Campaign has no matching contacts
- **Invalid Template**: Selected template doesn't exist
- **Rate Limit**: Too many emails sent too quickly
- **Authentication Failed**: Gmail credentials invalid

### Error Recovery
- All errors display user-friendly messages
- Failed emails are logged with error details
- Campaigns can be retried after fixing issues
- Bulk operations are transactional

## Rate Limiting
- Emails sent with 1-second delays
- Respects Gmail's daily sending limits
- Tracks daily quota usage
- Prevents quota exhaustion

## Security
- User authentication required for all operations
- Campaigns scoped to user ID
- SQL injection prevention via Prisma
- XSS protection in email rendering
- CSRF protection on all mutations

## Future Enhancements
- [x] Rerun completed/failed campaigns ✅
- [ ] A/B testing support
- [ ] Email personalization variables
- [ ] Advanced segmentation
- [ ] Campaign templates
- [ ] Automated follow-ups
- [ ] Integration with external email services
- [ ] Real-time sending progress
- [ ] Export analytics to CSV/PDF
- [ ] Campaign comparison
- [ ] Predictive analytics

## Troubleshooting

### Campaign Not Sending
1. Check Gmail connection in settings
2. Verify recipient count > 0
3. Check daily quota remaining
4. Review error logs in analytics

### Low Open Rates
1. Improve subject lines
2. Test different sending times
3. Clean contact list
4. Verify email content quality

### High Bounce Rate
1. Remove invalid email addresses
2. Verify contact list quality
3. Check email authentication
4. Review spam score

## Support
For issues or questions:
1. Check error messages in UI
2. Review campaign analytics
3. Check browser console for errors
4. Verify database connections
5. Review API logs
