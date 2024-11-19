/**
 * Returns modified network data when editing existing or adding new node
 */
export const handleNodeSave = (node, networkData) => {
  const isNewNode =
    networkData.nodes.find((existingNode) => existingNode.id === node.id) ===
    undefined;

  if (isNewNode) {
    return {
      ...networkData,
      nodes: [...networkData.nodes, node],
    };
  } else {
    const modifiedNetworkNodes = networkData.nodes.map((existingNode) => {
      if (existingNode.id === node.id) {
        return { ...existingNode, ...node };
      }
      return existingNode;
    });

    return { ...networkData, nodes: modifiedNetworkNodes };
  }
};

/**
 * Returns modified network data when deleting node (with its edges)
 */
export const handleNodeDelete = (
  deletedNodeId,
  deletedEdgesIds,
  networkData
) => {
  return {
    nodes: networkData.nodes.filter(
      (existingNode) => existingNode.id !== deletedNodeId
    ),
    edges: networkData.edges.filter(
      (existingEdge) => !deletedEdgesIds.includes(existingEdge.id)
    ),
  };
};

export const handleEdgeDelete = (deletedEdgesIds, networkData) => {
  console.log('handleEdgeDelete', deletedEdgesIds);

  return {
    ...networkData,
    edges: networkData.edges.filter(
      (existingEdge) => !deletedEdgesIds.includes(existingEdge.id)
    ),
  };
};

export const handleEdgeSave = (edge, networkData, callback) => {
  //const edgeData = edges.get(data.id);

  const isNewEdge =
    networkData.edges.find((existingEdge) => existingEdge.id === edge.id) ===
    undefined;

  console.log(
    'handleEdgeSave edge',
    edge,
    'isNewEdge',
    isNewEdge,
    'networkData',
    networkData
  );

  if (isNewEdge) {
    console.log('creating new edge', edge);

    if (
      edge.from == edge.to &&
      !confirm('Do you want to connect the node to itself?')
    ) {
      callback(null);
      return networkData; // fix: cancelling adding new edge would still create it without this return statement
    } else {
      callback(edge);
    }

    return {
      ...networkData,
      edges: [...networkData.edges, edge],
    };
  } else {
    console.log('modify existing edge', edge);

    callback(edge);

    const modifiedNetworkEdges = networkData.edges.map((existingEdge) => {
      if (existingEdge.id === edge.id) {
        return { ...existingEdge, ...edge };
      }
      return existingEdge;
    });

    return { ...networkData, edges: modifiedNetworkEdges };
  }
};
