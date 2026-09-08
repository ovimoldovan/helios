# ADR 007: AI-Generated Image Detection via Seeagle Assistant

## Context
Users upload photos when creating reports. To prevent spam and fake submissions, moderators need to know if an uploaded photo is authentic or AI-generated. We need a way to scan incoming images, calculate an AI-confidence score, and save it in the database for moderator review.

## Decision
We will delegate AI image detection to the new Python microservice (Seeagle Assistant). The C# backend will route the image to the Assistant before processing it further.

### The Workflow:

1. **Report Uploading:** User submits a report with an image.
2. **Image Uploading:** The C# backend receives the image.
3. **Seeagle Assistant Analysis:** C# backend sends the raw image to Seeagle Assistant. The Assistant analyzes the image for AI generation signatures and returns a unified Confidence Score.
4. **Data Persistence:** The score is saved to the PostgreSQL database on the Report entity so it can be displayed on the Moderator Dashboard.
5. **Processing:** The C# backend proceeds with standard image resizing.
6. **Storage:** The resized image is saved to disk/object storage.

## Methods Evaluated

### 1. C2PA / Content Credentials (Selected)
* **Description:** Cryptographic metadata standard adopted by the Coalition for Content Provenance and Authenticity (Adobe, OpenAI, Microsoft, Midjourney)
* **Why we will use it:** It is the industry standard. If an image has C2PA metadata, we can determine with near 100% certainty what tool generated it. It is incredibly fast to check computationally.

### 2. Google SynthID Watermarking (Selected)
* **Description:** Google's proprietary technology that embeds imperceptible digital watermarks directly into the pixels of AI-generated images (e.g., from Gemini or Imagen).
* **Why we will use it:** Unlike EXIF metadata which can be maliciously stripped by users, SynthID survives cropping, resizing, and compression. It provides a highly reliable check for Google-ecosystem images.

### 3. Noise Inconsistency Analysis / Digital Forensics (Future Consideration)
* **Description:** Analyzing the pixel noise distribution across different regions of the image to spot spliced or unnaturally smooth areas.
* **Why it is a secondary method:** While computationally fast, modern smartphones use heavy "computational photography" (auto-denoising and stitching) which causes high false-positive rates.

### 4. Deep Learning Classification Models (e.g., Hugging Face) (Future Consideration)
* **Description:** Convolutional Neural Networks (CNNs) trained to spot visual artifacts in AI images.
* **Why it is a secondary method:** Running deep learning inference on every uploaded image is computationally expensive and introduces significant latency.

## Architecture & Implementation Details

### Scoring Engine (Confidence Score) 
The Seeagle Assistant will calculate and return an AiConfidenceScore  for every uploaded photo.
