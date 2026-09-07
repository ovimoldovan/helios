from fastapi import FastAPI

app = FastAPI(title="SeeagleAssistant")


@app.get("/")
def root():
    return {"message": "Hello from SeeagleAssistant"}
