import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StopIcon from "@mui/icons-material/Stop";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

const RecordingScreen = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [hasStopped, setHasStopped] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const waveformRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const visualize = (stream) => {
    if (!waveformRef.current) return;

    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = document.createElement("canvas");
      canvas.width = waveformRef.current.clientWidth;
      canvas.height = waveformRef.current.clientHeight;
      waveformRef.current.innerHTML = "";
      waveformRef.current.appendChild(canvas);

      const canvasCtx = canvas.getContext("2d");

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "rgb(200, 200, 200)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "#2196f3";
        canvasCtx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      };

      draw();
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
    } catch (err) {
      console.error("Error in visualization:", err);
      setError("Error initializing audio visualization");
    }
  };

  const startRecording = async () => {
    try {
      setIsLoading(true);
      setError(null);
      chunksRef.current = []; // Reset chunks array
      setHasStopped(false);
      setAudioBlob(null);

      // First, check if we have permission
      const permissionStatus = await navigator.permissions.query({
        name: "microphone",
      });

      if (permissionStatus.state === "denied") {
        setError(
          "Microphone access was denied. Please enable it in your browser settings."
        );
        setIsLoading(false);
        return;
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Create and start MediaRecorder with WebM format
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setIsSaving(false);
      };

      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      visualize(stream);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      let errorMessage = "Failed to access microphone. ";

      if (error.name === "NotAllowedError") {
        errorMessage +=
          "Please ensure you have granted microphone permissions.";
      } else if (error.name === "NotFoundError") {
        errorMessage +=
          "No microphone found. Please connect a microphone and try again.";
      } else if (error.name === "NotReadableError") {
        errorMessage += "Microphone is already in use by another application.";
      } else {
        errorMessage += error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      setIsSaving(true);
      mediaRecorder.stop();
      setIsRecording(false);
      setHasStopped(true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const resetRecording = () => {
    setHasStopped(false);
    setAudioBlob(null);
    chunksRef.current = [];
    if (waveformRef.current) {
      waveformRef.current.innerHTML = "";
    }
  };

  const saveRecording = () => {
    if (audioBlob) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `voice-memo-${timestamp}.webm`;
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Save to localStorage
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          localStorage.setItem("lastRecording", JSON.stringify(reader.result));
        };
        reader.readAsDataURL(audioBlob);
      } catch (err) {
        console.error("Error saving recording to localStorage:", err);
        setError("Error saving recording");
      }
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
          Voice Memo
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          ref={waveformRef}
          sx={{
            width: "100%",
            height: 100,
            bgcolor: "grey.100",
            borderRadius: 1,
            mb: 4,
            overflow: "hidden",
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 4,
          }}
        >
          {!isRecording && !hasStopped ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <StopIcon />
                )
              }
              onClick={startRecording}
              disabled={isLoading}
              sx={{ py: 2 }}
            >
              {isLoading ? "Initializing..." : "Start Recording"}
            </Button>
          ) : isRecording ? (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<StopIcon />}
              onClick={stopRecording}
              sx={{ py: 2 }}
            >
              Stop Recording
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  isSaving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                onClick={saveRecording}
                disabled={!audioBlob || isSaving}
                sx={{ py: 2 }}
              >
                {isSaving ? "Processing..." : "Save Voice Memo"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RefreshIcon />}
                onClick={resetRecording}
                sx={{ py: 2 }}
              >
                Reset Recording
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default RecordingScreen;
