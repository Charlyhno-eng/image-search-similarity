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

export type SimilarImage = {
  filename: string;
  similarity: number;
  url: string;
};

type ImageDimensions = {
  width: number;
  height: number;
};

type BackendResponse = {
  filename: string;
  width: number;
  height: number;
  message: string;
  similar_images: {
    filename: string;
    similarity: number;
  }[];
};

type ImageSelectorProps = {
  onSimilarImages: (images: SimilarImage[]) => void;
};

export function ImageSelector({ onSimilarImages }: ImageSelectorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [backendResponse, setBackendResponse] = useState<BackendResponse | null>(null);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/upload-image/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    return response.json();
  };

  const handleImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof window !== "undefined" && reader.result) {
          const img = new window.Image();
          img.onload = async () => {
            setImageDimensions({
              width: img.width,
              height: img.height,
            });
            setSelectedImage(reader.result as string);

            try {
              const response: BackendResponse = await uploadImage(file);
              setBackendResponse(response);

              // Construire le tableau des images similaires avec url complète
              const similarImages: SimilarImage[] = response.similar_images.map(img => ({
                filename: img.filename,
                similarity: img.similarity,
                url: `http://127.0.0.1:8000/images_database/${img.filename}`, // adapte ici selon ta config backend
              }));

              onSimilarImages(similarImages);

            } catch (error) {
              console.error("Upload failed:", error);
            }
          };
          img.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    },
    [onSimilarImages],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 4 }}>
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
          sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" }, textTransform: "none", px: 3, py: 1 }}
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
            {backendResponse && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                Backend : {backendResponse.message}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
