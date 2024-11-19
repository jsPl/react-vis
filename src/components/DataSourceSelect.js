import React, { useState } from 'react';
import { Select } from './components-library';

export const DataSourceSelect = ({ options, value, onChange, disabled }) => {
  return (
    <Select
      label="Network"
      disabled={disabled}
      options={options}
      value={value}
      onChange={({ target }) => {
        onChange(target.value);
      }}
    />
  );
};
