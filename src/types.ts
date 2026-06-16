export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UrlItem {
  title?: string;
  url: string;
}

export interface BackendResponse {
  success: boolean;
  session_id: string;
  message: string;
  reply: string;
  urls?: UrlItem[] | string[];
  history?: ChatMessage[];
  quick_replies?: string[];
}

export interface ConversationEntry {
  id: string;
  session_id: string;
  timestamp: number;
  messages: ChatMessage[];
  title: string;
}
