import { useState } from 'react';
import { 
  ConversationResponse, 
  MessageResponse, 
  VoicemailResponse,
  EmailResponse,
  ChatGroupResponse,
} from '@/types/communication.types';
import { 
  mockConversations, 
  mockMessages, 
  mockVoicemails,
  mockEmails,
  mockChatGroups,
  mockMessageTemplates,
} from '@/data/mockCommunicationData';

export function useCommunication() {
  const [conversations, setConversations] = useState<ConversationResponse[]>(mockConversations);
  const [currentMessages, setCurrentMessages] = useState<MessageResponse[]>(mockMessages);
  const [selectedConversation, setSelectedConversation] = useState<ConversationResponse | null>(null);
  const [voicemails, setVoicemails] = useState<VoicemailResponse[]>(mockVoicemails);
  const [emails, setEmails] = useState<EmailResponse[]>(mockEmails);
  const [chatGroups, setChatGroups] = useState<ChatGroupResponse[]>(mockChatGroups);
  const [templates] = useState(mockMessageTemplates);

  const selectConversation = (conversation: ConversationResponse) => {
    setSelectedConversation(conversation);
    // In real app, fetch messages for this conversation
    setCurrentMessages(mockMessages);
  };

  const sendMessage = (content: string, type: 'IN_APP' | 'SMS' = 'IN_APP') => {
    if (!selectedConversation) return;
    
    const newMessage: MessageResponse = {
      messageId: `msg-${Date.now()}`,
      conversationId: selectedConversation.conversationId,
      clientId: selectedConversation.clientId,
      clientName: selectedConversation.clientName,
      senderId: 'current-user',
      senderName: 'You',
      content,
      type,
      sentAt: new Date().toISOString(),
      isRead: true,
      isFromClient: false,
    };
    
    setCurrentMessages(prev => [...prev, newMessage]);
    setConversations(prev => prev.map(conv => 
      conv.conversationId === selectedConversation.conversationId
        ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
        : conv
    ));
  };

  const markVoicemailRead = (voicemailId: string) => {
    setVoicemails(prev => prev.map(vm => 
      vm.voicemailId === voicemailId ? { ...vm, isRead: true } : vm
    ));
  };

  const deleteVoicemail = (voicemailId: string) => {
    setVoicemails(prev => prev.filter(vm => vm.voicemailId !== voicemailId));
  };

  const markEmailRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.emailId === emailId ? { ...email, isRead: true } : email
    ));
  };

  const toggleEmailStar = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.emailId === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const unreadMessagesCount = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);
  const unreadVoicemailsCount = voicemails.filter(vm => !vm.isRead).length;
  const unreadEmailsCount = emails.filter(e => !e.isRead).length;
  const unreadChatCount = chatGroups.reduce((acc, g) => acc + g.unreadCount, 0);

  return {
    conversations,
    currentMessages,
    selectedConversation,
    voicemails,
    emails,
    chatGroups,
    templates,
    selectConversation,
    sendMessage,
    markVoicemailRead,
    deleteVoicemail,
    markEmailRead,
    toggleEmailStar,
    unreadMessagesCount,
    unreadVoicemailsCount,
    unreadEmailsCount,
    unreadChatCount,
  };
}
