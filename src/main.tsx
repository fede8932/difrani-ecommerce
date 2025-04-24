import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "styled-components";
import { themes } from "./themes.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.tsx";
import { MantineProvider } from "@mantine/core";
import "semantic-ui-css/semantic.min.css";
import 'antd/dist/reset.css';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <MantineProvider theme={{ fontFamily: 'inherit' }}>
          <ThemeProvider theme={themes.ligth}>
            <App />
          </ThemeProvider>
        </MantineProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
