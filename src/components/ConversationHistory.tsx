import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import type { ConversationEntry } from '../types';

interface ConversationHistoryProps {
  conversations: ConversationEntry[];
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ConversationHistory({ conversations }: ConversationHistoryProps) {
  const [selected, setSelected] = React.useState<string | null>(null);

  const sorted = [...conversations].sort((a, b) => b.timestamp - a.timestamp);
  const active = sorted.find((c) => c.id === selected) ?? sorted[0] ?? null;

  if (sorted.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          opacity: 0.5,
          px: 3,
        }}
      >
        <HistoryIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No saved conversations yet. Start a chat and click the new-conversation icon to save it
          here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: '100%', sm: 280 },
          display: { xs: active && selected ? 'none' : 'flex', sm: 'flex' },
          flexDirection: 'column',
          borderRight: 1,
          borderColor: 'divider',
          overflowY: 'auto',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            PAST CONVERSATIONS
          </Typography>
          <Chip label={`${sorted.length}`} size="small" sx={{ ml: 1 }} />
        </Box>
        {sorted.map((conv) => (
          <Box
            key={conv.id}
            onClick={() => setSelected(conv.id)}
            sx={{
              px: 2,
              py: 1.5,
              cursor: 'pointer',
              bgcolor: active?.id === conv.id ? 'action.selected' : 'transparent',
              borderLeft: 3,
              borderColor: active?.id === conv.id ? 'primary.main' : 'transparent',
              '&:hover': { bgcolor: 'action.hover' },
              transition: 'background-color 0.15s',
            }}
          >
            <Typography variant="body2" fontWeight={500} noWrap>
              {conv.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(conv.timestamp)} · {conv.messages.length} msgs
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Detail */}
      <Box
        sx={{
          flex: 1,
          display: { xs: active && selected ? 'flex' : 'none', sm: 'flex' },
          flexDirection: 'column',
          overflowY: 'auto',
          bgcolor: 'background.default',
        }}
      >
        {active ? (
          <>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <HistoryIcon fontSize="small" color="action" />
              <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                {active.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(active.timestamp)}
              </Typography>
            </Box>

            <Box sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
              <Stack spacing={2}>
                {active.messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        flexDirection: isUser ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: isUser ? 'primary.main' : 'secondary.main',
                          flexShrink: 0,
                        }}
                      >
                        {isUser ? (
                          <PersonIcon sx={{ fontSize: 16 }} />
                        ) : (
                          <SmartToyIcon sx={{ fontSize: 16 }} />
                        )}
                      </Avatar>
                      <Paper
                        elevation={0}
                        sx={{
                          px: 2,
                          py: 1.25,
                          maxWidth: '72%',
                          bgcolor: isUser ? 'primary.main' : 'background.paper',
                          color: isUser ? 'primary.contrastText' : 'text.primary',
                          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          border: isUser ? 'none' : '1px solid',
                          borderColor: 'divider',
                          wordBreak: 'break-word',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}
                        >
                          {msg.content}
                        </Typography>
                      </Paper>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Select a conversation to view
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
