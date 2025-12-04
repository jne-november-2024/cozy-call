import { useCommunication } from '@/hooks/useCommunication';
import { MessageInbox } from './MessageInbox';
import { ConversationView } from './ConversationView';

export function MessagesModule() {
  const {
    conversations,
    currentMessages,
    selectedConversation,
    selectConversation,
    sendMessage,
  } = useCommunication();

  return (
    <div className="h-[calc(100vh-220px)] flex rounded-lg border overflow-hidden bg-card shadow-card">
      <div className="w-[350px] flex-shrink-0">
        <MessageInbox
          conversations={conversations}
          selectedId={selectedConversation?.conversationId}
          onSelect={selectConversation}
        />
      </div>
      <div className="flex-1">
        <ConversationView
          conversation={selectedConversation}
          messages={currentMessages}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}
