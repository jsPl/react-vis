import React, { useState } from 'react';

export const NodeEditForm = ({ node, onCancel, onSave }) => {
  const [id, setId] = useState(node?.data?.id ?? '');
  const [label, setLabel] = useState(node?.data?.label ?? '');
  // Custom node data, so we don't acccidentaly override vis.js node data
  const [type, setType] = useState(node?.data?.custom?.type ?? '');

  return (
    <div id="node-popUp">
      <div id="node-operation">Edit node</div>
      <table>
        <tbody>
          <tr>
            <td>id</td>
            <td>
              <input
                id="node-id"
                readOnly
                disabled
                value={id}
                onChange={({ target }) => setId(target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>label</td>
            <td>
              <input
                id="node-label"
                value={label}
                onChange={({ target }) => setLabel(target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>type</td>
            <td>
              <input
                id="node-type"
                value={type}
                onChange={({ target }) => setType(target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button
        type="button"
        id="node-saveButton"
        onClick={() => {
          node.data.label = label;
          node.data.custom = { ...node.data.custom, type };

          onSave(node.data);
          node.callback();
        }}
      >
        Save
      </button>
      <button
        type="button"
        id="node-cancelButton"
        onClick={() => {
          onCancel();
          node.callback();
        }}
      >
        Cancel
      </button>
    </div>
  );
};
