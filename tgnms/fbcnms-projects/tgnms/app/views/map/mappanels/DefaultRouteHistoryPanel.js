/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */

import CircularProgress from '@material-ui/core/CircularProgress';
import CustomAccordion from '@fbcnms/tg-nms/app/components/common/CustomAccordion';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Select from '@material-ui/core/Select';
import Slide from '@material-ui/core/Slide';
import TimelineIcon from '@material-ui/icons/Timeline';
import Typography from '@material-ui/core/Typography';
import useLiveRef from '@fbcnms/tg-nms/app/hooks/useLiveRef';
import useTaskState from '@fbcnms/tg-nms/app/hooks/useTaskState';
import {KeyboardDatePicker} from '@material-ui/pickers';
import {
  PANELS,
  PANEL_STATE,
} from '@fbcnms/tg-nms/app/features/map/usePanelControl';
import {SlideProps} from '@fbcnms/tg-nms/app/constants/MapPanelConstants';
import {
  currentDefaultRouteRequest,
  getDefaultRouteHistory,
} from '@fbcnms/tg-nms/app/apiutils/DefaultRouteHistoryAPIUtil';
import {makeStyles} from '@material-ui/styles';
import {mapDefaultRoutes} from '@fbcnms/tg-nms/app/helpers/DefaultRouteHelpers';
import {useNetworkContext} from '@fbcnms/tg-nms/app/contexts/NetworkContext';
import {useRouteContext} from '@fbcnms/tg-nms/app/contexts/RouteContext';

import type {PanelStateControl} from '@fbcnms/tg-nms/app/features/map/usePanelControl';

type DefaultRouteType = {
  route: Array<Array<string>>,
  percent: number,
  hops: number,
  isCurrent: boolean,
};

const useStyles = makeStyles(theme => ({
  iconCentered: {
    paddingRight: theme.spacing(1),
  },
  closerTitle: {
    marginBottom: -theme.spacing(1),
  },
  routeSelection: {
    marginLeft: -theme.spacing(1),
  },
  selectedRoute: {
    background: '#e3f2fd',
  },
}));

export default function DefaultRouteHistoryPanel({
  panelControl,
}: {
  panelControl: PanelStateControl,
}) {
  const classes = useStyles();
  const {getIsHidden, getIsOpen, toggleOpen, setPanelState} = panelControl;
  const TODAY = new Date();
  const routes = useRouteContext();
  const routesRef = useLiveRef(routes);
  const {
    networkName,
    networkConfig,
    nodeMap,
    siteToNodesMap,
  } = useNetworkContext();
  const topologyRef = useLiveRef(networkConfig.topology);
  const {isLoading, setState, TASK_STATE} = useTaskState();
  const [selectedDate, setSelectedDate] = React.useState(
    new Date(
      TODAY.getFullYear(),
      TODAY.getMonth(),
      TODAY.getDate(),
      0,
      TODAY.getTimezoneOffset(),
      0,
    ),
  );
  const [highlightedSiteNode, setHighlightedSiteNode] = React.useState(null);
  const [defaultRoutes, setDefaultRoutes] = React.useState(null);
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  const [totalChanges, setTotalChanges] = React.useState(-1);

  const node = React.useMemo(() => nodeMap[routesRef.current?.node ?? ''], [
    nodeMap,
    routesRef,
  ]);
  const siteNodes = React.useMemo(() => siteToNodesMap[node?.site_name] ?? [], [
    node,
    siteToNodesMap,
  ]);

  const [selectedNode, setSelectedNode] = React.useState('');

  const processRoutes = React.useCallback(async () => {
    try {
      setState(TASK_STATE.LOADING);
      const startTime = selectedDate.toISOString().split('.')[0];
      const endTime = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('.')[0];

      const [currentDefaultRoute, defaultRouteHistory] = await Promise.all([
        currentDefaultRouteRequest({
          networkName,
          selectedNode,
        }),
        getDefaultRouteHistory({
          networkName,
          nodeName: selectedNode,
          startTime,
          endTime,
        }),
      ]);

      if (
        defaultRouteHistory === undefined ||
        defaultRouteHistory.utils.length === 0
      ) {
        setState(TASK_STATE.IDLE);
        setDefaultRoutes(null);
        return;
      }
      if (currentDefaultRoute !== undefined) {
        const {links, nodes} = mapDefaultRoutes({
          mapRoutes: currentDefaultRoute,
          topology: topologyRef.current,
        });
        routesRef.current.onUpdateRoutes({
          node: selectedNode,
          links,
          nodes,
        });
      }

      const {history, utils} = defaultRouteHistory;
      const {historicalRoutes, percents} = utils.reduce(
        (res, util) => {
          res.historicalRoutes.push(util.routes);
          res.percents.push(util.percentage);
          return res;
        },
        {historicalRoutes: [], percents: []},
      );

      const currentRouteString = JSON.stringify(currentDefaultRoute);
      const finalDefaultRoutes: Array<DefaultRouteType> = historicalRoutes.map(
        (route, index) => {
          const routeString = JSON.stringify(route);
          const routeInstances = [...new Set(history)].filter(
            change => JSON.stringify(change.routes) === routeString,
          );
          const hops =
            routeInstances.find(route => route.max_hop_count !== 0)
              ?.max_hop_count || 0;

          const isCurrent = routeString === currentRouteString;

          if (isCurrent) {
            setSelectedRoute(index);
          }

          return {
            route,
            hops,
            percent: percents[index],
            isCurrent: isCurrent,
          };
        },
      );
      setDefaultRoutes(
        finalDefaultRoutes.sort((a, b) => b.percent - a.percent),
      );
      setTotalChanges(history.length);
      setState(TASK_STATE.SUCCESS);
    } catch (err) {
      console.error(err);
      setState(TASK_STATE.ERROR);
    }
  }, [
    selectedNode,
    TASK_STATE,
    networkName,
    routesRef,
    selectedDate,
    setState,
    topologyRef,
  ]);

  const handleNodeChange = React.useCallback(
    nodeName => {
      setSelectedNode(nodeName);
      processRoutes();
    },
    [processRoutes],
  );

  React.useEffect(() => {
    if (node && node.name !== selectedNode) {
      handleNodeChange(node.name);
    }
  }, [handleNodeChange, node, selectedNode]);

  React.useEffect(() => {
    if (!routesRef.current.node) {
      return;
    }
    setSelectedNode(routesRef.current.node);
    processRoutes();
  }, [processRoutes, routesRef]);

  const handleDateChange = React.useCallback(
    date => {
      if (date.toString() === 'Invalid Date') {
        return;
      }
      const newDate = new Date(date);
      newDate.setMinutes(-TODAY.getTimezoneOffset());
      setSelectedDate(newDate);
      processRoutes();
    },
    [TODAY, processRoutes],
  );

  const onSelectRoute = React.useCallback(
    (route, index) => {
      const {links, nodes} = mapDefaultRoutes({
        mapRoutes: route.route,
        topology: topologyRef.current,
      });
      setSelectedRoute(index);
      // update weights (will be used in links rendering)
      routesRef.current.onUpdateRoutes({
        node: selectedNode,
        links,
        nodes,
      });
    },
    [selectedNode, topologyRef, routesRef],
  );

  const togglePanel = React.useCallback(
    () => toggleOpen(PANELS.DEFAULT_ROUTES),
    [toggleOpen],
  );

  const handleClose = React.useCallback(() => {
    routesRef.current.resetRoutes();
    setPanelState(PANELS.DEFAULT_ROUTES, PANEL_STATE.HIDDEN);
  }, [routesRef, setPanelState]);

  if (!node) {
    return null;
  }

  return (
    <Slide {...SlideProps} in={!getIsHidden(PANELS.DEFAULT_ROUTES)}>
      <CustomAccordion
        title="Default Routes"
        titleIcon={<TimelineIcon classes={{root: classes.iconCentered}} />}
        details={
          <Grid container direction="column" spacing={2} wrap="nowrap">
            <Grid item xs={12}>
              <Typography variant="subtitle2">Node</Typography>
              <FormControl fullWidth={true}>
                <Select
                  value={selectedNode}
                  variant="outlined"
                  margin="dense"
                  onChange={ev => handleNodeChange(ev.target.value)}>
                  {Array.from(siteNodes).map(nodeName => (
                    <MenuItem key={nodeName} value={nodeName}>
                      {nodeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.closerTitle} variant="subtitle2">
                Date
              </Typography>
              <KeyboardDatePicker
                disableToolbar
                inputVariant="outlined"
                format="MM/DD/YYYY"
                margin="dense"
                id="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={ev => handleDateChange(ev._d)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            {isLoading ? (
              <Grid item container justify="center" data-testid="loadingCircle">
                <Grid item>
                  <CircularProgress />
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12} container spacing={1}>
                <Grid item>
                  {defaultRoutes ? (
                    <Typography variant="body2">
                      {totalChanges} route changes over {defaultRoutes.length}{' '}
                      routes.
                    </Typography>
                  ) : null}
                </Grid>
                <Grid item>
                  <List>
                    {defaultRoutes ? (
                      defaultRoutes.map((route, index) => (
                        <Paper
                          className={
                            selectedRoute === index ? classes.selectedRoute : ''
                          }
                          elevation={2}
                          key={'route' + index}>
                          <ListItem
                            button
                            dense
                            onClick={() => onSelectRoute(route, index)}
                            onMouseOver={() => setHighlightedSiteNode(index)}
                            onMouseOut={() => setHighlightedSiteNode(null)}
                            selected={index === highlightedSiteNode}>
                            <List className={classes.routeSelection}>
                              <ListItem className={classes.closerTitle}>
                                <Typography variant="subtitle2">
                                  {'Route ' + (index + 1).toString()}
                                </Typography>
                                {route.isCurrent ? (
                                  <Typography variant="subtitle2">
                                    {' '}
                                    - Current
                                  </Typography>
                                ) : null}
                              </ListItem>
                              <ListItem>
                                <Typography variant="body2">
                                  {route.percent + '% of the time - '}
                                  {route.route.length === 0
                                    ? 'no route'
                                    : route.hops + ' wireless hop(s)'}
                                </Typography>
                              </ListItem>
                            </List>
                          </ListItem>
                        </Paper>
                      ))
                    ) : (
                      <Typography data-testid="noRoutes" variant="subtitle1">
                        No route history exists during this time period. The
                        node could have been offline or not part of the
                        topology. Try selecting another time period.
                      </Typography>
                    )}
                  </List>
                </Grid>
              </Grid>
            )}
          </Grid>
        }
        expanded={getIsOpen(PANELS.DEFAULT_ROUTES)}
        onChange={togglePanel}
        onClose={handleClose}
      />
    </Slide>
  );
}