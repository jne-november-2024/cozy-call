import { useState } from 'react';
import { MessageCircle, Users, Send, User, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCommunication } from '@/hooks/useCommunication';

export function TeamChatModule() {
  const { chatGroups } = useCommunication();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const selectedGroupData = chatGroups.find(g => g.groupId === selectedGroup);

  // Mock messages for demo
  const mockChatMessages = [
    {
      messageId: 'cm-1',
      groupId: 'group-1',
      senderId: 'staff-2',
      senderName: 'Mark Stevens',
      content: 'Good morning team! Patient in the waiting room for Dr. Foster.',
      sentAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
      messageId: 'cm-2',
      groupId: 'group-1',
      senderId: 'staff-3',
      senderName: 'Rachel Kim',
      content: 'Got it, I\'ll let her know.',
      sentAt: new Date(Date.now() - 300000).toISOString(),
    },
    {
      messageId: 'cm-3',
      groupId: 'group-1',
      senderId: 'staff-1',
      senderName: 'Dr. Amanda Foster',
      content: 'Thanks! I\'ll be there in 5 minutes.',
      sentAt: new Date(Date.now() - 60000).toISOString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] animate-fade-in">
      {/* Groups List */}
      <Card className="lg:col-span-1 shadow-card flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Groups
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-1">
              {chatGroups.map((group) => (
                <button
                  key={group.groupId}
                  onClick={() => setSelectedGroup(group.groupId)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedGroup === group.groupId
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Hash className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{group.name}</span>
                        {group.unreadCount > 0 && (
                          <Badge variant="default" className="rounded-full h-5 min-w-[20px]">
                            {group.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {group.memberCount} members
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat View */}
      <Card className="lg:col-span-3 shadow-card flex flex-col overflow-hidden">
        {selectedGroupData ? (
          <>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedGroupData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedGroupData.memberCount} members
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockChatMessages.map((msg) => (
                    <div key={msg.messageId} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">
                          {msg.senderName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{msg.senderName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(msg.sentAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Message #${selectedGroupData.name.toLowerCase().replace(/\s/g, '-')}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && message.trim()) {
                        setMessage('');
                      }
                    }}
                  />
                  <Button disabled={!message.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a group</p>
              <p className="text-sm">Choose a group to start chatting</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
