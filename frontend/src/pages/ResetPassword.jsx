import {
  Alert,
  Box,
  Typography,
  Container,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";

import ResetPasswordForm from "../components/ResetPasswordFrom";

const ResetPassword = () => {
  const [urlParams] = useSearchParams();
  const code = urlParams.get("code");
  const exp = Number(urlParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  return (
    <Box component="main" sx={{ py: 10 }}>
      <Container maxWidth="sm">
        {linkIsValid ? (
          <ResetPasswordForm code={code} />
        ) : (
          <Stack alignItems="center" spacing={4}>
            <Alert severity="error" sx={{ width: "fit-content" }}>
              Invalid Link
            </Alert>
            <Typography
              sx={{
                fontSize: 16,
                textAlign: "center",
                color: "text.disabled",
              }}
            >
              The link is either invalid or replaced{" "}
              <MuiLink
                component={Link}
                to="/password/forgot"
                sx={{ fontSize: 16, textAlign: { xs: "center", md: "right" } }}
                replace
              >
                Forgot Password?
              </MuiLink>
            </Typography>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default ResetPassword;
