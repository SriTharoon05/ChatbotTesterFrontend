import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import theme from './theme';
import ChatWindow from './components/ChatWindow';
import ConversationHistory from './components/ConversationHistory';
import type { ConversationEntry } from './types';

export default function App() {
  const [tab, setTab] = useState(0);
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);

  function handleConversationSaved(entry: ConversationEntry) {
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === entry.id);
      if (exists) {
        return prev.map((c) => (c.id === entry.id ? entry : c));
      }
      return [entry, ...prev];
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          bgcolor: 'background.default',
        }}
      >
        {/* App Header */}
        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: 2,
            zIndex: 10,
          }}
        >
          <SmartToyIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              Chatbot Tester
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Plug in your endpoint and test
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            px: 2,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v: number) => setTab(v)}
            aria-label="chatbot tabs"
          >
            <Tab
              icon={<ChatIcon fontSize="small" />}
              iconPosition="start"
              label="Chat"
              id="tab-0"
              aria-controls="tabpanel-0"
              sx={{ minHeight: 48, textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              icon={<HistoryIcon fontSize="small" />}
              iconPosition="start"
              label={`History${conversations.length > 0 ? ` (${conversations.length})` : ''}`}
              id="tab-1"
              aria-controls="tabpanel-1"
              sx={{ minHeight: 48, textTransform: 'none', fontWeight: 500 }}
            />
          </Tabs>
        </Box>

        {/* Chat panel */}
        <Box
          role="tabpanel"
          id="tabpanel-0"
          aria-labelledby="tab-0"
          hidden={tab !== 0}
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: tab === 0 ? 'flex' : 'none',
            flexDirection: 'column',
          }}
        >
          <ChatWindow onConversationSaved={handleConversationSaved} />
        </Box>

        {/* History panel */}
        <Box
          role="tabpanel"
          id="tabpanel-1"
          aria-labelledby="tab-1"
          hidden={tab !== 1}
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: tab === 1 ? 'flex' : 'none',
            flexDirection: 'column',
          }}
        >
          <ConversationHistory conversations={conversations} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
