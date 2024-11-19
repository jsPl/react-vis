import React, { useState } from 'react';

export const Select = ({ label, value, options, onChange, disabled }) => {
  return (
    <label>
      {label}
      <select disabled={disabled} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
