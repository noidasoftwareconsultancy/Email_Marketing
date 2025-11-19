export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  googleTokens?: any;
  emailQuota: number;
  emailsSentToday: number;
}

export interface Contact {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  tags: string[];
  source?: string;
  notes?: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED' | 'COMPLAINED';
  listId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  subject: string;
  previewText?: string;
  htmlBody: string;
  textBody?: string;
  category?: string;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'FAILED' | 'PAUSED';
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

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    contacts: number;
  };
}

export interface DashboardStats {
  totalContacts: number;
  activeContacts: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalEmailsSent: number;
  totalTemplates: number;
  totalContactLists: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  recentContactsCount: number;
  recentCampaignsCount: number;
}

export interface RecentActivity {
  id: string;
  type: 'campaign' | 'contact' | 'template' | 'contact_list';
  action: string;
  description: string;
  timestamp: Date;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export interface EmailLog {
  id: string;
  campaignId: string;
  contactId: string;
  status: 'PENDING' | 'SENT' | 'OPENED' | 'CLICKED' | 'FAILED' | 'BOUNCED';
  error?: string;
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  createdAt: Date;
}
