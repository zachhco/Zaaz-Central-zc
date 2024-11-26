import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Menu,
  Grid,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  ThemeProvider,
  createTheme,
  useTheme,
  Theme,
} from '@mui/material';
import {
  FiDollarSign,
  FiBarChart2,
  FiPlus,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DealCard from './DealCard';
import DealDialog from './DealDialog';
import { Deal } from './types';
import { PIPELINE_STAGES, STAGE_DESCRIPTIONS } from './constants';

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

const getStageColor = (stage: string, index: number): 'primary' | 'success' | 'secondary' | 'info' | 'warning' | 'error' => {
  const colors = [
    'primary',
    'success',
    'secondary',
    'info',
    'warning',
    'error',
    'primary',
    'secondary'
  ] as const;
  return colors[index % colors.length];
};

const DealInsights: React.FC<{ deals: Deal[] }> = ({ deals }) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgProbability = deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length;
  
  const insights = [
    {
      title: 'Pipeline Value',
      value: `$${(totalValue / 1000).toFixed(1)}k`,
      trend: 'up',
      change: '+12.5%',
    },
    {
      title: 'Win Probability',
      value: `${avgProbability.toFixed(1)}%`,
      trend: 'up',
      change: '+5.2%',
    },
    {
      title: 'Active Deals',
      value: deals.length,
      trend: 'down',
      change: '-2.1%',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, color: (theme) => theme.palette.text.primary }}>Pipeline Insights</Typography>
      <Grid container spacing={3}>
        {insights.map((insight, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ bgcolor: (theme) => theme.palette.background.paper }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography color="text.secondary" variant="body2">
                    {insight.title}
                  </Typography>
                  <Chip
                    icon={insight.trend === 'up' ? <StyledIcon icon={FiArrowUp} /> : <StyledIcon icon={FiArrowDown} />}
                    label={insight.change}
                    size="small"
                    sx={{
                      bgcolor: (theme) => insight.trend === 'up' 
                        ? `${theme.palette.success.main}20`
                        : `${theme.palette.error.main}20`,
                      color: (theme) => insight.trend === 'up'
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                    }}
                  />
                </Box>
                <Typography variant="h4" component="div" sx={{ color: (theme) => theme.palette.text.primary }}>
                  {insight.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9',
      dark: '#42A5F5',
    },
    secondary: {
      main: '#CE93D8',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFA726',
    },
    info: {
      main: '#29B6F6',
    },
    success: {
      main: '#66BB6A',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.23)',
        },
      },
    },
  },
});

const BusinessPipelinePage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      name: 'Enterprise Software Solution',
      value: 150000,
      probability: 75,
      stage: 'Proposal',
      company: 'Tech Corp',
      dueDate: '2024-12-15',
      contacts: ['John Smith', 'Sarah Johnson'],
    },
    {
      id: '2',
      name: 'Cloud Migration Project',
      value: 85000,
      probability: 60,
      stage: 'First meeting',
      company: 'Cloud Systems Inc',
      dueDate: '2024-11-30',
      contacts: ['Mike Wilson'],
    },
    {
      id: '3',
      name: 'Security Implementation',
      value: 95000,
      probability: 90,
      stage: 'Discovery',
      company: 'SecureNet Ltd',
      dueDate: '2024-12-05',
      contacts: ['Emma Davis', 'Tom Brown'],
    },
  ]);

  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'probability' | 'dueDate'>('value');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deals, searchQuery]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const deal = deals.find(d => d.id === result.draggableId);
    if (!deal) return;

    const updatedDeals = deals.map(d => 
      d.id === deal.id 
        ? { ...d, stage: PIPELINE_STAGES[parseInt(result.destination.droppableId)] }
        : d
    );
    setDeals(updatedDeals);
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowDialog(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDialog(true);
  };

  const handleSaveDeal = async (dealData: Partial<Deal>) => {
    if (selectedDeal) {
      setDeals(deals.map(d => d.id === selectedDeal.id ? { ...selectedDeal, ...dealData } : d));
    } else {
      const newDeal = {
        ...dealData,
        id: String(deals.length + 1),
      } as Deal;
      setDeals([...deals, newDeal]);
    }
    setShowDialog(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: (theme) => theme.palette.background.default,
        pt: 3,
        pb: 6
      }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ 
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            color: (theme) => theme.palette.text.primary,
            mb: { xs: 2, md: 0 }
          }}>
            Business Pipeline
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              size="small"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  bgcolor: (theme) => theme.palette.background.paper,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: (theme) => `${theme.palette.primary.main}50`,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: (theme) => theme.palette.primary.main,
                  }
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
              variant="outlined"
              onClick={(e) => setFilterAnchor(e.currentTarget)}
              startIcon={<StyledIcon icon={FiFilter} />}
              sx={{
                borderColor: (theme) => `${theme.palette.primary.main}50`,
                color: (theme) => theme.palette.primary.main,
                '&:hover': {
                  borderColor: (theme) => theme.palette.primary.main,
                  bgcolor: (theme) => `${theme.palette.primary.main}10`,
                }
              }}
            >
              Filter
            </Button>

            <Button
              variant="contained"
              onClick={handleAddDeal}
              startIcon={<StyledIcon icon={FiPlus} />}
              sx={{
                bgcolor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.primary.dark,
                }
              }}
            >
              Add Deal
            </Button>
          </Box>
        </Box>

        {/* Insights Section */}
        <DealInsights deals={deals} />

        {/* Pipeline Stages */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2}>
            {PIPELINE_STAGES.map((stage, index) => (
              <Grid item xs={12} md={6} lg={3} key={stage}>
                <Paper
                  sx={{
                    p: 2,
                    height: '100%',
                    bgcolor: (theme) => theme.palette.background.paper,
                    borderTop: 4,
                    borderColor: (theme) => theme.palette[getStageColor(stage, index)].main,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {stage}
                  </Typography>
                  <Droppable droppableId={String(index)}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ minHeight: 100 }}
                      >
                        {filteredDeals
                          .filter((deal) => deal.stage === stage)
                          .map((deal, index) => (
                            <Draggable key={deal.id} draggableId={deal.id} index={index}>
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <DealCard
                                    deal={deal}
                                    onEdit={() => handleEditDeal(deal)}
                                  />
                                </Box>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
          sx={{
            '& .MuiPaper-root': {
              bgcolor: (theme) => theme.palette.background.paper,
              boxShadow: (theme) => theme.shadows[4],
            }
          }}
        >
          <MenuItem
            onClick={() => {
              setSortBy('value');
              setFilterAnchor(null);
            }}
            sx={{
              color: (theme) => theme.palette.text.primary,
              '&:hover': {
                bgcolor: (theme) => theme.palette.action.hover,
              }
            }}
          >
            <StyledIcon icon={FiDollarSign} style={{ marginRight: 8 }} />
            Sort by Value
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy('probability');
              setFilterAnchor(null);
            }}
            sx={{
              color: (theme) => theme.palette.text.primary,
              '&:hover': {
                bgcolor: (theme) => theme.palette.action.hover,
              }
            }}
          >
            <StyledIcon icon={FiBarChart2} style={{ marginRight: 8 }} />
            Sort by Probability
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSortBy('dueDate');
              setFilterAnchor(null);
            }}
            sx={{
              color: (theme) => theme.palette.text.primary,
              '&:hover': {
                bgcolor: (theme) => theme.palette.action.hover,
              }
            }}
          >
            <StyledIcon icon={FiCalendar} style={{ marginRight: 8 }} />
            Sort by Due Date
          </MenuItem>
        </Menu>

        {/* Deal Dialog */}
        <DealDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={handleSaveDeal}
          deal={selectedDeal || undefined}
        />
      </Container>
    </Box>
    </ThemeProvider>
  );
};

export default BusinessPipelinePage;
