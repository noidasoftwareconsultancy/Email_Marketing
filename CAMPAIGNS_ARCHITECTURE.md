# Campaigns Feature - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         /dashboard/campaigns (Main Page)                  │  │
│  │  - Campaign List                                          │  │
│  │  - Search & Filter                                        │  │
│  │  - Bulk Operations                                        │  │
│  │  - Create/Edit Modals                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ├─────────────────────────────────┐   │
│                           │                                 │   │
│  ┌────────────────────────▼──────────┐  ┌─────────────────▼───┐│
│  │  CampaignScheduler Component      │  │  CampaignPreview    ││
│  │  - Send Now/Later                 │  │  - Recipient List   ││
│  │  - Date/Time Picker               │  │  - Email Preview    ││
│  │  - Optimal Times                  │  │  - Template Info    ││
│  └───────────────────────────────────┘  └─────────────────────┘│
│                           │                                      │
│  ┌────────────────────────▼──────────────────────────────────┐ │
│  │    /dashboard/campaigns/[id]/analytics (Analytics Page)   │ │
│  │  - Key Metrics                                            │ │
│  │  - Status Breakdown                                       │ │
│  │  - Activity Timeline                                      │ │
│  │  - Error Analysis                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                │ HTTP Requests
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                          API LAYER                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Campaign CRUD Endpoints                          │ │
│  │                                                               │ │
│  │  GET    /api/campaigns              → List campaigns        │ │
│  │  POST   /api/campaigns              → Create campaign       │ │
│  │  GET    /api/campaigns/[id]         → Get campaign          │ │
│  │  PUT    /api/campaigns/[id]         → Update campaign       │ │
│  │  DELETE /api/campaigns/[id]         → Delete campaign       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Campaign Action Endpoints                        │ │
│  │                                                               │ │
│  │  POST   /api/campaigns/send         → Send campaign         │ │
│  │  POST   /api/campaigns/[id]/pause   → Pause campaign        │ │
│  │  POST   /api/campaigns/[id]/resume  → Resume campaign       │ │
│  │  POST   /api/campaigns/[id]/duplicate → Duplicate campaign  │ │
│  │  POST   /api/campaigns/bulk-delete  → Bulk delete           │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Analytics Endpoint                               │ │
│  │                                                               │ │
│  │  GET    /api/campaigns/[id]/analytics → Get analytics       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                │ Prisma ORM
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                       DATABASE LAYER                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │   Campaign   │    │   Template   │    │   Contact    │        │
│  ├──────────────┤    ├──────────────┤    ├──────────────┤        │
│  │ id           │───▶│ id           │    │ id           │        │
│  │ name         │    │ name         │    │ email        │        │
│  │ description  │    │ subject      │    │ name         │        │
│  │ status       │    │ htmlBody     │    │ tags[]       │        │
│  │ templateId   │    │ textBody     │    │ status       │        │
│  │ userId       │    │ category     │    │ userId       │        │
│  │ targetTags[] │    │ totalSent    │    │ ...          │        │
│  │ scheduledAt  │    │ avgOpenRate  │    └──────────────┘        │
│  │ sentAt       │    │ avgClickRate │           │                 │
│  │ totalSent    │    │ ...          │           │                 │
│  │ totalOpened  │    └──────────────┘           │                 │
│  │ totalClicked │                                │                 │
│  │ ...          │                                │                 │
│  └──────┬───────┘                                │                 │
│         │                                        │                 │
│         │                                        │                 │
│  ┌──────▼────────────────────────────────────────▼──────┐        │
│  │                  EmailLog                            │        │
│  ├──────────────────────────────────────────────────────┤        │
│  │ id                                                   │        │
│  │ campaignId  ──────────────────────────────────────┐  │        │
│  │ contactId   ──────────────────────────────────────┼──┘        │
│  │ status (PENDING/SENT/OPENED/CLICKED/FAILED)       │           │
│  │ sentAt                                             │           │
│  │ openedAt                                           │           │
│  │ clickedAt                                          │           │
│  │ error                                              │           │
│  │ ...                                                │           │
│  └────────────────────────────────────────────────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Create Campaign Flow

```
User Input
    │
    ├─ Campaign Name
    ├─ Description
    ├─ Template Selection
    ├─ Target Tags
    └─ Schedule Date/Time
    │
    ▼
Form Validation (Zod)
    │
    ├─ Validate required fields
    ├─ Validate template exists
    └─ Validate date format
    │
    ▼
POST /api/campaigns
    │
    ├─ Parse target tags
    ├─ Calculate recipient count
    ├─ Determine status (DRAFT/SCHEDULED)
    └─ Create campaign in DB
    │
    ▼
Response
    │
    ├─ Success: Return campaign object
    └─ Error: Return error message
    │
    ▼
UI Update
    │
    ├─ Show success toast
    ├─ Close modal
    ├─ Refresh campaign list
    └─ Reset form
```

### 2. Send Campaign Flow

```
User Action: Click "Send"
    │
    ▼
Open Scheduler Modal
    │
    ├─ Display recipient count
    ├─ Show send options
    └─ Load optimal times
    │
    ▼
User Selects: Send Now or Schedule
    │
    ├─────────────────┬─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
Send Now        Schedule Later    Cancel
    │                 │
    │                 ├─ Select Date
    │                 ├─ Select Time
    │                 └─ Confirm
    │                 │
    ▼                 ▼
POST /api/campaigns/send    PUT /api/campaigns/[id]
    │                           │
    ├─ Get campaign             ├─ Update scheduledAt
    ├─ Get template             └─ Set status: SCHEDULED
    ├─ Get contacts                 │
    ├─ Validate Gmail               ▼
    ├─ Update status: SENDING   Success Response
    │                               │
    ├─ For each contact:            ▼
    │   ├─ Send email           UI Update
    │   ├─ Create EmailLog          │
    │   └─ Wait 1 second            └─ Show success toast
    │
    ├─ Update campaign stats
    └─ Set status: COMPLETED
    │
    ▼
Response
    │
    ├─ sent: count
    └─ failed: count
    │
    ▼
UI Update
    │
    ├─ Show success toast
    ├─ Close modal
    └─ Refresh campaign list
```

### 3. View Analytics Flow

```
User Action: Click Analytics Icon
    │
    ▼
Navigate to /dashboard/campaigns/[id]/analytics
    │
    ▼
GET /api/campaigns/[id]/analytics
    │
    ├─ Get campaign with template
    ├─ Get all email logs
    │
    ├─ Calculate Metrics:
    │   ├─ Delivery Rate
    │   ├─ Open Rate
    │   ├─ Click Rate
    │   ├─ Bounce Rate
    │   └─ Click-to-Open Rate
    │
    ├─ Generate Status Breakdown
    ├─ Build Timeline
    ├─ Compile Recent Activity
    └─ Analyze Errors
    │
    ▼
Response with Analytics Object
    │
    ▼
Render Analytics Dashboard
    │
    ├─ Display Key Metrics
    ├─ Show Status Breakdown
    ├─ Render Activity Table
    ├─ Display Timeline
    └─ Show Error Analysis
```

### 4. Search & Filter Flow

```
User Input
    │
    ├─ Search Query (text)
    └─ Status Filter (dropdown)
    │
    ▼
Client-Side Filtering
    │
    ├─ Filter by search query:
    │   ├─ Match campaign name
    │   └─ Match description
    │
    ├─ Filter by status:
    │   └─ Match campaign status
    │
    └─ Combine filters (AND logic)
    │
    ▼
Update Filtered Campaigns State
    │
    ▼
Re-render Campaign List
    │
    └─ Display filtered results
```

## Component Hierarchy

```
DashboardLayout
│
└─ CampaignsPage
    │
    ├─ Header Section
    │   ├─ Title & Description
    │   └─ Create Button
    │
    ├─ Gmail Warning Banner (conditional)
    │
    ├─ Stats Cards
    │   ├─ Total Campaigns
    │   ├─ Completed
    │   ├─ Scheduled
    │   └─ Draft
    │
    ├─ Search & Filter Card
    │   ├─ Search Input
    │   ├─ Status Filter Dropdown
    │   └─ Bulk Delete Button (conditional)
    │
    ├─ Campaign List
    │   ├─ Select All Checkbox
    │   └─ Campaign Cards (map)
    │       ├─ Checkbox
    │       ├─ Campaign Info
    │       │   ├─ Name & Status Badge
    │       │   ├─ Description
    │       │   └─ Metrics Grid
    │       └─ Action Buttons
    │           ├─ Send (DRAFT only)
    │           ├─ Edit (DRAFT only)
    │           ├─ Pause (SENDING/SCHEDULED)
    │           ├─ Resume (PAUSED)
    │           ├─ Duplicate
    │           ├─ Analytics
    │           └─ Delete
    │
    ├─ Create/Edit Modal
    │   └─ Campaign Form
    │       ├─ Name Input
    │       ├─ Description Input
    │       ├─ Template Select
    │       ├─ Template Preview (conditional)
    │       ├─ Target Tags Input
    │       ├─ Schedule DateTime Input
    │       └─ Submit Buttons
    │
    └─ Scheduler Modal
        └─ CampaignScheduler
            ├─ Recipient Summary
            ├─ Mode Selection (Now/Later)
            ├─ Schedule Options (conditional)
            │   ├─ Quick Date Select
            │   ├─ Manual Date/Time
            │   ├─ Optimal Times
            │   └─ Schedule Preview
            ├─ Important Notes
            └─ Action Button
```

## State Management

### Campaign Page State

```typescript
// Campaign data
campaigns: Campaign[]              // All campaigns from API
filteredCampaigns: Campaign[]      // After search/filter
templates: Template[]              // Available templates

// UI state
loading: boolean                   // Initial load
isModalOpen: boolean              // Create/Edit modal
isSchedulerOpen: boolean          // Scheduler modal
sendingCampaign: string | null    // Currently sending ID

// Edit state
editingCampaign: Campaign | null  // Campaign being edited
schedulingCampaign: Campaign | null // Campaign being scheduled

// Filter state
searchQuery: string               // Search input value
statusFilter: string              // Selected status
selectedCampaigns: string[]       // Bulk selection

// Connection state
gmailConnected: boolean           // Gmail connection status
```

### Analytics Page State

```typescript
// Analytics data
analytics: CampaignAnalytics | null

// UI state
loading: boolean
```

## API Response Formats

### GET /api/campaigns
```json
[
  {
    "id": "clx...",
    "name": "Campaign Name",
    "description": "Description",
    "status": "DRAFT",
    "templateId": "clx...",
    "template": {
      "id": "clx...",
      "name": "Template Name",
      "subject": "Email Subject"
    },
    "targetTags": ["tag1", "tag2"],
    "scheduledAt": null,
    "sentAt": null,
    "totalRecipients": 100,
    "totalSent": 0,
    "totalOpened": 0,
    "totalClicked": 0,
    "createdAt": "2024-01-01T00:00:00Z",
    "_count": {
      "emailLogs": 0
    }
  }
]
```

### POST /api/campaigns/send
```json
{
  "sent": 95,
  "failed": 5
}
```

### GET /api/campaigns/[id]/analytics
```json
{
  "campaign": {
    "id": "clx...",
    "name": "Campaign Name",
    "status": "COMPLETED",
    "template": {
      "name": "Template Name",
      "subject": "Email Subject"
    },
    "sentAt": "2024-01-01T10:00:00Z"
  },
  "metrics": {
    "totalRecipients": 100,
    "sent": 95,
    "opened": 60,
    "clicked": 20,
    "bounced": 2,
    "failed": 5,
    "pending": 0,
    "openRate": 63.16,
    "clickRate": 21.05,
    "bounceRate": 2.0,
    "deliveryRate": 95.0,
    "clickToOpenRate": 33.33
  },
  "statusBreakdown": {
    "sent": 95,
    "opened": 60,
    "clicked": 20,
    "bounced": 2,
    "failed": 5,
    "pending": 0
  },
  "timeline": [...],
  "recentActivity": [...],
  "errors": {}
}
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                  │
├─────────────────────────────────────────┤
│                                          │
│  1. Authentication                       │
│     - User session validation            │
│     - User ID from headers               │
│                                          │
│  2. Authorization                        │
│     - User ID scoping on queries         │
│     - Ownership verification             │
│                                          │
│  3. Input Validation                     │
│     - Zod schema validation              │
│     - Type checking                      │
│     - Sanitization                       │
│                                          │
│  4. Database Security                    │
│     - Prisma ORM (SQL injection)         │
│     - Parameterized queries              │
│     - Cascade deletes                    │
│                                          │
│  5. Output Sanitization                  │
│     - XSS prevention                     │
│     - HTML escaping                      │
│     - Error message sanitization         │
│                                          │
│  6. Rate Limiting                        │
│     - Email sending delays               │
│     - Daily quota tracking               │
│     - API rate limits                    │
│                                          │
└─────────────────────────────────────────┘
```

## Performance Optimizations

### Database Level
- Indexed fields: userId, status, tags
- Efficient queries with Prisma
- Cascade deletes for cleanup
- Proper foreign key relationships

### API Level
- Minimal data fetching
- Selective includes
- Pagination-ready structure
- Efficient filtering

### Client Level
- React state management
- Conditional rendering
- Debounced search (can add)
- Lazy loading modals
- Optimistic UI updates

## Error Handling Strategy

```
┌─────────────────────────────────────────┐
│         Error Handling Flow              │
├─────────────────────────────────────────┤
│                                          │
│  API Layer                               │
│  ├─ Try-Catch blocks                     │
│  ├─ Specific error messages              │
│  ├─ HTTP status codes                    │
│  └─ Error logging                        │
│      │                                    │
│      ▼                                    │
│  Client Layer                            │
│  ├─ Response validation                  │
│  ├─ Toast notifications                  │
│  ├─ Fallback UI                          │
│  └─ User-friendly messages               │
│                                          │
└─────────────────────────────────────────┘
```

## Deployment Considerations

### Environment Variables
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://...
```

### Database Migrations
```bash
npx prisma migrate deploy
```

### Build Process
```bash
npm run build
npm start
```

### Monitoring
- API response times
- Error rates
- Email delivery rates
- User engagement metrics

## Scalability Considerations

### Current Capacity
- Handles 1000s of campaigns
- Supports 10,000s of contacts
- Processes 100s of emails/minute

### Future Scaling
- Add pagination for large lists
- Implement caching (Redis)
- Queue system for email sending
- Database read replicas
- CDN for static assets
- Horizontal scaling with load balancer
