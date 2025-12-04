import { useState } from 'react';
import { 
  Play, Pause, Phone, Trash2, FileText, User, Clock, 
  Sparkles, Loader2, AlertTriangle, CheckCircle, ListChecks 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VoicemailResponse, VoicemailSummary } from '@/types/communication.types';
import { useCommunication } from '@/hooks/useCommunication';
import { toast } from '@/hooks/use-toast';

export function VoicemailModule() {
  const { voicemails, markVoicemailRead, deleteVoicemail } = useCommunication();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedVoicemail, setSelectedVoicemail] = useState<VoicemailResponse | null>(null);
  const [summaries, setSummaries] = useState<Record<string, VoicemailSummary>>({});
  const [summarizing, setSummarizing] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const togglePlay = (voicemail: VoicemailResponse) => {
    if (playingId === voicemail.voicemailId) {
      setPlayingId(null);
    } else {
      setPlayingId(voicemail.voicemailId);
      setSelectedVoicemail(voicemail);
      if (!voicemail.isRead) {
        markVoicemailRead(voicemail.voicemailId);
      }
    }
  };

  const handleSummarize = async (voicemailId: string) => {
    if (summaries[voicemailId]) {
      // Already summarized
      return;
    }
    
    setSummarizing(voicemailId);
    
    // Simulate AI summarization API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const voicemail = voicemails.find(vm => vm.voicemailId === voicemailId);
    const transcript = voicemail?.transcript || '';
    
    // Mock AI summary based on transcript
    let summary: VoicemailSummary;
    
    if (transcript.toLowerCase().includes('reschedule')) {
      summary = {
        summary: 'Client requesting to reschedule their upcoming appointment. Needs callback to confirm new time.',
        actionItems: [
          'Call back client to reschedule appointment',
          'Check calendar availability for next week',
          'Send confirmation once new appointment is set'
        ],
        urgency: 'medium',
        generatedAt: new Date().toISOString(),
      };
    } else if (transcript.toLowerCase().includes('billing')) {
      summary = {
        summary: 'Client has a billing inquiry and is requesting clarification on their statement.',
        actionItems: [
          'Review client\'s billing history',
          'Prepare explanation of charges',
          'Call back with billing details'
        ],
        urgency: 'low',
        generatedAt: new Date().toISOString(),
      };
    } else {
      summary = {
        summary: 'General inquiry from client. Message requires follow-up callback.',
        actionItems: [
          'Return client\'s call at earliest convenience',
          'Review client notes before callback',
          'Document outcome of callback'
        ],
        urgency: 'medium',
        generatedAt: new Date().toISOString(),
      };
    }
    
    setSummaries(prev => ({
      ...prev,
      [voicemailId]: summary,
    }));
    setSummarizing(null);
    
    toast({
      title: 'Summary Generated',
      description: 'AI summary and action items are now available.',
    });
  };

  const getUrgencyColor = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-info/10 text-info border-info/20';
    }
  };

  const getUrgencyIcon = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Voicemail List */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Voicemails
            <Badge variant="secondary" className="ml-2">
              {voicemails.filter(vm => !vm.isRead).length} new
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="p-4 space-y-2">
              {voicemails.map((voicemail) => (
                <div
                  key={voicemail.voicemailId}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedVoicemail?.voicemailId === voicemail.voicemailId
                      ? 'bg-primary/5 border-primary/30'
                      : voicemail.isRead
                      ? 'bg-card hover:bg-accent/50'
                      : 'bg-accent/30 hover:bg-accent/50 border-primary/20'
                  }`}
                  onClick={() => setSelectedVoicemail(voicemail)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${!voicemail.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {voicemail.clientName}
                        </span>
                        {!voicemail.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        {summaries[voicemail.voicemailId] && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Sparkles className="w-3 h-3" />
                            Summarized
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{voicemail.phoneNumber}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(voicemail.createdAt)}
                        </span>
                        <span>{formatDuration(voicemail.duration)}</span>
                      </div>
                    </div>
                    <Button
                      variant={playingId === voicemail.voicemailId ? 'default' : 'outline'}
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(voicemail);
                      }}
                    >
                      {playingId === voicemail.voicemailId ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Waveform visualization */}
                  {playingId === voicemail.voicemailId && (
                    <div className="mt-3 flex items-center gap-1 h-8">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary rounded-full call-wave"
                          style={{
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Voicemail Detail */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedVoicemail ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedVoicemail.clientName}</h3>
                  <p className="text-muted-foreground">{selectedVoicemail.phoneNumber}</p>
                </div>
              </div>

              {/* Transcript Section */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Transcript</p>
                <p className="text-sm text-muted-foreground">
                  {selectedVoicemail.transcript || 'No transcript available'}
                </p>
              </div>

              {/* AI Summarize Button */}
              {selectedVoicemail.transcript && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSummarize(selectedVoicemail.voicemailId)}
                  disabled={summarizing === selectedVoicemail.voicemailId || !!summaries[selectedVoicemail.voicemailId]}
                >
                  {summarizing === selectedVoicemail.voicemailId ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Summary...
                    </>
                  ) : summaries[selectedVoicemail.voicemailId] ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Summary Available Below
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Summarize with AI
                    </>
                  )}
                </Button>
              )}

              {/* AI Summary Card */}
              {summaries[selectedVoicemail.voicemailId] && (
                <div className="space-y-3 animate-fade-in">
                  <Card className={`border ${getUrgencyColor(summaries[selectedVoicemail.voicemailId].urgency)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">AI Summary</span>
                        <Badge variant="outline" className={`ml-auto ${getUrgencyColor(summaries[selectedVoicemail.voicemailId].urgency)}`}>
                          {getUrgencyIcon(summaries[selectedVoicemail.voicemailId].urgency)}
                          <span className="ml-1 capitalize">{summaries[selectedVoicemail.voicemailId].urgency} Priority</span>
                        </Badge>
                      </div>
                      <p className="text-sm mb-4">
                        {summaries[selectedVoicemail.voicemailId].summary}
                      </p>
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <ListChecks className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Action Items</span>
                        </div>
                        <ul className="space-y-2">
                          {summaries[selectedVoicemail.voicemailId].actionItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">
                                {index + 1}
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="success" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Back
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => deleteVoicemail(selectedVoicemail.voicemailId)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Phone className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Select a voicemail to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
