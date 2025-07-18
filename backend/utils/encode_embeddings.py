from efficientnet_pytorch import EfficientNet
from PIL import Image
import torch
import torchvision.transforms as transforms
import os
import numpy as np

# Load the pre-trained EfficientNet-B0 model
model = EfficientNet.from_pretrained('efficientnet-b0')
model.eval()

# Prepare the image transformation
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def extract_embedding(image_path):
    image = Image.open(image_path).convert('RGB')
    img_tensor = transform(image).unsqueeze(0)  # batch size 1
    with torch.no_grad():
        features = model.extract_features(img_tensor)
        embedding = features.flatten().numpy()
    return embedding

images_dir = 'images_database'
embeddings_dir = 'embeddings'

os.makedirs(embeddings_dir, exist_ok=True)

for img_name in os.listdir(images_dir):
    img_path = os.path.join(images_dir, img_name)
    embedding = extract_embedding(img_path)
    embedding_path = os.path.join(embeddings_dir, img_name + '.npy')
    np.save(embedding_path, embedding)
    print(f"Embedding saved for {img_name}")
