import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  FiTrendingUp,
  FiUsers,
  FiTarget,
  FiSearch,
  FiCalendar,
  FiDownload,
  FiShare2,
  FiMessageSquare,
  FiFilter,
  FiMoreVertical,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';

// Mock data for insights
const mockInsights = {
  marketTrends: [
    {
      id: 1,
      title: 'Market Growth Opportunity',
      description: 'AI analysis suggests 15% growth potential in APAC region',
      impact: 'High',
      confidence: 85,
      trend: 'up',
      category: 'Market Trends',
      date: '2024-03-15',
    },
    {
      id: 2,
      title: 'Emerging Technology Adoption',
      description: 'Increased adoption of AI tools in target market',
      impact: 'Medium',
      confidence: 78,
      trend: 'up',
      category: 'Market Trends',
      date: '2024-03-14',
    },
  ],
  competitorAnalysis: [
    {
      id: 3,
      title: 'Competitor Market Share',
      description: 'Main competitor showing 5% decrease in market share',
      impact: 'High',
      confidence: 92,
      trend: 'down',
      category: 'Competitor Analysis',
      date: '2024-03-15',
    },
    {
      id: 4,
      title: 'Product Feature Gap',
      description: 'Opportunity to differentiate through AI capabilities',
      impact: 'Medium',
      confidence: 88,
      trend: 'up',
      category: 'Competitor Analysis',
      date: '2024-03-13',
    },
  ],
  opportunities: [
    {
      id: 5,
      title: 'New Market Entry',
      description: 'Potential for 20% revenue increase through expansion',
      impact: 'High',
      confidence: 82,
      trend: 'up',
      category: 'Opportunities',
      date: '2024-03-15',
    },
    {
      id: 6,
      title: 'Product Enhancement',
      description: 'Adding AI features could increase user engagement by 25%',
      impact: 'High',
      confidence: 90,
      trend: 'up',
      category: 'Opportunities',
      date: '2024-03-12',
    },
  ],
};

const AIInsightsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleInsightClick = (insight: any) => {
    setSelectedInsight(insight);
  };

  const getInsightsByCategory = () => {
    switch (selectedTab) {
      case 0:
        return mockInsights.marketTrends;
      case 1:
        return mockInsights.competitorAnalysis;
      case 2:
        return mockInsights.opportunities;
      default:
        return [];
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--background-primary)', pt: 3, pb: 6 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 2 }}>
            AI Insights Hub
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <TextField
              placeholder="Search insights..."
              size="small"
              fullWidth
              sx={{ maxWidth: 400 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton onClick={handleFilterClick}>
              <FiFilter />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<FiMessageSquare />}
              onClick={() => setChatOpen(true)}
            >
              Ask AI
            </Button>
          </Box>

          {/* Tabs */}
          <Tabs value={selectedTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Market Trends" icon={<FiTrendingUp />} iconPosition="start" />
            <Tab label="Competitor Analysis" icon={<FiTarget />} iconPosition="start" />
            <Tab label="Opportunities" icon={<FiUsers />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {getInsightsByCategory().map((insight) => (
            <Grid item xs={12} md={6} lg={4} key={insight.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
                }}
                onClick={() => handleInsightClick(insight)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      label={insight.impact}
                      color={insight.impact === 'High' ? 'error' : 'warning'}
                      size="small"
                    />
                    <IconButton size="small">
                      <FiMoreVertical />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {insight.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {insight.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {insight.trend === 'up' ? (
                        <FiArrowUp color="var(--success)" />
                      ) : (
                        <FiArrowDown color="var(--error)" />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {insight.confidence}% confidence
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {insight.date}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem onClick={handleFilterClose}>Last 7 days</MenuItem>
          <MenuItem onClick={handleFilterClose}>Last 30 days</MenuItem>
          <MenuItem onClick={handleFilterClose}>Last quarter</MenuItem>
          <MenuItem onClick={handleFilterClose}>Custom range...</MenuItem>
        </Menu>

        {/* Chat Dialog */}
        <Dialog open={chatOpen} onClose={() => setChatOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Ask AI Assistant</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              placeholder="Ask about insights, trends, or recommendations..."
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChatOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setChatOpen(false)}>
              Send
            </Button>
          </DialogActions>
        </Dialog>

        {/* Insight Detail Dialog */}
        <Dialog
          open={Boolean(selectedInsight)}
          onClose={() => setSelectedInsight(null)}
          maxWidth="md"
          fullWidth
        >
          {selectedInsight && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {selectedInsight.title}
                  <Box>
                    <Tooltip title="Export">
                      <IconButton>
                        <FiDownload />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton>
                        <FiShare2 />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1" paragraph>
                  {selectedInsight.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <Typography variant="body1" paragraph>
                  Based on this insight, we recommend:
                  {/* Add specific recommendations based on the insight */}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FiMessageSquare />}
                  sx={{ mt: 2 }}
                >
                  Discuss with AI
                </Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedInsight(null)}>Close</Button>
                <Button variant="contained" color="primary">
                  Apply Recommendations
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default AIInsightsPage;
