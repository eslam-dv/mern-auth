import {
  Container,
  Box,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  OutlinedInput,
  Link as MuiLink,
  Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../lib/api";

export const Login = () => {
  const location = useLocation();
  const redirectUrl = location.state?.redirectUrl || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn({ email, password });
  };
  return (
    <Box component="main" sx={{ paddingY: 10 }}>
      <Container maxWidth="xs">
        <Typography
          component="h1"
          variant="h4"
          sx={{ textAlign: "center", marginBottom: 5 }}
        >
          Sign into account
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {isError && (
            <Box sx={{ marginBottom: 3, color: "error.main" }}>
              Invalid email or password
            </Box>
          )}
          <Stack
            spacing={4}
            sx={{
              bgcolor: "background.secondary",
              color: "text.primary",
              borderRadius: 1,
              padding: 5,
            }}
          >
            <FormControl required>
              <FormLabel>Email Address</FormLabel>
              <OutlinedInput
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl required>
              <FormLabel>Password</FormLabel>
              <OutlinedInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <MuiLink
              component={Link}
              to="/password/forgot"
              sx={{ fontSize: 16, textAlign: { xs: "center", md: "right" } }}
              replace
            >
              Forgot Password?
            </MuiLink>
            <Button
              type="submit"
              disabled={!email || password.length < 6}
              variant="contained"
              loading={isPending}
            >
              Sign in
            </Button>
            <Typography
              sx={{
                fontSize: 16,
                textAlign: "center",
                color: "text.disabled",
              }}
            >
              Don't have an account?{" "}
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
