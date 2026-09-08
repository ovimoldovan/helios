# syntax=docker/dockerfile:1

FROM python:3.12-slim AS final

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

# Render (and similar hosts) inject PORT at runtime; default to 8080 for local `docker run`.
ENTRYPOINT ["/bin/sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
