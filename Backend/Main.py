from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

from Services.openrouter import ask_agent
from Services.tts import text_to_speech
from Services.stt import speech_to_text

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://saha-ai.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("tts_output", exist_ok=True)

class Query(BaseModel):
    message: str
    language: str

# Voice → STT → LLM → TTS → Return text/audio
@app.post("/api/voice-query")
async def voice_query(language: str, file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        audio_path = os.path.join("tts_output", file.filename)
        with open(audio_path, "wb") as f:
            f.write(await file.read())

        # Speech to Text (English)
        user_prompt = speech_to_text(audio_path)
        if not user_prompt:
            raise HTTPException(status_code=400, detail="Speech transcription failed")

        # Ask agent (respond in local language)
        reply = await ask_agent(user_prompt, language)
        lang_map = {"Hindi": "hi-IN", "Odia": "od-IN"}
        lang_code = lang_map.get(language)
        if not lang_code:
            raise HTTPException(status_code=400, detail="Unsupported language")

        audio_output_path = text_to_speech(reply, lang=lang_code)

        # Clean up input file
        os.remove(audio_path)

        return {
            "reply": reply,
            "audio_path": f"/api/audio/{os.path.basename(audio_output_path)}"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  


# Just ask using text input
@app.post("/api/ask")
async def handle_query(query: Query):
    reply = await ask_agent(query.message, query.language)
    # reply = "ଯଦି ଆପଣ ଭୋକ ଅନୁଭବ କରୁଛନ୍ତି, ତେବେ ଏହା ସାଧାରଣତଃ ଏକ ସଙ୍କେତ ଯେ ଆପଣଙ୍କ ଶରୀରକୁ ଖାଦ୍ୟ ଆବଶ୍ୟକ। " #Sample reply

    lang_map = {"Hindi": "hi-IN", "Odia": "od-IN"}  # <-- fixed
    lang_code = lang_map.get(query.language)
    if not lang_code:
        raise HTTPException(status_code=400, detail="Unsupported language")
    # lang_code = "hi" if query.language == "Hindi" else "or"
    print("📨 Received query:", query.message, "| Language:", query.language)
    audio_path = text_to_speech(reply, lang=lang_code)
    return {"reply": reply, "audio_path": f"/api/audio/{os.path.basename(audio_path)}"}


# Serve audio file
@app.get("/api/audio/{filename}")
def get_audio(filename: str):   
    path = os.path.join("tts_output", filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(path, media_type="audio/wav", filename=filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Main:app", host="127.0.0.1", port=8000, reload=True)