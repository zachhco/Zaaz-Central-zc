import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  FiMessageSquare,
  FiSearch,
  FiZap,
  FiSend,
  FiPlus,
  FiDownload,
  FiShare2,
  FiCpu,
  FiArrowUp,
  FiArrowDown,
  FiTool,
  FiCommand,
  FiDatabase,
  FiMaximize2,
} from 'react-icons/fi';

// Create a custom theme for dark mode
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    primary: {
      main: '#90CAF9',
      dark: '#42A5F5',
    },
    secondary: {
      main: '#CE93D8',
    },
    success: {
      main: '#66BB6A',
    },
    error: {
      main: '#F44336',
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

// Create a styled icon wrapper component
const StyledIcon = ({ 
  icon: Icon, 
  ...props 
}: { 
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  [key: string]: any; 
}) => {
  return <Icon style={{ color: 'inherit' }} {...props} />;
};

const AIHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isAI: boolean }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Mock data for insights
  const insights = [
    {
      id: 1,
      title: 'Market Opportunity',
      description: 'AI detected 15% growth potential in APAC region',
      impact: 'High',
      category: 'Market Analysis',
      trend: 'up',
      change: '+15%',
    },
    {
      id: 2,
      title: 'Competitor Alert',
      description: 'Main competitor launched new AI feature',
      impact: 'Medium',
      category: 'Competition',
      trend: 'down',
      change: '-8%',
    },
  ];

  // Mock data for tools
  const tools = [
    {
      id: 1,
      name: 'Code Assistant',
      description: 'AI-powered code completion and review',
      icon: <FiCpu />,
      usageCount: 234,
    },
    {
      id: 2,
      name: 'Data Analyzer',
      description: 'Automated data analysis and insights',
      icon: <FiDatabase />,
      usageCount: 156,
    },
    {
      id: 3,
      name: 'Process Optimizer',
      description: 'Workflow and process optimization',
      icon: <FiCommand />,
      usageCount: 89,
    },
  ];

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
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: (theme) => theme.palette.background.default, pt: 3, pb: 6 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: (theme) => theme.palette.text.primary, mb: 1 }}>
              AI Hub
            </Typography>
            <Typography variant="body1" sx={{ color: (theme) => theme.palette.text.secondary }}>
              Your central platform for AI-powered insights, analysis, and assistance
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Main Content - Tools and Insights */}
            <Grid item xs={12} md={8}>
              {/* Tools Section */}
              <Paper sx={{ 
                p: 3, 
                mb: 3,
                background: (theme) => theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: (theme) => theme.palette.text.primary,
                  fontWeight: 600
                }}>
                  <StyledIcon icon={FiTool} /> AI Tools
                </Typography>
                <Grid container spacing={2}>
                  {tools.map((tool) => (
                    <Grid item xs={12} sm={6} md={4} key={tool.id}>
                      <Card sx={{ 
                        height: '100%', 
                        position: 'relative',
                        bgcolor: (theme) => theme.palette.background.paper,
                        '&:hover': { 
                          transform: 'translateY(-4px)', 
                          transition: 'transform 0.2s',
                          bgcolor: (theme) => theme.palette.action.hover,
                        },
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              mr: 1,
                              fontSize: '1.5rem',
                              padding: '8px',
                              borderRadius: '8px',
                              bgcolor: (theme) => `${theme.palette.primary.main}20`,
                              color: (theme) => theme.palette.primary.main,
                            }}>
                              <StyledIcon icon={FiCpu} />
                            </Box>
                            <Typography variant="h6" sx={{ 
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: (theme) => theme.palette.text.primary
                            }}>
                              {tool.name}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 2,
                              color: (theme) => theme.palette.text.secondary,
                              lineHeight: 1.5
                            }}
                          >
                            {tool.description}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${tool.usageCount} uses`}
                            sx={{ 
                              fontWeight: 500,
                              bgcolor: (theme) => `${theme.palette.primary.main}20`,
                              color: (theme) => theme.palette.primary.main,
                              '& .MuiChip-label': {
                                px: 1,
                                color: (theme) => theme.palette.primary.main
                              }
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Insights Section */}
              <Paper sx={{ 
                p: 3,
                background: (theme) => theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 3 
                }}>
                  <Typography variant="h6" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: (theme) => theme.palette.text.primary,
                    fontWeight: 600
                  }}>
                    <StyledIcon icon={FiZap} /> AI Insights
                  </Typography>
                  <Box>
                    <TextField
                      size="small"
                      placeholder="Search insights..."
                      sx={{ 
                        mr: 1,
                        '& .MuiOutlinedInput-root': {
                          bgcolor: (theme) => theme.palette.background.paper,
                          borderRadius: 1.5,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: (theme) => `${theme.palette.primary.main}50`,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: (theme) => theme.palette.primary.main,
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: (theme) => theme.palette.text.primary,
                          '&::placeholder': {
                            color: (theme) => theme.palette.text.secondary,
                            opacity: 0.7
                          }
                        },
                        '& .MuiInputAdornment-root': {
                          color: (theme) => theme.palette.text.secondary,
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StyledIcon icon={FiSearch} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button 
                      variant="contained"
                      startIcon={<StyledIcon icon={FiPlus} />}
                      sx={{
                        bgcolor: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.primary.contrastText,
                        '&:hover': {
                          bgcolor: (theme) => theme.palette.primary.dark,
                        },
                        ml: 2
                      }}
                    >
                      New Analysis
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {insights.map((insight) => (
                    <Grid item xs={12} key={insight.id}>
                      <Card sx={{ 
                        bgcolor: (theme) => theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" sx={{ 
                                color: (theme) => theme.palette.text.primary,
                                fontWeight: 600,
                                mb: 0.5
                              }}>
                                {insight.title}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: (theme) => theme.palette.text.secondary,
                                opacity: 0.9
                              }}>
                                {insight.description}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Chip
                                label={insight.impact}
                                size="small"
                                sx={{ 
                                  fontWeight: 500,
                                  bgcolor: insight.impact === 'High' 
                                    ? (theme) => `${theme.palette.error.main}20`
                                    : (theme) => `${theme.palette.warning.main}20`,
                                  color: insight.impact === 'High' 
                                    ? (theme) => theme.palette.error.main
                                    : (theme) => theme.palette.warning.main,
                                  '& .MuiChip-label': {
                                    color: 'inherit'
                                  }
                                }}
                              />
                              <Chip
                                icon={insight.trend === 'up' ? <StyledIcon icon={FiArrowUp} /> : <StyledIcon icon={FiArrowDown} />}
                                label={insight.change}
                                size="small"
                                sx={{
                                  fontWeight: 500,
                                  bgcolor: insight.trend === 'up' 
                                    ? (theme) => `${theme.palette.success.main}20`
                                    : (theme) => `${theme.palette.error.main}20`,
                                  color: insight.trend === 'up' 
                                    ? (theme) => theme.palette.success.main
                                    : (theme) => theme.palette.error.main,
                                  '& .MuiChip-icon': {
                                    color: 'inherit'
                                  },
                                  '& .MuiChip-label': {
                                    color: 'inherit'
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            pt: 1,
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                          }}>
                            <Chip
                              label={insight.category}
                              variant="outlined"
                              size="small"
                              sx={{ 
                                borderColor: (theme) => `${theme.palette.primary.main}50`,
                                color: (theme) => theme.palette.primary.main,
                                bgcolor: (theme) => `${theme.palette.primary.main}10`,
                                '& .MuiChip-label': {
                                  color: 'inherit'
                                }
                              }}
                            />
                            <Box>
                              <Tooltip title="Export">
                                <IconButton 
                                  size="small"
                                  sx={{ 
                                    '&:hover': {
                                      color: (theme) => theme.palette.primary.main,
                                      bgcolor: (theme) => `${theme.palette.primary.main}20`,
                                    }
                                  }}
                                >
                                  <StyledIcon icon={FiDownload} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Share">
                                <IconButton 
                                  size="small"
                                  sx={{ 
                                    '&:hover': {
                                      color: (theme) => theme.palette.primary.main,
                                      bgcolor: (theme) => `${theme.palette.primary.main}20`,
                                    }
                                  }}
                                >
                                  <StyledIcon icon={FiShare2} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Right Column - AI Assistant */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 2, 
                height: 'calc(100vh - 180px)', 
                position: 'sticky',
                top: '24px',
                display: 'flex',
                flexDirection: 'column',
                background: (theme) => theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2,
                  pb: 2,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <Typography variant="h6" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: (theme) => theme.palette.text.primary,
                    fontWeight: 600
                  }}>
                    <StyledIcon icon={FiMessageSquare} /> AI Assistant
                  </Typography>
                  <Tooltip title="Open in full screen">
                    <IconButton 
                      size="small"
                      onClick={() => navigate('/ai-assistant')}
                      sx={{ 
                        '&:hover': {
                          color: (theme) => theme.palette.primary.main,
                          bgcolor: (theme) => `${theme.palette.primary.main}20`,
                        }
                      }}
                    >
                      <StyledIcon icon={FiMaximize2} />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                {/* Chat Messages */}
                <Box sx={{ 
                  flexGrow: 1, 
                  overflow: 'auto', 
                  mb: 2,
                  px: 1
                }}>
                  <List>
                    {chatMessages.map((msg, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          justifyContent: msg.isAI ? 'flex-start' : 'flex-end',
                          mb: 1,
                          px: 1
                        }}
                      >
                        <Paper
                          sx={{
                            p: 1.5,
                            maxWidth: '85%',
                            bgcolor: msg.isAI 
                              ? (theme) => theme.palette.background.paper
                              : (theme) => theme.palette.primary.main,
                            color: msg.isAI 
                              ? (theme) => theme.palette.text.primary
                              : (theme) => theme.palette.primary.contrastText,
                            borderRadius: 2,
                            boxShadow: msg.isAI 
                              ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                              : '0 2px 12px rgba(var(--primary-rgb), 0.2)',
                            border: msg.isAI 
                              ? '1px solid rgba(255, 255, 255, 0.05)'
                              : 'none',
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              lineHeight: 1.5,
                              fontWeight: msg.isAI ? 400 : 500
                            }}
                          >
                            {msg.text}
                          </Typography>
                        </Paper>
                      </ListItem>
                    ))}
                    {isTyping && (
                      <ListItem sx={{ px: 1 }}>
                        <Paper
                          sx={{
                            p: 1.5,
                            bgcolor: (theme) => theme.palette.background.paper,
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <CircularProgress 
                            size={16} 
                            sx={{ 
                              color: (theme) => theme.palette.primary.main,
                            }} 
                          />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: (theme) => theme.palette.text.secondary,
                              fontWeight: 500
                            }}
                          >
                            AI is typing...
                          </Typography>
                        </Paper>
                      </ListItem>
                    )}
                  </List>
                </Box>

                {/* Message Input */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  p: 1,
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Ask anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    multiline
                    maxRows={4}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: (theme) => theme.palette.background.paper,
                        borderRadius: 1.5,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: (theme) => `${theme.palette.primary.main}50`,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: (theme) => theme.palette.primary.main,
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        color: (theme) => theme.palette.text.primary,
                      }
                    }}
                  />
                  <IconButton 
                    onClick={handleSendMessage} 
                    color="primary"
                    sx={{ 
                      alignSelf: 'flex-end',
                      bgcolor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.primary.contrastText,
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.primary.dark,
                      },
                      width: 40,
                      height: 40,
                    }}
                  >
                    <StyledIcon icon={FiSend} />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AIHubPage;