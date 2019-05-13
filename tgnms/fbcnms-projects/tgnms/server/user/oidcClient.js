/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {OpenidClient} from './oidcTypes';

import {Issuer as OpenidIssuer} from 'openid-client';

const logger = require('../log')(module);

type ClientParameters = {
  issuerUrl: string,
  clientId: string,
  clientSecret: string,
};

export default function getOidcClient(
  params: ClientParameters,
): Promise<OpenidClient> {
  const {issuerUrl, clientId, clientSecret} = params;

  const tryDiscovery = () => {
    logger.info('openid discovery: starting');
    logger.debug(`openid discovery: connecting to issuer: ${issuerUrl}`);
    return OpenidIssuer.discover(issuerUrl).then((issuer: OpenidIssuer) => {
      const openidClient = new issuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
      });
      logger.info('openid discovery: success');
      return openidClient;
    });
  };

  /**
   * Transparently retry discovery until it succeeds
   **/
  return new Promise(resolve => {
    const attempt = () => {
      tryDiscovery()
        .then(client => resolve(client))
        .catch(_error => {
          logger.info('openid discovery: failed. retrying in 5s.');
          setTimeout(attempt, 5000);
        });
    };
    attempt();
  });
}