// Message types for communication between extension parts

export type MessageType = 'NEW' | 'PLAY' | 'DELETE' | 'API_REQUEST';

// Base message interface
interface BaseMessage {
  type: MessageType;
}

// New video loaded message (background -> content)
export interface NewVideoMessage extends BaseMessage {
  type: 'NEW';
  videoId: string;
  value: string;
}

// Play bookmark message (popup -> content)
export interface PlayMessage extends BaseMessage {
  type: 'PLAY';
  value: number;
}

// Delete bookmark message (popup -> content)
export interface DeleteMessage extends BaseMessage {
  type: 'DELETE';
  value: number;
}

// API request message (content/popup -> background)
export interface ApiRequestMessage extends BaseMessage {
  type: 'API_REQUEST';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

// Union type for all messages
export type ExtensionMessage = 
  | NewVideoMessage 
  | PlayMessage 
  | DeleteMessage 
  | ApiRequestMessage;

// API response from background script
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
