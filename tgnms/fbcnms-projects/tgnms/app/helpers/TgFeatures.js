/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 */
'use strict';

import {CtrlVerType, ctrlVerBefore} from './VersionHelper';

/**
 * Get polarities associated with a node.
 * Prior to RELEASE_M31, a node had a single polarity and it was part of the
 * node's topology stucture.
 * Starting from RELEASE_M31, polarity is per WLAN MAC and is part of the node's
 * configuration.
 */
export function getNodePolarities(
  ctrlVersion: string,
  node: Object,
  topologyConfig: Object,
) {
  const nodePolarities = {};
  if (ctrlVerBefore(ctrlVersion, CtrlVerType.M31)) {
    if (node.mac_addr) {
      nodePolarities[node.mac_addr] = node.polarity;
    }
  } else {
    if (node.wlan_mac_addrs) {
      for (const mac of node.wlan_mac_addrs) {
        nodePolarities[mac] = topologyConfig.polarity[mac];
      }
    } else {
      if (node.mac_addr) {
        nodePolarities[node.mac_addr] = topologyConfig.polarity[node.mac_addr];
      }
    }
  }
  return nodePolarities;
}

/**
 * Get link golay index
 * Prior to RELEASE_M31, golay was part of the link's topology structure
 * Starting from RELEASE_M31, golay is part of the node's configuration.
 */
export function getLinkGolay(
  ctrlVersion: string,
  link: Object,
  topologyConfig: Object,
) {
  let linkGolay = {};
  if (ctrlVerBefore(ctrlVersion, CtrlVerType.M31)) {
    if (link.golay_idx) {
      linkGolay = link.golay_idx;
    }
  } else {
    if (
      topologyConfig.golay &&
      topologyConfig.golay.hasOwnProperty(link.a_node_name) &&
      topologyConfig.golay[link.a_node_name].hasOwnProperty(link.z_node_mac)
    ) {
      linkGolay = topologyConfig.golay[link.a_node_name][link.z_node_mac];
    } else if (
      topologyConfig.golay &&
      topologyConfig.golay.hasOwnProperty(link.z_node_name) &&
      topologyConfig.golay[link.a_node_name].hasOwnProperty(link.a_node_mac)
    ) {
      linkGolay = topologyConfig.golay[link.z_node_name][link.a_node_mac];
    }
  }
  return linkGolay;
}

/**
 * Check if the Node structure has a 'wlan_mac_addrs' field.
 * This was added in RELEASE_M29.
 */
export function useNodeWlanMacs(ctrlVersion) {
  return !ctrlVerBefore(ctrlVersion, CtrlVerType.M29);
}

/**
 * Check if the single-node topology scan feature is supported.
 * This was added in RELEASE_M29.
 */
export function supportsTopologyScan(ctrlVersion) {
  return !ctrlVerBefore(ctrlVersion, CtrlVerType.M29);
}

/**
 * Check if the network-wide topology scan feature is supported.
 * This was added in RELEASE_M30.
 */
export function supportsTopologyDiscovery(ctrlVersion) {
  return !ctrlVerBefore(ctrlVersion, CtrlVerType.M30);
}