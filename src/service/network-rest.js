export const fetchNetworkData = async (
  networkId = '',
  existingNetworks = []
) => {
  const networkData = existingNetworks.find(
    (network) => network.id === networkId
  );

  if (!networkData) {
    throw new Error(`Network not found: id = ${networkId}`);
  }

  return networkData;
};
