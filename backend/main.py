from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
from efficientnet_pytorch import EfficientNet

app = FastAPI()

# Enable CORS to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the EfficientNet model once when the app starts
model = EfficientNet.from_pretrained('efficientnet-b0')
model.eval()

# Define the image transformation pipeline for EfficientNet
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def extract_embedding(image: Image.Image):
    """Extract the feature embedding from an image using EfficientNet."""
    img_tensor = transform(image).unsqueeze(0)  # Add batch dimension
    with torch.no_grad():
        features = model.extract_features(img_tensor)
        embedding = features.flatten().numpy()
    return embedding

@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    """API endpoint to upload an image and return its embedding."""
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    # Extract embedding from the uploaded image
    embedding = extract_embedding(image)

    width, height = image.size
    return {
        "filename": file.filename,
        "width": width,
        "height": height,
        "embedding": embedding.tolist(),
        "message": "Image received and embedding extracted"
    }
