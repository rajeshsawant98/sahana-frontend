import React from "react";
import { Box, Typography } from "@mui/material";
import InterestChip from "./InterestChip";
import { PopularCategory } from "../../constants/popularCategories";

interface CategorySectionProps {
  category: PopularCategory;
  selectedInterests: string[];
  onSelect: (interest: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, selectedInterests, onSelect }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5, color: 'primary.main', fontSize: 15, display: 'flex', alignItems: 'center', gap: 1 }}>
      <span style={{ fontSize: 18, marginRight: 6 }}>{category.emoji}</span>
      <span>{category.label}</span>
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
      {category.interests.filter(interest => !selectedInterests.includes(interest)).map(interest => (
        <InterestChip
          key={interest}
          label={interest}
          onClick={() => onSelect(interest)}
          actionIcon={"+"}
        />
      ))}
    </Box>
  </Box>
);

export default CategorySection;
