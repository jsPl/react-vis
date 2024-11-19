import React, { useState } from 'react';

export const EdgeEditForm = ({ edge, onCancel, onSave }) => {
  const [label, setLabel] = useState(edge?.data?.label ?? '');
  // Custom edge data, so we don't acccidentaly override vis.js edge data
  const [type, setType] = useState(edge?.data?.custom?.type ?? '');

  return (
    <div id="edge-popUp">
      <div>Edit edge</div>
      <table>
        <tbody>
          <tr>
            <td>label</td>
            <td>
              <input
                id="edge-label"
                value={label}
                onChange={({ target }) => setLabel(target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>type</td>
            <td>
              <input
                id="edge-type"
                value={type}
                onChange={({ target }) => setType(target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button
        type="button"
        onClick={() => {
          edge.data.label = label;
          edge.data.custom = { ...edge.data.custom, type };

          onSave(edge.data);
          edge.callback();
        }}
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => {
          onCancel();
          edge.callback();
        }}
      >
        Cancel
      </button>
    </div>
  );
};
