from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse
import os
from Services.openrouter import ask_agent
from Services.tts import text_to_speech
from Services.stt import speech_to_text


app = FastAPI()

origins = ["http:/localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    message: str
    language: str

# text - to - speech
@app.post("/api/ask")
async def handle_query(query: Query):
    reply = await ask_agent(query.message, query.language)
    lang_code = "hi" if query.language == "Hindi" else "or"
    audio_path = text_to_speech(reply, lang=lang_code)
    return {"reply": reply, "audio_path": f"/api/audio/{os.path.basename(audio_path)}"}

@app.get("/api/audio/{filename}")
def get_audio(filename: str):
    path = os.path.join("tts_output", filename)
    return FileResponse(path, media_type="audio/mpeg", filename=filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)