import { useState } from 'react';
import { Send, Smartphone, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConversationResponse, MessageResponse } from '@/types/communication.types';

interface ConversationViewProps {
  conversation: ConversationResponse | null;
  messages: MessageResponse[];
  onSend: (content: string, type: 'IN_APP' | 'SMS') => void;
}

export function ConversationView({ conversation, messages, onSend }: ConversationViewProps) {
  const [message, setMessage] = useState('');
  const [sendType, setSendType] = useState<'IN_APP' | 'SMS'>('IN_APP');

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim(), sendType);
    setMessage('');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center text-muted-foreground">
          <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Select a conversation</p>
          <p className="text-sm">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{conversation.clientName}</h3>
            <p className="text-sm text-muted-foreground">Client</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`flex ${msg.isFromClient ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.isFromClient
                    ? 'bg-muted text-foreground rounded-bl-sm'
                    : 'bg-primary text-primary-foreground rounded-br-sm'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className={`flex items-center gap-1 mt-1 ${
                  msg.isFromClient ? 'text-muted-foreground' : 'text-primary-foreground/70'
                }`}>
                  <span className="text-xs">{formatTime(msg.sentAt)}</span>
                  {msg.type === 'SMS' && (
                    <Smartphone className="w-3 h-3 ml-1" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
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
