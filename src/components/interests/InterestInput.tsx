import React from "react";

interface InterestInputProps {
  onAdd: (interest: string) => void;
}

const InterestInput: React.FC<InterestInputProps> = ({ onAdd }) => (
  <input
    type="text"
    placeholder="Add a custom interest"
    style={{
      minWidth: 160,
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: 15,
      padding: '6px 8px',
      color: 'inherit',
    }}
    onKeyDown={e => {
      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
        const val = e.currentTarget.value.trim();
        onAdd(val);
        e.currentTarget.value = '';
      }
    }}
  />
);

export default InterestInput;
