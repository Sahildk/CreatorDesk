<div align="center">

# 🎯 CreatorDesk

### AI-Powered Influencer Campaign Dashboard

An intelligent dashboard that replaces slow, manual Google Sheets workflows with real-time AI scoring, one-click creator classification, and drag-and-drop shortlist management.

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-Click_Here-violet?style=for-the-badge)](https://your-demo-link.vercel.app)
[![Loom Video](https://img.shields.io/badge/🎥_Loom_Walkthrough-Watch_Now-blue?style=for-the-badge)](https://your-loom-link.com)

---

### Built With

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433D37?style=for-the-badge&logo=react&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

</div>

---

## 📌 The Problem

Marketing teams operate on Google Sheets with creator databases that are:
- **Unstructured** — no consistent schema across rows
- **Incomplete** — missing emails, phone numbers, secondary niches
- **Slow to vet** — manually scrolling through hundreds of rows to find the right creator for a campaign

**CreatorDesk** solves this by providing a structured dashboard workflow with AI-powered creator discovery — while still keeping Google Sheets as a backend via CSV import/export.

---

## ✨ Features

### 🎪 Campaign Management
- Create campaigns with **mandatory** Campaign Code, Name, and Target Niches
- Select existing campaigns to resume work
- Edit or archive campaigns anytime

### 🤖 AI-Powered Creator Discovery
- **Relevance Scoring Engine (0–100)** — ranks every creator against the active campaign in real-time
- **AI Top Picks** — automatically surfaces the top 3 best-matched creators
- **AI Picks Only** toggle — narrows the grid to top 5 creators by relevance
- Sort by Relevance, Followers, Engagement Rate, or Cost

### 🧠 How the AI Scoring Works

| Component | Weight | Logic |
|---|---|---|
| **Niche Match** | 40 pts | Primary niche = 40, Secondary = 20, Tag overlap = 10 |
| **Engagement Rate** | 30 pts | Normalized per-platform (IG avg: 3%, YT avg: 5%, Twitter avg: 2%) |
| **Follower Tier** | 20 pts | 500K+ = 20, 100K+ = 15, 50K+ = 10, below = 5 |
| **Profile Completeness** | 10 pts | Penalizes missing email, phone, secondary niche, city |

> 💡 This is a **deterministic, real-time** scoring model — no API calls, no loading spinners. Runs entirely in-browser for instant results.

### 🏷️ Creator Classification
- One-click actions: **Shortlisted** ✅ / **Backup** ⏳ / **Rejected** ❌
- Classifications are campaign-specific (same creator can have different statuses across campaigns)

### 📋 Shortlist Manager (Kanban Board)
- Visual Kanban with three columns: Shortlisted, Backup, Rejected
- **Drag-and-drop** to move creators between columns
- Live **budget estimation** based on shortlisted creators' cost-per-post
- **CSV Export** for sharing shortlists back to the team

### 📊 Analytics Dashboard
- Total database size, active campaigns, average engagement rate
- **Profile Completeness** score across the entire database
- **Platform Distribution** with visual progress bars
- **Campaign Funnels** — stacked bar showing shortlisted vs. backup vs. rejected per campaign

### 📗 Google Sheets Integration
- **Import**: Paste a published Google Sheets CSV link → auto-parsed and merged into the database
- **Export**: Download clean CSV of shortlisted creators → import back into Sheets
- Column mapping handles the messy original schema automatically

### 🔍 Advanced Filtering
- Filter by Platform (Instagram, YouTube, Twitter)
- Filter by Niches (14 categories)
- Minimum Followers slider
- All filters apply in real-time with zero latency

### 🛡️ Bonus AI Features
- **Incomplete Profile Detection** — flags missing contact info with amber warnings on each card
- **Auto-tagging** — generates tags from platform, niche, and language data
- **Profile Scoring** — computes a completeness score per creator

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/CreatorDesk.git
cd CreatorDesk

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
CreatorDesk/
├── public/
│   └── creators.json          # Cleaned & structured creator database
├── src/
│   ├── components/
│   │   ├── AIRecommendations.tsx    # AI Top Picks section
│   │   ├── CampaignModal.tsx        # Create/Edit campaign dialog
│   │   ├── CreatorCard.tsx          # Creator profile card with actions
│   │   ├── FilterSidebar.tsx        # Advanced filter panel
│   │   ├── SheetsSync.tsx           # Google Sheets import/export
│   │   ├── layout/Layout.tsx        # App shell with sidebar & topbar
│   │   └── ui/                      # shadcn/ui primitives
│   ├── lib/
│   │   ├── ai/scorer.ts             # 🧠 AI scoring engine
│   │   └── csvUtils.ts              # CSV parse/export utilities
│   ├── pages/
│   │   ├── Campaigns.tsx            # Campaign Hub
│   │   ├── Creators.tsx             # Creator Discovery
│   │   ├── Shortlist.tsx            # Kanban Shortlist Manager
│   │   └── Analytics.tsx            # Analytics Dashboard
│   ├── store/useAppStore.ts         # Zustand state management
│   └── types/index.ts               # TypeScript interfaces
└── dataset.xlsx                     # Original unstructured dataset
```

---

## 🎨 Design Philosophy

- **Dark theme** with violet accent gradients for a premium B2B SaaS feel
- **Glassmorphism** — backdrop blur and translucent cards
- **Micro-interactions** — hover effects, smooth transitions, animated entries
- **Information density** — show key metrics at a glance without overwhelming

---

## 📝 License

This project was built as part of an AI internship assignment. Feel free to reference it for learning purposes.

---

<div align="center">

**Built with ☕ and AI assistance**

</div>
