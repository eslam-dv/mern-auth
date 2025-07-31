import { Alert, Box, Stack, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const { email, verified, createdAt } = user.user;

  return (
    <Box component="main">
      <Stack alignItems="center" spacing={2}>
        <Typography variant="h4" component="h1" sx={{ textAlign: "center" }}>
          My Account
        </Typography>
        {!verified && (
          <Alert
            severity="warning"
            sx={{ width: "fit-content", borderRadius: 2 }}
          >
            Please verify your account
          </Alert>
        )}
        <Typography sx={{ color: "text.secondary" }}>
          <Typography
            component="span"
            sx={{ color: "text.primary", fontWeight: "bold" }}
          >
            Email:{" "}
          </Typography>
          {email}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          <Typography
            component="span"
            sx={{ color: "text.primary", fontWeight: "bold" }}
          >
            Created At:{" "}
          </Typography>
          {new Date(createdAt).toLocaleString("en-UK")}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Profile;
