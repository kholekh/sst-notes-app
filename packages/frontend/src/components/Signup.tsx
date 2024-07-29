import { Auth } from "aws-amplify";
import { ISignUpResult } from "amazon-cognito-identity-js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormFields } from "../lib/HooksLib";
import { useAppContext } from "../lib/ContextLib";
import { Avatar, Box, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { onError } from "../lib/ErrorLib";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const nav = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<null | ISignUpResult>(null);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setNewUser(newUser);
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      nav("/");
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Box
        component="form"
        onSubmit={handleConfirmationSubmit}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          type="tel"
          id="confirmationCode"
          label="Confirmation Code"
          name="confirmationCode"
          autoFocus
          value={fields.confirmationCode}
          onChange={handleFieldChange}
        />
        <Typography variant="body2" color="text.secondary">
          Please check your email for the code.
        </Typography>
        <LoadingButton
          type="submit"
          disabled={!validateConfirmationForm() || isLoading}
          fullWidth
          loading={isLoading}
          loadingPosition="end"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          <span>Verify</span>
        </LoadingButton>
      </Box>
    );
  }

  function renderForm() {
    return (
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
          autoComplete="new-password"
          value={fields.password}
          onChange={handleFieldChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={fields.confirmPassword}
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
          <span>Sign Up</span>
        </LoadingButton>
      </Box>
    );
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
        Sign up
      </Typography>
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </Box>
  );
}
