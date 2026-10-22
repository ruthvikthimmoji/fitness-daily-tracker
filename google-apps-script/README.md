# Google Apps Script Setup Guide

Follow these simple steps to link your Google Sheet with your mobile application. It takes less than 2 minutes and is 100% free with no Google Cloud API billing or credentials needed.

---

### Step 1: Open Apps Script in Google Sheets
1. Open your [Fitness & Daily Tracker Google Sheet](https://docs.google.com/spreadsheets/d/1g-LrMb2Efx4OiISCcNV9r6qosiarYu3hQ_4H4RHRt28/edit).
2. Click **Extensions** in the top menu bar, then click **Apps Script**.
3. A new browser tab will open showing the Apps Script editor.

---

### Step 2: Paste the Code
1. If there is already code in `Code.gs` (like `function myFunction() { ... }`), select all (`Ctrl+A` or `Cmd+A`) and **delete it**.
2. Open the file [`google-apps-script/Code.gs`](./Code.gs) from this project, copy all contents, and paste it into the editor.
3. Click the **Save icon** (💾) or press `Cmd+S` / `Ctrl+S`.

---

### Step 3: Deploy as a Web App
1. In the top right corner of the Apps Script window, click the blue **Deploy** button.
2. Select **New deployment**.
3. Next to "Select type", click the **Gear icon (⚙️)** and choose **Web app**.
4. Configure the settings:
   - **Description**: `Fitness Tracker Mobile API`
   - **Execute as**: **Me (your-email@gmail.com)**
   - **Who has access**: **Anyone** *(This is required so your mobile device can send data to your sheet)*
5. Click **Deploy**.

---

### Step 4: Authorize Google Access
1. Google will show an "Authorization required" prompt. Click **Authorize access**.
2. Select your Google account.
3. If you see a screen that says *"Google hasn't verified this app"*:
   - Click **Advanced** (small text in the bottom left).
   - Click **Go to Untitled project (unsafe)** (don't worry, this is your own private script running on your sheet!).
   - Click **Allow**.

---

### Step 5: Copy Your Web App URL
1. You will see a box titled **Web app**.
2. Copy the **URL** (it looks like: `https://script.google.com/macros/s/AKfycbx.../exec`).
3. Open the Fitness & Daily Tracker Mobile App on your phone or computer.
4. Go to **Settings** (⚙️) -> Paste the URL into the **Google Apps Script URL** input.
5. Tap **Test Connection & Save**!

You're done! Now whenever you log water, food, workouts, work tasks, or daily stats from your phone, they immediately sync and update in your Google Sheet!
