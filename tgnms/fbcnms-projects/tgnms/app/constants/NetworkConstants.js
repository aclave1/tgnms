/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 */
'use strict';

export const TopologyElementType = {
  NODE: 'node',
  LINK: 'link',
  SITE: 'site',
};

// At a PER of 1e-3, 6.1dB is needed to support MCS2 and 13dB for MCS9
export const SNR_THRESHOLD_MCS2 = 6.1;
export const SNR_THRESHOLD_MCS9 = 13;

export const SCAN_MAX_RX_DISTANCE = 300; // meters
export const SCAN_MAX_COVERAGE_ANGLE = 90; // degrees

// Theoretical MCS to throughput mapping for single carrier PHY
const MB_IN_BITS = 1000 * 1000;
export const MCS_DATARATE_TABLE = {
  '1': 385 * MB_IN_BITS,
  '2': 770 * MB_IN_BITS,
  '3': 962.5 * MB_IN_BITS,
  '4': 1155 * MB_IN_BITS,
  '5': 1251.25 * MB_IN_BITS,
  '6': 1540 * MB_IN_BITS,
  '7': 1925 * MB_IN_BITS,
  '8': 2310 * MB_IN_BITS,
  '9': 2502.5 * MB_IN_BITS,
  '10': 3080 * MB_IN_BITS,
  '11': 3850 * MB_IN_BITS,
  '12': 4620 * MB_IN_BITS,
};