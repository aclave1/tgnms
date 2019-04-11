/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */
'use strict';
import type {ContextRouter} from 'react-router-dom';
import type {UINotification} from '../../components/common/CustomSnackbar';
import type {CreateTestUrl} from './NetworkTest';
import type {LinkTestResult} from './LinkTestResultDetails';
import * as React from 'react';
import {Link, Route} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Loading from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import CustomTable from '../../components/common/CustomTable';
import {withStyles} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/styles';
import * as testApi from '../../apiutils/NetworkTestAPIUtil';
import HealthIndicator from './HealthIndicator';
import LinkTestResultDetails from './LinkTestResultDetails';
import HealthHistogram from './HealthHistogram';
import {HEALTH_CODES} from '../../constants/HealthConstants';

type Props = {|
  className: string,
  showNotification: UINotification => any,
  classes: {
    exitButton: string,
    header: string,
    resultsTable: string,
    divider: string,
    resultRow: string,
    loadingWrapper: string,
  },
  createTestUrl: CreateTestUrl,
|} & ContextRouter;

type State = {|
  //all test results
  testResults: ?Array<LinkTestResult>,
  lookupTable: {
    [string | number]: LinkTestResult,
  },
  loading: boolean,
|};

const styles = theme => ({
  resultsTable: {
    height: 400,
  },
  divider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  resultRow: {
    cursor: 'pointer',
  },
  loadingWrapper: {textAlign: 'center', marginTop: theme.spacing.unit * 4},
  header: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(
  class NetworkTestResults extends React.PureComponent<Props, State> {
    state = {
      testResults: null,
      loading: true,
      lookupTable: {},
    };

    static defaultProps = {
      className: '',
    };

    columns = [
      {
        isKey: true,
        key: 'linkName',
        label: 'Link',
        width: 200,
        filter: true,
        sort: true,
      },
      {
        key: 'health',
        label: 'Health',
        width: 100,
        sort: true,
        sortFunc: sortByHealth,
        render: (_, link: LinkTestResult) => {
          const health = getWorstLinkHealth(link);
          return <HealthIndicator health={health} />;
        },
      },
    ];

    rowHeight = 50;
    headerHeight = 40;
    overscanRowCount = 10;

    componentDidMount() {
      this.loadResults();
    }

    componentDidUpdate(prevProps: Props) {
      if (this.getExecutionId(this.props) !== this.getExecutionId(prevProps)) {
        this.loadResults();
      }
    }

    render() {
      const {classes} = this.props;
      const {testResults} = this.state;
      return (
        <>
          <Route
            exact
            path={this.getBaseUrl()}
            render={() => (
              <TestResultsPanel heading="Summary" getBackUrl={this.getBackUrl}>
                {this.state.loading && (
                  <div className={classes.loadingWrapper}>
                    <Loading />
                  </div>
                )}
                {!this.state.loading && testResults && (
                  <>
                    <HealthHistogram testResults={testResults} />
                    <div className={classes.resultsTable}>
                      <Typography
                        variant="subtitle2"
                        className={classes.header}>
                        Click a link below to view the test details
                      </Typography>
                      <CustomTable
                        rowHeight={this.rowHeight}
                        headerHeight={this.headerHeight}
                        overscanRowCount={this.overscanRowCount}
                        columns={this.columns}
                        data={testResults}
                        onRowSelect={this.handleRowSelect}
                        trClassName={classes.resultRow}
                      />
                    </div>
                  </>
                )}
              </TestResultsPanel>
            )}
          />
          <Route
            path={`${this.getBaseUrl()}/details/:linkName`}
            render={({match}) => (
              <TestResultsPanel
                heading={match.params.linkName}
                getBackUrl={this.getBackUrl}>
                <LinkTestResultDetails
                  link={this.getLinkResultById(match.params.linkName)}
                />
              </TestResultsPanel>
            )}
          />
        </>
      );
    }

    loadResults = () => {
      const executionId = this.getExecutionId();
      this.setState({loading: true});
      if (executionId) {
        return testApi
          .getTestResults({
            executionId,
          })
          .then(results => {
            /**
             * Test results come back as an array with one result
             * per traffic direction (2 per link). This groups by link
             */
            const {allResults, lookupTable} = results.reduce(
              (state, result) => {
                if (!result.link_name || result.link_name.trim() === '') {
                  return state;
                }
                let link: LinkTestResult = state.lookupTable[result.link_name];
                if (!link) {
                  link = {
                    linkName: result.link_name,
                    results: [],
                  };
                  state.lookupTable[result.link_name] = link;
                  state.allResults.push(link);
                }
                link.results.push(result);
                return state;
              },
              {allResults: [], lookupTable: {}},
            );

            this.setState({
              testResults: allResults,
              lookupTable,
              loading: false,
            });
          })
          .catch(this.handleLoadingFailed);
      } else {
        this.handleLoadingFailed();
      }
    };

    handleLoadingFailed = (_error: Error | void) => {
      this.props.showNotification({
        message: 'Could not load test results',
        onRetry: this.loadResults,
        variant: 'error',
      });
      this.setState({loading: false});
    };

    handleRowSelect = (row: LinkTestResult) => {
      this.props.history.push(
        this.props.createTestUrl({
          executionId: this.getExecutionId() || '',
          linkName: row.linkName,
        }),
      );
    };

    /**
     * default to this.props but accepts any props object
     */
    getExecutionId = (props: Props | void) =>
      (props != null ? props : this.props).match.params.executionId;

    getBaseUrl = () => this.props.match.url;
    getBackUrl = () => {
      /**
       * if match is exact, we're already at baseUrl -
       * we're not rendering a nested route,
       * so the best way "back" is the all tests screen
       */
      if (this.props.match.isExact) {
        return this.props.createTestUrl({});
      }
      return this.props.createTestUrl({
        executionId: this.getExecutionId() || '',
      });
    };

    createResultsUrl = ({linkName}: {linkName: string}) => {
      return this.props.createTestUrl({
        linkName,
        executionId: this.getExecutionId() || '',
      });
    };

    getLinkResultById = (
      id: number | string | null | void,
    ): ?LinkTestResult => {
      if (typeof id === 'number' || typeof id === 'string') {
        return this.state.lookupTable[id];
      }
    };
  },
);

function sortByHealth(linkA, linkB, sortDirection, _sortBy) {
  const linkAWorstHealth = getWorstLinkHealth(linkA);
  const linkBWorstHealth = getWorstLinkHealth(linkB);
  let retVal = linkAWorstHealth - linkBWorstHealth;
  if (sortDirection === 'DESC') {
    retVal = 0 - retVal;
  }
  return retVal;
}

/**
 * Since a link can have multiple test results, use the worst for sorting and
 * displaying the overall test result
 */
function getWorstLinkHealth(link: LinkTestResult) {
  if (!link || !link.results || link.results.length < 1) {
    return HEALTH_CODES.UNKNOWN;
  }
  return link.results.reduce((max, link) => {
    if (typeof link.health !== 'number') {
      return HEALTH_CODES.UNKNOWN;
    }
    return Math.max(max, link.health);
  }, 0);
}

const usePanelStyles = makeStyles(theme => ({
  panel: {
    padding: theme.spacing.unit * 2,
    flex: '1',
    height: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  exitButton: {
    marginLeft: -(theme.spacing.unit * 2),
    marginTop: -(theme.spacing.unit * 2),
    flexGrow: 0,
  },
  header: {
    marginTop: -(theme.spacing.unit * 2),
    display: 'inline-block',
    verticalAlign: 'middle',
    flexGrow: 0,
  },
  divider: {
    marginBottom: theme.spacing.unit * 2,
    flexGrow: 0,
  },
  contentWrapper: {
    overflow: 'auto',
    flex: 1,
    textAlign: 'center',
  },
}));
function TestResultsPanel({
  children,
  heading,
  getBackUrl,
}: {
  children: React.Node,
  heading: ?string,
  getBackUrl: () => string,
}) {
  const classes = usePanelStyles();
  return (
    <Paper className={classes.panel}>
      <Grid>
        <IconButton
          component={Link}
          to={getBackUrl()}
          className={classes.exitButton}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" component="h2" className={classes.header}>
          {heading}
        </Typography>
      </Grid>
      <Divider className={classes.divider} />
      <div className={classes.contentWrapper}>{children}</div>
    </Paper>
  );
}