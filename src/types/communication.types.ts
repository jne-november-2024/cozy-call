// Call Types
export interface CallResponse {
  callId: string;
  clientId: string;
  clientName: string;
  phoneNumber: string;
  staffId?: string;
  staffName?: string;
  type: 'INCOMING' | 'OUTGOING';
  status: 'RINGING' | 'ACTIVE' | 'ENDED' | 'MISSED' | 'ON_HOLD';
  reason?: 'billing' | 'clinical' | 'appointment' | 'general' | 'emergency';
  startTime: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  isRecorded?: boolean;
  recordingUrl?: string;
  savedToChart?: boolean;
  assignedToStaffId?: string;
  assignedToStaffName?: string;
  assignmentNote?: string;
  assignmentPriority?: 'low' | 'medium' | 'high';
}

export interface AcceptCallRequest {
  callId: string;
  staffId?: string;
}

export interface TransferCallRequest {
  callId: string;
  staffId: string;
}

export interface AssignCallRequest {
  callId: string;
  staffId: string;
  note?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface SaveNotesToChartRequest {
  callId: string;
  notes: string;
}

// Message Types
export interface MessageResponse {
  messageId: string;
  conversationId: string;
  clientId: string;
  clientName: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'IN_APP' | 'SMS';
  sentAt: string;
  isRead: boolean;
  readAt?: string;
  isFromClient: boolean;
}

export interface ConversationResponse {
  conversationId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  lastMessage?: MessageResponse;
  unreadCount: number;
  updatedAt: string;
}

export interface SendMessageRequest {
  conversationId?: string;
  clientId: string;
  content: string;
  type: 'IN_APP' | 'SMS';
}

export interface SendMultipleMessagesRequest {
  clientIds: string[];
  content: string;
  type: 'IN_APP' | 'SMS';
  templateId?: string;
}

// Voicemail Types
export interface VoicemailResponse {
  voicemailId: string;
  clientId: string;
  clientName: string;
  phoneNumber: string;
  duration: number;
  recordingUrl: string;
  transcript?: string;
  createdAt: string;
  isRead: boolean;
  aiSummary?: VoicemailSummary;
}

export interface VoicemailSummary {
  summary: string;
  actionItems: string[];
  urgency: 'low' | 'medium' | 'high';
  generatedAt: string;
}

// Staff Availability Types
export interface StaffAvailabilityResponse {
  staffId: string;
  staffName: string;
  avatar?: string;
  status: 'available' | 'unavailable' | 'busy' | 'offline';
  activeCalls: number;
  totalCallsToday: number;
  role: string;
}

// Message Template Types
export interface MessageTemplateResponse {
  templateId: string;
  name: string;
  content: string;
  category?: string;
  createdAt: string;
}

// Email Types
export interface EmailResponse {
  emailId: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
  attachments?: string[];
  createdAt: string;
}

export interface EmailTemplateResponse {
  templateId: string;
  name: string;
  subject: string;
  body: string;
  category?: string;
  createdAt: string;
}

export interface SendMultipleEmailsRequest {
  recipients: string[];
  subject: string;
  body: string;
  templateId?: string;
}

// Team Chat Types
export interface ChatGroupResponse {
  groupId: string;
  name: string;
  description?: string;
  members: string[];
  memberCount: number;
  lastMessage?: ChatMessageResponse;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatMessageResponse {
  messageId: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachments?: string[];
  sentAt: string;
}

// Stats
export interface CallStats {
  activeCalls: number;
  waitingCalls: number;
  missedCalls: number;
  totalToday: number;
}

// Follow-up Types
export interface FollowUpRequest {
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  appointmentType: 'follow_up' | 'consultation' | 'therapy' | 'check_in';
  notes?: string;
}

// Client for selection
export interface ClientOption {
  clientId: string;
  clientName: string;
  email?: string;
  phoneNumber?: string;
}
