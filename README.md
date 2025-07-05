# 🩺 Village Health Assistant Bot 

AI-powered multilingual health assistant for rural communities, powered by 
-Gemini 
-SarvamAI
-Built with FastAPI + React 
-Supports Speech ↔️ Text in Odia & English
-Deployable via Firebase

# [Features]

| Capability | Description |
|------------|-------------|
| **Voice Input** | Users can speak in our regional languages  Odia and the bot will understand |
| **English Translation** | Gemini handles accurate speech-to-text and translation(Odia <->English) |
| **Natural Voice Output** | Text responses are turned into realistic speech using SarvamAI |
| **Contextual Chat** | Easily integrate Gemini for personalized answers |
| **Frontend + Backend** | React + FastAPI architecture with modular `Services/` |
| **Firebase Ready** | Comes with REST APIs ready to deploy on Firebase Cloud Functions |

---

# [Tech Stack]
           -img here-
- **Backend**: FastAPI (Python)
- **AI**: Google Gemini 2.5 (Speech-to-text + LLM), SarvamAI (TTS)
- **Audio**: `.mp3` uploads, `.wav` synthesis
- **Frontend**: React
- **Secure Config**: `.env` file for API keys
- **Deployment**: Firebase / Cloud Functions

---

# Project Structure
            -img here-
  village-health-assistant/
  │
  ├── Services/
  │ ├── stt.py # Speech to text using Gemini
  │ ├── tts.py # Text to speech using SarvamAI
  │
  ├── tts_output/ # Stores generated audio files
  ├── mps_TEST/ # Test MP3 files
  ├── main.py # API routes (Firebase or FastAPI)
  ├── .env # API keys
  └── README.md

# How It Works
               -img here-

1. **User speaks** → uploaded `.mp3`
2. **Gemini** transcribes and translates to English
3. **LLM** generates a smart response
4. **SarvamAI** converts text to regional voice
5. **Response** is returned via API or UI

---

## Quick Start

###  1. Clone the Repo

```bash
git clone https://github.com/your-username/village-health-assistant.git
cd village-health-assistant