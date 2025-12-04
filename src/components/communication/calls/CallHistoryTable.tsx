import { useState } from 'react';
import { Phone, PhoneMissed, PhoneOutgoing, PhoneIncoming, Clock, FileText, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CallResponse } from '@/types/communication.types';

interface CallHistoryTableProps {
  calls: CallResponse[];
}

export function CallHistoryTable({ calls }: CallHistoryTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'missed' | 'incoming' | 'outgoing'>('all');

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ENDED': return <Badge variant="ended">Ended</Badge>;
      case 'MISSED': return <Badge variant="missed">Missed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string, status: string) => {
    if (status === 'MISSED') {
      return <PhoneMissed className="w-4 h-4 text-error" />;
    }
    return type === 'INCOMING' 
      ? <PhoneIncoming className="w-4 h-4 text-success" />
      : <PhoneOutgoing className="w-4 h-4 text-info" />;
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.clientName.toLowerCase().includes(search.toLowerCase()) ||
      call.phoneNumber.includes(search);
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'missed') return matchesSearch && call.status === 'MISSED';
    if (filter === 'incoming') return matchesSearch && call.type === 'INCOMING';
    if (filter === 'outgoing') return matchesSearch && call.type === 'OUTGOING';
    return matchesSearch;
  });

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Call History
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search calls..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {(['all', 'missed', 'incoming', 'outgoing'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalls.map((call) => (
                <TableRow key={call.callId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(call.type, call.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{call.clientName}</p>
                      <p className="text-sm text-muted-foreground">{call.phoneNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{formatDate(call.startTime)}</p>
                      <p className="text-sm text-muted-foreground">{formatTime(call.startTime)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{formatDuration(call.duration)}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(call.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm">{call.staffName || '-'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      {call.notes && (
                        <Button variant="ghost" size="icon-sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCalls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No calls found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
