/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow strict-local
 */

import 'jest-dom/extend-expect';
import * as React from 'react';
import LinkOffline from '../LinkOffline';
import {TestApp} from '../../../tests/testHelpers';
import {render} from '@testing-library/react';

jest
  .spyOn(
    require('@fbcnms/tg-nms/app/constants/FeatureFlags'),
    'isFeatureEnabled',
  )
  .mockReturnValue(true);

test('renders without crashing', () => {
  const {getByTitle} = render(
    <TestApp>
      <LinkOffline />
    </TestApp>,
  );
  expect(getByTitle('Link Offline')).toBeInTheDocument();
});