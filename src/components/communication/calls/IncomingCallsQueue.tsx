import { Phone, PhoneOff, ArrowRightLeft, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CallResponse } from '@/types/communication.types';

interface IncomingCallsQueueProps {
  calls: CallResponse[];
  onAccept: (callId: string) => void;
  onDecline: (callId: string) => void;
}

export function IncomingCallsQueue({ calls, onAccept, onDecline }: IncomingCallsQueueProps) {
  const formatWaitTime = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getReasonColor = (reason?: string) => {
    switch (reason) {
      case 'emergency': return 'destructive';
      case 'clinical': return 'info';
      case 'billing': return 'warning';
      case 'appointment': return 'success';
      default: return 'secondary';
    }
  };

  if (calls.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Incoming Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <Phone className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No incoming calls</p>
            <p className="text-sm">New calls will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Incoming Calls
          </CardTitle>
          <Badge variant="ringing">{calls.length} waiting</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 p-4">
            {calls.map((call, index) => (
              <div
                key={call.callId}
                className={`p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors animate-fade-in ${
                  index === 0 ? 'border-primary/50 ring-2 ring-primary/20' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{call.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{call.phoneNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {call.reason && (
                      <Badge variant={getReasonColor(call.reason)} className="capitalize">
                        {call.reason}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatWaitTime(call.startTime)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="accept"
                    size="sm"
                    className="flex-1"
                    onClick={() => onAccept(call.callId)}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    variant="decline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onDecline(call.callId)}
                  >
                    <PhoneOff className="w-4 h-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
