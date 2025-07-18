"use client";

import { ImageSelector } from "../components/ImageSelector/ImageSelector";
import { SimilarImages, SimilarImage } from "../components/SimilarImages/SimilarImages";
import { Box } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);

  // This callback would be passed to ImageSelector to update similar images
  const handleSimilarImages = (images: SimilarImage[]) => {
    setSimilarImages(images);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh", px: 4, py: 6 }}>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <ImageSelector />
      </Box>

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", pl: 4 }}>
        <SimilarImages images={similarImages} />
      </Box>
    </Box>
  );
}
