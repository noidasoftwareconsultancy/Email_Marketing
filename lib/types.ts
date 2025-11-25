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
  customData?: any;
  source?: string;
  notes?: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED' | 'COMPLAINED';
  // New fields
  linkedInUrl?: string;
  twitterHandle?: string;
  facebookUrl?: string;
  birthday?: Date;
  gender?: string;
  language?: string;
  timezone?: string;
  score?: number;
  rating?: number;
  lastContactedAt?: Date;
  lastEngagedAt?: Date;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  doNotEmail?: boolean;
  doNotCall?: boolean;
  listId?: string | null;
  list?: ContactList;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    emailLogs: number;
    activities: number;
  };
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
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  avgOpenRate: number;
  avgClickRate: number;
  performanceScore: number;
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
  completedAt?: Date;
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

export interface ContactActivity {
  id: string;
  contactId: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: any;
  userId: string;
  createdAt: Date;
}

export interface ContactSegment {
  id: string;
  name: string;
  description?: string;
  conditions: any;
  contactIds: string[];
  userId: string;
  isActive: boolean;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    contacts: number;
  };
}

export interface ContactField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  options: string[];
  isRequired: boolean;
  isActive: boolean;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactDuplicate {
  id: string;
  contactId1: string;
  contactId2: string;
  contact1?: Contact;
  contact2?: Contact;
  similarityScore: number;
  matchedFields: string[];
  status: DuplicateStatus;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
}

export interface ContactFilter {
  query?: string;
  status?: string;
  tags?: string[];
  listId?: string;
  source?: string;
  company?: string;
  state?: string;
  country?: string;
  score?: { min?: number; max?: number };
  rating?: number;
  createdAfter?: Date;
  createdBefore?: Date;
  lastContactedAfter?: Date;
  lastContactedBefore?: Date;
  hasEmail?: boolean;
  hasPhone?: boolean;
  emailVerified?: boolean;
  doNotEmail?: boolean;
}

export interface ContactStats {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
  complained: number;
  recentContacts: number;
  lastWeekGrowth: number;
  averageScore: number;
  topTags: Array<{ tag: string; count: number }>;
  topSources: Array<{ source: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  topCompanies: Array<{ company: string; count: number }>;
  engagement: {
    totalEngaged: number;
    totalOpened: number;
    totalClicked: number;
    engagementRate: string;
    openRate: string;
    clickRate: string;
  };
}

export interface BulkOperation {
  action: 'delete' | 'update_status' | 'add_tags' | 'remove_tags' | 'move_to_list' | 'update_score' | 'merge';
  contactIds: string[];
  data?: any;
}

export type ActivityType =
  | 'EMAIL_SENT'
  | 'EMAIL_OPENED'
  | 'EMAIL_CLICKED'
  | 'EMAIL_BOUNCED'
  | 'CALL_MADE'
  | 'CALL_RECEIVED'
  | 'MEETING_SCHEDULED'
  | 'MEETING_COMPLETED'
  | 'NOTE_ADDED'
  | 'TAG_ADDED'
  | 'TAG_REMOVED'
  | 'STATUS_CHANGED'
  | 'LIST_CHANGED'
  | 'FORM_SUBMITTED'
  | 'WEBSITE_VISIT'
  | 'CUSTOM';

export type FieldType =
  | 'TEXT'
  | 'NUMBER'
  | 'EMAIL'
  | 'PHONE'
  | 'URL'
  | 'DATE'
  | 'BOOLEAN'
  | 'DROPDOWN'
  | 'MULTI_SELECT'
  | 'TEXTAREA';

export type DuplicateStatus = 'PENDING' | 'MERGED' | 'IGNORED' | 'REVIEWED';
