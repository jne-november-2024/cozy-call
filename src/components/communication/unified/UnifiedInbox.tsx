import { Search, Phone, MessageSquare, Voicemail, Mail, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UnifiedClientThread, InteractionType } from '@/types/communication.types';
import { cn } from '@/lib/utils';

interface UnifiedInboxProps {
  threads: UnifiedClientThread[];
  selectedClientId?: string;
  onSelect: (clientId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterChannel: 'ALL' | 'CALL' | 'MESSAGE' | 'VOICEMAIL' | 'EMAIL';
  onFilterChannelChange: (channel: 'ALL' | 'CALL' | 'MESSAGE' | 'VOICEMAIL' | 'EMAIL') => void;
  filterUnread: boolean;
  onFilterUnreadChange: (unread: boolean) => void;
}

const getChannelIcon = (type: InteractionType) => {
  switch (type) {
    case 'CALL':
      return Phone;
    case 'MESSAGE':
      return MessageSquare;
    case 'VOICEMAIL':
      return Voicemail;
    case 'EMAIL':
      return Mail;
    default:
      return MessageSquare;
  }
};

const getChannelColor = (type: InteractionType) => {
  switch (type) {
    case 'CALL':
      return 'text-blue-500 bg-blue-50 dark:bg-blue-950';
    case 'MESSAGE':
      return 'text-green-500 bg-green-50 dark:bg-green-950';
    case 'VOICEMAIL':
      return 'text-purple-500 bg-purple-50 dark:bg-purple-950';
    case 'EMAIL':
      return 'text-orange-500 bg-orange-50 dark:bg-orange-950';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

export function UnifiedInbox({
  threads,
  selectedClientId,
  onSelect,
  searchQuery,
  onSearchChange,
  filterChannel,
  onFilterChannelChange,
  filterUnread,
  onFilterUnreadChange,
}: UnifiedInboxProps) {
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

  const ChannelIcon = getChannelIcon(threads[0]?.lastInteractionType || 'MESSAGE');

  return (
    <div className="h-full flex flex-col border-r bg-card">
      {/* Header with Search */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients, messages, calls..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => onSearchChange('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filterChannel} onValueChange={onFilterChannelChange}>
            <SelectTrigger className="h-8 text-xs">
              <Filter className="w-3 h-3 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Channels</SelectItem>
              <SelectItem value="CALL">Calls</SelectItem>
              <SelectItem value="MESSAGE">Messages</SelectItem>
              <SelectItem value="VOICEMAIL">Voicemails</SelectItem>
              <SelectItem value="EMAIL">Emails</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 px-2 py-1 rounded-md border">
            <Switch
              id="unread-filter"
              checked={filterUnread}
              onCheckedChange={onFilterUnreadChange}
              className="scale-75"
            />
            <Label htmlFor="unread-filter" className="text-xs cursor-pointer">
              Unread only
            </Label>
          </div>
        </div>
      </div>

      {/* Threads List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {threads.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No conversations found</p>
              {(searchQuery || filterChannel !== 'ALL' || filterUnread) && (
                <p className="text-xs mt-1">Try adjusting your filters</p>
              )}
            </div>
          ) : (
            threads.map((thread) => {
              const LastChannelIcon = getChannelIcon(thread.lastInteractionType);
              const channelColor = getChannelColor(thread.lastInteractionType);

              return (
                <button
                  key={thread.clientId}
                  onClick={() => onSelect(thread.clientId)}
                  className={cn(
                    'w-full p-3 rounded-lg text-left transition-colors mb-1',
                    selectedClientId === thread.clientId
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-accent'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Client Avatar */}
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {thread.clientAvatar ? (
                        <img
                          src={thread.clientAvatar}
                          alt={thread.clientName}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">
                          {thread.clientName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Thread Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium truncate">{thread.clientName}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(thread.lastInteractionAt)}
                        </span>
                      </div>

                      {/* Last Interaction Preview */}
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn('p-1 rounded', channelColor)}>
                          <LastChannelIcon className="w-3 h-3" />
                        </div>
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {thread.lastInteractionPreview}
                        </p>
                      </div>

                      {/* Channel Badges */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {thread.callCount > 0 && (
                          <Badge variant="outline" className="text-xs h-5 px-1.5">
                            <Phone className="w-3 h-3 mr-1" />
                            {thread.callCount}
                          </Badge>
                        )}
                        {thread.messageCount > 0 && (
                          <Badge variant="outline" className="text-xs h-5 px-1.5">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {thread.messageCount}
                          </Badge>
                        )}
                        {thread.voicemailCount > 0 && (
                          <Badge variant="outline" className="text-xs h-5 px-1.5">
                            <Voicemail className="w-3 h-3 mr-1" />
                            {thread.voicemailCount}
                          </Badge>
                        )}
                        {thread.emailCount > 0 && (
                          <Badge variant="outline" className="text-xs h-5 px-1.5">
                            <Mail className="w-3 h-3 mr-1" />
                            {thread.emailCount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Unread Badge */}
                    {thread.unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="rounded-full h-5 min-w-[20px] flex items-center justify-center flex-shrink-0"
                      >
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

