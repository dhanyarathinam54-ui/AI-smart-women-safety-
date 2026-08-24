import json
import queue

import numpy as np
import sounddevice as sd
from scipy.signal import resample_poly
from vosk import Model, KaldiRecognizer

from backend.config import (
    MODEL_PATH,
    MIC_DEVICE,
    MIC_SAMPLE_RATE,
    MIC_CHANNELS,
    VOSK_SAMPLE_RATE
)


class VoiceDetector:

    def __init__(self):

        print("Loading Vosk model...")
        print("Model path:", MODEL_PATH)

        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Vosk model not found: {MODEL_PATH}"
            )

        if not (MODEL_PATH / "am").exists():
            raise FileNotFoundError(
                f"Invalid Vosk model folder: {MODEL_PATH}"
            )

        self.model = Model(str(MODEL_PATH))

        self.audio_queue = queue.Queue()
        self.running = False

        print("Vosk model loaded successfully!")

    def audio_callback(
        self,
        indata,
        frames,
        time,
        status
    ):

        if status:
            print("Audio status:", status)

        audio = np.frombuffer(
            indata,
            dtype=np.int16
        )

        audio = audio.reshape(
            -1,
            MIC_CHANNELS
        )

        mono = audio.mean(
            axis=1
        ).astype(np.int16)

        resampled = resample_poly(
            mono,
            1,
            3
        ).astype(np.int16)

        self.audio_queue.put(
            resampled.tobytes()
        )

    def trigger_sos(self):

        from backend.sos_service import send_sos

        print("\n🚨 WAKE PHRASE DETECTED!")
        print("🚨 SOS TRIGGERED!")

        result = send_sos()

        print("SOS Result:", result)

    def start(self):

        if self.running:
            print("Voice detection already running.")
            return

        self.running = True

        recognizer = KaldiRecognizer(
            self.model,
            VOSK_SAMPLE_RATE
        )

        print("\nVoice detection started!")
        print('Please say "Vazhi Thunai"...')

        try:

            with sd.RawInputStream(
                samplerate=MIC_SAMPLE_RATE,
                blocksize=8000,
                device=MIC_DEVICE,
                dtype="int16",
                channels=MIC_CHANNELS,
                callback=self.audio_callback
            ):

                while self.running:

                    data = self.audio_queue.get()

                    if recognizer.AcceptWaveform(data):

                        result = json.loads(
                            recognizer.Result()
                        )

                        text = result.get(
                            "text",
                            ""
                        ).lower()

                        if text:
                            print(
                                "You said:",
                                text
                            )

                        if (
                            "vazhi thunai" in text
                            or (
                                "vazhi" in text
                                and
                                "thunai" in text
                            )
                        ):

                            self.trigger_sos()

        except Exception as e:

            print(
                "Voice detection error:",
                e
            )

        finally:

            self.running = False

    def stop(self):

        self.running = False

        print("Voice detection stopped.")


voice_detector = VoiceDetector()