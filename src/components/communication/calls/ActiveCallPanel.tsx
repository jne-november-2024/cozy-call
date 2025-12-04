import { useState } from 'react';
import { 
  Phone, PhoneOff, Pause, Play, ArrowRightLeft, User, FileText, 
  Calendar, ExternalLink, ChevronDown, UserPlus, Save, CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CallResponse, StaffAvailabilityResponse } from '@/types/communication.types';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

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
  const [showTransferMenu, setShowTransferMenu] = useState(false);
  const [showTransferList, setShowTransferList] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [showClientChartDialog, setShowClientChartDialog] = useState(false);
  const [saveToChart, setSaveToChart] = useState(false);
  const [isSavingToChart, setIsSavingToChart] = useState(false);
  const [savedToChart, setSavedToChart] = useState(false);
  
  // Follow-up state
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);
  const [followUpTime, setFollowUpTime] = useState('09:00');
  const [appointmentType, setAppointmentType] = useState<string>('follow_up');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  
  // Assign state
  const [assignStaffId, setAssignStaffId] = useState('');
  const [assignNote, setAssignNote] = useState('');
  const [assignPriority, setAssignPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isAssigning, setIsAssigning] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isOnHold = call.status === 'ON_HOLD';
  const availableStaff = staffList.filter(s => s.status === 'available');

  const handleSaveToChart = async () => {
    if (!notes.trim()) {
      toast({
        title: 'No notes to save',
        description: 'Please add notes before saving to chart.',
        variant: 'destructive',
      });
      return;
    }
    setIsSavingToChart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavedToChart(true);
    setIsSavingToChart(false);
    toast({
      title: 'Saved to Client Chart',
      description: 'Call notes have been saved to the client\'s chart.',
    });
  };

  const handleScheduleFollowUp = async () => {
    if (!followUpDate) {
      toast({
        title: 'Date required',
        description: 'Please select a follow-up date.',
        variant: 'destructive',
      });
      return;
    }
    setIsScheduling(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsScheduling(false);
    setShowFollowUpDialog(false);
    toast({
      title: 'Follow-up Scheduled',
      description: `Appointment scheduled for ${format(followUpDate, 'PPP')} at ${followUpTime}`,
    });
    // Reset form
    setFollowUpDate(undefined);
    setFollowUpTime('09:00');
    setAppointmentType('follow_up');
    setFollowUpNotes('');
  };

  const handleAssignForFollowUp = async () => {
    if (!assignStaffId) {
      toast({
        title: 'Staff required',
        description: 'Please select a staff member to assign.',
        variant: 'destructive',
      });
      return;
    }
    setIsAssigning(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAssigning(false);
    setShowAssignDialog(false);
    const assignedStaff = staffList.find(s => s.staffId === assignStaffId);
    toast({
      title: 'Call Assigned',
      description: `Follow-up task assigned to ${assignedStaff?.staffName || 'staff member'}.`,
    });
    // Reset form
    setAssignStaffId('');
    setAssignNote('');
    setAssignPriority('medium');
  };

  return (
    <>
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
            
            {/* Transfer/Assign Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="info" className="flex-1">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Transfer
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowTransferList(true)}>
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Transfer Call
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign for Follow-up
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="decline" 
              className="flex-1" 
              onClick={() => onEnd(notes)}
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Call
            </Button>
          </div>

          {/* Transfer List */}
          {showTransferList && (
            <div className="p-3 bg-muted rounded-lg space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Transfer to:</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTransferList(false)}
                >
                  Cancel
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableStaff.map(staff => (
                  <Button
                    key={staff.staffId}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      onTransfer(staff.staffId);
                      setShowTransferList(false);
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4" />
                Call Notes
              </div>
              <div className="flex items-center gap-2">
                {savedToChart && (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Saved to Chart
                  </Badge>
                )}
              </div>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setSavedToChart(false);
              }}
              placeholder="Add notes about this call..."
              className="min-h-[80px] resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="save-to-chart"
                  checked={saveToChart}
                  onCheckedChange={setSaveToChart}
                />
                <Label htmlFor="save-to-chart" className="text-sm">
                  Auto-save to chart on call end
                </Label>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveToChart}
                disabled={isSavingToChart || !notes.trim()}
              >
                {isSavingToChart ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save to Chart
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowClientChartDialog(true)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Client Chart
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowFollowUpDialog(true)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Follow-up
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={showFollowUpDialog} onOpenChange={setShowFollowUpDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Follow-up</DialogTitle>
            <DialogDescription>
              Schedule a follow-up appointment for {call.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Input value={call.clientName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {followUpDate ? format(followUpDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={followUpDate}
                    onSelect={setFollowUpDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Select value={followUpTime} onValueChange={setFollowUpTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                    '15:00', '15:30', '16:00', '16:30', '17:00'].map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Appointment Type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow_up">Follow-up Session</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="therapy">Therapy Session</SelectItem>
                  <SelectItem value="check_in">Check-in Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                placeholder="Add any notes for the follow-up..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFollowUpDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleFollowUp} disabled={isScheduling}>
              {isScheduling ? 'Scheduling...' : 'Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign for Follow-up Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign for Follow-up</DialogTitle>
            <DialogDescription>
              Create a follow-up task for this call with {call.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Assign to Staff</Label>
              <Select value={assignStaffId} onValueChange={setAssignStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.filter(s => s.status !== 'offline').map(staff => (
                    <SelectItem key={staff.staffId} value={staff.staffId}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          staff.status === 'available' ? 'bg-status-available' :
                          staff.status === 'busy' ? 'bg-status-busy' : 'bg-status-unavailable'
                        }`} />
                        {staff.staffName} ({staff.role})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={assignPriority} onValueChange={(v) => setAssignPriority(v as 'low' | 'medium' | 'high')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-info" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Note</Label>
              <Textarea
                value={assignNote}
                onChange={(e) => setAssignNote(e.target.value)}
                placeholder="Add instructions for the follow-up..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignForFollowUp} disabled={isAssigning}>
              {isAssigning ? 'Assigning...' : 'Assign Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Client Chart Dialog */}
      <Dialog open={showClientChartDialog} onOpenChange={setShowClientChartDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Client Chart - {call.clientName}</DialogTitle>
            <DialogDescription>
              Quick view of client information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{call.clientName}</h3>
                <p className="text-sm text-muted-foreground">Client ID: {call.clientId}</p>
                <p className="text-sm text-muted-foreground">{call.phoneNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Total Calls</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-secondary">8</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-info">3</div>
                <div className="text-sm text-muted-foreground">Voicemails</div>
              </Card>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Recent Notes</h4>
              <p className="text-sm text-muted-foreground">
                Client is showing positive progress in therapy sessions. Last session focused on anxiety management techniques.
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning" />
              <p className="text-sm">This is a demo view. Full client chart integration requires backend setup.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClientChartDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast({
                title: 'Opening Full Chart',
                description: 'Redirecting to full client chart...',
              });
              setShowClientChartDialog(false);
            }}>
              Open Full Chart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
