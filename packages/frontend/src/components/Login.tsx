import { Auth } from "aws-amplify";
import { Avatar, Box, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../lib/ContextLib";
import { onError } from "../lib/ErrorLib";
import { useFormFields } from "../lib/HooksLib";

export default function Login() {
  const nav = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      nav("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={fields.email}
          onChange={handleFieldChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={fields.password}
          onChange={handleFieldChange}
        />
        <LoadingButton
          type="submit"
          disabled={!validateForm() || isLoading}
          fullWidth
          loading={isLoading}
          loadingPosition="end"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          <span>Sign In</span>
        </LoadingButton>
      </Box>
    </Box>
  );
}
