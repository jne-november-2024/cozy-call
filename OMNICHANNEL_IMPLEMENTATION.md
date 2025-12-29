# Omnichannel Implementation

This document describes the unified omnichannel communication system implemented in the Healthcare Counseling Call Center platform.

## Overview

The platform now supports a **unified omnichannel view** similar to [Spruce Health](https://sprucehealth.com/), where all client interactions (calls, messages, voicemails, emails) are aggregated into a single, client-centric timeline.

## Key Features

### 1. Unified Client Inbox
- **Single inbox** showing all client interactions across all channels
- **Chronological timeline** of all communications per client
- **Channel indicators** with color-coded icons (Phone, Message, Voicemail, Email)
- **Unread counts** aggregated across all channels
- **Quick preview** of last interaction per client

### 2. Client-Centric Conversation View
- **Unified timeline** showing all interactions for a selected client
- **Cross-channel context** - see the full communication history regardless of channel
- **Rich interaction cards** with channel-specific details:
  - **Calls**: Status, duration, notes, reason
  - **Messages**: Content, type (SMS/In-App), sender info
  - **Voicemails**: Transcript, duration, AI summary with action items
  - **Emails**: Subject, body preview, attachments

### 3. Advanced Search & Filtering
- **Unified search** across all channels (client names, phone numbers, content)
- **Channel filtering** (All, Calls, Messages, Voicemails, Emails)
- **Unread filter** to show only conversations with unread items
- **Real-time filtering** with instant results

### 4. Cross-Channel Actions
- **Call from conversation** - initiate calls directly from the unified view
- **Send messages** (In-App or SMS) from any conversation
- **Reply to emails** directly from the timeline
- **View voicemail transcripts** and AI summaries inline

## Architecture

### New Components

#### `UnifiedModule`
Main component that orchestrates the unified inbox and conversation view.

#### `UnifiedInbox`
- Displays list of all client threads
- Shows search and filter controls
- Displays channel badges and unread counts
- Handles client selection

#### `UnifiedConversationView`
- Shows complete interaction timeline for selected client
- Renders different interaction types with appropriate UI
- Provides action buttons (call, reply, etc.)
- Message input for sending new messages

### New Hooks

#### `useUnifiedCommunication`
- Aggregates data from all communication channels
- Groups interactions by client
- Provides filtering and search functionality
- Calculates unified statistics (total unread, thread counts)

### New Types

#### `UnifiedInteraction`
Represents a single interaction across any channel with:
- Channel type (CALL, MESSAGE, VOICEMAIL, EMAIL)
- Client information
- Channel-specific data
- Metadata (duration, urgency, attachments)
- Preview text

#### `UnifiedClientThread`
Represents all interactions for a single client:
- Client information
- Chronological list of all interactions
- Summary statistics (unread count, channel counts)
- Last interaction details

## Usage

### Accessing the Unified View

1. Navigate to the Communication Dashboard
2. Click on the **"Unified Inbox"** tab (first tab, default view)
3. All client interactions are now visible in one place

### Using the Unified Inbox

1. **Search**: Type in the search box to find clients or conversations
2. **Filter by Channel**: Use the channel dropdown to filter by specific channels
3. **Filter Unread**: Toggle "Unread only" to see only conversations with unread items
4. **Select Client**: Click on any client thread to view their complete interaction history

### Viewing Client Timeline

1. Select a client from the inbox
2. View their complete interaction timeline in chronological order
3. See all channels mixed together (calls, messages, voicemails, emails)
4. Use action buttons to:
   - Call the client
   - Send a message
   - Reply to emails
   - Play voicemails

## Benefits

### For Healthcare Staff
- **Context at a glance**: See all client interactions in one place
- **Faster response**: No need to switch between tabs
- **Better continuity**: Understand full conversation history
- **Reduced errors**: Less chance of missing important communications

### For the Platform
- **Modern UX**: Aligns with industry leaders like Spruce Health
- **Scalable**: Easy to add new communication channels
- **Flexible**: Can still use channel-specific views when needed
- **HIPAA-ready**: All interactions tracked and organized

## Migration Path

The platform maintains **backward compatibility**:
- All original channel-specific tabs still work (Calls, Messages, Voicemails, Mailbox, Team Chat)
- Users can switch between unified and channel-specific views
- Unified view is the default, but users can use traditional views if preferred

## Future Enhancements

Potential improvements for future iterations:
- Real-time updates via WebSocket
- Advanced AI-powered insights across channels
- Automated workflow triggers based on interaction patterns
- Integration with EHR systems for automatic charting
- Voice-to-text transcription for calls
- Sentiment analysis across all channels
- Automated follow-up scheduling

## Technical Notes

- All data is currently using mock data
- In production, this would connect to real APIs
- The unified hook aggregates data client-side for now
- Server-side aggregation would improve performance at scale
- Email client mapping may need adjustment based on your data model

