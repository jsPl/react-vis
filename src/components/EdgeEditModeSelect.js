import React from 'react';
import { Select } from './components-library';

const options = [
  { label: 'Form', value: 'form' },
  { label: 'Drag', value: 'drag' },
];

export const EdgeEditModeSelect = ({ value, onChange }) => {
  return (
    <Select
      label="Edge edit mode"
      options={options}
      value={value}
      onChange={({ target }) => {
        onChange(target.value);
      }}
    />
  );
};
