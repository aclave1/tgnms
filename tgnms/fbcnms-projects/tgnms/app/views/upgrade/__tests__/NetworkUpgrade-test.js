/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow strict-local
 */

import NetworkUpgrade from '../NetworkUpgrade';
import React from 'react';
import {
  NetworkContextWrapper,
  TestApp,
  initWindowConfig,
  mockNetworkConfig,
  renderWithRouter,
} from '@fbcnms/tg-nms/app/tests/testHelpers';

jest.useFakeTimers();
jest.mock('axios');
jest.mock('copy-to-clipboard');

beforeEach(() => {
  initWindowConfig();
});

test('renders empty without crashing', () => {
  const {getByTestId, getAllByTestId} = renderWithRouter(
    <TestApp>
      <NetworkContextWrapper
        contextValue={{networkConfig: mockNetworkConfig()}}>
        <NetworkUpgrade />
      </NetworkContextWrapper>
    </TestApp>,
  );
  expect(getByTestId('upgradeToolbar')).toBeInTheDocument();
  expect(getByTestId('nodeUpgrade')).toBeInTheDocument();
  expect(getAllByTestId('batchUpgrade').length).toEqual(2);
});
