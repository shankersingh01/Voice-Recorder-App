import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import HomeScreen from "./screens/HomeScreen";
import RecordingScreen from "./screens/RecordingScreen";
import ShareScreen from "./screens/ShareScreen";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/record" element={<RecordingScreen />} />
          <Route path="/share" element={<ShareScreen />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
