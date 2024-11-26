import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  FiEdit2,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
} from 'react-icons/fi';
import { Deal } from './types';

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

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onEdit }) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

  const getDueColor = (dueDate: string): 'error' | 'warning' | 'success' => {
    const days = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 0) return 'error';
    if (days < 7) return 'warning';
    return 'success';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: (theme) => theme.palette.background.paper,
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
          borderColor: (theme) => theme.palette.primary.main,
        },
        mb: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: (theme) => theme.palette.text.primary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {deal.name}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onEdit(deal)}
          sx={{
            ml: 1,
            color: (theme) => theme.palette.text.secondary,
            '&:hover': {
              color: (theme) => theme.palette.primary.main,
              bgcolor: (theme) => `${theme.palette.primary.main}20`,
            },
          }}
        >
          <StyledIcon icon={FiEdit2} size={16} />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: (theme) => theme.palette.text.secondary,
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '40px',
        }}
      >
        {deal.company}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={deal.probability}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: (theme) => theme.palette.action.hover,
              flex: 1,
              mr: 1,
              '& .MuiLinearProgress-bar': {
                bgcolor: (theme) => theme.palette.primary.main,
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: (theme) => theme.palette.text.secondary,
              fontWeight: 600,
            }}
          >
            {deal.probability}%
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Tooltip title="Deal value">
          <Chip
            icon={<StyledIcon icon={FiDollarSign} size={14} />}
            label={formatCurrency(deal.value)}
            size="small"
            sx={{
              bgcolor: (theme) => theme.palette.action.hover,
              '& .MuiChip-label': {
                color: (theme) => theme.palette.text.primary,
              },
              '& .MuiChip-icon': {
                color: (theme) => theme.palette.primary.main,
              },
            }}
          />
        </Tooltip>

        <Tooltip title="Due date">
          <Chip
            icon={<StyledIcon icon={FiCalendar} size={14} />}
            label={new Date(deal.dueDate).toLocaleDateString()}
            size="small"
            sx={{
              bgcolor: (theme) => theme.palette.action.hover,
              '& .MuiChip-label': {
                color: (theme) => theme.palette[getDueColor(deal.dueDate)].main,
              },
              '& .MuiChip-icon': {
                color: (theme) => theme.palette[getDueColor(deal.dueDate)].main,
              },
            }}
          />
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default DealCard;
