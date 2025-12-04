import { useState } from 'react';
import { 
  Mail, Star, Inbox, Send, FileText, Trash2, Search, User, 
  Users, ChevronDown, Loader2, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useCommunication } from '@/hooks/useCommunication';
import { EmailTemplateResponse } from '@/types/communication.types';
import { toast } from '@/hooks/use-toast';

// Mock email templates
const mockEmailTemplates: EmailTemplateResponse[] = [
  {
    templateId: 'email-tmpl-1',
    name: 'Appointment Confirmation',
    subject: 'Your Appointment Confirmation - {date}',
    body: 'Dear {clientName},\n\nThis email confirms your appointment scheduled for {date} at {time}.\n\nPlease arrive 15 minutes early to complete any necessary paperwork.\n\nIf you need to reschedule, please contact us at least 24 hours in advance.\n\nBest regards,\nHuman Care Center',
    category: 'appointment',
    createdAt: new Date().toISOString(),
  },
  {
    templateId: 'email-tmpl-2',
    name: 'Billing Statement',
    subject: 'Your Billing Statement is Ready',
    body: 'Dear {clientName},\n\nYour latest billing statement is now available. Please log in to your patient portal to view the details.\n\nIf you have any questions about your statement, please don\'t hesitate to contact our billing department.\n\nBest regards,\nHuman Care Center Billing',
    category: 'billing',
    createdAt: new Date().toISOString(),
  },
  {
    templateId: 'email-tmpl-3',
    name: 'Follow-up Care Instructions',
    subject: 'Your Follow-up Care Instructions',
    body: 'Dear {clientName},\n\nThank you for your recent visit. Below are your personalized follow-up care instructions.\n\n[Add instructions here]\n\nPlease feel free to reach out if you have any questions.\n\nBest regards,\nYour Care Team',
    category: 'clinical',
    createdAt: new Date().toISOString(),
  },
];

// Mock recipients
const mockRecipients = [
  { id: 'r1', name: 'Sarah Johnson', email: 'sarah.johnson@email.com' },
  { id: 'r2', name: 'Michael Chen', email: 'michael.chen@email.com' },
  { id: 'r3', name: 'Emily Rodriguez', email: 'emily.rodriguez@email.com' },
  { id: 'r4', name: 'James Wilson', email: 'james.wilson@email.com' },
  { id: 'r5', name: 'Lisa Thompson', email: 'lisa.thompson@email.com' },
  { id: 'r6', name: 'Robert Davis', email: 'robert.davis@email.com' },
  { id: 'r7', name: 'Jennifer Martinez', email: 'jennifer.martinez@email.com' },
  { id: 'r8', name: 'David Anderson', email: 'david.anderson@email.com' },
];

export function MailboxModule() {
  const { emails, markEmailRead, toggleEmailStar } = useCommunication();
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  
  // Compose state
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [composeMode, setComposeMode] = useState<'single' | 'multiple'>('single');
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateResponse | null>(null);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredEmails = emails.filter(email => 
    email.folder === folder &&
    (email.subject.toLowerCase().includes(search.toLowerCase()) ||
     email.fromName.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredRecipients = mockRecipients.filter(r =>
    r.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    r.email.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  const folders = [
    { id: 'inbox' as const, label: 'Inbox', icon: Inbox, count: emails.filter(e => e.folder === 'inbox' && !e.isRead).length },
    { id: 'sent' as const, label: 'Sent', icon: Send, count: 0 },
    { id: 'drafts' as const, label: 'Drafts', icon: FileText, count: 0 },
    { id: 'trash' as const, label: 'Trash', icon: Trash2, count: 0 },
  ];

  const selectedEmailData = emails.find(e => e.emailId === selectedEmail);

  const handleTemplateSelect = (template: EmailTemplateResponse) => {
    setSelectedTemplate(template);
    setComposeSubject(template.subject);
    setComposeBody(template.body);
  };

  const toggleRecipientSelection = (recipientId: string) => {
    setSelectedRecipients(prev =>
      prev.includes(recipientId)
        ? prev.filter(id => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const handleSendEmail = async () => {
    if (composeMode === 'single') {
      if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      setIsSending(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSending(false);
      setShowComposeDialog(false);
      
      toast({
        title: 'Email Sent',
        description: `Email sent to ${composeTo}`,
      });
    } else {
      if (selectedRecipients.length === 0 || !composeSubject.trim() || !composeBody.trim()) {
        toast({
          title: 'Missing information',
          description: 'Please select recipients and fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      setIsSending(true);
      setSendProgress(0);

      // Simulate sending to each recipient individually
      for (let i = 0; i < selectedRecipients.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSendProgress(((i + 1) / selectedRecipients.length) * 100);
      }

      setIsSending(false);
      setShowComposeDialog(false);
      
      toast({
        title: 'Emails Sent',
        description: `Successfully sent individual emails to ${selectedRecipients.length} recipients.`,
      });
    }

    // Reset
    resetComposeForm();
  };

  const resetComposeForm = () => {
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setSelectedRecipients([]);
    setSelectedTemplate(null);
    setRecipientSearch('');
    setSendProgress(0);
  };

  const openCompose = (mode: 'single' | 'multiple') => {
    setComposeMode(mode);
    resetComposeForm();
    setShowComposeDialog(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
        {/* Sidebar */}
        <Card className="lg:col-span-1 shadow-card">
          <CardHeader className="pb-3 space-y-2">
            <Button variant="default" className="w-full" onClick={() => openCompose('single')}>
              <Mail className="w-4 h-4 mr-2" />
              Compose
            </Button>
            <Button variant="outline" className="w-full" onClick={() => openCompose('multiple')}>
              <Users className="w-4 h-4 mr-2" />
              Send to Multiple
            </Button>
          </CardHeader>
          <CardContent className="p-2">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setFolder(f.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  folder === f.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                }`}
              >
                <f.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{f.label}</span>
                {f.count > 0 && (
                  <Badge variant="default" className="rounded-full">
                    {f.count}
                  </Badge>
                )}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Email List */}
        <Card className="lg:col-span-1 shadow-card">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-2 space-y-1">
                {filteredEmails.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Mail className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No emails</p>
                  </div>
                ) : (
                  filteredEmails.map((email) => (
                    <button
                      key={email.emailId}
                      onClick={() => {
                        setSelectedEmail(email.emailId);
                        if (!email.isRead) markEmailRead(email.emailId);
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedEmail === email.emailId
                          ? 'bg-primary/10 border border-primary/20'
                          : email.isRead
                          ? 'hover:bg-accent'
                          : 'bg-accent/30 hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEmailStar(email.emailId);
                          }}
                          className="mt-1"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              email.isStarred ? 'fill-warning text-warning' : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm truncate ${!email.isRead ? 'font-semibold' : ''}`}>
                              {email.fromName}
                            </span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatTime(email.createdAt)}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${!email.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                            {email.subject}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Email Content */}
        <Card className="lg:col-span-2 shadow-card">
          <CardContent className="p-6">
            {selectedEmailData ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedEmailData.fromName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedEmailData.from}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(selectedEmailData.createdAt)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{selectedEmailData.subject}</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{selectedEmailData.body}</p>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="default">Reply</Button>
                  <Button variant="outline">Forward</Button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-muted-foreground">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Select an email to read</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compose Email Dialog */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {composeMode === 'multiple' ? <Users className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
              {composeMode === 'multiple' ? 'Send to Multiple Recipients' : 'Compose Email'}
            </DialogTitle>
            <DialogDescription>
              {composeMode === 'multiple' 
                ? 'Send individual emails to multiple recipients (not BCC)'
                : 'Create and send a new email'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {/* Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={composeMode === 'single' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setComposeMode('single')}
              >
                Single Recipient
              </Button>
              <Button
                variant={composeMode === 'multiple' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setComposeMode('multiple')}
              >
                Multiple Recipients
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
                  {mockEmailTemplates.map(template => (
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

            {/* Recipients */}
            {composeMode === 'single' ? (
              <div className="space-y-2">
                <Label>To</Label>
                <Input
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="recipient@email.com"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Select Recipients</Label>
                  {selectedRecipients.length > 0 && (
                    <Badge variant="secondary">
                      {selectedRecipients.length} selected
                    </Badge>
                  )}
                </div>
                <Input
                  placeholder="Search recipients..."
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                />
                <ScrollArea className="h-[150px] border rounded-lg">
                  <div className="p-2 space-y-1">
                    {filteredRecipients.map(recipient => (
                      <div
                        key={recipient.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedRecipients.includes(recipient.id)
                            ? 'bg-primary/10'
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => toggleRecipientSelection(recipient.id)}
                      >
                        <Checkbox
                          checked={selectedRecipients.includes(recipient.id)}
                          onCheckedChange={() => toggleRecipientSelection(recipient.id)}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{recipient.name}</p>
                          <p className="text-xs text-muted-foreground">{recipient.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Subject */}
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Write your email..."
                className="min-h-[150px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Use {'{clientName}'} to personalize with the recipient's name
              </p>
            </div>

            {/* Send Progress */}
            {isSending && composeMode === 'multiple' && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending to {selectedRecipients.length} recipients...
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
              onClick={() => setShowComposeDialog(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {composeMode === 'multiple' 
                    ? `Send to ${selectedRecipients.length || 0} Recipients`
                    : 'Send Email'
                  }
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
