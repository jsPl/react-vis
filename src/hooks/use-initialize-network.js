import { useEffect } from 'react';
import { useForceUpdate } from './use-force-update';
import { fetchNetworkData } from '../service/network-rest';

// Fetches initial network by id
export const useInitializeNetwork = (networkId, networkDataRef) => {
  const { forceUpdate } = useForceUpdate();

  useEffect(() => {
    if (!networkId) {
      return;
    }

    fetchNetworkData(networkId).then((data) => {
      networkDataRef.current = data;

      // Component needs to be force updated after changing networkDataRef
      forceUpdate();
    });
  }, [networkId]);
};
