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

        reader = c2pa.Reader.from_file(tmp_path)
        manifest = reader.get_active_manifest()

        if manifest is None:
            return {
                "aiProbability": 0.0,
                "detectionMethod": "none",
                "details": "No C2PA manifest found",
            }

        claim_generator = manifest.get("claim_generator", "").lower()
        title = manifest.get("title", "").lower()
        combined = f"{claim_generator} {title}"

        is_ai = any(gen in combined for gen in AI_GENERATORS)

        return {
            "aiProbability": 0.95 if is_ai else 0.05,
            "detectionMethod": "c2pa",
            "details": f"C2PA claim generator: {claim_generator}" if claim_generator else "C2PA manifest found (no generator info)",
        }

    except Exception as e:
        error_msg = str(e)
        
        # If it crashed trying to parse CBOR metadata, it means the image DOES have 
        # C2PA metadata embedded (which almost exclusively comes from AI generators right now).
        # We can treat this as a positive detection even if the parser couldn't read the exact generator name.
        if "CBOR" in error_msg or "cbor" in error_msg:
            return {
                "aiProbability": 0.95,
                "detectionMethod": "c2pa_cbor_fallback",
                "details": "AI metadata found but could not be fully parsed (CBOR format)"
            }
            
        return {
            "aiProbability": 0.0,
            "detectionMethod": "none",
            "details": f"Error or no manifest: {error_msg}",
        }
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass
