import os
import tempfile

from fastapi import FastAPI, File, UploadFile, Header, HTTPException
import c2pa

app = FastAPI(title="SeeagleAssistant")

SERVICE_TOKEN = os.environ.get("SERVICE_TOKEN", "seeagle-shared-secret-2026")

AI_GENERATORS = [
    "dall-e", "midjourney", "stable diffusion", "firefly",
    "imagen", "gemini", "copilot", "bing image creator",
    "leonardo", "playground", "ideogram",
]


def verify_token(x_service_token: str = Header(...)):
    if x_service_token != SERVICE_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid service token")


@app.get("/")
def root():
    return {"message": "Hello from SeeagleAssistant"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/detect-ai")
async def detect_ai(
    file: UploadFile = File(...),
    x_service_token: str = Header(...),
):
    verify_token(x_service_token)

    contents = await file.read()

    try:
        _, ext = os.path.splitext(file.filename)
        if not ext:
            ext = ".jpg"

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        reader = c2pa.Reader.try_create(tmp_path)
    
        if reader is None:
            return {
                "aiProbability": 0.0,
                "detectionMethod": "none",
                "details": "No C2PA manifest found",
            }

        manifest = reader.get_active_manifest()

        if manifest is None:
            return {
                "aiProbability": 0.0,
                "detectionMethod": "none",
                "details": "No active manifest found",
            }
        
        manifest_str = str(manifest).lower()

        has_ai_flag = "trainedalgorithmicmedia" in manifest_str
        has_ai_generator = any(gen in manifest_str for gen in AI_GENERATORS)

        is_ai = has_ai_flag or has_ai_generator

        return {
            "aiProbability": 0.95 if is_ai else 0.05,
            "detectionMethod": "c2pa",
            "details": "C2PA manifest found (AI signature detected)" if is_ai else "C2PA manifest found (No AI signature)",
        }

    except Exception as e:
        return {
            "aiProbability": 0.0,
            "detectionMethod": "none",
            "details": f"Error: {str(e)}",
        }
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass
