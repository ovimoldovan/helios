from fastapi import FastAPI

app = FastAPI(title="SeeagleAssistant")


@app.get("/")
def root():
    return {"message": "Hello from SeeagleAssistant"}


@app.get("/health")
def health():
    return {"status": "ok"}