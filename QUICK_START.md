# Quick Start Guide - Enhanced Contact System

## 🚀 Getting Started in 3 Steps

### Step 1: Regenerate Prisma Client

The Prisma schema has been updated with new models. You need to regenerate the client:

```bash
# Stop your development server first (Ctrl+C)

# Regenerate Prisma Client
npx prisma generate

# Push changes to database (if not already done)
npx prisma db push
```

**Troubleshooting**: If you get permission errors, close your IDE and any Node processes, then try again.

### Step 2: Migrate Existing Data (Optional)

If you have existing contacts, run the migration script to set default values:

```bash
# Basic migration (sets defaults)
node scripts/migrate-contacts.js

# With sample activities
node scripts/migrate-contacts.js --samples
```

### Step 3: Start Development Server

```bash
npm run dev
```

## ✨ What's New?

### Enhanced Contact Form
Your contact form now supports:
- 📱 Social media profiles (LinkedIn, Twitter, Facebook)
- 🎂 Personal info (Birthday, Gender, Language, Timezone)
- ⭐ Lead scoring (0-100 score + 1-5 star rating)
- ✅ Verification status (Email/Phone verified)
- 🚫 Communication preferences (Do Not Email/Call)

### Activity Tracking
Track every interaction with your contacts:
- Email sent/opened/clicked
- Calls made/received
- Meetings scheduled/completed
- Notes, tags, status changes
- Custom activities

### Duplicate Management
Keep your database clean:
- Automatic duplicate detection
- Similarity scoring
- Smart merging with multiple strategies
- Side-by-side comparison

## 📝 Quick Examples

### Create a Contact with New Fields

```tsx
const newContact = {
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  company: 'Acme Inc',
  
  // New fields
  linkedInUrl: 'https://linkedin.com/in/johndoe',
  score: 75,
  rating: 4,
  language: 'en',
  emailVerified: true,
};

const response = await fetch('/api/contacts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newContact),
});
```

### Track an Activity

```tsx
await fetch('/api/contacts/activities', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contactId: 'contact-id',
    type: 'EMAIL_SENT',
    title: 'Welcome Email Sent',
    description: 'Sent automated welcome email',
  }),
});
```

### Detect and Merge Duplicates

```tsx
// Detect duplicates
const detectResponse = await fetch('/api/contacts/duplicates', {
  method: 'POST',
});

// Merge duplicates
const mergeResponse = await fetch('/api/contacts/merge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    primaryContactId: 'keep-this-one',
    secondaryContactId: 'merge-this-one',
    mergeStrategy: 'primary',
  }),
});
```

## 🎨 Using the New Components

### Contact Detail Page

```tsx
import { ContactDetailView } from '@/components/contacts/ContactDetailView';

<ContactDetailView
  contact={contact}
  onEdit={() => setIsEditing(true)}
  onDelete={handleDelete}
/>
```

### Activity Timeline

```tsx
import { ContactActivities } from '@/components/contacts/ContactActivities';

<ContactActivities contactId={contact.id} />
```

### Duplicate Manager

```tsx
import { DuplicateContacts } from '@/components/contacts/DuplicateContacts';

<DuplicateContacts />
```

### Enhanced Form

```tsx
import { ContactForm } from '@/components/contacts/ContactForm';

<ContactForm
  contact={existingContact}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

## 🔧 API Endpoints Reference

### Contacts
- `GET /api/contacts` - List all contacts
- `POST /api/contacts` - Create contact (with new fields)
- `GET /api/contacts/[id]` - Get contact details
- `PUT /api/contacts/[id]` - Update contact (with new fields)
- `DELETE /api/contacts/[id]` - Delete contact

### Activities
- `GET /api/contacts/activities?contactId={id}` - Get activities
- `POST /api/contacts/activities` - Create activity

### Duplicates
- `GET /api/contacts/duplicates?status=PENDING` - List duplicates
- `POST /api/contacts/duplicates` - Detect duplicates
- `PUT /api/contacts/duplicates/[id]` - Update duplicate status
- `DELETE /api/contacts/duplicates/[id]` - Delete duplicate

### Merging
- `POST /api/contacts/merge` - Merge two contacts

## 📚 Documentation

For detailed information, see:
- `CONTACT_SYSTEM_UPDATE.md` - Complete system overview
- `components/contacts/README.md` - Component usage guide
- `prisma/schema.prisma` - Database schema

## 🐛 Common Issues

### "Property 'contactActivity' does not exist"
**Solution**: Run `npx prisma generate` and restart your dev server

### Database out of sync
**Solution**: Run `npx prisma db push`

### Permission errors during generation
**Solution**: Close all Node processes and your IDE, then try again

### TypeScript errors in components
**Solution**: Restart your TypeScript server (VS Code: Cmd/Ctrl + Shift + P → "Restart TS Server")

## 💡 Best Practices

1. **Lead Scoring**: Update scores based on engagement
   - Email opened: +5 points
   - Email clicked: +10 points
   - Meeting completed: +20 points

2. **Activity Tracking**: Log activities automatically
   - When sending emails
   - After calls or meetings
   - When status changes

3. **Duplicate Detection**: Run weekly or monthly
   - Before importing new contacts
   - After bulk updates

4. **Data Quality**: Use all available fields
   - Richer profiles = better segmentation
   - Social media = more touchpoints
   - Verification = higher deliverability

## 🎯 Next Steps

1. ✅ Regenerate Prisma Client
2. ✅ Migrate existing data
3. ✅ Test the new features
4. 📊 Build reports using new data
5. 🤖 Automate lead scoring
6. 📧 Respect communication preferences

## 🆘 Need Help?

Check the detailed documentation:
- System overview: `CONTACT_SYSTEM_UPDATE.md`
- Component guide: `components/contacts/README.md`
- Schema reference: `prisma/schema.prisma`

Happy coding! 🚀
