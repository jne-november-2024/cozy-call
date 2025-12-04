import { Users, Phone, PhoneCall } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StaffAvailabilityResponse } from '@/types/communication.types';

interface StaffAvailabilityListProps {
  staff: StaffAvailabilityResponse[];
}

export function StaffAvailabilityList({ staff }: StaffAvailabilityListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <Badge variant="available">Available</Badge>;
      case 'unavailable': return <Badge variant="unavailable">Unavailable</Badge>;
      case 'busy': return <Badge variant="busy">On Call</Badge>;
      case 'offline': return <Badge variant="offline">Offline</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'available': return 'bg-status-available';
      case 'unavailable': return 'bg-status-unavailable';
      case 'busy': return 'bg-status-busy';
      case 'offline': return 'bg-status-offline';
      default: return 'bg-muted';
    }
  };

  const availableCount = staff.filter(s => s.status === 'available').length;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Staff
          </CardTitle>
          <Badge variant="success">{availableCount} available</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-1 p-4">
            {staff.map((member) => (
              <div
                key={member.staffId}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {member.staffName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getStatusDot(member.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{member.staffName}</p>
                    {member.activeCalls > 0 && (
                      <PhoneCall className="w-3 h-3 text-success animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{member.totalCallsToday}</p>
                  <p className="text-xs text-muted-foreground">today</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
