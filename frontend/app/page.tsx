import { ImageSelector } from "../components/ImageSelector/ImageSelector";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        px: 4,
        py: 6,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ImageSelector />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pl: 4,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Additional information here...
        </Typography>
      </Box>
    </Box>
  );
}
