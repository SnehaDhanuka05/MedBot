<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-r175-000000?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

# 🫀 Somatic — AI Health Companion

> An interactive, voice-enabled HealthTech web app with a 3D human body model and AI-powered educational health guidance.

**Somatic** lets users click on regions of a 3D human body (head, chest, stomach), describe their symptoms via voice or text, and receive educational health information powered by Google's Gemini AI — all wrapped in a stunning glassmorphism UI.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Architecture Deep Dive](#-architecture-deep-dive)
- [Component Reference](#-component-reference)
- [3D Models](#-3d-models)
- [API Integration](#-api-integration)
- [Known Limitations](#-known-limitations)
- [What's Next / TODO](#-whats-next--todo)
- [Contributing](#-contributing)

---

## ✨ Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🎨 Glassmorphism UI | ✅ Done | Animated gradient background, frosted-glass panels, translucent borders |
| 🧍 3D Body Model | ✅ Done | Interactive male/female GLB models with auto-scaling to viewport |
| 🖱️ Clickable Body Parts | ✅ Done | Invisible hitboxes on head, chest, stomach with hover/select effects |
| 🎙️ Voice Input | ✅ Done | Browser SpeechRecognition API for mic-to-text symptom entry |
| 🔊 Voice Output | ✅ Done | SpeechSynthesis reads AI responses aloud (with mute toggle) |
| 🤖 Gemini AI Chat | ✅ Done | Structured health Q&A via Google Gemini 2.0 Flash |
| 📋 Consent Flow | ✅ Done | Mandatory disclaimer modal before app usage |
| ♂️♀️ Gender Toggle | ✅ Done | Switch between male/female 3D models from the header |
| 🎭 Framer Motion | ✅ Done | Smooth transitions, floating bot animation, entrance effects |
| 📱 Responsive 3D | ✅ Done | Model auto-scales based on viewport dimensions |

---

## 🛠 Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19.x | Component-based UI |
| **Bundler** | Vite | 8.x | Fast HMR dev server |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS (via `@tailwindcss/vite`) |
| **3D Engine** | Three.js | r175+ | WebGL 3D rendering |
| **3D React** | @react-three/fiber | 9.x | React renderer for Three.js |
| **3D Helpers** | @react-three/drei | 10.x | OrbitControls, useGLTF, Html overlays |
| **Animation** | Framer Motion | 12.x | UI animations and transitions |
| **Icons** | Lucide React | latest | Consistent icon set |
| **AI** | @google/generative-ai | latest | Gemini API SDK |
| **Voice Input** | Web Speech API | native | `SpeechRecognition` / `webkitSpeechRecognition` |
| **Voice Output** | Web Speech API | native | `SpeechSynthesis` |

---

## 📁 Project Structure

```
MedBot/
├── public/
│   ├── male.glb              # 3D male body model (~950KB)
│   └── female.glb            # 3D female body model (~870KB)
│
├── server/
│   ├── chatHandler.js        # Shared Gemini logic: validation, prompt, parse
│   └── index.js              # Express API server for local development
│
├── api/
│   └── chat.js               # Vercel serverless entry (production)
│
├── src/
│   ├── main.jsx              # App entry point, wraps with AppProvider
│   ├── App.jsx               # Main layout: Header, Footer, ConsentModal, MainInterface
│   ├── index.css             # Tailwind v4 imports, custom animations, global styles
│   │
│   ├── context/
│   │   └── AppContext.jsx    # React Context: gender, selectedBodyPart, isAgreed
│   │
│   └── components/
│       ├── BodyCanvas.jsx    # Three.js canvas, model loading, auto-scaling, hitboxes
│       └── FloatingBot.jsx   # AI chat panel, voice I/O, /api/chat integration
│
├── .env                      # Server-only GEMINI_API_KEY (gitignored)
├── .env.example              # Template for environment variables
├── index.html                # HTML entry with Inter font & SEO meta
├── vite.config.js            # Vite + React + Tailwind + /api dev proxy
├── vercel.json               # Vercel deploy config (static + serverless API)
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A modern browser (Chrome/Edge recommended for Speech API support)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SnehaDhanuka05/MedBot.git
cd MedBot

# 2. Install dependencies
npm install

# 3. Copy environment template and add your Gemini API key
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here

# 4. Start the full stack (API server + Vite dev server)
npm run dev:all
```

The app will open at `http://localhost:5173/` (or the next available port). The Vite dev server proxies `/api/*` requests to the Express server on port 3001.

**Frontend only** (no AI chat — useful for UI/3D work):

```bash
npm run dev
```

**API server only**:

```bash
npm run server
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key (server-only — never use `VITE_` prefix) | ✅ Yes |
| `PORT` | Express server port for local dev (default: `3001`) | No |
| `CORS_ORIGIN` | Allowed origin for local API server (default: `http://localhost:5173`) | No |

Copy `.env.example` to `.env` and set your key locally. **Never commit `.env`** — it is gitignored. For production, set `GEMINI_API_KEY` in your Vercel project settings.

If a key was previously committed or exposed in the browser bundle, **rotate it** in [Google AI Studio](https://aistudio.google.com/app/apikey) before deploying.

---

## 🧠 How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  User clicks  │────▶│  Body part   │────▶│  selectedBodyPart │
│  3D hitbox    │     │  detected    │     │  set in Context   │
└──────────────┘     └──────────────┘     └────────┬─────────┘
                                                    │
┌──────────────┐     ┌──────────────┐              │
│  User speaks  │────▶│  Speech-to-  │              │
│  or types     │     │  Text (STT)  │              │
└──────────────┘     └──────┬───────┘              │
                            │                       │
                            ▼                       ▼
                    ┌───────────────────────────────────┐
                    │        Gemini API Prompt          │
                    │  "User clicked {bodyPart} and     │
                    │   said: {symptoms}..."            │
                    └───────────────┬───────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────────┐
                    │     Gemini 2.0 Flash Response     │
                    │  {                                │
                    │    educational_summary: "...",    │
                    │    wellness_tips: ["...", "..."], │
                    │    disclaimer: "..."              │
                    │  }                                │
                    └───────────────┬───────────────────┘
                                    │
                          ┌─────────┴─────────┐
                          ▼                   ▼
                  ┌──────────────┐   ┌──────────────┐
                  │  Display in  │   │  Read aloud  │
                  │  chat card   │   │  via TTS     │
                  └──────────────┘   └──────────────┘
```

### User Flow

1. **Consent Modal** → User reads disclaimer and clicks "I Understand & Agree"
2. **3D Model** → Interactive body appears; user rotates/zooms with mouse
3. **Select Body Part** → Click head, chest, or stomach (hitbox highlights)
4. **Describe Symptoms** → Use mic button or type in the chat input
5. **AI Response** → Gemini returns structured JSON displayed as a health card
6. **Voice Output** → Response is read aloud (toggle mute in chat header)

---

## 🏗 Architecture Deep Dive

### State Management — `AppContext.jsx`

Three pieces of global state shared across all components:

```jsx
{
  gender: 'male' | 'female',       // Which 3D model to load
  selectedBodyPart: string | null,  // 'head' | 'chest' | 'stomach' | null
  isAgreed: boolean,                // Has user accepted the disclaimer?
}
```

### 3D Rendering Pipeline — `BodyCanvas.jsx`

```
Canvas (react-three-fiber)
  │
  ├── Lights (ambient + 2x directional + point)
  │
  ├── AutoScaledModel
  │   ├── Loads GLB via useGLTF()
  │   ├── Computes bounding box
  │   ├── Scales to 75% of viewport height
  │   └── Reports dimensions to parent for hitbox positioning
  │
  ├── BodyHitbox × 3 (head, chest, stomach)
  │   ├── Invisible box meshes
  │   ├── onClick → setSelectedBodyPart()
  │   ├── onPointerOver → cursor + opacity hint
  │   └── Selection → animated glow + HTML label
  │
  └── OrbitControls (pan disabled, zoom limited)
```

**Key design decision**: Hitboxes are **dynamically positioned** based on the model's actual bounding box. When the viewport resizes, the model rescales, and hitboxes reposition automatically.

### AI Chat Pipeline — `FloatingBot.jsx`

```
User Input (voice or text)
    │
    ▼
Construct Prompt
    │  "You are 'Somatic'... The user clicked their {bodyPart}
    │   and said: {text}. Output strictly as JSON..."
    ▼
GoogleGenerativeAI SDK
    │  model: 'gemini-2.0-flash'
    ▼
Parse JSON from response
    │  Regex extract: /\{[\s\S]*\}/
    ▼
Render HealthResponseCard
    │  ├── educational_summary
    │  ├── wellness_tips[]
    │  └── disclaimer
    ▼
SpeechSynthesis.speak()
```

---

## 📦 Component Reference

### `<App />` — `src/App.jsx`

The root component. Renders:
- **Animated gradient background** (indigo → purple → emerald, cycling via CSS animation)
- **`<Header />`** — Logo + gender toggle (♂ Male / ♀ Female)
- **`<ConsentModal />`** — Shown when `isAgreed === false`
- **`<MainInterface />`** — Shown when `isAgreed === true` (contains BodyCanvas + body part indicator)
- **`<Footer />`** — "Meet the Team" and "About Us" links
- **`<FloatingBot />`** — Always rendered, animates position based on consent state

### `<BodyCanvas />` — `src/components/BodyCanvas.jsx`

| Prop | Type | Description |
|------|------|-------------|
| *(none)* | — | Reads `gender` from AppContext |

Key internals:
- **`AutoScaledModel`** — Loads GLB, computes bounding box, scales to fit viewport
- **`BodyHitbox`** — Invisible interactive mesh with hover/select states
- **`SceneContent`** — Orchestrates model + hitboxes + lights + controls inside Canvas

### `<FloatingBot />` — `src/components/FloatingBot.jsx`

| Feature | Implementation |
|---------|---------------|
| Position animation | Framer Motion variants: `center` → `corner` |
| Speech input | `webkitSpeechRecognition` with interim results |
| Speech output | `SpeechSynthesis` with preferred voice selection |
| AI backend | `@google/generative-ai` → `gemini-2.0-flash` |
| Response display | `HealthResponseCard` sub-component |

---

## 🧍 3D Models

The app loads two GLB files from the `public/` directory:

| File | Size | Description |
|------|------|-------------|
| `male.glb` | ~950 KB | Male human body mesh |
| `female.glb` | ~870 KB | Female human body mesh |

**Fallback behavior**: If GLB files fail to load, the app renders a stylized purple capsule mesh with wireframe overlay — so the app never crashes from missing models.

**Auto-scaling**: Models are automatically scaled based on:
1. Compute bounding box of the loaded mesh
2. Calculate scale factor to fill 75% of viewport height
3. Constrain to 40% of viewport width
4. Position feet near bottom of viewport
5. Dynamically reposition hitboxes based on actual model dimensions

---

## 🤖 API Integration

### Gemini Prompt Template

```
You are 'Somatic', an educational health companion.
The user clicked their [bodyPart] and said: "[userSpeech]".
Provide a short, educational summary of what might cause this
discomfort, and 2 general wellness tips.

You MUST output strictly as a JSON object with keys:
  'educational_summary', 'wellness_tips' (array), and 'disclaimer'.

You are NOT a doctor. Ensure the disclaimer explicitly states
you are an AI and they must see a medical professional.
```

### Expected Response Format

```json
{
  "educational_summary": "Tension headaches are often caused by...",
  "wellness_tips": [
    "Practice regular neck stretches...",
    "Ensure adequate hydration..."
  ],
  "disclaimer": "I am an AI assistant, not a medical professional..."
}
```

---

## ⚠️ Known Limitations

| Issue | Details |
|-------|---------|
| **Speech API** | Only works in Chromium-based browsers (Chrome, Edge). Firefox/Safari have limited support. |
| **Hitbox alignment** | Hitboxes are positioned based on bounding-box math. Different model geometries may need tuning. |
| **API Key in .env** | Included for team convenience. **Must be rotated before any public deployment.** |
| **No backend** | All API calls go directly from the browser. Rate limiting depends on Gemini API quotas. |
| **No chat history persistence** | Messages are lost on page refresh. |

---

## 🗺 What's Next / TODO

- [ ] Add more body regions (arms, legs, back, neck)
- [ ] Implement chat history persistence (localStorage or backend)
- [ ] Add user authentication
- [ ] Build a proper backend to proxy Gemini API calls (hide API key)
- [ ] Add symptom severity selector (mild / moderate / severe)
- [ ] Implement "Meet the Team" and "About Us" page content
- [ ] Add dark/light theme toggle
- [ ] Mobile touch support for 3D model interaction
- [ ] Add loading skeleton states
- [ ] Unit tests with Vitest
- [ ] Deploy to Vercel/Netlify

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test locally: `npm run dev`
4. Commit: `git commit -m "feat: your feature description"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

---

<p align="center">
  <strong>⚕️ Disclaimer</strong>: Somatic is an educational tool, not a medical device. Always consult a healthcare professional for medical advice.
</p>
