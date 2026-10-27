# 畳 | JLPT N4/N5 Washitsu Study App

A mobile-first, zero-scroll Progressive Web Application (PWA) designed for mastering Japanese Language Proficiency Test (JLPT) N4 and N5 vocabulary. Built with a traditional *washitsu* (和室) aesthetic, interactive matching quizzes, and persistent local-first SRS tracking.

---

## ✨ Key Features

- **Spaced Repetition System (SRS):** 
  - Intelligent queue scheduling with radical decomposition on card backs.
  - Strict homophone resolution via unique entry IDs rather than reading-based lookups.
  - Contextual spacing rules for transitive and intransitive verb pairs.

- **5-Word Static-Grid Matching Quiz:**
  - **Two-Way Tap Selection:** Match Japanese terms to English meanings in any order with symmetric touch feedback.
  - **Furigana Display Toggle (`あ/漢`):** Instantly show or hide kana readings above kanji to test raw kanji recognition.
  - **Fixed-Position Grid Layout:** Solved tiles dim (`opacity: 0.35`) and disable interactions *without* reflowing surrounding tiles, preserving spatial memory until the full 5-pair round is solved.
  - **Zero-Scroll Bounds:** Scaled specifically for mobile viewports (`100dvh`) to ensure all 10 tiles fit on screen without scrolling.

- **Washitsu (和室) Aesthetics:**
  - Calming, tactile UI inspired by traditional Japanese interior design, rice paper textures, and natural organic pigments.

- **iOS PWA & Mobile Native Feel:**
  - Standalone PWA integration with custom app icon (`学` emblem on Matcha background), translucent status bar theme, and zero-browser-chrome layout when added to the iPhone Home Screen.

- **Robust Data Persistence:**
  - Synchronous lazy React state initialization and write guards engineered to prevent `localStorage` race conditions on Mobile Safari.

---

## 🎨 Palette & Design System

| Element | Color Name | Hex Code | Primary Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Matcha Green | `#6B7F5E` | Active selection borders, active navigation, header |
| **Accent / Error** | Vermilion Red | `#C84B31` | Error shake feedback, destructive actions, seals |
| **Deep Contrast** | Indigo | `#2B4C6F` | Key UI structural accents, dark typography |
| **Secondary** | Moss Green | `#5B7051` | Progress bars, success state indicators |
| **Surface** | Rice Paper / Cream | `#F4F0EA` / `#F9F6F0` | App background, tile card surfaces |
| **Highlight** | Antique Gold | `#D4AF37` | Solved state borders, milestone indicators |

---

## 🛠 Tech Stack

- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Deployment & Hosting:** Vercel (Automated CI/CD via GitHub `main` branch)
- **State & Storage:** LocalStorage with lazy synchronous initialization

---

## 📱 iOS Home Screen Installation

To install the application as a standalone full-screen app on iPhone:

1. Open your live Vercel URL in **Safari**.
2. Tap the **Share** button (the square icon with the upward arrow at the bottom of the screen).
3. Scroll down and select **Add to Home Screen**.
4. Name the application and tap **Add**.

---

## 🚀 Local Development

```bash
# Clone the repository
git clone [https://github.com/markdavidsondesign/jlpt-washitsu-app.git](https://github.com/markdavidsondesign/jlpt-washitsu-app.git)

# Navigate into project directory
cd jlpt-washitsu-app

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
