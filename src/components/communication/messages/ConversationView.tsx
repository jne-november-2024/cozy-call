import { useState } from 'react';
import { 
  Send, Smartphone, Globe, User, Users, FileText, 
  Check, Loader2, X, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ConversationResponse, MessageResponse, MessageTemplateResponse, ClientOption } from '@/types/communication.types';
import { mockMessageTemplates } from '@/data/mockCommunicationData';
import { toast } from '@/hooks/use-toast';

interface ConversationViewProps {
  conversation: ConversationResponse | null;
  messages: MessageResponse[];
  onSend: (content: string, type: 'IN_APP' | 'SMS') => void;
}

// Mock clients for multi-select
const mockClients: ClientOption[] = [
  { clientId: 'client-1', clientName: 'Sarah Johnson', phoneNumber: '(555) 123-4567' },
  { clientId: 'client-2', clientName: 'Michael Chen', phoneNumber: '(555) 234-5678' },
  { clientId: 'client-3', clientName: 'Emily Rodriguez', phoneNumber: '(555) 345-6789' },
  { clientId: 'client-4', clientName: 'James Wilson', phoneNumber: '(555) 456-7890' },
  { clientId: 'client-5', clientName: 'Lisa Thompson', phoneNumber: '(555) 567-8901' },
  { clientId: 'client-6', clientName: 'Robert Davis', phoneNumber: '(555) 678-9012' },
  { clientId: 'client-7', clientName: 'Jennifer Martinez', phoneNumber: '(555) 789-0123' },
  { clientId: 'client-8', clientName: 'David Anderson', phoneNumber: '(555) 890-1234' },
];

export function ConversationView({ conversation, messages, onSend }: ConversationViewProps) {
  const [message, setMessage] = useState('');
  const [sendType, setSendType] = useState<'IN_APP' | 'SMS'>('IN_APP');
  const [sendToMultiple, setSendToMultiple] = useState(false);
  const [showMultiSendDialog, setShowMultiSendDialog] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [multiMessage, setMultiMessage] = useState('');
  const [multiSendType, setMultiSendType] = useState<'IN_APP' | 'SMS'>('IN_APP');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplateResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [clientSearch, setClientSearch] = useState('');

  const templates = mockMessageTemplates;

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim(), sendType);
    setMessage('');
  };

  const handleTemplateSelect = (template: MessageTemplateResponse) => {
    setSelectedTemplate(template);
    setMultiMessage(template.content);
  };

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleMultiSend = async () => {
    if (selectedClients.length === 0 || !multiMessage.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please select recipients and enter a message.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    setSendProgress(0);

    // Simulate sending to each recipient
    for (let i = 0; i < selectedClients.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSendProgress(((i + 1) / selectedClients.length) * 100);
    }

    setIsSending(false);
    setShowMultiSendDialog(false);
    
    toast({
      title: 'Messages Sent',
      description: `Successfully sent ${multiSendType === 'SMS' ? 'SMS' : 'in-app'} message to ${selectedClients.length} recipients.`,
    });

    // Reset
    setSelectedClients([]);
    setMultiMessage('');
    setSelectedTemplate(null);
    setSendProgress(0);
  };

  const filteredClients = mockClients.filter(client =>
    client.clientName.toLowerCase().includes(clientSearch.toLowerCase())
  );

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
    <>
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{conversation.clientName}</h3>
                <p className="text-sm text-muted-foreground">Client</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMultiSendDialog(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Send to Multiple
            </Button>
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

      {/* Multi-Send Dialog */}
      <Dialog open={showMultiSendDialog} onOpenChange={setShowMultiSendDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Send to Multiple Recipients
            </DialogTitle>
            <DialogDescription>
              Send individual private messages to multiple clients at once
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {/* Message Type Toggle */}
            <div className="flex items-center gap-4">
              <Button
                variant={multiSendType === 'IN_APP' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMultiSendType('IN_APP')}
              >
                <Globe className="w-4 h-4 mr-1" />
                In-App
              </Button>
              <Button
                variant={multiSendType === 'SMS' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMultiSendType('SMS')}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                SMS
              </Button>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Use Template (optional)</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedTemplate ? selectedTemplate.name : 'Select a template'}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full" align="start">
                  {templates.map(template => (
                    <DropdownMenuItem 
                      key={template.templateId}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {template.name}
                      {template.category && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          {template.category}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Message Content */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={multiMessage}
                onChange={(e) => setMultiMessage(e.target.value)}
                placeholder="Type your message or select a template..."
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Use {'{clientName}'} to personalize with the client's name
              </p>
            </div>

            {/* Client Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Select Recipients</Label>
                {selectedClients.length > 0 && (
                  <Badge variant="secondary">
                    {selectedClients.length} selected
                  </Badge>
                )}
              </div>
              <Input
                placeholder="Search clients..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="mb-2"
              />
              <ScrollArea className="h-[200px] border rounded-lg">
                <div className="p-2 space-y-1">
                  {filteredClients.map(client => (
                    <div
                      key={client.clientId}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedClients.includes(client.clientId)
                          ? 'bg-primary/10'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => toggleClientSelection(client.clientId)}
                    >
                      <Checkbox
                        checked={selectedClients.includes(client.clientId)}
                        onCheckedChange={() => toggleClientSelection(client.clientId)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{client.clientName}</p>
                        <p className="text-xs text-muted-foreground">{client.phoneNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Send Progress */}
            {isSending && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending to {selectedClients.length} recipients...
                  </span>
                  <span>{Math.round(sendProgress)}%</span>
                </div>
                <Progress value={sendProgress} />
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowMultiSendDialog(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleMultiSend}
              disabled={isSending || selectedClients.length === 0 || !multiMessage.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to {selectedClients.length || 0} Recipients
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
