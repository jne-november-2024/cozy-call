import { 
  Phone, MessageSquare, Voicemail, Mail, User, Send, 
  Smartphone, Globe, Clock, Play, Download, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { UnifiedClientThread, UnifiedInteraction } from '@/types/communication.types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface UnifiedConversationViewProps {
  thread: UnifiedClientThread | null;
  onSendMessage: (content: string, type: 'IN_APP' | 'SMS') => void;
  onCall: (clientId: string) => void;
  onReplyToEmail: (emailId: string) => void;
}

const getChannelIcon = (type: string) => {
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

const getChannelColor = (type: string) => {
  switch (type) {
    case 'CALL':
      return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20';
    case 'MESSAGE':
      return 'border-green-200 bg-green-50 dark:bg-green-950/20';
    case 'VOICEMAIL':
      return 'border-purple-200 bg-purple-50 dark:bg-purple-950/20';
    case 'EMAIL':
      return 'border-orange-200 bg-orange-50 dark:bg-orange-950/20';
    default:
      return 'border-muted bg-muted/50';
  }
};

export function UnifiedConversationView({
  thread,
  onSendMessage,
  onCall,
  onReplyToEmail,
}: UnifiedConversationViewProps) {
  const [message, setMessage] = useState('');
  const [sendType, setSendType] = useState<'IN_APP' | 'SMS'>('IN_APP');

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateHeader = (dateString: string, prevDateString?: string) => {
    const date = new Date(dateString);
    const prevDate = prevDateString ? new Date(prevDateString) : null;
    const now = new Date();
    
    if (prevDate && date.toDateString() === prevDate.toDateString()) {
      return null;
    }
    
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSend = () => {
    if (!message.trim() || !thread) return;
    onSendMessage(message.trim(), sendType);
    setMessage('');
  };

  const renderInteraction = (interaction: UnifiedInteraction, index: number, interactions: UnifiedInteraction[]) => {
    const ChannelIcon = getChannelIcon(interaction.type);
    const channelColor = getChannelColor(interaction.type);
    const dateHeader = formatDateHeader(interaction.timestamp, interactions[index + 1]?.timestamp);

    return (
      <div key={interaction.interactionId}>
        {dateHeader && (
          <div className="flex items-center gap-4 my-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground font-medium">{dateHeader}</span>
            <Separator className="flex-1" />
          </div>
        )}

        <div className={cn('mb-4 p-4 rounded-lg border', channelColor)}>
          <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg', channelColor)}>
              <ChannelIcon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{interaction.clientName}</span>
                  <Badge variant="outline" className="text-xs">
                    {interaction.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(interaction.timestamp)}
                </div>
              </div>

              {/* Content based on type */}
              {interaction.type === 'CALL' && interaction.callData && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={interaction.callData.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {interaction.callData.status}
                    </Badge>
                    {interaction.callData.reason && (
                      <Badge variant="outline">{interaction.callData.reason}</Badge>
                    )}
                  </div>
                  {interaction.callData.notes && (
                    <p className="text-sm text-muted-foreground">{interaction.callData.notes}</p>
                  )}
                  {interaction.callData.duration && (
                    <p className="text-xs text-muted-foreground">
                      Duration: {Math.floor(interaction.callData.duration / 60)}m {interaction.callData.duration % 60}s
                    </p>
                  )}
                  {interaction.callData.status === 'RINGING' && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => onCall(interaction.clientId)}>
                        <Phone className="w-4 h-4 mr-2" />
                        Answer
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {interaction.type === 'MESSAGE' && interaction.messageData && (
                <div className="space-y-2">
                  <p className="text-sm">{interaction.messageData.content}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {interaction.messageData.type === 'SMS' && (
                      <Smartphone className="w-3 h-3" />
                    )}
                    {interaction.messageData.isFromClient ? 'From client' : 'To client'}
                  </div>
                </div>
              )}

              {interaction.type === 'VOICEMAIL' && interaction.voicemailData && (
                <div className="space-y-2">
                  <p className="text-sm">{interaction.voicemailData.transcript || 'No transcript available'}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Duration: {interaction.voicemailData.duration}s</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  {interaction.voicemailData.aiSummary && (
                    <Card className="mt-2">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-xs font-medium">AI Summary</span>
                          <Badge variant="outline" className="ml-auto">
                            {interaction.voicemailData.aiSummary.urgency}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {interaction.voicemailData.aiSummary.summary}
                        </p>
                        {interaction.voicemailData.aiSummary.actionItems.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-1">Action Items:</p>
                            <ul className="text-xs text-muted-foreground list-disc list-inside">
                              {interaction.voicemailData.aiSummary.actionItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {interaction.type === 'EMAIL' && interaction.emailData && (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium mb-1">{interaction.emailData.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {interaction.emailData.body}
                    </p>
                  </div>
                  {interaction.emailData.attachments && interaction.emailData.attachments.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      {interaction.emailData.attachments.length} attachment(s)
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => onReplyToEmail(interaction.emailData!.emailId)}>
                      Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!thread) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center text-muted-foreground">
          <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Select a client</p>
          <p className="text-sm">Choose a conversation from the unified inbox</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {thread.clientAvatar ? (
                <img
                  src={thread.clientAvatar}
                  alt={thread.clientName}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{thread.clientName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {thread.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {thread.phoneNumber}
                  </span>
                )}
                {thread.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {thread.email}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onCall(thread.clientId)}>
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          </div>
        </div>
      </div>

      {/* Interactions Timeline */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {thread.interactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No interactions yet</p>
            </div>
          ) : (
            thread.interactions.map((interaction, index) =>
              renderInteraction(interaction, index, thread.interactions)
            )
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant={sendType === 'IN_APP' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSendType('IN_APP')}
          >
            <Globe className="w-4 h-4 mr-1" />
            In-App
          </Button>
          <Button
            variant={sendType === 'SMS' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSendType('SMS')}
          >
            <Smartphone className="w-4 h-4 mr-1" />
            SMS
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <Button onClick={handleSend} disabled={!message.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

