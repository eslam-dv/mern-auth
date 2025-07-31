import {
  Alert,
  Box,
  Typography,
  Link as MuiLink,
  Stack,
  FormControl,
  FormLabel,
  OutlinedInput,
  Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../lib/api";

const ResetPasswordForm = ({ code }) => {
  const [password, setPassword] = useState("");

  const {
    mutate: resetUserPassword,
    isError,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: resetPassword,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetUserPassword({ password, verificationCode: code });
  };
  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={{ textAlign: "center", marginBottom: 5 }}
      >
        Change your password
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ bgcolor: "background.secondary", p: 5 }}
      >
        {isError && (
          <Box sx={{ marginBottom: 3, color: "error.main" }}>
            {error.message || "Invalid email or password"}
          </Box>
        )}
        {isSuccess ? (
          <Stack alignItems="center" spacing={4}>
            <Alert severity="success" sx={{ width: "fit-content" }}>
              Password updated successfully
            </Alert>
            <MuiLink component={Link} to="/login" replace>
              Sign in
            </MuiLink>
          </Stack>
        ) : (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <OutlinedInput
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              loading={isPending}
              disabled={password.length < 6}
            >
              Reset Password
            </Button>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default ResetPasswordForm;
