# Codebase Index

This document provides an overview of the codebase structure and available exports.

## Directory Structure

```
src/
├── components/          # React components
│   ├── communication/   # Communication-related components
│   │   ├── calls/       # Call center components
│   │   ├── messages/    # Messaging components
│   │   ├── voicemail/   # Voicemail components
│   │   ├── mailbox/     # Email components
│   │   └── team-chat/   # Team chat components
│   ├── ui/              # shadcn/ui components
│   └── NavLink.tsx      # Navigation link component
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── types/               # TypeScript type definitions
├── lib/                 # Utility functions
├── data/                # Mock data
└── index.ts             # Main application exports
```

## Exports

### Components

#### Communication Components
- **Calls**: `CallCenterDashboard`, `ActiveCallPanel`, `AvailabilityToggle`, `CallHistoryTable`, `CallStatsCards`, `IncomingCallsQueue`, `StaffAvailabilityList`
- **Messages**: `MessagesModule`, `MessageInbox`, `ConversationView`
- **Voicemail**: `VoicemailModule`
- **Mailbox**: `MailboxModule`
- **Team Chat**: `TeamChatModule`

#### UI Components
All shadcn/ui components are available from `@/components/ui/*`

#### Other Components
- `NavLink` - Custom navigation link component

### Hooks

- `useCallCenter` - Manages call center state and operations
- `useCommunication` - Manages communication state (messages, voicemails, emails, chats)
- `useMobile` - Detects mobile device
- `useToast` - Toast notification hook

### Pages

- `CommunicationDashboard` - Main communication dashboard
- `Index` - Landing page
- `NotFound` - 404 error page

### Types

All types are exported from `@/types/communication.types`:
- `CallResponse`, `CallStats`
- `MessageResponse`, `ConversationResponse`
- `VoicemailResponse`, `VoicemailSummary`
- `EmailResponse`, `EmailTemplateResponse`
- `ChatGroupResponse`, `ChatMessageResponse`
- `StaffAvailabilityResponse`
- `MessageTemplateResponse`
- And more...

### Utilities

- `cn` - Class name utility (clsx + tailwind-merge)

### Data

- Mock data exports from `mockCommunicationData.ts`

## Import Examples

```typescript
// Import components
import { CallCenterDashboard, MessagesModule } from '@/components';
import { CallStatsCards } from '@/components/communication/calls';

// Import hooks
import { useCallCenter, useCommunication } from '@/hooks';

// Import types
import { CallResponse, MessageResponse } from '@/types';

// Import utilities
import { cn } from '@/lib';

// Import pages
import { CommunicationDashboard } from '@/pages';
```

## Usage

All index files are set up to allow clean imports. You can import from:
- Specific paths: `@/components/communication/calls/CallCenterDashboard`
- Index files: `@/components/communication/calls`
- Main index: `@/components` (for top-level exports)

