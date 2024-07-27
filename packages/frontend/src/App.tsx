import { Link as RouterLink } from "react-router-dom";
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

function App() {
  return (
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
          <Button component={RouterLink} color="inherit" to="/signup">
            Signup
          </Button>
          <Button component={RouterLink} color="inherit" to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
          <Routes />
      </Container>
    </>
  );
}

export default App;
