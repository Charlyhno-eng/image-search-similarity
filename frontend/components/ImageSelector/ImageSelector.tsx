"use client";

import React, { useState, useCallback } from "react";
import {
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

type ImageDimensions = {
  width: number;
  height: number;
};

export function ImageSelector() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions | null>(null);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof window !== "undefined" && reader.result) {
          const img = new window.Image();
          img.onload = () => {
            setImageDimensions({
              width: img.width,
              height: img.height,
            });
            setSelectedImage(reader.result as string);
          };
          img.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 4,
      }}
    >
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="contained-button-file"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          component="span"
          startIcon={<PhotoCamera />}
          sx={{
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          Select an image
        </Button>
      </label>

      {selectedImage && imageDimensions && (
        <Card sx={{ maxWidth: 800, width: "100%", mt: 2 }}>
          <CardMedia
            component="img"
            image={selectedImage}
            alt="Selected"
            sx={{ maxHeight: 500, objectFit: "contain" }}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Dimensions : {imageDimensions.width} x {imageDimensions.height} px
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
