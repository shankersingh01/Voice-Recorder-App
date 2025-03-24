import { Box, Button, Typography, Container, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShareIcon from "@mui/icons-material/Share";
import { useState, useEffect, useRef } from "react";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [lastRecording, setLastRecording] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Get the last recording from localStorage
    const savedRecording = localStorage.getItem("lastRecording");
    if (savedRecording) {
      try {
        const blob = new Blob([JSON.parse(savedRecording)], {
          type: "audio/webm",
        });
        setLastRecording(blob);
      } catch (err) {
        console.error("Error loading recording:", err);
        setError("Error loading recording");
      }
    }
  }, []);

  const handlePlayRecording = () => {
    if (!lastRecording) {
      setError("No recording available to play");
      return;
    }

    try {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (err) {
      console.error("Error playing recording:", err);
      setError("Error playing recording");
    }
  };

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

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

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
            onClick={handlePlayRecording}
            disabled={!lastRecording}
            sx={{ py: 2 }}
          >
            {isPlaying ? "Pause Recording" : "Play Recording"}
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<ShareIcon />}
            onClick={() => navigate("/share")}
            disabled={!lastRecording}
            sx={{ py: 2 }}
          >
            Share Recording
          </Button>
        </Box>

        <audio
          ref={audioRef}
          src={lastRecording ? URL.createObjectURL(lastRecording) : null}
          onEnded={() => setIsPlaying(false)}
          style={{ display: "none" }}
        />
      </Box>
    </Container>
  );
};

export default HomeScreen;
