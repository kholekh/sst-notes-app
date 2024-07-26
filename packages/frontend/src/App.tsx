import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./App.css";
import Reservation from "./components/Reservation";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Reservation />
    </LocalizationProvider>
  );
}

export default App;
