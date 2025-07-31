import {
  Container,
  Box,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  OutlinedInput,
  FormHelperText,
  Link as MuiLink,
  Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../lib/api";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const {
    mutate: createAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/", { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAccount({ email, password, confirmPassword });
  };
  return (
    <Box component="main" sx={{ paddingY: 10 }}>
      <Container maxWidth="xs">
        <Typography
          component="h1"
          variant="h4"
          sx={{ textAlign: "center", marginBottom: 5 }}
        >
          Create a new account
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {isError && (
            <Box sx={{ marginBottom: 3, color: "error.main" }}>
              {error?.message || "Invalid email or password"}
            </Box>
          )}
          <Stack
            spacing={4}
            sx={{
              bgcolor: "background.secondary",
              borderRadius: 3,
              p: 5,
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
              <FormHelperText>
                - Must be atleast 6 characters long
              </FormHelperText>
            </FormControl>
            <FormControl required>
              <FormLabel>Confirm Password</FormLabel>
              <OutlinedInput
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              disabled={
                !email || password.length < 6 || password !== confirmPassword
              }
              variant="contained"
              loading={isPending}
            >
              Create account
            </Button>
            <Typography
              sx={{
                fontSize: 16,
                textAlign: "center",
                color: "text.disabled",
              }}
            >
              Already have an account?{" "}
              <MuiLink component={Link} to="/login">
                Sign in
              </MuiLink>
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
