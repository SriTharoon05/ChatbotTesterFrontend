import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { UrlItem } from '../types';

interface QuickReply {
  text: string;
  payload?: string;
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  urls?: UrlItem[] | string[];
  quickReplies?: (string | QuickReply)[];
  onQuickReply?: (text: string) => void;
  isLast?: boolean;
}

function normalizeUrls(urls: UrlItem[] | string[]): UrlItem[] {
  return urls.map((u) =>
    typeof u === 'string' ? { url: u } : u,
  );
}

export default function MessageBubble({
  role,
  content,
  urls,
  quickReplies,
  onQuickReply,
  isLast,
}: MessageBubbleProps) {
  const isUser = role === 'user';
  const normalizedUrls = urls && urls.length > 0 ? normalizeUrls(urls) : [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
          flexShrink: 0,
          mt: 0.5,
        }}
      >
        {isUser ? (
          <PersonIcon fontSize="small" />
        ) : (
          <SmartToyIcon fontSize="small" />
        )}
      </Avatar>

      <Box
        sx={{
          maxWidth: '72%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          gap: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.25,
            bgcolor: isUser ? 'primary.main' : 'background.paper',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: isUser
              ? '18px 18px 4px 18px'
              : '18px 18px 18px 4px',
            border: isUser ? 'none' : '1px solid',
            borderColor: 'divider',
            wordBreak: 'break-word',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {content}
          </Typography>
        </Paper>

        {normalizedUrls.length > 0 && (
          <Stack spacing={0.75} sx={{ width: '100%' }}>
            {normalizedUrls.map((item, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{
                  px: 1.5,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 2,
                }}
              >
                <OpenInNewIcon
                  sx={{
                    fontSize: 14,
                    color: 'primary.main',
                    flexShrink: 0,
                  }}
                />

                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="caption"
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    wordBreak: 'break-all',
                  }}
                >
                  {item.title ?? item.url}
                </Link>
              </Paper>
            ))}
          </Stack>
        )}

        {isLast && quickReplies && quickReplies.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
              mt: 0.5,
            }}
          >
            {quickReplies.map((reply, idx) => {
              const label =
                typeof reply === 'string'
                  ? reply
                  : reply.text;

              const value =
                typeof reply === 'string'
                  ? reply
                  : reply.payload || reply.text;

              return (
                <Chip
                  key={idx}
                  label={label}
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => onQuickReply?.(value)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: '16px',
                  }}
                />
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}