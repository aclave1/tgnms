/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */
'use strict';
import type {TestExecution} from '../models/testExecution';
import type {TestResult} from '../models/testResult';
import type {TestExecution as TestExecutionDto} from '../../shared/dto/TestExecution';
import type {TestResult as TestResultDto} from '../../shared/dto/TestResult';
import type {TablePage} from '../../shared/dto/TablePage';
import Sequelize from 'sequelize';
const {api_testrunexecution, api_testresult} = require('../models');

type RecentTestExecutionsRequest = {
  networkName?: ?string,
  afterDate?: ?string,
  testType?: ?string,
};

const service = {
  getTestExecution: function({
    executionId,
    includeTestResults,
  }: {
    executionId: string,
    includeTestResults?: boolean,
  }) {
    const queryOptions = {};
    if (includeTestResults) {
      queryOptions.include = [
        {
          model: api_testresult,
          as: 'test_results',
        },
      ];
    }
    return (api_testrunexecution
      .findByPk(executionId, queryOptions)
      .then(execution =>
        mapTestExecutionToDto(execution),
      ): Promise<TestExecutionDto>);
  },
  getRecentTestExecutions: function(
    request: RecentTestExecutionsRequest,
  ): Promise<TablePage<TestExecutionDto>> {
    const limit = 10;
    const query = {
      limit: limit,
      order: [['id', 'DESC']],
      where: {},
    };
    if (typeof request.networkName === 'string' && request.networkName !== '') {
      query.where.topology_name = request.networkName;
    }
    if (typeof request.afterDate === 'string' && request.afterDate !== '') {
      query.where.start_date_utc = {
        // $FlowFixMe flow doesn't support symbols
        [Sequelize.Op.gt]: new Date(request.afterDate),
      };
      query.limit = 5000;
    }
    if (typeof request.testType === 'string' && request.testType !== '') {
      query.where.test_code = request.testType;
    }
    return (api_testrunexecution
      .findAll(query)
      .then((rows: Array<TestExecution>) =>
        rows.map(testResult => mapTestExecutionToDto(testResult)),
      )
      .then(mapped => ({
        rows: mapped,
        limit,
      }))
      .catch(error => {
        if (isDatabaseError(error)) {
          return handleDatabaseError(error);
        }
        return Promise.reject(error);
      }): Promise<TablePage<TestExecutionDto>>);
  },

  getTestResults: function({
    executionId,
  }: {
    executionId: number,
  }): Promise<Array<TestResultDto>> {
    return (api_testresult
      .findAll({
        where: {
          test_run_execution_id: executionId,
        },
      })
      .then((rows: Array<TestResult>) =>
        rows.map(result => mapTestResultToDto(result)),
      ): Promise<Array<TestResultDto>>);
  },

  getTestOverlay: function({
    executionId,
    metrics,
  }: {
    executionId: string,
    metrics: Array<$Keys<TestResult>>,
  }) {
    const attributes: Array<$Keys<TestResult>> = [
      'link_name',
      'origin_node',
      'peer_node',
    ].concat(metrics);
    return (api_testresult
      .findAll({
        attributes: attributes,
        where: {
          test_run_execution_id: executionId,
        },
      })
      .then((rows: Array<TestResult>) =>
        rows.reduce(
          (
            map: {[linkName: string]: {A: TestResult, Z: TestResult}},
            row: TestResult,
          ) => {
            // get or create a link object
            let link = map[row.link_name];
            if (!link) {
              link = {};
              map[row.link_name] = link;
            }

            //link name is alphabetical ordering of node names
            if (row.origin_node < row.peer_node) {
              link.A = row;
            } else {
              link.Z = row;
            }

            return map;
          },
          {},
        ),
      ): Promise<Array<TestResultDto>>);
  },
};

function isDatabaseError(error: Error) {
  return error.name === 'SequelizeDatabaseError';
}

function handleDatabaseError(error: any) {
  /**
   * we expect missing table errors to occur in the case where network test has
   * not been configured for this network
   */
  if (error.original && error.original.code === 'ER_NO_SUCH_TABLE') {
    const newError: any = new Error(
      'Could not show test results. Network test service has not been configured.',
    );
    newError.expected = true;
    return Promise.reject(newError);
  }
  return Promise.reject(new Error('An unexpected database error has occurred'));
}

function mapTestExecutionToDto(model: TestExecution): TestExecutionDto {
  return {
    id: model.id,
    start_date_utc: model.start_date_utc,
    end_date_utc: model.end_date_utc,
    expected_end_date_utc:
      model.expected_end_time > 0
        ? // convert from unix epoch seconds to utc
          new Date(model.expected_end_time * 1000)
        : new Date(),
    status: model.status,
    test_code: model.test_code,
    user_id: model.user_id,
    topology_id: model.topology_id,
    topology_name: model.topology_name,
    test_results: model.test_results
      ? model.test_results.map(mapTestResultToDto)
      : null,
  };
}

function mapTestResultToDto(model: TestResult): TestResultDto {
  return {
    id: model.id,
    status: model.status,
    origin_node: model.origin_node,
    peer_node: model.peer_node,
    link_name: model.link_name,
    start_date_utc: model.start_date_utc,
    end_date_utc: model.end_date_utc,
    pathloss_avg: model.pathloss_avg,
    foliage_factor: model.foliage_factor,
    health: model.health,
    early_weak_factor: model.early_weak_factor,
    mcs_p90: model.mcs_p90,
    mcs_avg: model.mcs_avg,
    rssi_avg: model.rssi_avg,
    rssi_std: model.rssi_std,
    snr_avg: model.snr_avg,
    snr_std: model.snr_std,
    txpwr_avg: model.txpwr_avg,
    txpwr_std: model.txpwr_std,
    num_tx_packets: model.num_tx_packets,
    num_rx_packets: model.num_rx_packets,
    tx_per: model.tx_per,
    rx_per: model.rx_per,
    tx_ba: model.tx_ba,
    rx_ba: model.rx_ba,
    tx_ppdu: model.tx_ppdu,
    rx_ppdu: model.rx_ppdu,
    rx_plcp_fail: model.rx_plcp_fail,
    rx_beam_idx: model.rx_beam_idx,
    rx_rtcal_top_panel_beam: model.rx_rtcal_top_panel_beam,
    rx_rtcal_bot_panel_beam: model.rx_rtcal_bot_panel_beam,
    rx_vbs_beam: model.rx_vbs_beam,
    rx_cbf_beam: model.rx_cbf_beam,
    tx_beam_idx: model.tx_beam_idx,
    tx_rtcal_top_panel_beam: model.tx_rtcal_top_panel_beam,
    tx_rtcal_bot_panel_beam: model.tx_rtcal_bot_panel_beam,
    tx_vbs_beam: model.tx_vbs_beam,
    tx_cbf_beam: model.tx_cbf_beam,
    link_up_time: model.link_up_time,
    link_available_time: model.link_available_time,
    num_link_up_flaps: model.num_link_up_flaps,
    num_link_avail_flaps: model.num_link_avail_flaps,
    p2mp_flag: model.p2mp_flag,
    ping_avg_latency: model.ping_avg_latency,
    ping_loss: model.ping_loss,
    ping_max_latency: model.ping_max_latency,
    ping_min_latency: model.ping_min_latency,
    ping_pkt_rx: model.ping_pkt_rx,
    ping_pkt_tx: model.ping_pkt_tx,
    iperf_throughput_min: model.iperf_throughput_min,
    iperf_throughput_max: model.iperf_throughput_max,
    iperf_throughput_mean: model.iperf_throughput_mean,
    iperf_throughput_std: model.iperf_throughput_std,
    iperf_link_error_min: model.iperf_link_error_min,
    iperf_link_error_max: model.iperf_link_error_max,
    iperf_link_error_mean: model.iperf_link_error_mean,
    iperf_link_error_std: model.iperf_link_error_std,
    iperf_jitter_min: model.iperf_jitter_min,
    iperf_jitter_max: model.iperf_jitter_max,
    iperf_jitter_mean: model.iperf_jitter_mean,
    iperf_jitter_std: model.iperf_jitter_std,
    iperf_lost_datagram_min: model.iperf_lost_datagram_min,
    iperf_lost_datagram_max: model.iperf_lost_datagram_max,
    iperf_lost_datagram_mean: model.iperf_lost_datagram_mean,
    iperf_lost_datagram_std: model.iperf_lost_datagram_std,
    iperf_udp_flag: model.iperf_udp_flag,
    iperf_p90_tput: model.iperf_p90_tput,
    test_run_execution_id: model.test_run_execution_id,
    iperf_client_blob: model.iperf_client_blob,
    iperf_server_blob: model.iperf_server_blob,
    ping_output_blob: model.ping_output_blob,
    iperf_pushed_throughput: model.iperf_pushed_throughput,
    is_ecmp: model.is_ecmp,
    route_changed_count: model.route_changed_count,
    test_execution: model.test_execution
      ? mapTestExecutionToDto(model.test_execution)
      : null,
  };
}

module.exports = service;