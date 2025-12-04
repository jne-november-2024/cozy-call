import { Phone, PhoneMissed, PhoneCall, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CallStats } from '@/types/communication.types';

interface CallStatsCardsProps {
  stats: CallStats;
}

export function CallStatsCards({ stats }: CallStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.activeCalls}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.waitingCalls}</p>
              <p className="text-sm text-muted-foreground">Waiting</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
              <PhoneMissed className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.missedCalls}</p>
              <p className="text-sm text-muted-foreground">Missed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.totalToday}</p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
