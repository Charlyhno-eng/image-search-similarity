from efficientnet_pytorch import EfficientNet
from PIL import Image
import torch
import torchvision.transforms as transforms
import torch.nn.functional as F
import os
import numpy as np

model = EfficientNet.from_pretrained('efficientnet-b4')
model.eval()

transform = transforms.Compose([
    transforms.Resize(384),
    transforms.CenterCrop(380),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def extract_embedding(image_path):
    image = Image.open(image_path).convert('RGB')
    img_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        features = model.extract_features(img_tensor)
        pooled = F.adaptive_avg_pool2d(features, 1)
        embedding = pooled.view(pooled.size(0), -1)
    return embedding.squeeze(0).numpy()

images_dir = 'images_database'
embeddings_dir = 'embeddings'

os.makedirs(embeddings_dir, exist_ok=True)

for img_name in os.listdir(images_dir):
    img_path = os.path.join(images_dir, img_name)
    embedding = extract_embedding(img_path)
    embedding_path = os.path.join(embeddings_dir, img_name + '.npy')
    np.save(embedding_path, embedding)
    print(f"Saved embedding for {img_name} with shape {embedding.shape}")
