import { useMemo, useState } from 'react';

import {
  handleNodeSave,
  handleNodeDelete,
  handleEdgeDelete,
  handleEdgeSave,
} from '../service/network-crud';

export const useNetworkManipulation = (
  networkDataRef,
  networkRef,
  edgeEditMode
) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  const manipulation = useMemo(
    () => ({
      addNode(nodeData, callback) {
        console.log('useNetworkManipulation addNode', nodeData);
        callback(nodeData);
        networkDataRef.current = handleNodeSave(
          nodeData,
          networkDataRef.current
        );
      },
      editNode(data, callback) {
        console.log('useNetworkManipulation editNode data', data);
        setSelectedNode({ data, callback });
      },
      deleteNode({ nodes, edges }, callback) {
        networkDataRef.current = handleNodeDelete(
          nodes[0],
          edges,
          networkDataRef.current
        );
        callback({ nodes, edges });
        setSelectedNode(null);
      },
      addEdge(edgeData, callback) {
        console.log('useNetworkManipulation addEdge');
        networkDataRef.current = handleEdgeSave(
          edgeData,
          networkDataRef.current,
          callback
        );
      },
      editEdge:
        edgeEditMode === 'form'
          ? {
              // alternative egde edit - no drag and drop, needs edit form
              editWithoutDrag(data, callback) {
                // Custom edge data needs to be accessed from Dataset
                const custom = networkRef.current
                  .getEdgesDataset()
                  .get(data.id)?.custom;

                setSelectedEdge({ data: { ...data, custom }, callback });
              },
            }
          : function (edgeData, callback) {
              // drag and drop edge edit
              networkDataRef.current = handleEdgeSave(
                edgeData,
                networkDataRef.current,
                callback
              );
            },

      deleteEdge({ nodes, edges }, callback) {
        callback({ nodes, edges });
        networkDataRef.current = handleEdgeDelete(
          edges,
          networkDataRef.current
        );
      },
    }),
    [edgeEditMode]
  );

  const cancelNodeSelection = useMemo(() => setSelectedNode(null), []);

  const cancelEdgeSelection = useMemo(() => setSelectedEdge(null), []);

  return {
    manipulation,
    selectedNode,
    cancelNodeSelection,
    selectedEdge,
    cancelEdgeSelection,
  };
};
