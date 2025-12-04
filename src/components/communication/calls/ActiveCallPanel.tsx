import { useState, useEffect, useCallback } from 'react';
import { Phone, PhoneOff, Pause, Play, ArrowRightLeft, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CallResponse, StaffAvailabilityResponse } from '@/types/communication.types';

interface ActiveCallPanelProps {
  call: CallResponse;
  duration: number;
  staffList: StaffAvailabilityResponse[];
  onEnd: (notes?: string) => void;
  onHold: () => void;
  onResume: () => void;
  onTransfer: (staffId: string) => void;
}

export function ActiveCallPanel({
  call,
  duration,
  staffList,
  onEnd,
  onHold,
  onResume,
  onTransfer,
}: ActiveCallPanelProps) {
  const [notes, setNotes] = useState(call.notes || '');
  const [showTransfer, setShowTransfer] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isOnHold = call.status === 'ON_HOLD';
  const availableStaff = staffList.filter(s => s.status === 'available');

  return (
    <Card className="border-2 border-success/30 bg-success/5 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            Active Call
          </CardTitle>
          <Badge variant={isOnHold ? 'warning' : 'active'}>
            {isOnHold ? 'On Hold' : 'Connected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Info */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{call.clientName}</h3>
            <p className="text-sm text-muted-foreground">{call.phoneNumber}</p>
            {call.reason && (
              <Badge variant="outline" className="mt-1 capitalize">
                {call.reason}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-semibold text-foreground">
              {formatDuration(duration)}
            </div>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex gap-2">
          {isOnHold ? (
            <Button variant="success" className="flex-1" onClick={onResume}>
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          ) : (
            <Button variant="warning" className="flex-1" onClick={onHold}>
              <Pause className="w-4 h-4 mr-2" />
              Hold
            </Button>
          )}
          <Button 
            variant="info" 
            className="flex-1" 
            onClick={() => setShowTransfer(!showTransfer)}
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Transfer
          </Button>
          <Button 
            variant="decline" 
            className="flex-1" 
            onClick={() => onEnd(notes)}
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            End Call
          </Button>
        </div>

        {/* Transfer Options */}
        {showTransfer && (
          <div className="p-3 bg-muted rounded-lg space-y-2 animate-fade-in">
            <p className="text-sm font-medium">Transfer to:</p>
            <div className="grid grid-cols-2 gap-2">
              {availableStaff.map(staff => (
                <Button
                  key={staff.staffId}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    onTransfer(staff.staffId);
                    setShowTransfer(false);
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-status-available mr-2" />
                  {staff.staffName}
                </Button>
              ))}
            </div>
            {availableStaff.length === 0 && (
              <p className="text-sm text-muted-foreground">No available staff</p>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="w-4 h-4" />
            Call Notes
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this call..."
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Client Chart
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Schedule Follow-up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
