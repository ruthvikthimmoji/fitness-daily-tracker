# ⚡ FitDaily – Personal Fitness & Daily Work Tracker Mobile App

> A mobile-first Progressive Web App (PWA) synced directly to your **[Personal Fitness & Daily Tracker Google Sheet](https://docs.google.com/spreadsheets/d/1g-LrMb2Efx4OiISCcNV9r6qosiarYu3hQ_4H4RHRt28/edit)**.

No more opening clumsy spreadsheets on your phone. Log your water, steps, morning weight, meals, workouts, and work tasks in 2 seconds with high-contrast, touch-optimized controls. Everything updates directly in your Google Sheet in real time.

---

## 📱 Features

1. **Daily Command Center (Today)**
   - **Score & Calorie Meter**: Real-time calorie budget (Consumed vs Burned vs Target) and daily compliance score.
   - **Quick Tap Water Counter**: `+250ml`, `+500ml`, `+1L` buttons with hydration progress circle.
   - **Step Tracker**: Quick add `+1,000`, `+2,500`, `+5,000` steps or direct input against your 10,000 daily goal.
   - **Morning Weight**: Fast entry with one-tap save, tracking change towards your 72 kg goal.
   - **Sleep & Mood Log**: Log hours slept and daily energy/mood (1 to 5) with tactile feedback.
   - **Daily Notes**: Scratchpad that syncs to column T of your Daily Log.

2. **Food & Macro Logger (Food)**
   - Grouped by meal: Breakfast, Lunch, Dinner, Snacks.
   - Auto-tracks Calories, Protein, Carbs, and Fat against your custom macro targets.
   - Pre-loaded with 1-tap quick presets (Oats with banana, Whey protein, Grilled chicken & rice, etc.).
   - Appends directly to your `Food Log` sheet; Google Sheets formulas auto-flow the totals into your `Daily Log`!

3. **Workout Logger (Workout)**
   - Track Push, Pull, Legs, Cardio, Upper, Lower, Full Body workouts.
   - Log Sets, Reps, and Weight (kg); automatically calculates **Workout Volume** (`Sets × Reps × Weight`).
   - Log duration (mins) and calories burned for cardio sessions.
   - Quick 1-tap presets for popular lifts (Bench Press, Deadlifts, Squats, Incline Press, Lat Pulldowns).

4. **Daily Work & Task Logger (Work)**
   - Track daily productivity, work tasks, study sessions, and personal side projects.
   - Status toggle (Done / In Progress) and duration hours.
   - Hours auto-flow into the `Work hours` column in your `Daily Log`.

5. **Body Transformation & Analytics (Progress)**
   - Visual progress toward your 72 kg goal weight.
   - 7-Day & 14-Day compliance trends.
   - Weekly Body Measurements logger (Body fat %, Chest, Waist, Hips, Arms, Thighs) that syncs to the `Measurements` sheet.

6. **Offline First & PWA Ready**
   - Installs directly to iPhone (Safari "Add to Home Screen") and Android (Chrome "Install App").
   - Works offline with local cache; queues actions and auto-syncs when reconnected.

---

## 🚀 2-Minute Google Sheet Sync Setup

### 1. Paste the Backend Script into Your Sheet
1. Open your [Fitness & Daily Tracker Google Sheet](https://docs.google.com/spreadsheets/d/1g-LrMb2Efx4OiISCcNV9r6qosiarYu3hQ_4H4RHRt28/edit).
2. Click **Extensions** in the top menu -> **Apps Script**.
3. Clear any existing code in `Code.gs`.
4. Copy all contents from [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) and paste it into the editor.
5. Click **Save** (💾 icon or `Cmd+S`).

### 2. Deploy Web App
1. In the top right corner of Apps Script, click **Deploy** -> **New deployment**.
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
3. Set the following options:
   - **Description**: `Fitness Tracker Mobile API`
   - **Execute as**: **Me** (`your-email@gmail.com`)
   - **Who has access**: **Anyone** *(Required for your phone to sync data)*
4. Click **Deploy**.
5. Click **Authorize access** -> Choose your account -> Click **Advanced** -> Click **Go to Untitled project (unsafe)** -> Click **Allow**.
6. Copy the generated **Web app URL** (starts with `https://script.google.com/macros/s/...`).

### 3. Connect the Mobile App
1. Open the Mobile App.
2. Tap the **Settings** icon (⚙️) in the top right.
3. Paste your Web App URL into the **Google Apps Script Web App URL** field.
4. Tap **Test Connection** -> A green banner will confirm connection with your sheet!
5. Tap **Save Settings & Targets**.

---

## 📲 How to Open & Install on Your Phone

### Option A: Local Wi-Fi (Right Now)
1. Make sure your phone is connected to the same Wi-Fi network as this computer.
2. Open your phone browser and go to:
   ```
   http://10.30.64.226:5173
   ```
   *(Or open Settings ⚙️ in the web app on your computer, click "Show QR Code", and scan it with your phone camera!)*
3. **iPhone**: Tap the **Share** button (box with arrow pointing up) -> scroll down and tap **Add to Home Screen**.
4. **Android**: Tap the **three dots** in Chrome -> tap **Install App** or **Add to Home Screen**.

### Option B: Free Cloud Hosting (Anywhere Access on Cellular / 4G / 5G)
Deploy to Vercel in 60 seconds:
```bash
# In this directory:
npm i -g vercel
vercel
```
Follow the prompts (default settings work out of the box). You will get a free permanent HTTPS link like `https://fitdaily-tracker.vercel.app` that you can open and install anywhere in the world!

---

## 💻 Local Development Commands

```bash
# Start local dev server (accessible over Wi-Fi)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
