import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.jsx";
import queryClient from "./config/queryClient.js";
import { darkTheme } from "./themes/darkTheme.js";
import "./main.css";

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <App />
      </Router>
      <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
    </ThemeProvider>
  </QueryClientProvider>,
);
