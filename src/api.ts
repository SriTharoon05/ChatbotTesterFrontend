import type { BackendResponse } from './types';

// Replace this URL with your actual backend endpoint
const API_ENDPOINT = 'https://certificationexamrag-chatbot-backend.onrender.com/message';

export async function sendMessage(
  message: string,
  sessionId: string,
  
): Promise<BackendResponse> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: BackendResponse = await response.json();
  if (!data.success) {
    throw new Error('Backend returned success: false');
  }
  return data;
}
