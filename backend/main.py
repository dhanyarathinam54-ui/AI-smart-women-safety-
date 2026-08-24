from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.sos_service import send_sos
from backend.voice_detector import voice_detector


app = FastAPI(
    title="Vazhi Thunai",
    description="Emergency Safety Backend",
    version="1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class SOSRequest(BaseModel):

    latitude: Optional[float] = None
    longitude: Optional[float] = None


@app.get("/")
def home():

    return {
        "status": "online",
        "application": "Vazhi Thunai"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/sos")
def sos(request: SOSRequest):

    result = send_sos(
        latitude=request.latitude,
        longitude=request.longitude
    )

    return result


@app.post("/voice/start")
def start_voice():

    voice_detector.start()

    return {
        "success": True,
        "message": "Voice detection started"
    }


@app.post("/voice/stop")
def stop_voice():

    voice_detector.stop()

    return {
        "success": True,
        "message": "Voice detection stopped"
    }