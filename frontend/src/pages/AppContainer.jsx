import { Box, CircularProgress, Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import UserMenu from "../components/UserMenu";

const AppContainer = () => {
  const { user, isLoading } = useAuth();
  return isLoading ? (
    <Stack alignItems="center" sx={{ height: "100vh" }}>
      <CircularProgress />
    </Stack>
  ) : user ? (
    <Box sx={{ p: 4 }}>
      <UserMenu />
      <Outlet />
    </Box>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ redirectUrl: window.location.pathname }}
    />
  );
};

export default AppContainer;
