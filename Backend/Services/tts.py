import os
import uuid
import re
from dotenv import load_dotenv
from fastapi import HTTPException
from sarvamai import SarvamAI
from sarvamai.play import save

# Load environment variables
load_dotenv()

client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))

# Supported languages
SUPPORTED_LANGUAGES = {
    "bn-IN", "en-IN", "gu-IN", "hi-IN", "kn-IN",
    "ml-IN", "mr-IN", "od-IN", "pa-IN", "ta-IN", "te-IN"
}


def clean_text_for_tts(text: str) -> str:
    """
    Clean input text before sending to TTS.
    """
    text = re.sub(r'[*•]', '', text)                # Remove markdown bullets
    text = re.sub(r'(\d+)\.', r'\1.', text)         # Normalize numbered lists
    text = text.replace(":", ",")                   # Replace colons with pauses
    text = re.sub(r'\s{2,}', ' ', text)             # Remove extra spaces
    text = re.split(r"Please note", text)[0]        # Trim trailing notes
    return text.strip()


def text_to_speech(text: str, lang: str = "od-IN") -> str:
    """
    Convert text to speech using SarvamAI TTS.
    Returns path to generated audio file.
    """
    if lang not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language code '{lang}'. "
                   f"Must be one of {', '.join(sorted(SUPPORTED_LANGUAGES))}"
        )

    cleaned_text = clean_text_for_tts(text)

    output_dir = "tts_output"
    os.makedirs(output_dir, exist_ok=True)

    filename = f"tts_{uuid.uuid4().hex}.wav"
    output_path = os.path.join(output_dir, filename)

    try:
        tts = client.text_to_speech.convert(
            text=cleaned_text,
            target_language_code=lang,
            speaker="hitesh",
            enable_preprocessing=True,
        )
        save(tts, output_path)
        return output_path

    except Exception as e:
        print(f"❌ SarvamAI TTS error: {e}")
        raise HTTPException(status_code=500, detail="TTS generation failed")
