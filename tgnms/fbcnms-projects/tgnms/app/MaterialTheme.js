/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */
'use strict';
import {StylesProvider} from '@material-ui/styles';
import {JssProvider} from 'react-jss';
import * as React from 'react';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles';
import MuiStylesThemeProvider from '@material-ui/styles/ThemeProvider';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';

// both styling solutions need to share the same classname generator
const generateClassName = createGenerateClassName();

// default theme
const theme = createMuiTheme({
  typography: {
    htmlFontSize: 18,
    useNextVariants: true,
  },
  palette: {
    success: {
      light: green[100],
      main: green[500],
      dark: green[800],
    },
    warning: {
      light: amber[100],
      main: amber[500],
      dark: amber[800],
    },
  },
});

function MaterialTheme({children}: {children: React.Node}) {
  return (
    <JssProvider generateClassName={generateClassName}>
      <StylesProvider generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <MuiStylesThemeProvider theme={theme}>
            {children}
          </MuiStylesThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>
    </JssProvider>
  );
}

export default MaterialTheme;