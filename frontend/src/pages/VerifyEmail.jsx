import {
  Alert,
  Box,
  Container,
  Stack,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { verifyEmail } from "../lib/api";

export const VerifyEmail = () => {
  const { code } = useParams();
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code),
  });
  return (
    <Box component="main">
      <Container maxWidth="sm" sx={{ paddingY: 10, textAlign: "center" }}>
        {isPending ? (
          <CircularProgress />
        ) : (
          <Stack alignItems="center" spacing={6}>
            <Alert
              severity={isSuccess ? "success" : "error"}
              sx={{ width: "fit-content" }}
            >
              {isSuccess ? "Email verified" : "Invalid link"}
            </Alert>
            {isError && (
              <Box sx={{ marginBottom: 3, color: "error.main" }}>
                The link is either invalid or expired{" "}
                <MuiLink component={Link} to="/password/reset" replace>
                  Get a new link
                </MuiLink>
              </Box>
            )}
            <MuiLink component={Link} to="/" replace>
              Back to home
            </MuiLink>
          </Stack>
        )}
      </Container>
    </Box>
  );
};
