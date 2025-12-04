import { useState } from 'react';
import { Search, MessageSquare, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConversationResponse } from '@/types/communication.types';

interface MessageInboxProps {
  conversations: ConversationResponse[];
  selectedId?: string;
  onSelect: (conversation: ConversationResponse) => void;
}

export function MessageInbox({ conversations, selectedId, onSelect }: MessageInboxProps) {
  const [search, setSearch] = useState('');

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col border-r bg-card">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No conversations</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => onSelect(conv)}
                className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
                  selectedId === conv.conversationId
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-accent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">{conv.clientName}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTime(conv.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage?.content || 'No messages'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge variant="default" className="rounded-full h-5 min-w-[20px] flex items-center justify-center">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
