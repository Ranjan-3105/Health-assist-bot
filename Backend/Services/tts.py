from gtts import gTTS
import uuid
import os

def text_to_speech(text: str, lang: str = 'hi') -> str:
    filename = f"tts_{uuid.uuid4().hex}.mp3"
    path = os.path.join("tts_output", filename)
    os.makedirs("tts_output", exist_ok=True)
    tts = gTTS(text=text, lang=lang)
    tts.save(path)
    return path