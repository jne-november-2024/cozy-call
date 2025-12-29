import { useUnifiedCommunication } from '@/hooks/useUnifiedCommunication';
import { UnifiedInbox } from './UnifiedInbox';
import { UnifiedConversationView } from './UnifiedConversationView';
import { toast } from '@/hooks/use-toast';

export function UnifiedModule() {
  const {
    clientThreads,
    selectedClientThread,
    selectedClientId,
    searchQuery,
    filterChannel,
    filterUnread,
    setSearchQuery,
    setFilterChannel,
    setFilterUnread,
    selectClient,
    clearSelection,
  } = useUnifiedCommunication();

  const handleSendMessage = (content: string, type: 'IN_APP' | 'SMS') => {
    if (!selectedClientId) return;
    
    // In a real app, this would make an API call
    toast({
      title: 'Message sent',
      description: `Sent ${type === 'SMS' ? 'SMS' : 'in-app'} message to client`,
    });
  };

  const handleCall = (clientId: string) => {
    toast({
      title: 'Initiating call',
      description: 'Call functionality would be integrated here',
    });
  };

  const handleReplyToEmail = (emailId: string) => {
    toast({
      title: 'Reply to email',
      description: 'Email reply functionality would be integrated here',
    });
  };

  return (
    <div className="h-[calc(100vh-220px)] flex rounded-lg border overflow-hidden bg-card shadow-card">
      <div className="w-[400px] flex-shrink-0">
        <UnifiedInbox
          threads={clientThreads}
          selectedClientId={selectedClientId || undefined}
          onSelect={selectClient}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterChannel={filterChannel}
          onFilterChannelChange={setFilterChannel}
          filterUnread={filterUnread}
          onFilterUnreadChange={setFilterUnread}
        />
      </div>
      <div className="flex-1">
        <UnifiedConversationView
          thread={selectedClientThread}
          onSendMessage={handleSendMessage}
          onCall={handleCall}
          onReplyToEmail={handleReplyToEmail}
        />
      </div>
    </div>
  );
}

