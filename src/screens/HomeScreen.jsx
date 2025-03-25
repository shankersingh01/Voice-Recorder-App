import { Box, Button, Typography, Container, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShareIcon from "@mui/icons-material/Share";
import { useState, useRef } from "react";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    // Create a file input element if it doesn't exist
    if (!fileInputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "audio/*";
      fileInputRef.current = input;

      // Handle file selection
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            // Create a URL for the selected file
            const url = URL.createObjectURL(file);
            // Navigate to record screen with the file URL
            navigate("/record", {
              state: {
                selectedFile: url,
                fileName: file.name,
                fileType: file.type,
              },
            });
          } catch (err) {
            console.error("Error loading file:", err);
            setError("Error loading audio file");
          }
        }
      };
    }

    // Trigger file selection dialog
    fileInputRef.current.click();
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
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: "24px", sm: "32px" }, // Responsive font size
            textAlign: "center",
          }}
        >
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
            onClick={handleFileSelect}
            sx={{ py: 2 }}
          >
            Select Audio File
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
