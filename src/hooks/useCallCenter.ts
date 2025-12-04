import { useState, useEffect } from 'react';
import { CallResponse, CallStats } from '@/types/communication.types';
import { 
  mockIncomingCalls, 
  mockActiveCall, 
  mockCallHistory, 
  mockStaffAvailability 
} from '@/data/mockCommunicationData';

export function useCallCenter() {
  const [incomingCalls, setIncomingCalls] = useState<CallResponse[]>(mockIncomingCalls);
  const [activeCall, setActiveCall] = useState<CallResponse | null>(mockActiveCall);
  const [callHistory, setCallHistory] = useState<CallResponse[]>(mockCallHistory);
  const [staffAvailability, setStaffAvailability] = useState(mockStaffAvailability);
  const [isAvailable, setIsAvailable] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const stats: CallStats = {
    activeCalls: activeCall ? 1 : 0,
    waitingCalls: incomingCalls.length,
    missedCalls: callHistory.filter(c => c.status === 'MISSED').length,
    totalToday: callHistory.length + (activeCall ? 1 : 0),
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const acceptCall = (callId: string) => {
    const call = incomingCalls.find(c => c.callId === callId);
    if (call) {
      setActiveCall({ ...call, status: 'ACTIVE' });
      setIncomingCalls(prev => prev.filter(c => c.callId !== callId));
      setCallDuration(0);
    }
  };

  const declineCall = (callId: string) => {
    const call = incomingCalls.find(c => c.callId === callId);
    if (call) {
      setCallHistory(prev => [{ ...call, status: 'MISSED' }, ...prev]);
      setIncomingCalls(prev => prev.filter(c => c.callId !== callId));
    }
  };

  const endCall = (notes?: string) => {
    if (activeCall) {
      const endedCall: CallResponse = {
        ...activeCall,
        status: 'ENDED',
        endTime: new Date().toISOString(),
        duration: callDuration,
        notes,
      };
      setCallHistory(prev => [endedCall, ...prev]);
      setActiveCall(null);
      setCallDuration(0);
    }
  };

  const holdCall = () => {
    if (activeCall) {
      setActiveCall({ ...activeCall, status: 'ON_HOLD' });
    }
  };

  const resumeCall = () => {
    if (activeCall) {
      setActiveCall({ ...activeCall, status: 'ACTIVE' });
    }
  };

  const transferCall = (staffId: string) => {
    const staff = staffAvailability.find(s => s.staffId === staffId);
    if (activeCall && staff) {
      setActiveCall({ 
        ...activeCall, 
        staffId: staff.staffId,
        staffName: staff.staffName,
      });
    }
  };

  const toggleAvailability = () => {
    setIsAvailable(prev => !prev);
  };

  return {
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
  };
}
