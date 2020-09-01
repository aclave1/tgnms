/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow strict-local
 *
 * Only import flow types into this file!!
 */
import type {UIEnv} from './dto/UI';

export type FeatureFlagDef = {|
  isDefaultEnabled: boolean,
  customFlag?: UIEnv => boolean,
|};

export const FEATURE_FLAGS: {|[string]: FeatureFlagDef|} = {
  // needs certain configs
  LOGIN_ENABLED: {isDefaultEnabled: false},
  GRAFANA_ENABLED: {
    isDefaultEnabled: false,
    customFlag: env => typeof env['GRAFANA_URL'] === 'string',
  },
  SERVICE_AVAILABILITY_ENABLED: {isDefaultEnabled: false},

  //beta features
  NMS_SETTINGS_ENABLED: {isDefaultEnabled: true},
  NETWORKTEST_ENABLED: {isDefaultEnabled: true},
  SCANSERVICE_ENABLED: {isDefaultEnabled: true},
  L2_TUNNELS_ENABLED: {isDefaultEnabled: true},
  TASK_BASED_CONFIG_ENABLED: {isDefaultEnabled: true},

  //experimental
  NMS_BACKUP_ENABLED: {isDefaultEnabled: false},
  GET_SYSDUMP_ENABLED: {isDefaultEnabled: false},
  MAP_ANNOTATIONS_ENABLED: {isDefaultEnabled: false},
  MAP_HISTORY_ENABLED: {isDefaultEnabled: false},
  JSON_CONFIG_ENABLED: {isDefaultEnabled: false},
  ALARMS_ENABLED: {isDefaultEnabled: false},
  DEFAULT_ROUTES_HISTORY_ENABLED: {isDefaultEnabled: false},
  LINK_BUDGETING_ENABLED: {isDefaultEnabled: false},
  //deprecated
  WEBSOCKETS_ENABLED: {isDefaultEnabled: false},
  NOTIFICATION_MENU_ENABLED: {isDefaultEnabled: false},
};

export type FeatureFlagKey = $Keys<typeof FEATURE_FLAGS>;