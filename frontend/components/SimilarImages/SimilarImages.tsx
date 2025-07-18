"use client";

import React from "react";
import { Box, Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";

export type SimilarImage = {
  filename: string;
  similarity: number;
  url: string;
};

type SimilarImagesProps = {
  images: SimilarImage[];
}

export function SimilarImages({ images }: SimilarImagesProps) {
  if (images.length === 0) {
    return (
      <Typography variant="body1">
        No similar images found yet.
      </Typography>
    );
  }

  return (
    <Box width="100%">
      <Typography variant="h6" gutterBottom>
        Most Similar Images
      </Typography>

      <Grid container spacing={2}>
        {images.map((img, index) => (
          <Grid key={index} size={6}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={img.url}
                alt={`Similar image ${index + 1}`}
              />
              <CardContent>
                <Typography variant="body2">
                  {img.filename}
                </Typography>
                <Typography variant="body2">
                  Similarity: {(img.similarity * 100).toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
