import React from "react";
import { Box } from "@mui/material";

interface InterestChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  actionIcon?: React.ReactNode;
  sx?: any;
}

const InterestChip: React.FC<InterestChipProps> = ({ label, selected, onClick, actionIcon, sx }) => (
  <Box
    component={onClick ? "button" : "span"}
    type={onClick ? "button" : undefined}
    onClick={onClick}
    title={selected ? "Remove from your interests" : "Add to your interests"}
    sx={theme => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: selected ? theme.palette.primary.main : theme.palette.background.paper,
      color: selected ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary,
      borderRadius: '8px',
      height: 36,
      minWidth: 120,
      maxWidth: 180,
      px: 2,
      fontSize: 15,
      fontWeight: 500,
      marginRight: '8px',
      marginBottom: '8px',
      border: `1.5px solid ${theme.palette.primary.main}`,
      boxShadow: selected ? '0 2px 8px rgba(25,118,210,0.10)' : '0 1px 4px rgba(0,0,0,0.03)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background 0.15s, color 0.15s, border 0.15s, box-shadow 0.15s',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      '&:hover': onClick ? {
        background: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        border: `1.5px solid ${theme.palette.primary.dark}`,
        boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
      } : {},
      ...sx,
    })}
  >
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{label}</span>
    {actionIcon && <span style={{ marginLeft: 6, fontSize: 16, fontWeight: 700, pointerEvents: 'none' }}>{actionIcon}</span>}
  </Box>
);

export default InterestChip;
