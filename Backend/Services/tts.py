# import os
# import uuid
# from dotenv import load_dotenv
# from sarvamai import SarvamAI
# from sarvamai.play import save

# load_dotenv()

# client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY")) 

# def text_to_speech(text: str, lang: str = "od-IN") -> str:
#     filename = f"tts_{uuid.uuid4().hex}.wav"
#     output_dir = "tts_output"
#     os.makedirs(output_dir, exist_ok=True)
#     output_path = os.path.join(output_dir, filename)

#     tts = client.text_to_speech.convert(
#         text=text,
#         target_language_code=lang,
#         speaker="hitesh",
#         enable_preprocessing=True,
#     )

#     save(tts, output_path)
#     return output_path



import os
import uuid
from dotenv import load_dotenv
from sarvamai import SarvamAI
from sarvamai.play import save
from fastapi import HTTPException
import re

load_dotenv()

client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))

# Supported languages
SUPPORTED_LANGUAGES = {
    "bn-IN", "en-IN", "gu-IN", "hi-IN", "kn-IN", 
    "ml-IN", "mr-IN", "od-IN", "pa-IN", "ta-IN", "te-IN"
}



def clean_text_for_tts(text: str) -> str:
    # Remove markdown bullets
    text = re.sub(r'[*•]', '', text)
    # Add space after numbers like "1." or "2."
    text = re.sub(r'(\d+)\.', r'\1.', text)
    # Replace colons with short pauses
    text = text.replace(":", ",")
    # Remove excessive whitespace
    text = re.sub(r'\s{2,}', ' ', text)
    # Trim trailing English notes
    text = re.split(r"Please note", text)[0]
    return text.strip()


def text_to_speech(text: str, lang: str = "od-IN") -> str:
    if lang not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language code '{lang}'. Must be one of {', '.join(SUPPORTED_LANGUAGES)}"
        )

    # 🧼 Clean the input before TTS
    cleaned_text = clean_text_for_tts(text)

    filename = f"tts_{uuid.uuid4().hex}.wav"
    output_dir = "tts_output"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, filename)

    tts = client.text_to_speech.convert(
        text=cleaned_text,  # 👈 use cleaned_text instead of raw text
        target_language_code=lang,
        speaker="hitesh", 
        enable_preprocessing=True,
    )

    save(tts, output_path)
    return output_path
