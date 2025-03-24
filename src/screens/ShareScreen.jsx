import { Box, Button, Typography, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";

const ShareScreen = () => {
  const navigate = useNavigate();

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      color: "#25D366",
      action: () => {
        // Implement WhatsApp sharing
        window.open("https://wa.me/?text=Check out my recording!", "_blank");
      },
    },
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      color: "#1877F2",
      action: () => {
        // Implement Facebook sharing
        window.open(
          "https://www.facebook.com/sharer/sharer.php?u=" +
            encodeURIComponent(window.location.href),
          "_blank"
        );
      },
    },
    {
      name: "Twitter",
      icon: <TwitterIcon />,
      color: "#1DA1F2",
      action: () => {
        // Implement Twitter sharing
        window.open(
          "https://twitter.com/intent/tweet?text=Check out my recording!",
          "_blank"
        );
      },
    },
    {
      name: "Email",
      icon: <EmailIcon />,
      color: "#EA4335",
      action: () => {
        // Implement Email sharing
        window.location.href =
          "mailto:?subject=Check out my recording!&body=I wanted to share this recording with you.";
      },
    },
  ];

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
          Share Recording
        </Typography>

        <Grid container spacing={2} sx={{ mt: 4 }}>
          {shareOptions.map((option) => (
            <Grid item xs={6} key={option.name}>
              <Button
                variant="contained"
                startIcon={option.icon}
                onClick={option.action}
                sx={{
                  width: "100%",
                  py: 2,
                  bgcolor: option.color,
                  "&:hover": {
                    bgcolor: option.color,
                    opacity: 0.9,
                  },
                }}
              >
                {option.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ShareScreen;
