import { Button } from '@/components/ui/button';
import { Phone, PhoneOff } from 'lucide-react';

interface AvailabilityToggleProps {
  isAvailable: boolean;
  onToggle: () => void;
}

export function AvailabilityToggle({ isAvailable, onToggle }: AvailabilityToggleProps) {
  return (
    <Button
      variant={isAvailable ? 'available' : 'unavailable'}
      size="lg"
      onClick={onToggle}
      className="w-full"
    >
      {isAvailable ? (
        <>
          <Phone className="w-5 h-5 mr-2" />
          Available
        </>
      ) : (
        <>
          <PhoneOff className="w-5 h-5 mr-2" />
          Unavailable
        </>
      )}
    </Button>
  );
}
