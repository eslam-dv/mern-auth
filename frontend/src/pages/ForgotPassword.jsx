import { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  OutlinedInput,
  Stack,
  Typography,
  Link as MuiLink,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetEmail } from "../lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const {
    mutate: SendPasswordReset,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: sendPasswordResetEmail,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    SendPasswordReset(email);
  };
  return (
    <Box component="main" sx={{ py: 10 }}>
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          component="h1"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Reset your password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ bgcolor: "background.secondary", p: 5, borderRadius: 3 }}
        >
          {isError && (
            <Box sx={{ marginBottom: 3, color: "error.main" }}>
              {error?.message || "An error occured"}
            </Box>
          )}
          <Stack spacing={4} alignItems="center">
            {isSuccess ? (
              <Alert severity="success" sx={{ width: "fit-content" }}>
                Email sent! Check your inbox for further instructions.
              </Alert>
            ) : (
              <>
                <FormControl required fullWidth>
                  <FormLabel>Email address</FormLabel>
                  <OutlinedInput
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!email}
                  loading={isPending}
                  fullWidth
                >
                  Reset Password
                </Button>
              </>
            )}
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Go back to{" "}
              <MuiLink component={Link} to="/login" replace>
                Sign in
              </MuiLink>{" "}
              &nbsp;or&nbsp;{" "}
              <MuiLink component={Link} to="/register" replace>
                Sign up
              </MuiLink>
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
