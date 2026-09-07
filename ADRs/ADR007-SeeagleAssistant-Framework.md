# ADR007 - SeeagleAssistant Framework
___
## Status
Proposed

___
## Context
We need a new microservice (SeeagleAssistant) for future AI workloads (image detection, LLM integration). It will be a simple Web API communicating with the main Seeagle backend via REST.

___
## Decision
Use Python with FastAPI for the SeeagleAssistant service. Python has the strongest AI ecosystem available. Libraries like PyTorch, OpenCV, OpenAI SDK, LangChain and Hugging Face are all Python-native. FastAPI auto-generates Swagger docs, has async support and requires minimal boilerplate.

___
## Consequences
Pros: full access to the Python AI ecosystem without workarounds; auto-generated API documentation; lightweight and fast to develop with; industry standard for AI services

Cons: introduces a second language to the project since the main backend uses C#; Python is dynamically typed, so there is no compiler to catch errors early; separate CI/CD pipeline required

___
## Alternatives Considered
- **Java + Spring Boot:** Java has a decent AI ecosystem through Spring AI, LangChain4j and Deep Java Library (DJL). It is a mature framework with strong typing and good performance. However, Java's AI ecosystem is significantly behind Python. Spring Boot is heavier to set up and the language is more verbose.
- **C# / ASP.NET Core:** The main advantage is consistency with the existing backend. Performance is excellent. The major downside is that C# has the weakest AI ecosystem of all options. ML.NET exists but is far behind Python and Java. LLM and image processing SDKs are lagging in C#.
- **Node.js + Express:** It is easy to set up and deploy. Node.js is single-threaded, meaning heavy AI tasks would block the entire service. The AI ecosystem is weak, and for any real AI work it would need to call Python externally.

___
**Date:** 03.09.2026
