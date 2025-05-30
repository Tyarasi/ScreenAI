# 🤖 Resume Screener AI – Intelligent CV Filtering & Analytics

An offline/local-first application to automatically screen multiple CVs based on a Job Description (JD), generate skill gap analysis, ATS score, and visual analytics.

## 🧰 Tech Stack

### 🖥️ Frontend
- **Next.js** – For modern SPA dashboard
- **Tailwind CSS** – For responsive UI styling
- **ShadCN UI / Recharts** – Clean UI + analytics chart components
- **Zustand** – Simple global state management
- **React Query** – For data fetching
- **React Hook Form** – For form management
- **Zod** – For data validation

### ⚙️ Backend
- **Next.js API Routes** – REST API for document processing
- **LangChain.js / Python** – Orchestration of LLM + embedding logic (planned)
- **Python libraries** (planned):
  - `spaCy` – For NLP preprocessing
  - `scikit-learn` – For similarity scoring & gap detection
  - `wordcloud` – To generate skill-based word cloud
  - `pdfminer.six`, `docx`, `textract` – For parsing CV files

### 🧠 AI Models (planned)
- **LLM (via Ollama)** – e.g., `Mistral`, `LLaMA3` for JD understanding & summary
- **Embeddings** – `bge-m3` or `Instructor-XL` for skill matching
- **Local Sentence Transformer** – For similarity scoring between JD & CV

### 📦 Storage & Processing (planned)
- **ChromaDB** – Local vector DB for semantic CV search
- **SQLite / LowDB** – User data, logs, job postings
- **Local File System** – For CV uploads and metadata

## 📂 Key Features

- 📝 Upload multiple CVs (PDF, DOCX, TXT)
- 📌 Input single Job Description text
- 📈 Sort candidates based on:
  - Semantic similarity (LLM embeddings)
  - Keyword match
  - Skill gap (missing from CV)
  - ATS readiness score
- 📊 Word cloud of skill frequencies
- 🧠 Auto-summary of top candidates

## 🔒 Offline-Ready
- All models run locally (no API keys needed)
- CVs and job data never leave user's device

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- For full functionality (planned): Python 3.9+ with pip

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/screen-ai.git
cd screen-ai
```

2. Install dependencies
```bash
pnpm install
```

3. Create uploads directory
```bash
mkdir -p public/uploads
```

4. Run the development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Future Enhancements

- Export filtered candidates to CSV
- Compare 2 CVs head-to-head
- Add resume builder/editor for rejected candidates
- Integration with local LLM models via Ollama
