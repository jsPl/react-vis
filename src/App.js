import React, { useRef, useState, useMemo } from 'react';
import './style.css';
import Graph from './Graph';
import { NodeEditForm } from './components/NodeEditForm';
import { EdgeEditForm } from './components/EdgeEditForm';
import { EdgeEditModeSelect } from './components/EdgeEditModeSelect';
import { DataSourceSelect } from './components/DataSourceSelect';
import { handleNodeSave, handleEdgeSave } from './service/network-crud';

import { fetchNetworkData } from './service/network-rest';
import { events } from './service/network-events';

import { initialNetworks } from './data/network-data';

import { useNetworkManipulation } from './hooks/use-network-manipulation';
//import { useInitializeNetwork } from './hooks/use-initialize-network';

export default function App() {
  const [edgeEditMode, setEdgeEditMode] = useState('form'); // edit mode for edges: either 'form' or 'drag'
  const [networks, setNetworks] = useState(initialNetworks);
  const [currentNetworkId, setCurrentNetworkId] = useState(''); // initial networkId to be fetched
  const networkDataRef = useRef(); // ref to network data - using state caused problems with updating
  const networkRef = useRef(null); // ref to graph so we can call its methods imperatively
  const [isCreatingNewNetworkMode, setIsCreatingNewNetworkMode] =
    useState(false);
  const {
    manipulation,
    selectedNode,
    cancelNodeSelection,
    selectedEdge,
    cancelEdgeSelection,
  } = useNetworkManipulation(networkDataRef, networkRef, edgeEditMode);

  // Fetches currentNetworkId on initial application render
  //useInitializeNetwork(currentNetworkId, networkDataRef);

  const dataSourceOptions = useMemo(() => {
    const options = networks.map((network) => ({
      value: network.id,
      label: network.title,
    }));

    return [{ value: '', label: '-- Select network --' }, ...options];
  }, [networks]);

  const options = {
    manipulation,
    layout: {
      randomSeed: 1,
    },
  };

  console.log(
    'render networkDataRef',
    networkDataRef.current,
    'currentNetworkId',
    currentNetworkId,
    'dataSourceOptions',
    dataSourceOptions,
    'networks state',
    networks
  );

  return (
    <>
      <div style={{ height: '500px' }}>
        {currentNetworkId !== '' || isCreatingNewNetworkMode ? (
          <Graph
            data={networkDataRef.current}
            events={events}
            options={options}
            ref={networkRef}
          />
        ) : (
          <div>Please select existing network or create a new one</div>
        )}
      </div>

      <div className="customization">
        <button
          type="button"
          onClick={() => {
            console.log(
              networkDataRef.current,
              'selectedNode',
              selectedNode,
              'selectedEdge',
              selectedEdge,
              'networks state',
              networks
            );
          }}
        >
          get network data
        </button>
        <EdgeEditModeSelect value={edgeEditMode} onChange={setEdgeEditMode} />
        <DataSourceSelect
          disabled={isCreatingNewNetworkMode}
          options={dataSourceOptions}
          value={currentNetworkId}
          onChange={(networkId) => {
            if (networkId) {
              fetchNetworkData(networkId, networks).then((data) => {
                networkDataRef.current = data;
                setCurrentNetworkId(networkId);
              });
            }
          }}
        />
        <button
          type="button"
          disabled={currentNetworkId === '' || isCreatingNewNetworkMode}
          onClick={() => {
            const networkToDelete = networks.find(
              (o) => o.id === currentNetworkId
            );
            if (
              confirm(
                `Delete network ${networkToDelete.title} id = ${networkToDelete.id}?`
              )
            ) {
              networkDataRef.current = undefined;
              setCurrentNetworkId('');
              setNetworks(networks.filter((o) => o.id !== networkToDelete.id));
            }
          }}
        >
          Delete selected
        </button>
        <button
          type="button"
          disabled={isCreatingNewNetworkMode}
          onClick={() => {
            networkDataRef.current = { nodes: [], edges: [] };
            setIsCreatingNewNetworkMode(true);
          }}
        >
          Create new network
        </button>
        {isCreatingNewNetworkMode && (
          <button
            type="button"
            disabled={!isCreatingNewNetworkMode}
            onClick={() => {
              const id = crypto.randomUUID();
              const newNetworkData = {
                id,
                title: `Network ${id.split('-')[0]}`,
                ...networkDataRef.current,
              };

              setCurrentNetworkId(newNetworkData.id);
              setNetworks([...networks, newNetworkData]);
              setIsCreatingNewNetworkMode(false);
            }}
          >
            Save
          </button>
        )}
        {isCreatingNewNetworkMode && (
          <button
            type="button"
            disabled={!isCreatingNewNetworkMode}
            onClick={() => {
              networkDataRef.current = networks.find(
                (network) => network.id === currentNetworkId
              );
              setIsCreatingNewNetworkMode(false);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {selectedNode && (
        <NodeEditForm
          node={selectedNode}
          onSave={(node) => {
            networkDataRef.current = handleNodeSave(
              node,
              networkDataRef.current
            );

            setNetworks(
              networks.map((network) => {
                if (network.id === networkDataRef.current.id) {
                  return networkDataRef.current;
                }
                return network;
              })
            );

            cancelNodeSelection();
          }}
          onCancel={cancelNodeSelection}
        />
      )}

      {selectedEdge && (
        <EdgeEditForm
          edge={selectedEdge}
          onSave={(edge) => {
            console.log('edge save', edge);
            networkDataRef.current = handleEdgeSave(
              edge,
              networkDataRef.current,
              selectedEdge.callback
            );

            setNetworks(
              networks.map((network) => {
                if (network.id === networkDataRef.current.id) {
                  return networkDataRef.current;
                }
                return network;
              })
            );

            cancelEdgeSelection();
          }}
          onCancel={cancelEdgeSelection}
        />
      )}
    </>
  );
}
