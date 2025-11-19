# Campaigns Feature - Quick Reference Guide

## 🚀 Quick Start

### Create Your First Campaign
1. Go to `/dashboard/campaigns`
2. Click "Create Campaign"
3. Fill in name, select template
4. Click "Create Campaign"
5. Click "Send" → "Send Now"

### View Analytics
1. Find completed campaign
2. Click chart icon
3. View metrics and activity

## 📁 File Structure

```
app/
├── api/campaigns/
│   ├── route.ts                    # List, Create
│   ├── [id]/
│   │   ├── route.ts                # Get, Update, Delete
│   │   ├── analytics/route.ts      # Analytics
│   │   ├── duplicate/route.ts      # Duplicate
│   │   ├── pause/route.ts          # Pause
│   │   └── resume/route.ts         # Resume
│   ├── send/route.ts               # Send campaign
│   └── bulk-delete/route.ts        # Bulk delete
└── dashboard/campaigns/
    ├── page.tsx                    # Main page
    └── [id]/analytics/page.tsx     # Analytics page

components/campaigns/
├── CampaignScheduler.tsx           # Scheduling UI
└── CampaignPreview.tsx             # Preview component

lib/
├── types.ts                        # TypeScript types
└── validations.ts                  # Zod schemas
```

## 🔌 API Endpoints Cheat Sheet

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/campaigns` | List all campaigns |
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns/[id]` | Get campaign |
| PUT | `/api/campaigns/[id]` | Update campaign |
| DELETE | `/api/campaigns/[id]` | Delete campaign |
| POST | `/api/campaigns/send` | Send campaign |
| POST | `/api/campaigns/[id]/pause` | Pause campaign |
| POST | `/api/campaigns/[id]/resume` | Resume campaign |
| POST | `/api/campaigns/[id]/rerun` | Rerun campaign |
| POST | `/api/campaigns/[id]/duplicate` | Duplicate campaign |
| POST | `/api/campaigns/bulk-delete` | Bulk delete |
| GET | `/api/campaigns/[id]/analytics` | Get analytics |

## 📊 Campaign Status Flow

```
DRAFT → SCHEDULED → SENDING → COMPLETED
  ↓         ↓          ↓            ↓
  └────→ PAUSED ←──────┘      (Rerun → DRAFT)
            ↓                       ↑
         FAILED ────────────────────┘
```

## 🎯 Common Tasks

### Create Campaign
```typescript
POST /api/campaigns
{
  "name": "Campaign Name",
  "description": "Description",
  "templateId": "template_id",
  "targetTags": ["tag1", "tag2"],
  "scheduledAt": "2024-01-01T10:00:00Z" // optional
}
```

### Send Campaign
```typescript
POST /api/campaigns/send
{
  "campaignId": "campaign_id"
}
```

### Update Campaign
```typescript
PUT /api/campaigns/[id]
{
  "name": "Updated Name",
  "status": "PAUSED"
}
```

### Get Analytics
```typescript
GET /api/campaigns/[id]/analytics
// Returns full analytics object
```

## 🔍 Search & Filter

### Search
- Searches: name, description
- Case-insensitive
- Real-time filtering

### Filter by Status
- ALL
- DRAFT
- SCHEDULED
- SENDING
- COMPLETED
- PAUSED
- FAILED

## 📈 Key Metrics

| Metric | Formula | Description |
|--------|---------|-------------|
| Delivery Rate | (sent / total) × 100 | % successfully delivered |
| Open Rate | (opened / sent) × 100 | % of emails opened |
| Click Rate | (clicked / sent) × 100 | % of emails clicked |
| Bounce Rate | (bounced / total) × 100 | % of emails bounced |
| Click-to-Open | (clicked / opened) × 100 | % who clicked after opening |

## 🎨 Status Colors

| Status | Color | Class |
|--------|-------|-------|
| DRAFT | Gray | `bg-gray-100 text-gray-700` |
| SCHEDULED | Purple | `bg-purple-100 text-purple-700` |
| SENDING | Blue | `bg-blue-100 text-blue-700` |
| COMPLETED | Green | `bg-green-100 text-green-700` |
| PAUSED | Orange | `bg-orange-100 text-orange-700` |
| FAILED | Red | `bg-red-100 text-red-700` |

## 🔐 Security Checklist

- ✅ User authentication required
- ✅ User ID scoping on all queries
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting on email sending

## 🐛 Common Issues & Solutions

### Campaign Not Sending
**Problem:** Campaign stuck in SENDING
**Solution:** Check Gmail connection, verify quota

### No Recipients
**Problem:** totalRecipients = 0
**Solution:** Check target tags, verify active contacts

### High Bounce Rate
**Problem:** Many emails bouncing
**Solution:** Clean contact list, verify emails

### Analytics Not Loading
**Problem:** Analytics page blank
**Solution:** Check campaign has email logs

## 💡 Best Practices

### Campaign Creation
- Use descriptive names
- Test templates first
- Target specific audiences
- Review recipient count

### Scheduling
- Use optimal times (9-10 AM, 2 PM)
- Avoid weekends
- Schedule during business hours
- Allow review time

### Analytics
- Monitor regularly
- Track trends over time
- Compare campaigns
- Act on insights

### Performance
- Keep contact lists clean
- Remove bounced contacts
- Use engaging content
- Respect rate limits

## 🎯 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + K` | Open search |
| `Escape` | Close modal |
| `Tab` | Navigate elements |
| `Enter` | Submit form |
| `Space` | Toggle checkbox |

## 📱 Mobile Support

- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ Scrollable tables
- ✅ Adaptive layouts
- ✅ Mobile-optimized modals

## 🔄 State Management

### Campaign List State
```typescript
campaigns: Campaign[]           // All campaigns
filteredCampaigns: Campaign[]   // After filters
searchQuery: string             // Search input
statusFilter: string            // Status filter
selectedCampaigns: string[]     // Bulk selection
```

### Modal State
```typescript
isModalOpen: boolean            // Create/Edit modal
isSchedulerOpen: boolean        // Scheduler modal
editingCampaign: Campaign | null
schedulingCampaign: Campaign | null
```

## 🎨 UI Components Used

| Component | Purpose |
|-----------|---------|
| `DashboardLayout` | Page wrapper |
| `Card` | Content containers |
| `Button` | Actions |
| `Input` | Form fields |
| `Modal` | Dialogs |
| `Badge` | Status indicators |

## 📦 Dependencies

```json
{
  "@prisma/client": "^5.x",
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x",
  "react-hot-toast": "^2.x",
  "@headlessui/react": "^1.x",
  "@heroicons/react": "^2.x"
}
```

## 🧪 Testing Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## 📝 TypeScript Types

### Campaign
```typescript
interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  templateId: string;
  template?: Template;
  targetTags: string[];
  scheduledAt?: Date;
  sentAt?: Date;
  totalRecipients: number;
  totalSent: number;
  totalFailed: number;
  totalOpened: number;
  totalClicked: number;
  createdAt: Date;
}
```

### CampaignStatus
```typescript
type CampaignStatus = 
  | 'DRAFT'
  | 'SCHEDULED'
  | 'SENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'PAUSED';
```

## 🎓 Learning Resources

### Documentation
- `CAMPAIGNS_FEATURE.md` - Complete feature docs
- `CAMPAIGNS_ARCHITECTURE.md` - System architecture
- `CAMPAIGNS_TESTING_GUIDE.md` - Testing guide
- `CAMPAIGNS_IMPLEMENTATION_SUMMARY.md` - Implementation details

### Code Examples
- Check `app/dashboard/campaigns/page.tsx` for UI patterns
- Check `app/api/campaigns/route.ts` for API patterns
- Check `components/campaigns/` for component patterns

## 🚨 Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | Invalid campaign IDs | Check request body |
| 400 | No contacts found | Add contacts or adjust tags |
| 400 | Gmail not connected | Connect Gmail in settings |
| 404 | Campaign not found | Verify campaign ID |
| 500 | Failed to create campaign | Check logs, verify data |

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Rate Limits
- Email sending: 1 email/second
- Daily quota: 500 emails (configurable)
- API requests: No limit (can add)

## 📊 Analytics Metrics

### Available Metrics
- Total Recipients
- Sent Count
- Opened Count
- Clicked Count
- Bounced Count
- Failed Count
- Pending Count
- Delivery Rate (%)
- Open Rate (%)
- Click Rate (%)
- Bounce Rate (%)
- Click-to-Open Rate (%)

### Status Breakdown
- Visual count of each email status
- Color-coded indicators
- Real-time updates

### Timeline
- Chronological engagement events
- Opens and clicks
- Contact information
- Timestamps

## 🎯 Feature Flags

Currently all features are enabled. To add feature flags:

```typescript
const FEATURES = {
  BULK_DELETE: true,
  CAMPAIGN_DUPLICATE: true,
  ADVANCED_ANALYTICS: true,
  CAMPAIGN_PREVIEW: true,
};
```

## 📞 Support

### Getting Help
1. Check documentation files
2. Review error messages
3. Check browser console
4. Verify database connection
5. Review API logs

### Reporting Issues
Use the bug template in `CAMPAIGNS_TESTING_GUIDE.md`

## 🎉 Success Criteria

Campaign feature is working if:
- ✅ Can create campaigns
- ✅ Can edit campaigns
- ✅ Can delete campaigns
- ✅ Can send campaigns
- ✅ Can view analytics
- ✅ Search works
- ✅ Filters work
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Accessible

## 🔮 Future Enhancements

### Planned
- [ ] A/B testing
- [ ] Email personalization
- [ ] Advanced segmentation
- [ ] Campaign templates
- [ ] Automated follow-ups

### Under Consideration
- [ ] Real-time progress
- [ ] Export to CSV/PDF
- [ ] Campaign comparison
- [ ] Predictive analytics
- [ ] Integration with external services

## 📚 Additional Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev
- Tailwind CSS: https://tailwindcss.com

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready ✅
