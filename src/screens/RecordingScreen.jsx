import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StopIcon from "@mui/icons-material/Stop";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WaveSurfer from "wavesurfer.js";

const RecordingScreen = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const wavesurferRef = useRef(null);
  const waveformRef = useRef(null);

  useEffect(() => {
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
        setAudioChunks(chunks);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Initialize WaveSurfer
      if (waveformRef.current) {
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#2196f3",
          progressColor: "#1976d2",
          cursorColor: "#1976d2",
          barWidth: 2,
          barRadius: 3,
          cursorWidth: 1,
          height: 100,
          barGap: 3,
        });
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const saveRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.wav";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ alignSelf: "flex-start", mb: 2 }}
        >
          Back
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Recording
        </Typography>

        <Box
          ref={waveformRef}
          sx={{
            width: "100%",
            height: 100,
            bgcolor: "grey.100",
            borderRadius: 1,
            mb: 4,
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 4,
          }}
        >
          {!isRecording ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<StopIcon />}
              onClick={startRecording}
              sx={{ py: 2 }}
            >
              Start Recording
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<StopIcon />}
                onClick={stopRecording}
                sx={{ py: 2 }}
              >
                Stop Recording
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveRecording}
                disabled={!audioBlob}
                sx={{ py: 2 }}
              >
                Save Recording
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default RecordingScreen;
