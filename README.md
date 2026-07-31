# Aroko-AI
AI-powered platform that transforms ideas into high-quality creative content in minutes.

# Aroko AI

> AI-powered creative content generation platform that transforms a single idea into complete marketing content in seconds.

![Aroko AI](./assets/banner.png)

---

## Overview

Aroko AI is an intelligent creative assistant designed to streamline the content creation process for entrepreneurs, startups, marketers, agencies, and content creators.

The platform leverages Large Language Models (LLMs) to transform a simple business idea into a complete content package, including creative briefs, marketing copy, social media content, SEO assets, and campaign suggestions.

Developed for the **IBM AI Builders Challenge**, Aroko AI demonstrates how artificial intelligence can significantly reduce the time and effort required to produce high-quality marketing content while maintaining creativity and consistency.

---

## Problem Statement

Creating professional marketing content is often expensive, time-consuming, and requires expertise across multiple disciplines including copywriting, branding, SEO, and social media strategy.

Many small businesses, creators, and startups lack the resources to produce consistent, engaging content at scale.

Existing AI tools typically focus on a single task, forcing users to switch between multiple platforms to complete one workflow.

---

## Solution

Aroko AI provides a unified AI-powered workspace that converts a single creative idea into a comprehensive marketing package within minutes.

Users simply describe their idea, select their preferred tone and audience, and receive structured content ready for immediate use across digital platforms.

The platform centralizes the creative workflow, reducing manual effort while improving productivity and content quality.

---

## Key Features

- Secure user authentication with Supabase
- AI-powered content generation
- Creative brief generation
- Marketing copy creation
- Product descriptions
- Social media captions
- Campaign concepts
- SEO keyword suggestions
- Hashtag generation
- Project management dashboard
- Project history and persistence
- Responsive modern user interface
- Dark mode optimized design

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- shadcn/ui

### Backend

- FastAPI
- Python
- Pydantic
- SQLAlchemy

### Authentication

- Supabase Authentication

### Database

- PostgreSQL (Supabase)

### Artificial Intelligence

- Google Gemini API

### Development Tools

- IBM Bob
- Git
- GitHub

---

## System Architecture

```text
                User
                  │
                  ▼
        Next.js Frontend
                  │
                  ▼
          FastAPI Backend
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
 Supabase Auth          Gemini API
      │                       │
      ▼                       ▼
 PostgreSQL            Generated Content
```

---

## Repository Structure

```
Aroko-AI
│
├── Frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── lib
│   ├── public
│   └── types
│
├── Backend
│   ├── api
│   ├── config
│   ├── domain
│   ├── infrastructure
│   ├── services
│   └── main.py
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm
- Git
- Supabase Project
- Google Gemini API Key

---

### Clone the Repository

```bash
git clone https://github.com/Ahmedscreativeverse/Aroko-AI.git

cd Aroko-AI
```

---

## Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Application runs on:

```
http://localhost:3000
```

---

## Backend Setup

```bash
cd Backend

python -m venv .venv
```

Activate the virtual environment.

Windows

```bash
.venv\Scripts\activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run the development server.

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```
http://localhost:8000
```

---

## Environment Variables

### Frontend

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

NEXT_PUBLIC_API_URL=
```

### Backend

```env
SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_JWT_SECRET=

DATABASE_URL=

GEMINI_API_KEY=
```

---

## Application Workflow

1. User creates an account or signs in.
2. A new project is created.
3. The user describes a creative idea.
4. The request is sent securely to the FastAPI backend.
5. Gemini generates structured marketing content.
6. Results are stored in Supabase.
7. Users can revisit previous projects and generated content.

---

## IBM AI Builders Challenge

This project was developed as part of the **IBM AI Builders Challenge** under the theme:

> **Reimagine Creative Industries with AI**

The project demonstrates how modern AI can simplify content creation by transforming a single idea into production-ready marketing assets.

IBM Bob was used throughout the software development lifecycle to accelerate engineering, debugging, architecture planning, and feature implementation.

---

## Future Roadmap

- Multi-language support
- Team collaboration
- AI image generation
- AI video script generation
- Brand identity generation
- Social media publishing
- Content calendar
- Analytics dashboard
- Content version comparison
- AI-powered content refinement

---

## Team

**Ahmed Olugbasa**

Software Engineer | AI Builder

GitHub: https://github.com/Ahmedscreativeverse

---

## License

This project is released under the MIT License.

---

## Acknowledgements

Special thanks to:

- IBM AI Builders Challenge
- IBM Bob
- Google Gemini
- Supabase
- Next.js
- FastAPI
- The Open Source Community

---

> **Aroko AI — Empowering creators to transform ideas into impactful content through artificial intelligence.**
