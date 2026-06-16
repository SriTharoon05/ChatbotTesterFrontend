import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import SendIcon from '@mui/icons-material/Send';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MessageBubble from './MessageBubble';
import { sendMessage } from '../api';
import type { ChatMessage, UrlItem, ConversationEntry } from '../types';

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function parseReply(reply: string) {
  try {
    const match = reply.match(/\{[\s\S]*"quick_replies"[\s\S]*\}$/);

    if (!match) {
      return {
        text: reply,
        quickReplies: [],
      };
    }

    const parsed = JSON.parse(match[0]);

    return {
      text: reply.replace(match[0], '').trim(),
      quickReplies: parsed.quick_replies || [],
    };
  } catch {
    return {
      text: reply,
      quickReplies: [],
    };
  }
}

interface ChatWindowProps {
  onConversationSaved: (entry: ConversationEntry) => void;
}

interface QuickReply {
  text: string;
  payload?: string;
}

interface DisplayMessage {
  role: 'user' | 'assistant';
  content: string;
  urls?: UrlItem[] | string[];
  quickReplies?: (string | QuickReply)[];
}

export default function ChatWindow({ onConversationSaved }: ChatWindowProps) {
  const [sessionId, setSessionId] = useState(generateSessionId);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function startNewChat() {
    if (messages.length > 0) {
      const entry: ConversationEntry = {
        id: sessionId,
        session_id: sessionId,
        timestamp: Date.now(),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        title: messages[0]?.content.slice(0, 60) || 'Conversation',
      };
      onConversationSaved(entry);
    }
    setSessionId(generateSessionId());
    setMessages([]);
    setError(null);
  }

async function handleSend(text?: string) {
  const userText = (text ?? input).trim();

  if (!userText || loading) return;

  setInput('');
  setError(null);

  setMessages((prev) => [
    ...prev,
    {
      role: 'user',
      content: userText,
    },
  ]);

  setLoading(true);

  try {
    const data = await sendMessage(userText, sessionId);

    const parsedReply = parseReply(data.reply || '');
const quickReplies = Array.isArray(data.quick_replies)
  ? data.quick_replies
  : parsedReply.quickReplies;

setMessages((prev) => [
  ...prev,
  {
    role: 'assistant',
    content: parsedReply.text,
    urls: data.urls,
    quickReplies,
  },
]);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Something went wrong.',
    );

    setMessages((prev) => prev.slice(0, -1));
  } finally {
    setLoading(false);
  }
}
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  const historyMessages: ChatMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const isEmpty = messages.length === 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>
            Chat
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            {sessionId.slice(0, 20)}…
          </Typography>
        </Box>
        <Tooltip title="New conversation">
          <IconButton size="small" onClick={startNewChat} color="primary">
            <AddCommentIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: { xs: 2, sm: 3 },
          py: 3,
        }}
      >
        {isEmpty && (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              opacity: 0.5,
            }}
          >
            <SmartToyIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Send a message to start chatting
            </Typography>
          </Box>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            role={msg.role}
            content={msg.content}
            urls={msg.urls}
            quickReplies={msg.quickReplies}
            onQuickReply={(t) => void handleSend(t)}
            isLast={idx === messages.length - 1}
          />
        ))}

        {loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'secondary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <SmartToyIcon sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Box
              sx={{
                px: 2,
                py: 1.25,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: '18px 18px 18px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CircularProgress size={14} thickness={5} />
              <Typography variant="caption" color="text.secondary">
                Thinking…
              </Typography>
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div ref={bottomRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          bgcolor: 'background.paper',
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={5}
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          variant="outlined"
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={() => void handleSend()}
          disabled={!input.trim() || loading}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            width: 40,
            height: 40,
            flexShrink: 0,
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Debug: history count */}
      {historyMessages.length > 0 && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ textAlign: 'center', pb: 0.5, bgcolor: 'background.paper' }}
        >
          {historyMessages.length} messages in session
        </Typography>
      )}
    </Box>
  );
}
