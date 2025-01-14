import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';
import { Network } from 'vis-network/peer';
import { DataSet } from 'vis-data/peer';

import 'vis-network/styles/vis-network.css';

const Graph = forwardRef((props, ref) => {
  const {
    data = { nodes: [], edges: [] },
    options = {},
    events = {},
    style = { width: '100%', height: '100%' },
    getNetwork,
    getNodes,
    getEdges,
  } = props;

  const nodes = useRef(new DataSet(data.nodes));
  const edges = useRef(new DataSet(data.edges));
  const network = useRef(null);
  const container = useRef(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        getEdgesDataset() {
          return edges.current;
        },
      };
    },
    []
  );

  useEffect(() => {
    network.current = new Network(
      container.current,
      { nodes: nodes.current, edges: edges.current },
      options
    );

    if (getNetwork) {
      getNetwork(network.current);
    }

    if (getNodes) {
      getNodes(nodes.current);
    }

    if (getEdges) {
      getEdges(edges.current);
    }
  }, []);

  useEffect(() => {
    const nodesChange = !isEqual(nodes.current, data.nodes);
    const edgesChange = !isEqual(edges.current, data.edges);

    if (nodesChange) {
      const idIsEqual = (n1, n2) => n1.id === n2.id;
      const nodesRemoved = differenceWith(
        nodes.current.get(),
        data.nodes,
        idIsEqual
      );

      const nodesAdded = differenceWith(
        data.nodes,
        nodes.current.get(),
        idIsEqual
      );

      const nodesChanged = differenceWith(
        differenceWith(data.nodes, nodes.current.get(), isEqual),
        nodesAdded
      );

      nodes.current.remove(nodesRemoved);
      nodes.current.add(nodesAdded);
      nodes.current.update(nodesChanged);
    }

    if (edgesChange) {
      const edgesRemoved = differenceWith(
        edges.current.get(),
        data.edges,
        isEqual
      );
      const edgesAdded = differenceWith(
        data.edges,
        edges.current.get(),
        isEqual
      );
      const edgesChanged = differenceWith(
        differenceWith(data.edges, edges.current.get(), isEqual),
        edgesAdded
      );
      edges.current.remove(edgesRemoved);
      edges.current.add(edgesAdded);
      edges.current.update(edgesChanged);
    }

    if ((nodesChange || edgesChange) && getNetwork) {
      getNetwork(network.current);
    }

    if (nodesChange && getNodes) {
      getNodes(nodes.current);
    }

    if (edgesChange && getEdges) {
      getEdges(edges.current);
    }
  }, [data]);

  useEffect(() => {
    network.current.setOptions(options);
  }, [options]);

  useEffect(() => {
    // Add user provied events to network
    // eslint-disable-next-line no-restricted-syntax
    for (const eventName of Object.keys(events)) {
      network.current.on(eventName, events[eventName]);
    }

    return () => {
      for (const eventName of Object.keys(events)) {
        network.current.off(eventName, events[eventName]);
      }
    };
  }, [events]);

  return <div ref={container} style={style} />;
});

export default Graph;
