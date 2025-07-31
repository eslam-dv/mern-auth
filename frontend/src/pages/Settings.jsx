import { Box, Container, CircularProgress, Stack, Typography } from "@mui/material";
import useSession from "../hooks/useSession";
import SessionCard from "../components/SessionCard";

const Settings = () => {
  const { sessions, isPending, isSuccess, isError } = useSession();
  return (
    <Box component="main">
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" sx={{ mb: 5 }}>
          My Sessions
        </Typography>
        {isPending && (
          <Stack alignItems="center" sx={{ height: "100vh" }}>
            <CircularProgress />
          </Stack>
        )}
        {isError && (
          <Box sx={{ color: "error.main" }}>Failed to get sessions</Box>
        )}
        {isSuccess && (
          <Stack spacing={3} alignItems="flex-start">
            {sessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Settings;
