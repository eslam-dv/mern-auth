import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      secondary: "#1d1d1d",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "10px 14px",
        },
      },
    },
  },
});
