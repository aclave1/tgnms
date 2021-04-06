/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */

import * as React from 'react';
import ConfigTaskForm from '../taskBasedConfig/ConfigTaskForm';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import KafkaEndpoint from '../taskBasedConfig/configTasks/KafkaEndpoint';
import TextField from '@material-ui/core/TextField';
import TroubleshootWarning from './TroubleshootWarning';
import ZmqUrl from '../taskBasedConfig/configTasks/ZmqUrl';
import useForm from '../../hooks/useForm';
import useTroubleshootAutomation from '../../hooks/useTroubleshootAutomation';
import {FORM_CONFIG_MODES, SWARM_URLS} from '../../constants/ConfigConstants';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  label: {
    color: 'black',
  },
}));

export default function EnableNetworkTest() {
  const attemptTroubleShootAutomation = useTroubleshootAutomation();
  const classes = useStyles();

  const {handleInputChange, updateFormState, formState} = useForm({
    initialState: {
      networkTest: SWARM_URLS.NETWORKTEST_HOST,
      zmq: '',
      kafka: '',
    },
  });
  const onAttemptFix = React.useCallback(() => {
    const successMessage = 'Successfully enabled network test';
    const settingsChange = {
      NETWORKTEST_ENABLED: 'true',
      NETWORKTEST_HOST: formState.networkTest,
    };
    const configChange = {
      mode: FORM_CONFIG_MODES.NETWORK,
      drafts: {},
    };
    if (formState.kafka) {
      configChange.drafts = {
        ...configChange.drafts,
        'statsAgentParams.endpointParams.kafkaParams.config.brokerEndpointList':
          formState.kafka,
        'statsAgentParams.endpointParams.kafkaParams.enabled': true,
      };
    }
    if (formState.zmq) {
      configChange.drafts = {
        ...configChange.drafts,
        'statsAgentParams.sources.controller.zmq_url': formState.zmq,
      };
    }

    attemptTroubleShootAutomation({
      settingsChange,
      configChange,
      successMessage,
    });
  }, [attemptTroubleShootAutomation, formState]);

  return (
    <TroubleshootWarning
      isToolTip={true}
      title="Network Test Unavailable"
      modalContent={
        <ConfigTaskForm editMode={FORM_CONFIG_MODES.NETWORK}>
          <Grid container spacing={3}>
            <Grid item container>
              <Grid item>
                If you were expecting to see tests, Network Test might be
                unavailable.
              </Grid>
              <Grid item>
                An online Network Test Container, and ZMQ and Kafka URLs are
                required.
              </Grid>
              <Grid item>
                Please make sure the correct URLs are displayed below and click
                submit to change these settings.
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormLabel className={classes.label}>Network Test URL</FormLabel>
              <TextField
                fullWidth
                value={formState.networkTest}
                onChange={handleInputChange(val => ({networkTest: val}))}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <ZmqUrl onChange={val => updateFormState({zmq: val})} />
            </Grid>
            <Grid item xs={12}>
              <KafkaEndpoint onChange={val => updateFormState({kafka: val})} />
            </Grid>
          </Grid>
        </ConfigTaskForm>
      }
      onAttemptFix={onAttemptFix}
    />
  );
}