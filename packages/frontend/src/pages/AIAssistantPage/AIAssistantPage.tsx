import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  FiMessageSquare,
  FiSend,
  FiMinimize2,
  FiCpu,
} from 'react-icons/fi';

const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isAI: boolean }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    setChatMessages([...chatMessages, { text: message, isAI: false }]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        text: "I'll help you analyze that. Based on the current data...",
        isAI: true
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--background-primary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FiCpu size={24} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              AI Assistant
            </Typography>
          </Box>
          <Tooltip title="Return to AI Hub">
            <IconButton 
              onClick={() => navigate('/ai-hub')}
              sx={{ color: 'var(--text-primary)' }}
            >
              <FiMinimize2 />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Chat Container */}
        <Paper sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          height: 'calc(100vh - 200px)',
          backgroundColor: 'var(--background-secondary)',
          border: '1px solid var(--border-color)',
        }}>
          {/* Messages */}
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 3,
          }}>
            <List>
              {chatMessages.map((msg, index) => (
                <ListItem
                  key={index}
                  sx={{
                    justifyContent: msg.isAI ? 'flex-start' : 'flex-end',
                    mb: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: msg.isAI ? 'var(--background-primary)' : 'var(--primary)',
                      color: msg.isAI ? 'var(--text-primary)' : 'white',
                      boxShadow: msg.isAI ? 1 : 2,
                    }}
                  >
                    <Typography variant="body1">{msg.text}</Typography>
                  </Paper>
                </ListItem>
              ))}
              {isTyping && (
                <ListItem>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: 'var(--background-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      AI is typing...
                    </Typography>
                  </Paper>
                </ListItem>
              )}
            </List>
          </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--background-primary)',
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--background-secondary)',
                  }
                }}
              />
              <IconButton 
                onClick={handleSendMessage} 
                color="primary"
                sx={{ 
                  alignSelf: 'flex-end',
                  p: '12px',
                }}
              >
                <FiSend />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AIAssistantPage;
