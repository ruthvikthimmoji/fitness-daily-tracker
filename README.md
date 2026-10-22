# ⚡ DAILY/FIT – Personal Fitness & Daily Work Tracker

> **A private, no-excuses daily log of your body, food, work and habits.**
> Synced directly with your **[Google Sheet Tracker](https://docs.google.com/spreadsheets/d/1g-LrMb2Efx4OiISCcNV9r6qosiarYu3hQ_4H4RHRt28/edit)**.

Built according to the official **DAILY/FIT Brand Guidelines (v1.0)**:
- **Brand Pillars**: Consistency over intensity · Data over guesses · Progress, not perfection.
- **Personality**: Calm, disciplined, honest, quietly motivating.
- **Core Palette**: Deep Teal (`#1F4E5F`), Ocean Blue (`#2E75B6`), Slate Grey (`#595959`), Mist (`#EAF2F5`), Sunlight Yellow (`#FFF9DB` inputs).

---

## 🎨 Brand Design System Implemented

| Element | Specification | Applied To |
| :--- | :--- | :--- |
| **Primary** | Deep Teal `#1F4E5F` | Titles, KPI numbers, primary buttons, headers |
| **Secondary** | Ocean Blue `#2E75B6` | Subheadings, links, progress highlights |
| **Tint** | Mist `#EAF2F5` | App background, card backgrounds, alternate pills |
| **Input** | Sunlight `#FFF9DB` | Any field where YOU type (matching Excel yellow cells) |
| **Neutral Dark** | Slate Grey `#595959` | Auto/calculated values, subtext, captions |
| **Borders** | Medium Grey `#BFBFBF` | 1px card borders, input borders |
| **On Track** | `#C6EFCE` fill / `#2E7D32` text | Status pills, completed tasks, goals achieved |
| **Pending** | `#FFEB9C` fill / `#7F6000` text | In-progress tasks, pending sync |
| **Over Target** | `#F8CBAD` fill / `#C00000` text | Over-budget warnings, target dashed lines |

---

## 📱 Features

1. **Daily Command Center (Today)**
   - Daily Compliance Score & Calorie Budget.
   - Quick water tap counter (`+250ml`, `+500ml`, `+1L`) with hydration bar.
   - Quick step tracker (`+1,000`, `+2,500`, `+5,000` steps) or direct Sunlight Yellow input.
   - Morning weight logger tracking journey toward your 72 kg goal.
   - Sleep hours and 5-stage daily energy/mood check-in.
   - Daily notes scratchpad syncing to Column T in `Daily Log`.

2. **Food & Nutrition (Food)**
   - Grouped by meal (Breakfast, Lunch, Dinner, Snacks).
   - Tracks Calories (`#4472C4`), Protein (`#2E9E6B`), Carbs (`#F28E2B`), Fat (`#EC407A`).
   - 1-tap quick presets and modal adding directly to `Food Log`.

3. **Workout & Strength (Workout)**
   - Strict workout color `#D32F2F`.
   - Push, Pull, Legs, Cardio splits.
   - Auto-computes **Volume** (`Sets × Reps × Weight`) into `Workout Log`.

4. **Daily Work & Focus (Work)**
   - Work / activity color `#455A64`.
   - Task logging with hours spent flowing into `Daily Log`.
   - Toggle checkmark with brand status styling (`#C6EFCE` / `#2E7D32`).

5. **Body Progress & Analytics (Progress)**
   - Weight journey chart toward 72 kg goal.
   - 7-Day consistency bars with `#C00000` dashed 80% target line.
   - Weekly body measurements logger (`Measurements` sheet).

6. **PWA Mobile Native Experience**
   - Full-screen standalone PWA for iOS (Safari "Add to Home Screen") and Android (Chrome "Install App").
   - Works offline with local cache and background queue.

---

## 🚀 2-Minute Google Sheet Sync Setup

1. Open your [Fitness & Daily Tracker Google Sheet](https://docs.google.com/spreadsheets/d/1g-LrMb2Efx4OiISCcNV9r6qosiarYu3hQ_4H4RHRt28/edit).
2. Go to **Extensions** > **Apps Script**.
3. Paste [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) into `Code.gs` and click **Save** (💾).
4. Click **Deploy** > **New deployment** > **Web app**:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
5. Click **Deploy**, authorize permissions, and copy the Web App URL.
6. In the app, open **Settings (⚙️)**, paste the URL, and click **Test Connection**!
