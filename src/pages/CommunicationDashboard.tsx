import { useState } from 'react';
import { Phone, MessageSquare, Voicemail, Mail, Users, Headphones, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UnifiedModule } from '@/components/communication/unified/UnifiedModule';
import { CallCenterDashboard } from '@/components/communication/calls/CallCenterDashboard';
import { MessagesModule } from '@/components/communication/messages/MessagesModule';
import { VoicemailModule } from '@/components/communication/voicemail/VoicemailModule';
import { MailboxModule } from '@/components/communication/mailbox/MailboxModule';
import { TeamChatModule } from '@/components/communication/team-chat/TeamChatModule';
import { useCommunication } from '@/hooks/useCommunication';
import { useUnifiedCommunication } from '@/hooks/useUnifiedCommunication';

export default function CommunicationDashboard() {
  const [activeTab, setActiveTab] = useState('unified');
  const { unreadMessagesCount, unreadVoicemailsCount, unreadEmailsCount, unreadChatCount } = useCommunication();
  const { totalUnreadCount } = useUnifiedCommunication();

  const tabs = [
    { id: 'unified', label: 'Unified Inbox', icon: Layers, badge: totalUnreadCount },
    { id: 'calls', label: 'Calls', icon: Phone, badge: 0 },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'voicemails', label: 'Voicemails', icon: Voicemail, badge: unreadVoicemailsCount },
    { id: 'mailbox', label: 'Mailbox', icon: Mail, badge: unreadEmailsCount },
    { id: 'team-chat', label: 'Team Chat', icon: Users, badge: unreadChatCount },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Headphones className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Communication Center</h1>
                <p className="text-sm text-muted-foreground">Healthcare Counseling Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border p-1 h-auto flex-wrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge > 0 && (
                  <Badge variant="secondary" className="rounded-full h-5 min-w-[20px] text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="unified" className="m-0">
            <UnifiedModule />
          </TabsContent>

          <TabsContent value="calls" className="m-0">
            <CallCenterDashboard />
          </TabsContent>

          <TabsContent value="messages" className="m-0">
            <MessagesModule />
          </TabsContent>

          <TabsContent value="voicemails" className="m-0">
            <VoicemailModule />
          </TabsContent>

          <TabsContent value="mailbox" className="m-0">
            <MailboxModule />
          </TabsContent>

          <TabsContent value="team-chat" className="m-0">
            <TeamChatModule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
