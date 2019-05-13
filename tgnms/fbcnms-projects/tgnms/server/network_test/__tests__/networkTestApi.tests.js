/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 *
 * // WARNING: These are API contract tests!
 * If these tests break, ensure that you have not introduced
 * api breaking changes.
 */
import express from 'express';
import request from 'supertest';
import {api_testresult, api_testrunexecution} from '../../models';

jest.mock('../../sequelize-config', () => {
  process.env.NODE_ENV = 'test';
  return {
    [process.env.NODE_ENV]: {
      username: null,
      password: null,
      database: 'db',
      dialect: 'sqlite',
      dialectModulePath: 'sqlite3-offline',
      logging: false,
    },
  };
});

beforeEach(async () => {
  const {sequelize} = require('../../models');
  // running sync instead of migrations because of weird foreign key issues
  await sequelize.sync({force: true});
});

describe('/results - get test results (one per link direction)', () => {
  test('?results: single id returns one result', async () => {
    const app = setupApp();
    await api_testresult.bulkCreate([
      {
        id: 1,
        status: 1,
      },
      {
        id: 2,
        status: 1,
      },
      {
        id: 3,
        status: 1,
      },
    ]);
    const response = await request(app)
      .get('/network_test/results?results=1')
      .expect(200);
    expect(response.body[0].id).toBe(1);
  });
  test('?results: comma separated ids return multiple results', async () => {
    const app = setupApp();
    await api_testresult.bulkCreate([
      {
        id: 1,
        status: 1,
      },
      {
        id: 2,
        status: 1,
      },
      {
        id: 3,
        status: 1,
      },
    ]);
    const response = await request(app)
      .get('/network_test/results?results=1,2')
      .expect(200);
    expect(response.body[0].id).toBe(1);
    expect(response.body[1].id).toBe(2);
  });
  test('?executionId: returns only results for execution', async () => {
    const app = setupApp();
    await api_testrunexecution.create({
      id: 2,
      test_code: '8.1',
    });
    await api_testresult.bulkCreate([
      {
        id: 1,
        status: 1,
        test_run_execution_id: 2,
      },
      {
        id: 2,
        status: 1,
      },
      {
        id: 3,
        status: 1,
        test_run_execution_id: 2,
      },
    ]);
    const response = await request(app)
      .get('/network_test/results?executionId=2')
      .expect(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].id).toBe(1);
    expect(response.body[1].id).toBe(3);
  });

  test('?metrics: empty parameter returns only default columns', async () => {
    const app = setupApp();
    await api_testrunexecution.create({
      id: 2,
      test_code: '8.1',
    });
    await api_testresult.bulkCreate([
      {
        id: 1,
        status: 1,
        test_run_execution_id: 2,
        // a unique number so we know this attr didn't get returned
        rssi_avg: 88,
      },
    ]);
    const response = await request(app)
      .get('/network_test/results?executionId=2&metrics')
      .expect(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].rssi_avg).toBeFalsy;
    expect(response.body[0].rssi_avg).not.toBe(88);
  });

  test('?metrics: comma separated returns only default columns and those specified', async () => {
    const app = setupApp();
    await api_testrunexecution.create({
      id: 2,
      test_code: '8.1',
    });
    await api_testresult.bulkCreate([
      {
        id: 1,
        status: 1,
        test_run_execution_id: 2,
        mcs_p90: 12,
        mcs_avg: 12,
        // a unique number so we know this attr didn't get returned
        rssi_avg: 88,
      },
    ]);
    const response = await request(app)
      .get('/network_test/results?executionId=2&metrics=mcs_p90,mcs_avg')
      .expect(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].rssi_avg).toBeFalsy;
    expect(response.body[0].rssi_avg).not.toBe(88);
    expect(response.body[0].mcs_p90).toBe(12);
    expect(response.body[0].mcs_avg).toBe(12);
  });
});

describe('/executions - get recent test executions', () => {
  test('?network: network name returns executions which ran on that network', async () => {
    const app = setupApp();
    await api_testrunexecution.bulkCreate([
      {
        id: 2,
        test_code: '8.1',
        topology_name: 'fbtest',
      },
      {
        id: 3,
        test_code: '8.1',
        topology_name: 'not this one',
      },
    ]);
    const response = await request(app)
      .get('/network_test/executions?network=fbtest')
      .expect(200);
    // Note that these may not look exactly like the database row
    expect(response.body.rows.length).toBe(1);
    expect(response.body.rows[0].id).toBe(2);
    expect(response.body.rows[0].topology_name).toBe('fbtest');
  });

  test('?testType: returns executions only of a certain test type', async () => {
    const app = setupApp();
    await api_testrunexecution.bulkCreate([
      {
        id: 2,
        test_code: '8.1',
        topology_name: 'fbtest',
      },
      {
        id: 3,
        test_code: '8.2',
        topology_name: 'fbtest',
      },
    ]);
    const response = await request(app)
      .get('/network_test/executions?network=fbtest&testType=8.1')
      .expect(200);
    expect(response.body.rows.length).toBe(1);
    expect(response.body.rows[0].test_code).toBe('8.1');
    expect(response.body.rows[0].topology_name).toBe('fbtest');
  });

  test('?protocol: returns executions only of protocol TCP / UDP (case insensitive)', async () => {
    const app = setupApp();
    await api_testrunexecution.bulkCreate([
      {
        id: 2,
        test_code: '8.1',
        topology_name: 'fbtest',
        protocol: 'UDP',
      },
      {
        id: 3,
        test_code: '8.1',
        topology_name: 'fbtest',
        protocol: 'TCP',
      },
    ]);
    const response = await request(app)
      //case in-sensitive
      .get('/network_test/executions?network=fbtest&protocol=tcp')
      .expect(200);
    expect(response.body.rows.length).toBe(1);
    expect(response.body.rows[0].test_code).toBe('8.1');
    expect(response.body.rows[0].topology_name).toBe('fbtest');
    expect(response.body.rows[0].protocol).toBe('TCP');
  });

  test('?afterDate: returns only executions which started after the specified RFC 2822 date', async () => {
    const app = setupApp();
    await api_testrunexecution.bulkCreate([
      {
        id: 2,
        test_code: '8.1',
        topology_name: 'fbtest',
        start_date_utc: '2019-01-01T00:00:00Z',
      },
      {
        id: 3,
        test_code: '8.1',
        topology_name: 'fbtest',
        start_date_utc: '2019-05-05T00:00:00.000Z',
      },
    ]);
    const response = await request(app)
      //case in-sensitive
      .get(
        '/network_test/executions?network=fbtest&afterDate=2019-05-01T00:00:00Z',
      )
      .expect(200);
    expect(response.body.rows.length).toBe(1);
    expect(response.body.rows[0].start_date_utc).toBe(
      '2019-05-05T00:00:00.000Z',
    );
  });

  test('returns a TablePage structured object', async () => {
    const app = setupApp();
    await api_testrunexecution.bulkCreate([
      {
        id: 2,
        test_code: '8.1',
        topology_name: 'fbtest',
      },
      {
        id: 3,
        test_code: '8.1',
        topology_name: 'fbtest',
      },
      {
        id: 4,
        test_code: '8.1',
        topology_name: 'fbtest',
      },
    ]);
    const response = await request(app)
      .get('/network_test/executions?network=fbtest')
      .expect(200);
    // Note that these may not look exactly like the database row
    expect(response.body.rows.length).toBe(3);
    expect(typeof response.body.limit).toBe('number');
  });
});

describe('/executions/:id - get a single execution by id', () => {
  test('returns a single execution', async () => {
    const app = setupApp();
    await api_testrunexecution.bulkCreate([
      {
        id: 2,
        test_code: '8.1',
        topology_name: 'fbtest',
      },
      {
        id: 3,
        test_code: '8.1',
        topology_name: 'fbtest',
      },
      {
        id: 4,
        test_code: '8.1',
        topology_name: 'fbtest',
      },
    ]);

    const response = await request(app)
      .get('/network_test/executions/2')
      .expect(200);
    expect(response.body.id).toBe(2);
  });

  test('?includeTestResults=true returns all results associated with this execution', async () => {
    const app = setupApp();
    await api_testrunexecution.bulkCreate([
      {
        id: 1,
        test_code: '8.1',
        topology_name: 'fbtest',
      },
    ]);
    await api_testresult.bulkCreate([
      {
        id: 1,
        status: 1,
        test_run_execution_id: 1,
      },
      {
        id: 2,
        status: 1,
        test_run_execution_id: 1,
      },
    ]);

    const response = await request(app)
      .get('/network_test/executions/1?includeTestResults=true')
      .expect(200);
    expect(response.body.id).toBe(1);
    expect(response.body.test_results.length).toBe(2);
    expect(response.body.test_results[0]).toMatchObject({id: 1, status: 1});
  });
});

function setupApp() {
  const app = express();
  app.use('/network_test', require('../routes'));
  return app;
}