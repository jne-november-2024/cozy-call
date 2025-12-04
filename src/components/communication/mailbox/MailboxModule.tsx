import { useState } from 'react';
import { Mail, Star, Inbox, Send, FileText, Trash2, Search, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCommunication } from '@/hooks/useCommunication';

export function MailboxModule() {
  const { emails, markEmailRead, toggleEmailStar } = useCommunication();
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

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

  const folders = [
    { id: 'inbox' as const, label: 'Inbox', icon: Inbox, count: emails.filter(e => e.folder === 'inbox' && !e.isRead).length },
    { id: 'sent' as const, label: 'Sent', icon: Send, count: 0 },
    { id: 'drafts' as const, label: 'Drafts', icon: FileText, count: 0 },
    { id: 'trash' as const, label: 'Trash', icon: Trash2, count: 0 },
  ];

  const selectedEmailData = emails.find(e => e.emailId === selectedEmail);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
      {/* Sidebar */}
      <Card className="lg:col-span-1 shadow-card">
        <CardHeader className="pb-3">
          <Button variant="default" className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Compose
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
  );
}
