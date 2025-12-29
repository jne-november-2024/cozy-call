import { useState, useMemo } from 'react';
import { 
  UnifiedInteraction, 
  UnifiedClientThread,
  CallResponse,
  MessageResponse,
  VoicemailResponse,
  EmailResponse,
  ConversationResponse,
} from '@/types/communication.types';
import { 
  mockIncomingCalls,
  mockActiveCall,
  mockCallHistory,
  mockConversations,
  mockMessages,
  mockVoicemails,
  mockEmails,
} from '@/data/mockCommunicationData';

/**
 * Unified communication hook that aggregates all channels into a single omnichannel view
 */
export function useUnifiedCommunication() {
  const [calls] = useState<CallResponse[]>([...mockIncomingCalls, mockActiveCall, ...mockCallHistory]);
  const [conversations] = useState<ConversationResponse[]>(mockConversations);
  const [messages] = useState<MessageResponse[]>(mockMessages);
  const [voicemails] = useState<VoicemailResponse[]>(mockVoicemails);
  const [emails] = useState<EmailResponse[]>(mockEmails);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<'ALL' | 'CALL' | 'MESSAGE' | 'VOICEMAIL' | 'EMAIL'>('ALL');
  const [filterUnread, setFilterUnread] = useState(false);

  // Convert all channel data into unified interactions
  const unifiedInteractions = useMemo<UnifiedInteraction[]>(() => {
    const interactions: UnifiedInteraction[] = [];

    // Add calls
    calls.forEach(call => {
      const preview = call.status === 'ACTIVE' 
        ? `Active call - ${call.reason || 'general'}`
        : call.status === 'RINGING'
        ? `Incoming call - ${call.reason || 'general'}`
        : call.status === 'ENDED'
        ? `Call ended - ${call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : ''}`
        : call.status === 'MISSED'
        ? `Missed call`
        : `Call - ${call.reason || 'general'}`;

      interactions.push({
        interactionId: `call-${call.callId}`,
        clientId: call.clientId,
        clientName: call.clientName,
        type: 'CALL',
        timestamp: call.startTime,
        isRead: call.status !== 'RINGING',
        isUnread: call.status === 'RINGING',
        callData: call,
        preview,
        metadata: {
          duration: call.duration,
          status: call.status,
          urgency: call.reason === 'emergency' ? 'high' : call.reason === 'clinical' ? 'medium' : 'low',
        },
      });
    });

    // Add messages
    conversations.forEach(conv => {
      if (conv.lastMessage) {
        interactions.push({
          interactionId: `msg-${conv.conversationId}`,
          clientId: conv.clientId,
          clientName: conv.clientName,
          type: 'MESSAGE',
          timestamp: conv.lastMessage.sentAt,
          isRead: conv.lastMessage.isRead,
          isUnread: conv.unreadCount > 0,
          messageData: conv.lastMessage,
          preview: conv.lastMessage.content,
          metadata: {
            attachments: 0,
          },
        });
      }
    });

    // Add voicemails
    voicemails.forEach(vm => {
      interactions.push({
        interactionId: `vm-${vm.voicemailId}`,
        clientId: vm.clientId,
        clientName: vm.clientName,
        type: 'VOICEMAIL',
        timestamp: vm.createdAt,
        isRead: vm.isRead,
        isUnread: !vm.isRead,
        voicemailData: vm,
        preview: vm.transcript || `Voicemail (${vm.duration}s)`,
        metadata: {
          duration: vm.duration,
          urgency: vm.aiSummary?.urgency || 'low',
        },
      });
    });

    // Add emails
    emails.forEach(email => {
      // Use clientId if provided, otherwise create a fallback ID
      // In production, all emails should have a clientId from the database
      const emailClientId = email.clientId || `email-client-${email.from}`;
      interactions.push({
        interactionId: `email-${email.emailId}`,
        clientId: emailClientId,
        clientName: email.fromName,
        type: 'EMAIL',
        timestamp: email.createdAt,
        isRead: email.isRead,
        isUnread: !email.isRead,
        emailData: email,
        preview: email.subject,
        metadata: {
          attachments: email.attachments?.length || 0,
        },
      });
    });

    // Sort by timestamp (newest first)
    return interactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [calls, conversations, voicemails, emails]);

  // Group interactions by client
  const clientThreads = useMemo<UnifiedClientThread[]>(() => {
    const threadsMap = new Map<string, UnifiedClientThread>();

    unifiedInteractions.forEach(interaction => {
      if (!threadsMap.has(interaction.clientId)) {
        threadsMap.set(interaction.clientId, {
          clientId: interaction.clientId,
          clientName: interaction.clientName,
          clientAvatar: interaction.clientAvatar,
          phoneNumber: interaction.callData?.phoneNumber || interaction.voicemailData?.phoneNumber,
          email: interaction.emailData?.from,
          interactions: [],
          unreadCount: 0,
          lastInteractionAt: interaction.timestamp,
          lastInteractionType: interaction.type,
          lastInteractionPreview: interaction.preview,
          callCount: 0,
          messageCount: 0,
          voicemailCount: 0,
          emailCount: 0,
        });
      }

      const thread = threadsMap.get(interaction.clientId)!;
      thread.interactions.push(interaction);
      
      if (interaction.isUnread) {
        thread.unreadCount++;
      }

      // Update counts
      if (interaction.type === 'CALL') thread.callCount++;
      else if (interaction.type === 'MESSAGE') thread.messageCount++;
      else if (interaction.type === 'VOICEMAIL') thread.voicemailCount++;
      else if (interaction.type === 'EMAIL') thread.emailCount++;

      // Update last interaction if this is newer
      if (new Date(interaction.timestamp) > new Date(thread.lastInteractionAt)) {
        thread.lastInteractionAt = interaction.timestamp;
        thread.lastInteractionType = interaction.type;
        thread.lastInteractionPreview = interaction.preview;
      }
    });

    // Sort interactions within each thread chronologically (newest first)
    threadsMap.forEach(thread => {
      thread.interactions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });

    return Array.from(threadsMap.values()).sort((a, b) => 
      new Date(b.lastInteractionAt).getTime() - new Date(a.lastInteractionAt).getTime()
    );
  }, [unifiedInteractions]);

  // Filter threads based on search and filters
  const filteredThreads = useMemo(() => {
    let filtered = clientThreads;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(thread =>
        thread.clientName.toLowerCase().includes(query) ||
        thread.phoneNumber?.toLowerCase().includes(query) ||
        thread.email?.toLowerCase().includes(query) ||
        thread.lastInteractionPreview.toLowerCase().includes(query)
      );
    }

    // Channel filter
    if (filterChannel !== 'ALL') {
      filtered = filtered.filter(thread => {
        if (filterChannel === 'CALL') return thread.callCount > 0;
        if (filterChannel === 'MESSAGE') return thread.messageCount > 0;
        if (filterChannel === 'VOICEMAIL') return thread.voicemailCount > 0;
        if (filterChannel === 'EMAIL') return thread.emailCount > 0;
        return true;
      });
    }

    // Unread filter
    if (filterUnread) {
      filtered = filtered.filter(thread => thread.unreadCount > 0);
    }

    return filtered;
  }, [clientThreads, searchQuery, filterChannel, filterUnread]);

  // Get selected client's full interaction timeline
  const selectedClientThread = useMemo(() => {
    if (!selectedClientId) return null;
    return clientThreads.find(thread => thread.clientId === selectedClientId) || null;
  }, [clientThreads, selectedClientId]);

  // Get total unread count across all channels
  const totalUnreadCount = useMemo(() => {
    return clientThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);
  }, [clientThreads]);

  return {
    // Data
    clientThreads: filteredThreads,
    selectedClientThread,
    selectedClientId,
    
    // Filters
    searchQuery,
    filterChannel,
    filterUnread,
    setSearchQuery,
    setFilterChannel,
    setFilterUnread,
    
    // Actions
    selectClient: setSelectedClientId,
    clearSelection: () => setSelectedClientId(null),
    
    // Stats
    totalUnreadCount,
    totalThreads: clientThreads.length,
  };
}

