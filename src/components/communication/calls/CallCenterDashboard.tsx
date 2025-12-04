import { useCallCenter } from '@/hooks/useCallCenter';
import { CallStatsCards } from './CallStatsCards';
import { IncomingCallsQueue } from './IncomingCallsQueue';
import { ActiveCallPanel } from './ActiveCallPanel';
import { CallHistoryTable } from './CallHistoryTable';
import { StaffAvailabilityList } from './StaffAvailabilityList';
import { AvailabilityToggle } from './AvailabilityToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';

export function CallCenterDashboard() {
  const {
    incomingCalls,
    activeCall,
    callHistory,
    staffAvailability,
    stats,
    isAvailable,
    callDuration,
    acceptCall,
    declineCall,
    endCall,
    holdCall,
    resumeCall,
    transferCall,
    toggleAvailability,
  } = useCallCenter();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <CallStatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <AvailabilityToggle isAvailable={isAvailable} onToggle={toggleAvailability} />
          <StaffAvailabilityList staff={staffAvailability} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <IncomingCallsQueue
              calls={incomingCalls}
              onAccept={acceptCall}
              onDecline={declineCall}
            />
            {activeCall ? (
              <ActiveCallPanel
                call={activeCall}
                duration={callDuration}
                staffList={staffAvailability}
                onEnd={endCall}
                onHold={holdCall}
                onResume={resumeCall}
                onTransfer={transferCall}
              />
            ) : (
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Active Call
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-12 text-center text-muted-foreground">
                    <Phone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No active call</p>
                    <p className="text-sm">Accept an incoming call to start</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <CallHistoryTable calls={callHistory} />
        </div>
      </div>
    </div>
  );
}
