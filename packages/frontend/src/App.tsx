import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Routes from "./Routes.tsx";
import { AppContext, AppContextType } from "./lib/ContextLib";
import { onError } from "./lib/ErrorLib.ts";

function App() {
  const nav = useNavigate();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (error) {
      if (error !== "No current user") {
        onError(error);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    nav("/");
  }

  return (
    !isAuthenticating && (
      <>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              component={RouterLink}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              to="/"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Reservations
            </Typography>
            {isAuthenticated ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button component={RouterLink} color="inherit" to="/signup">
                  Signup
                </Button>
                <Button component={RouterLink} color="inherit" to="/login">
                  Login
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
        >
          <Container maxWidth="sm">
            <Routes />
          </Container>
        </AppContext.Provider>
      </>
    )
  );
}

export default App;
