# JLPT N5 + N4 Vocabulary & Priority Frequency SRS Deck

Expand the JLPT study platform from single kanji flashcards into a comprehensive, frequency-ranked vocabulary and kanji study system integrating both JLPT N5 and N4 datasets with daily SRS batching and multi-level study modes.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been synthesized based on your answers:
> - **CSV Fallback over JSON 404**: The fetch pipeline will first attempt the requested JSON endpoints, immediately and transparently falling back to the repository's native CSV sources (`src/n5.csv` and `src/n4.csv`) and built-in offline caches if CORS or network failures occur.
> - **20–30 Word Daily SRS Batches**: Rather than overwhelming the user with all 600+ items at once, cards are presented in focused 25-card daily batches ordered by test frequency ranking, with full Leitner spaced repetition active within and across batches.
> - **Adaptive Vocabulary & Kanji Display**: Card front-and-back designs adapt dynamically for single kanji, compound kanji words, and kana-only expressions with auto-scaling typography and tailored linguistic breakdowns.

---

## 1. Overview & Core Concept

- **What It Does**: Merges over 600 JLPT N5 and N4 vocabulary words and high-yield kanji items into a unified, frequency-prioritized learning queue. Users can toggle between **"All (N5 + N4)"**, **"N4 Only"**, and **"N5 Review"** modes while studying in bite-sized, 25-card SRS sessions.
- **Target Audience**: JLPT N4 candidates solidifying N5 foundational prerequisites while targeting high-probability N4 grammar verbs (transitive/intransitive pairs, giving/receiving verbs, honorifics, and everyday vocabulary).
- **Key Value**: Eliminates rote alphabetical learning by surfacing exam-critical words first, preventing study fatigue through focused daily batches, and keeping progress synchronized across sessions via `localStorage`.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Mode Selection**: User selects their study focus using a segmented control in the top bar:
   - `All (N5 + N4)` (Default: Core N4 high-yield verbs + N5 prerequisites interleaved by test frequency)
   - `N4 Only` (Focus solely on N4 vocabulary and transitive/intransitive pairs)
   - `N5 Review` (Rapid reinforcement of essential N5 foundations)
2. **Daily Batch Study**: The session loads a focused batch of 25 cards drawn from highest-priority unmastered items.
3. **Card Interaction & Swiping**:
   - **Front**: Clean, uncluttered view showing the word/expression (auto-scaled for readability), JLPT level pill (`N4` or `N5`), SRS level badge, and subtle swipe hints.
   - **Flip & Listen**: Tap card or spacebar to flip. The back reveals phonetic furigana readings (24px+ font), crisp "Listen" natural Japanese audio button (Google 日本語 / Kyoko / Nanami priority), English definition (18px+ font), part-of-speech tags, radical breakdowns (when kanji is present), and example sentences.
   - **SRS Rating**: Tinder-style swipe left for **Again** (Level 1, immediate queue re-insertion), swipe right for **Good** (Level 2) or **Easy / Mastered** (Level 3).
4. **Batch & Deck Milestones**: Completing a 25-card batch displays a celebratory batch summary with options to "Start Next 25 Cards" or "Review Due Cards". The Deck Modal provides full searchable browsing across all 600+ words.

### Visual Identity & Theme
- **Segmented Control**: Pill-shaped switcher in the header with smooth transition indicator, dark/light mode contrast, and level counts.
- **Adaptive Card Sizing**: Dynamic typography:
  - 1-character Kanji: `text-8xl sm:text-9xl`
  - 2-character Compounds: `text-6xl sm:text-7xl`
  - 3+ character Expressions: `text-4xl sm:text-5xl`
- **Data Status Pill**: Subtle, non-intrusive badge showing data sync status (e.g., `● 650 words synced (N5+N4)` or `● Offline high-frequency deck`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Priority & Frequency Ranking Algorithm**
  - *Chosen Approach*: Multi-tier priority scoring:
    1. Tier 1 (Highest): Core N4 high-frequency verbs, giving/receiving verbs (`あげる`, `くれる`, `もらう`), and transitive/intransitive verb pairs (`開ける/開く`, `閉める/閉まる`, `つける/つく`).
    2. Tier 2: High-yield N4 nouns, adjectives, and functional adverbs.
    3. Tier 3: Essential N5 foundational words to reinforce prerequisites.
    4. Tier 4: Extended N4/N5 vocabulary.
  - *Why*: Research on JLPT scoring shows passing students frequently struggle with verb conjugations and transitivity; prioritizing these creates maximum score impact.

- **Decision 2: Resilient Multi-Stage Data Fetch Pipeline**
  - *Chosen Approach*: 
    1. Attempt remote JSON: `json/n5.json` and `json/n4.json`.
    2. On 404 / failure: Attempt remote CSV: `src/n5.csv` and `src/n4.csv` from `elzup/jlpt-word-list`.
    3. On network / CORS failure: Fall back seamlessly to built-in bundled vocabulary dataset without blocking the user.
  - *Why*: Ensures the app is 100% resilient offline, behind strict proxies, or when remote GitHub structures shift.

- **Decision 3: Batch-Based SRS State Architecture**
  - *Chosen Approach*: Track global SRS progress for all words in `localStorage`, but isolate the active review session to a prioritized active batch of 20–30 cards.
  - *Why*: Prevents queue paralysis from hundreds of cards while preserving persistent Leitner spaced repetition.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Application UI                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Header: Mode Switcher [ All (N5+N4) | N4 Only | N5 Review ]     │  │
│  │         Stats: Due Cards | Mastered Count | Sync Status Badge    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│  ┌─────────────────────────────────▼────────────────────────────────┐  │
│  │                    Adaptive Flashcard Container                  │  │
│  │  - Pointer swipe gestures (Left = Again, Right = Good/Mastered)  │  │
│  │  - Dynamic font scale (1-char vs multi-char expressions)         │  │
│  │  - Back: Audio TTS (Google/Kyoko/Nanami) + Furigana + Grammar   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│  ┌─────────────────────────────────▼────────────────────────────────┐  │
│  │                     SRS Controls & Shortcuts                     │  │
│  │  - Again (1) | Good (2) | Easy (3) | Spacebar (Flip)            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                           State & Data Layer                           │
│  ┌──────────────────────────┐         ┌─────────────────────────────┐  │
│  │    Vocabulary Manager    │         │     SRS Leitner Engine      │  │
│  │ - Multi-stage fetcher    │         │ - Batch queue (25 cards)    │  │
│  │ - CSV / JSON parser      │◄───────►│ - Leitner levels (1, 2, 3)  │  │
│  │ - Frequency rank engine  │         │ - Due item prioritization   │  │
│  │ - Filter by N4 / N5 / All│         │ - localStorage persistence  │  │
│  └──────────────────────────┘         └─────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Structures & State Management
- **`VocabItem`**:
  ```ts
  interface VocabItem {
    id: string;
    expression: string; // Target word or kanji
    reading: string;    // Hiragana furigana
    meaning: string;    // English definition
    level: 'N5' | 'N4';
    tags?: string[];
    priority: number;   // Calculated frequency/grammar priority index
    exampleSentence?: {
      japanese: string;
      furigana: string;
      english: string;
    };
  }
  ```
- **Study Modes**: `'all' | 'n4' | 'n5'`
- **Batch State**: Tracks current batch offset, active batch queue, and completion milestones.
- **Audio Integration**: Integrates directly with `src/utils/speech.ts` passing pure Hiragana `item.reading` to `window.speechSynthesis`.

---

## 5. Verification Plan

1. **Unit Tests (`node --test`)**:
   - Test CSV parser against edge cases (commas in quotes, tags, multi-reading).
   - Test frequency ranking engine ensuring N4 core verbs and N5 high-yield words are sorted ahead of low-frequency items.
   - Test batching logic and SRS transitions within batches.
2. **Compilation & Linting**:
   - Run `compile_applet` and `lint_applet` to ensure zero TypeScript or bundling errors.
3. **Interactive & Browser Testing**:
   - Verify mode switching (`All`, `N4 Only`, `N5 Review`) re-ranks and filters deck seamlessly.
   - Verify network fallback by simulating offline and online fetches.
   - Verify touch/drag swiping and audio pronunciation across mobile viewports.

---

## 6. Kanji Radical & Constituent Element Decomposition (User Request #9)

- **Comprehensive Character Decomposition**: Replaced single-radical lookup logic with `decomposeWord` in `src/utils/kanjiDecomposer.ts`. Extracts all constituent sub-elements (e.g. `語` -> `言` [speech], `五` [five], `口` [mouth]) for all JLPT N4 and N5 kanji.
- **Multi-Kanji Grouping**: For compound words (e.g. `病院`), groups sub-components clearly under character labels without visual clutter.
- **Compact Washitsu Component Pill Row**: Renders badges styled as `[Radical] [English]` with `padding: 3px 8px; font-size: 0.8rem; gap: 6px;` matching the teahouse palette.
- **Graceful Fallbacks**: Omit the breakdown row entirely for pure Kana words or single-element primitives to maintain zero-scroll card compactness.

---

## 7. Matching Quiz Module & Fixed 5-Pair Round Progression

- **Duolingo-style 5-Word Matching**: 2-column mobile layout (5 Japanese cards on left, 5 English meanings on right) strictly fitted in zero-scroll viewport (`max-height: 100dvh`).
- **Compact Card-Sized Outer Shell**:
  - Matching board wrapped in a card shell matching the primary flashcard container (`max-width: 440px`, `width: 100%`, `margin: 0 auto`, `rounded-2xl sm:rounded-3xl`, `bg-[#FAF8F5] dark:bg-[#28231F]`, shadow and subtle border).
  - 2x5 grid container configured with `justify-content: center` and `align-content: center` with uniform tight `gap: 10px` (`sm:gap: 12px`) row and column spacing.
  - Tiles sized with compact fixed vertical sizing (`min-height: 50px`, `px-3 py-2 sm:py-2.5`) to eliminate vertical stretching and keep all 10 tiles neatly adjacent.
- **Two-Way Tap Selection**: Tapping Japanese or English in either order highlights with Matcha Green (`#6B7F5E`) and evaluates upon selecting the partner column.
- **Furigana Reading Toggle**: Header button (`あ/漢` ON/OFF) allows testing raw kanji recognition with persisted preference.
- **Fixed Static Positions (Zero Reflow & No Mid-Round Replenishment)**:
  - Correct matches trigger audio chime, green pulse, and freeze in place with `opacity-30 pointer-events-none grayscale`.
  - Zero tile replenishment or array refilling mid-round: both column arrays remain capped at the exact 5 pairs assigned.
  - Round matched count (`roundMatchedCount`) tracks solved pairs from 0 to 5.
  - Automatically loads the next 5-word set ONLY when `roundMatchedCount === 5`.
  - 5 rounds of 5 words (25 total words) complete the session and launch the Washitsu completion summary.

---

## 8. Custom PWA App Icon, iOS Web App Meta & Web Application Manifest

- **App Icon Assets**:
  - Background: Solid Matcha Green (`#6B7F5E`) with rounded Japanese washitsu border aesthetics (`rx="112"`).
  - Emblem: Centered Japanese Kanji 「学」 in soft Cream (`#F9F6F0`) framed by a subtle gold ring (`#D4AF37`) and traditional tatami corner brackets.
  - Accent Stamp: Vermilion Red (`#C84B31`) Japanese hanko seal stamp in the lower-right corner labeled 「N4」.
  - Deployed assets: `/public/apple-touch-icon.png` (180x180), `/public/icon-512.png` (512x512 maskable & any), `/public/icon-192.png` (192x192), `/public/icon-32x32.png` (valid 32x32 RGBA PNG), and `/public/icon.svg`.
- **HTML Head & iOS Meta Configuration (`index.html`)**:
  - `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`
  - `<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">`
  - `<meta name="apple-mobile-web-app-capable" content="yes">`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
  - `<meta name="apple-mobile-web-app-title" content="JLPT Study">`
  - `<meta name="theme-color" content="#6B7F5E">`
  - `<link rel="manifest" href="/manifest.json">`
- **Web App Manifest (`/public/manifest.json` & `/public/site.webmanifest`)**:
  - Configured with `"name": "JLPT Washitsu Study"`, `"short_name": "JLPT N4/N5"`, `"theme_color": "#6B7F5E"`, `"background_color": "#F4F0EA"`, and `"display": "standalone"`.
- **In-App Install UI (`PWAInstallButton`)**:
  - Automatically suppresses itself when running in standalone mode.
  - Triggers native installation prompt on Chromium/Android/Desktop.
  - Provides guided 3-step instructions for iOS Safari users.



