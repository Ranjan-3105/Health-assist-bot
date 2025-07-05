import os
import httpx
from dotenv import load_dotenv
from fastapi import HTTPException
import traceback

load_dotenv()

async def ask_agent(message: str, language: str) -> str:
    prompt = f"""
    You are a rural health assistant AI. A user says: '{message}'.
    Explain the problem clearly, offer home care tips, and suggest when to see a doctor.
    Respond in {language} using simple words.
    """

    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 300
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=payload,
                headers=headers
            )
        except httpx.ReadTimeout:
            print("❌ Read timeout occurred")
            raise HTTPException(status_code=504, detail="OpenRouter API timed out.")
        except httpx.RequestError as e:
            print(f"❌ Request error: {str(e)}")
            raise HTTPException(status_code=502, detail=f"Connection error: {str(e)}")
        except Exception as e:
            print("❌ Unexpected exception:\n", traceback.format_exc())
            raise HTTPException(status_code=500, detail="Unexpected error")

    print("✅ Response status:", response.status_code)
    print("✅ Response text:", response.text)

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"OpenRouter API error {response.status_code}: {response.text}"
        )

    data = response.json()

    if "choices" not in data:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected response format from OpenRouter: {data}"
        )

    return data["choices"][0]["message"]["content"]