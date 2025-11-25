# Contact Components Usage Guide

## Components Overview

### 1. ContactForm
Enhanced form for creating and editing contacts with all new fields.

```tsx
import { ContactForm } from '@/components/contacts/ContactForm';

<ContactForm
  contact={existingContact} // Optional: for editing
  onSubmit={async (data) => {
    // Handle form submission
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }}
  onCancel={() => {
    // Handle cancel
  }}
  isSubmitting={false}
/>
```

**New Fields Supported:**
- Social Media: LinkedIn, Twitter, Facebook
- Personal: Birthday, Gender, Language, Timezone
- Lead Scoring: Score (0-100), Rating (1-5)
- Preferences: Email/Phone verification, Do Not Email/Call

### 2. ContactDetailView
Comprehensive view of all contact information.

```tsx
import { ContactDetailView } from '@/components/contacts/ContactDetailView';

<ContactDetailView
  contact={contact}
  onEdit={() => {
    // Open edit modal/page
  }}
  onDelete={async () => {
    // Handle delete
    await fetch(`/api/contacts/${contact.id}`, { method: 'DELETE' });
  }}
/>
```

**Features:**
- Lead score visualization with progress bar
- Star rating display
- Social media links
- Communication preferences warnings
- Activity timeline integration
- Complete metadata display

### 3. ContactActivities
Activity timeline for tracking contact interactions.

```tsx
import { ContactActivities } from '@/components/contacts/ContactActivities';

<ContactActivities contactId={contact.id} />
```

**Activity Types:**
- EMAIL_SENT, EMAIL_OPENED, EMAIL_CLICKED, EMAIL_BOUNCED
- CALL_MADE, CALL_RECEIVED
- MEETING_SCHEDULED, MEETING_COMPLETED
- NOTE_ADDED, TAG_ADDED, TAG_REMOVED
- STATUS_CHANGED, LIST_CHANGED
- FORM_SUBMITTED, WEBSITE_VISIT, CUSTOM

**Creating Activities:**
```tsx
await fetch('/api/contacts/activities', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contactId: 'contact-id',
    type: 'EMAIL_SENT',
    title: 'Welcome Email Sent',
    description: 'Sent welcome email campaign',
    metadata: { campaignId: 'campaign-123' },
  }),
});
```

### 4. DuplicateContacts
Manage and merge duplicate contacts.

```tsx
import { DuplicateContacts } from '@/components/contacts/DuplicateContacts';

<DuplicateContacts />
```

**Features:**
- Automatic duplicate detection
- Similarity scoring (0-100%)
- Side-by-side comparison
- Merge or ignore options
- Matched fields display

**Merge Strategies:**
- `primary`: Keep primary contact data, fill gaps with secondary
- `secondary`: Prefer secondary contact data
- `newest`: Use newest non-null values

## API Integration Examples

### Create Contact with New Fields
```tsx
const createContact = async (formData) => {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // Basic fields
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      company: 'Acme Inc',
      
      // New fields
      linkedInUrl: 'https://linkedin.com/in/johndoe',
      twitterHandle: '@johndoe',
      birthday: '1990-01-15',
      language: 'en',
      timezone: 'America/New_York',
      score: 75,
      rating: 4,
      emailVerified: true,
      doNotEmail: false,
      
      // Tags and notes
      tags: ['customer', 'vip'],
      notes: 'Important client',
    }),
  });
  
  return response.json();
};
```

### Detect and Merge Duplicates
```tsx
// Detect duplicates
const detectDuplicates = async () => {
  const response = await fetch('/api/contacts/duplicates', {
    method: 'POST',
  });
  const result = await response.json();
  console.log(`Found ${result.count} duplicates`);
};

// Merge contacts
const mergeDuplicates = async (primaryId, secondaryId) => {
  const response = await fetch('/api/contacts/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      primaryContactId: primaryId,
      secondaryContactId: secondaryId,
      mergeStrategy: 'primary', // or 'secondary', 'newest'
    }),
  });
  
  return response.json();
};
```

### Track Contact Activities
```tsx
const trackActivity = async (contactId, activityData) => {
  const response = await fetch('/api/contacts/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contactId,
      type: activityData.type,
      title: activityData.title,
      description: activityData.description,
      metadata: activityData.metadata,
    }),
  });
  
  return response.json();
};

// Example: Track email sent
await trackActivity('contact-123', {
  type: 'EMAIL_SENT',
  title: 'Welcome Email',
  description: 'Sent automated welcome email',
  metadata: { campaignId: 'welcome-001', templateId: 'template-456' },
});
```

## Page Integration Examples

### Contact List Page with Duplicate Detection
```tsx
'use client';

import { useState } from 'react';
import { DuplicateContacts } from '@/components/contacts/DuplicateContacts';
import { Button } from '@/components/ui/Button';

export default function ContactsPage() {
  const [showDuplicates, setShowDuplicates] = useState(false);
  
  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1>Contacts</h1>
        <Button onClick={() => setShowDuplicates(!showDuplicates)}>
          {showDuplicates ? 'View Contacts' : 'Manage Duplicates'}
        </Button>
      </div>
      
      {showDuplicates ? (
        <DuplicateContacts />
      ) : (
        // Your contact list component
        <ContactList />
      )}
    </div>
  );
}
```

### Contact Detail Page
```tsx
'use client';

import { useState, useEffect } from 'react';
import { ContactDetailView } from '@/components/contacts/ContactDetailView';
import { ContactForm } from '@/components/contacts/ContactForm';

export default function ContactDetailPage({ params }) {
  const [contact, setContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    fetchContact();
  }, [params.id]);
  
  const fetchContact = async () => {
    const response = await fetch(`/api/contacts/${params.id}`);
    const data = await response.json();
    setContact(data);
  };
  
  if (isEditing) {
    return (
      <ContactForm
        contact={contact}
        onSubmit={async (data) => {
          await fetch(`/api/contacts/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          setIsEditing(false);
          fetchContact();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }
  
  return contact ? (
    <ContactDetailView
      contact={contact}
      onEdit={() => setIsEditing(true)}
      onDelete={async () => {
        if (confirm('Delete this contact?')) {
          await fetch(`/api/contacts/${params.id}`, { method: 'DELETE' });
          // Redirect to contacts list
        }
      }}
    />
  ) : (
    <div>Loading...</div>
  );
}
```

## Styling Notes

All components use Tailwind CSS classes and are designed to work with your existing design system. They follow these patterns:

- **Cards**: `bg-white border border-gray-200 rounded-lg p-6`
- **Buttons**: Use your `Button` component from `@/components/ui/Button`
- **Inputs**: Use your `Input` component from `@/components/ui/Input`
- **Status badges**: Color-coded based on status (green=active, red=bounced, etc.)

## Best Practices

1. **Lead Scoring**: Update scores based on engagement (email opens, clicks, meetings)
2. **Activity Tracking**: Log all significant interactions automatically
3. **Duplicate Detection**: Run periodically (weekly/monthly) to keep database clean
4. **Verification**: Mark emails/phones as verified after confirmation
5. **Preferences**: Always respect doNotEmail and doNotCall flags
6. **Data Quality**: Use the enhanced fields to build richer contact profiles

## Troubleshooting

### "contactActivity does not exist" error
Run: `npx prisma generate` and restart your dev server

### Activities not showing
Check that the contactId is correct and activities exist in the database

### Duplicate detection not finding matches
Adjust the similarity threshold in the API (default is 70%)

### Form validation errors
Ensure URLs include protocol (https://) and dates are in YYYY-MM-DD format
