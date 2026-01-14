import { StrictMode } from 'react';

import { theme as antdTheme, ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';

import 'antd/dist/reset.css';
import { App, GlobalStyle } from './app/';
import { Themes } from './shared';
import store from './store/store';

const { baseTheme } = Themes;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const theme = {
  algorithm: antdTheme.darkAlgorithm,
  components: {
    Modal: {
      contentBg: baseTheme.colors.surface,
      footerBg: baseTheme.colors.surface,
      headerBg: baseTheme.colors.surface,
    },
  },
  token: {
    borderRadius: 10,
    colorBgBase: baseTheme.colors.background,
    colorPrimary: baseTheme.colors.accent,
    fontFamily: baseTheme.typography.fontFamily,
  },
};

root.render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <Provider store={store}>
      <ThemeProvider theme={baseTheme}>
          <GlobalStyle/>
          <HashRouter>
            <App/>
          </HashRouter>
      </ThemeProvider>
    </Provider>
    </ConfigProvider>
  </StrictMode>
);
