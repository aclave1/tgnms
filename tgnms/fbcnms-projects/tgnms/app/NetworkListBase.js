/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 */
'use strict';

import axios from 'axios';
import MaterialTopBar from './components/topbar/MaterialTopBar.js';
import NetworkListContext from './NetworkListContext';
import NetworkUI from './NetworkUI';
import NmsConfig from './views/nms_config/NmsConfig';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';

// Pick a network if no network is requested in URL
// This will choose any alive controller, otherwise redirect to /config
function getDefaultNetworkName(networkList) {
  if (!networkList || !Object.keys(networkList).length) {
    return null;
  }
  const network = Object.values(networkList).find(cfg => cfg.controller_online);
  return network ? network.name : null;
}
const defaultNetworkName = getDefaultNetworkName(window.CONFIG);

const styles = theme => ({
  appBarSpacer: {
    flex: '0 1 auto',
    ...theme.mixins.toolbar,
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column',
    height: '100vh',
    overflow: 'auto',
  },
  root: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
    height: '100%',
  },
});

const CONFIG_URL = '/config';

const REFRESH_INTERVAL = window.CONFIG.refresh_interval
  ? window.CONFIG.refresh_interval
  : 5000;

class NetworkListBase extends React.Component<Props, State> {
  state = {
    networkList: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // fetch initial network list
    this.refreshTopologyList();

    // schedule period refresh
    this._refreshNetworkListInterval = setInterval(
      this.refreshTopologyList,
      REFRESH_INTERVAL,
    );
  }

  refreshTopologyList = () => {
    // Fetch list of network/topology configurations
    axios.get('/topology/list').then(response => {
      // update network list context
      const networkList = response.data;
      this.setState({networkList});
      this.updateNetworkName(networkList);
    });
  };

  waitForNetworkListRefresh = () => {
    this.setState({networkList: null});
    this.refreshTopologyList();
  };

  updateNetworkName = networkList => {
    // Update network name if needed based on new network list
    const currentNetworkName = this.getNetworkName();

    // If current network doesn't exist, redirect to /config
    if (currentNetworkName && !networkList.hasOwnProperty(currentNetworkName)) {
      this.props.history.push(CONFIG_URL);
    }
  };

  getNetworkName = () => {
    // Return the current network name
    const splitPath = this.props.location.pathname.split('/');
    if (splitPath.length >= 3 && splitPath[2].length) {
      return splitPath[2];
    }
    return null;
  };

  //TODO: use this.props.match instead of manually parsing the url
  changeNetworkName = networkName => {
    // Change the current network name
    const splitPath = this.props.location.pathname.split('/');
    if (splitPath.length >= 3) {
      // replace network name (first parameter)
      splitPath[2] = networkName;
    } else {
      // push network name
      splitPath.push(networkName);
    }
    return splitPath.join('/');
  };

  render() {
    const {classes} = this.props;
    return (
      <NetworkListContext.Provider
        value={{
          networkList: this.state.networkList,
          // Wait until topology is refreshed before rendering routes
          waitForNetworkListRefresh: this.waitForNetworkListRefresh,
          // Get/set network name
          getNetworkName: this.getNetworkName,
          changeNetworkName: this.changeNetworkName,
        }}>
        <div className={classes.root}>
          <MaterialTopBar />
          <main className={classes.main}>
            <div className={classes.appBarSpacer} />
            <Switch>
              <Route path={CONFIG_URL} component={NmsConfig} />
              <Route path="/:viewName/:networkName" component={NetworkUI} />
              <Redirect
                to={
                  defaultNetworkName ? `/map/${defaultNetworkName}` : CONFIG_URL
                }
              />
            </Switch>
          </main>
        </div>
      </NetworkListContext.Provider>
    );
  }
}

export default withStyles(styles, {withTheme: true})(
  withRouter(NetworkListBase),
);