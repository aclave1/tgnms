/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 *
 * Represents a paginated view into a database table
 */
'use strict';
export type TablePage<T> = {
  rows: Array<T>,

  // 0-indexed page number
  offset: number,

  // size of each page
  limit: number,

  // total number of rows matching specified query
  totalCount: number,
};