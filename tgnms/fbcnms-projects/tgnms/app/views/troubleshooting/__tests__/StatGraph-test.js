/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow strict-local
 */

import 'jest-dom/extend-expect';
import React from 'react';
import StatGraph from '../StatGraph';
import {NetworkContextWrapper, TestApp} from '../../../tests/testHelpers';
import {cleanup, render} from '@testing-library/react';

afterEach(() => {
  cleanup();
});

const defaultProps = {
  statName: 'testName',
  data: [
    {
      type: 'scatter',
      mode: 'lines+points',
      x: [0],
      y: [2],
      marker: {color: 'green'},
      text: `test text`,
    },
  ],
  startTime: 0,
  endTime: 1,
};

test('renders', () => {
  const {getByText, getByTestId} = render(
    <TestApp route="/nodes">
      <NetworkContextWrapper>
        <StatGraph {...defaultProps} />
      </NetworkContextWrapper>
    </TestApp>,
  );

  expect(getByText('testName')).toBeInTheDocument();
  expect(getByTestId('plotly-graph-wrapper')).toBeInTheDocument();
});