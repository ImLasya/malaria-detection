
# MalariaDetect

A mobile application for detecting malaria parasites in blood smear images using YOLOv8.

## Features

- Upload images from gallery or capture using camera
- Real-time malaria parasite detection using YOLOv8
- Display detection results with bounding boxes and confidence scores
- Modern and intuitive user interface

## Prerequisites

- Node.js (v14 or later)
- Python (3.8 or later)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Project Structure

```
malaria-detect/
├── backend/             # FastAPI backend
│   ├── main.py         # Main FastAPI application
│   └── models/         # YOLOv8 model files
└── frontend/           # React Native frontend
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── screens/    # Screen components
    │   ├── navigation/ # Navigation setup
    │   └── utils/      # Utility functions
    └── App.tsx         # Root component
```

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd malaria-detect
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
uvicorn main:app --reload
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Run on your device:
   - Press 'a' to run on Android emulator
   - Press 'i' to run on iOS simulator (macOS only)
   - Scan the QR code with Expo Go app on your physical device

## API Endpoints

- `POST /predict`: Upload an image for malaria parasite detection
  - Request: `multipart/form-data` with image file
  - Response: JSON with detection results and annotated image

## Notes

- The YOLOv8 model file (`best.pt`) should be placed in the `backend/models/` directory
- For Android emulator, the API URL is set to `10.0.2.2:8000`
- For iOS simulator or web, change the API URL in `src/utils/api.ts` to `localhost:8000` 

# malaria-detection
7d78ed506b14c1fa80fc7d0bac940e25be6d8e0a
