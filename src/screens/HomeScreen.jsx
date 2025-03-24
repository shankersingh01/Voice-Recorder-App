import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShareIcon from "@mui/icons-material/Share";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Voice Recorder
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: 400,
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<MicIcon />}
            onClick={() => navigate("/record")}
            sx={{ py: 2 }}
          >
            Start Recording
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<PlayArrowIcon />}
            sx={{ py: 2 }}
          >
            Play Recording
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<ShareIcon />}
            onClick={() => navigate("/share")}
            sx={{ py: 2 }}
          >
            Share Recording
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomeScreen;
