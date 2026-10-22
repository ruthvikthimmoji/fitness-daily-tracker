/**
 * ============================================================================
 * Personal Fitness & Daily Work Tracker - Google Apps Script Backend API
 * ============================================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet (Fitness & Daily Tracker).
 * 2. In the top menu, click "Extensions" > "Apps Script".
 * 3. Delete any default code in Code.gs and replace it with this entire file.
 * 4. Click the "Save" icon (or press Cmd+S / Ctrl+S).
 * 5. In the top right corner, click "Deploy" > "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Fill in the deployment configuration:
 *      - Description: "Fitness Tracker Mobile API"
 *      - Execute as: "Me (your email)"
 *      - Who has access: "Anyone" (Required so your phone can sync to it)
 * 8. Click "Deploy".
 * 9. Google will ask you to "Authorize access" (Click your account -> Advanced -> Go to Untitled project (unsafe) -> Allow).
 * 10. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...)
 * 11. Open your Mobile App -> Settings -> Paste the URL into the "Google Apps Script URL" box!
 * ============================================================================
 */

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'getSummary';
    const dateStr = (e && e.parameter && e.parameter.date) || getTodayString();
    
    // Health check / ping test
    if (action === 'ping') {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      return jsonResponse({
        success: true,
        message: 'Connected to Fitness & Daily Tracker Sheet successfully!',
        sheetName: ss.getName(),
        sheetsFound: ss.getSheets().map(s => s.getName()),
        timestamp: new Date().toISOString()
      });
    }

    // Get settings and targets
    if (action === 'getSettings') {
      const settings = fetchSettings();
      return jsonResponse({
        success: true,
        settings: settings
      });
    }

    // Get comprehensive summary for a specific date (defaults to today)
    if (action === 'getSummary') {
      const summary = fetchDailySummary(dateStr);
      return jsonResponse({
        success: true,
        date: dateStr,
        ...summary
      });
    }

    // Get recent history for trend charts
    if (action === 'getHistory') {
      const days = parseInt((e && e.parameter && e.parameter.days) || '14', 10);
      const history = fetchRecentHistory(days);
      return jsonResponse({
        success: true,
        days: days,
        history: history
      });
    }

    return jsonResponse({
      success: false,
      error: 'Unknown GET action: ' + action
    });
  } catch (err) {
    return jsonResponse({
      success: false,
      error: err.toString(),
      stack: err.stack
    });
  }
}

function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (ex) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action;
    const dateStr = payload.date || getTodayString();

    // 1. Update Daily Log (Weight, Water, Steps, Sleep, Mood, Notes)
    if (action === 'updateDailyLog') {
      const result = updateDailyLogRow(dateStr, payload);
      return jsonResponse({ success: true, result: result });
    }

    // 2. Add Food Item
    if (action === 'addFoodItem') {
      const result = addFoodRow(dateStr, payload);
      return jsonResponse({ success: true, result: result });
    }

    // 3. Delete Food Item
    if (action === 'deleteFoodItem') {
      const result = deleteFoodRow(payload.rowIndex, payload.date, payload.foodItem);
      return jsonResponse({ success: true, result: result });
    }

    // 4. Add Workout Exercise
    if (action === 'addWorkoutItem') {
      const result = addWorkoutRow(dateStr, payload);
      return jsonResponse({ success: true, result: result });
    }

    // 5. Delete Workout Exercise
    if (action === 'deleteWorkoutItem') {
      const result = deleteWorkoutRow(payload.rowIndex, payload.date, payload.exercise);
      return jsonResponse({ success: true, result: result });
    }

    // 6. Add Work / Task Log
    if (action === 'addWorkItem') {
      const result = addWorkRow(dateStr, payload);
      return jsonResponse({ success: true, result: result });
    }

    // 7. Delete Work / Task Log
    if (action === 'deleteWorkItem') {
      const result = deleteWorkRow(payload.rowIndex, payload.date, payload.task);
      return jsonResponse({ success: true, result: result });
    }

    // 8. Add Weekly Body Measurement
    if (action === 'addMeasurement') {
      const result = addMeasurementRow(dateStr, payload);
      return jsonResponse({ success: true, result: result });
    }

    // 9. Batch sync
    if (action === 'batchSync') {
      const results = {};
      if (payload.dailyLog) {
        results.dailyLog = updateDailyLogRow(dateStr, payload.dailyLog);
      }
      if (payload.foodItems && Array.isArray(payload.foodItems)) {
        results.foodItems = payload.foodItems.map(f => addFoodRow(dateStr, f));
      }
      if (payload.workoutItems && Array.isArray(payload.workoutItems)) {
        results.workoutItems = payload.workoutItems.map(w => addWorkoutRow(dateStr, w));
      }
      if (payload.workItems && Array.isArray(payload.workItems)) {
        results.workItems = payload.workItems.map(wk => addWorkRow(dateStr, wk));
      }
      return jsonResponse({ success: true, results: results });
    }

    return jsonResponse({
      success: false,
      error: 'Unknown POST action: ' + action
    });
  } catch (err) {
    return jsonResponse({
      success: false,
      error: err.toString(),
      stack: err.stack
    });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// DATA FETCHING HELPERS
// ============================================================================

/**
 * Reads user settings and targets from the 'Settings' sheet
 */
function fetchSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Settings');
  const settings = {
    name: 'User',
    startDate: '',
    heightCm: 170,
    startWeightKg: 78.0,
    goalWeightKg: 72.0,
    dailyCalorieTarget: 2200,
    dailyProteinTarget: 130,
    dailyWaterTarget: 3.0,
    dailyStepsTarget: 10000,
    dailySleepTarget: 7.5
  };

  if (!sheet) return settings;

  const values = sheet.getDataRange().getValues();
  // Look for settings key-values
  for (let r = 0; r < values.length; r++) {
    const row = values[r];
    for (let c = 0; c < row.length - 1; c++) {
      const key = String(row[c] || '').trim().toLowerCase();
      const val = row[c + 1];

      if (key.includes('your name')) settings.name = String(val || 'User').trim();
      else if (key.includes('tracking start date')) settings.startDate = formatSheetDate(val);
      else if (key.includes('height')) settings.heightCm = parseNum(val) || 170;
      else if (key.includes('starting weight')) settings.startWeightKg = parseNum(val) || 78.0;
      else if (key.includes('goal weight')) settings.goalWeightKg = parseNum(val) || 72.0;
      else if (key.includes('calorie target')) settings.dailyCalorieTarget = parseNum(val) || 2200;
      else if (key.includes('protein target')) settings.dailyProteinTarget = parseNum(val) || 130;
      else if (key.includes('water target')) settings.dailyWaterTarget = parseNum(val) || 3.0;
      else if (key.includes('steps target')) settings.dailyStepsTarget = parseNum(val) || 10000;
      else if (key.includes('sleep target')) settings.dailySleepTarget = parseNum(val) || 7.5;
    }
  }

  return settings;
}

/**
 * Fetches everything for a single day: Daily Log, Food Items, Workouts, Work Tasks, Measurements
 */
function fetchDailySummary(targetDateStr) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = fetchSettings();
  const targetDate = parseInputDate(targetDateStr);

  // 1. Fetch Daily Log row
  let dailyLog = {
    date: targetDateStr,
    day: getDayOfWeek(targetDate),
    weight: null,
    caloriesIn: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
    steps: 0,
    sleep: 0,
    workoutDone: false,
    workoutVolume: 0,
    caloriesBurned: 0,
    netCalories: 0,
    calorieTarget: settings.dailyCalorieTarget,
    workHours: 0,
    mood: 3,
    photoTaken: false,
    dailyScore: 0,
    notes: '',
    rowIndex: -1
  };

  const dailySheet = ss.getSheetByName('Daily Log');
  if (dailySheet) {
    const data = dailySheet.getDataRange().getValues();
    // Headers are at row 4 (index 3). Data starts at row 5 (index 4).
    for (let r = 4; r < data.length; r++) {
      const cellDate = data[r][0]; // Col A
      if (isSameDate(cellDate, targetDate)) {
        dailyLog.rowIndex = r + 1; // 1-based row index
        dailyLog.day = String(data[r][1] || getDayOfWeek(targetDate)).trim();
        dailyLog.weight = data[r][2] !== '' ? parseNum(data[r][2]) : null;
        dailyLog.caloriesIn = parseNum(data[r][3]);
        dailyLog.protein = parseNum(data[r][4]);
        dailyLog.carbs = parseNum(data[r][5]);
        dailyLog.fat = parseNum(data[r][6]);
        dailyLog.water = parseNum(data[r][7]);
        dailyLog.steps = parseNum(data[r][8]);
        dailyLog.sleep = parseNum(data[r][9]);
        dailyLog.workoutDone = String(data[r][10] || '').trim().toLowerCase() === 'yes';
        dailyLog.workoutVolume = parseNum(data[r][11]);
        dailyLog.caloriesBurned = parseNum(data[r][12]);
        dailyLog.netCalories = parseNum(data[r][13]);
        dailyLog.calorieTarget = parseNum(data[r][14]) || settings.dailyCalorieTarget;
        dailyLog.workHours = parseNum(data[r][15]);
        dailyLog.mood = data[r][16] !== '' ? parseNum(data[r][16]) : 3;
        dailyLog.photoTaken = String(data[r][17] || '').trim().toLowerCase() === 'yes';
        dailyLog.dailyScore = parseScore(data[r][18]);
        dailyLog.notes = String(data[r][19] || '').trim();
        break;
      }
    }
  }

  // 2. Fetch Food Log items for this date
  const foodItems = [];
  const foodSheet = ss.getSheetByName('Food Log');
  if (foodSheet) {
    const fData = foodSheet.getDataRange().getValues();
    for (let r = 4; r < fData.length; r++) {
      const fDate = fData[r][0];
      if (isSameDate(fDate, targetDate)) {
        const item = String(fData[r][2] || '').trim();
        if (item) {
          foodItems.push({
            rowIndex: r + 1,
            date: targetDateStr,
            meal: String(fData[r][1] || 'Breakfast').trim(),
            foodItem: item,
            quantity: String(fData[r][3] || '').trim(),
            calories: parseNum(fData[r][4]),
            protein: parseNum(fData[r][5]),
            carbs: parseNum(fData[r][6]),
            fat: parseNum(fData[r][7]),
            notes: String(fData[r][8] || '').trim()
          });
        }
      }
    }
  }

  // 3. Fetch Workout Log items for this date
  const workoutItems = [];
  const workoutSheet = ss.getSheetByName('Workout Log');
  if (workoutSheet) {
    const wData = workoutSheet.getDataRange().getValues();
    for (let r = 4; r < wData.length; r++) {
      const wDate = wData[r][0];
      if (isSameDate(wDate, targetDate)) {
        const exercise = String(wData[r][2] || '').trim();
        if (exercise) {
          workoutItems.push({
            rowIndex: r + 1,
            date: targetDateStr,
            workoutType: String(wData[r][1] || 'Push').trim(),
            exercise: exercise,
            sets: parseNum(wData[r][3]),
            reps: parseNum(wData[r][4]),
            weightKg: parseNum(wData[r][5]),
            volumeKg: parseNum(wData[r][6]),
            durationMin: parseNum(wData[r][7]),
            caloriesBurned: parseNum(wData[r][8]),
            notes: String(wData[r][9] || '').trim()
          });
        }
      }
    }
  }

  // 4. Fetch Work Log items for this date
  const workItems = [];
  const workSheet = ss.getSheetByName('Work Log');
  if (workSheet) {
    const wkData = workSheet.getDataRange().getValues();
    for (let r = 4; r < wkData.length; r++) {
      const wkDate = wkData[r][0];
      if (isSameDate(wkDate, targetDate)) {
        const task = String(wkData[r][1] || '').trim();
        if (task) {
          workItems.push({
            rowIndex: r + 1,
            date: targetDateStr,
            task: task,
            category: String(wkData[r][2] || 'Work').trim(),
            hours: parseNum(wkData[r][3]),
            status: String(wkData[r][4] || 'Done').trim(),
            notes: String(wkData[r][5] || '').trim()
          });
        }
      }
    }
  }

  // 5. Fetch Dashboard KPI highlights
  const dashboardSheet = ss.getSheetByName('Dashboard');
  const dashboardKpis = {
    currentWeight: dailyLog.weight || settings.startWeightKg,
    startingWeight: settings.startWeightKg,
    goalWeight: settings.goalWeightKg,
    changeSoFar: 0,
    remainingToGoal: 0,
    bmi: 0,
    goalProgress: 0
  };

  if (dashboardSheet) {
    const dVals = dashboardSheet.getDataRange().getValues();
    for (let r = 0; r < dVals.length; r++) {
      const label = String(dVals[r][0] || '').trim().toLowerCase();
      const val = dVals[r][1];
      if (label.includes('current weight')) dashboardKpis.currentWeight = parseNum(val);
      else if (label.includes('starting weight')) dashboardKpis.startingWeight = parseNum(val);
      else if (label.includes('goal weight')) dashboardKpis.goalWeight = parseNum(val);
      else if (label.includes('change so far')) dashboardKpis.changeSoFar = parseNum(val);
      else if (label.includes('remaining to goal')) dashboardKpis.remainingToGoal = parseNum(val);
      else if (label.includes('bmi')) dashboardKpis.bmi = parseNum(val);
      else if (label.includes('goal progress')) dashboardKpis.goalProgress = parseScore(val);
    }
  }

  return {
    settings: settings,
    dailyLog: dailyLog,
    foodItems: foodItems,
    workoutItems: workoutItems,
    workItems: workItems,
    dashboardKpis: dashboardKpis
  };
}

/**
 * Fetches recent history (last N days) from Daily Log for trend charts
 */
function fetchRecentHistory(daysCount) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Daily Log');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const history = [];

  // Rows 5+ contain daily records
  for (let r = 4; r < data.length; r++) {
    const dateVal = data[r][0];
    if (dateVal) {
      const weightVal = data[r][2];
      const waterVal = data[r][7];
      const stepsVal = data[r][8];
      const sleepVal = data[r][9];
      const caloriesVal = data[r][3];
      const volumeVal = data[r][11];
      const workHoursVal = data[r][15];
      const moodVal = data[r][16];
      const scoreVal = data[r][18];

      // Only include if date has at least some data logged
      const hasData = (weightVal !== '' && weightVal !== null) ||
                      (waterVal > 0) || (stepsVal > 0) || (sleepVal > 0) ||
                      (caloriesVal > 0) || (volumeVal > 0) || (workHoursVal > 0);

      const dStr = formatSheetDate(dateVal);
      if (dStr) {
        history.push({
          date: dStr,
          day: String(data[r][1] || ''),
          weight: weightVal !== '' ? parseNum(weightVal) : null,
          caloriesIn: parseNum(caloriesVal),
          water: parseNum(waterVal),
          steps: parseNum(stepsVal),
          sleep: parseNum(sleepVal),
          workoutVolume: parseNum(volumeVal),
          workHours: parseNum(workHoursVal),
          mood: moodVal !== '' ? parseNum(moodVal) : null,
          dailyScore: parseScore(scoreVal),
          hasData: hasData
        });
      }
    }
  }

  // Return the most recent entries
  return history.slice(-Math.max(daysCount, 7));
}

// ============================================================================
// DATA WRITE / UPDATE HELPERS
// ============================================================================

/**
 * Updates the yellow (user-editable) columns of Daily Log for a given date.
 * Columns:
 * Col C (3): Weight (kg)
 * Col H (8): Water (L)
 * Col I (9): Steps
 * Col J (10): Sleep (hrs)
 * Col Q (17): Mood (1-5)
 * Col T (20): Notes
 */
function updateDailyLogRow(dateStr, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Daily Log');
  if (!sheet) throw new Error('Daily Log sheet not found');

  const targetDate = parseInputDate(dateStr);
  const data = sheet.getDataRange().getValues();

  let targetRow = -1;

  // Search existing pre-populated rows (start at row 5, index 4)
  for (let r = 4; r < data.length; r++) {
    if (isSameDate(data[r][0], targetDate)) {
      targetRow = r + 1; // 1-based row index
      break;
    }
  }

  // If date row not found, append a new row
  if (targetRow === -1) {
    targetRow = sheet.getLastRow() + 1;
    if (targetRow > sheet.getMaxRows()) {
      sheet.insertRowAfter(sheet.getMaxRows());
    }
    // Set date and day formula
    sheet.getRange(targetRow, 1).setValue(targetDate).setNumberFormat('dd-mmm-yy');
    sheet.getRange(targetRow, 2).setFormula(`=TEXT(A${targetRow},"ddd")`);

    // Copy formulas from previous row for cols D-G, K-P, R-S
    const prevRow = targetRow - 1;
    if (prevRow >= 5) {
      // D to G: Calories, Protein, Carbs, Fat
      sheet.getRange(prevRow, 4, 1, 4).copyTo(sheet.getRange(targetRow, 4, 1, 4), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
      // K to P: Workout done?, Volume, Cal burned, Net cal, Cal target, Work hours
      sheet.getRange(prevRow, 11, 1, 6).copyTo(sheet.getRange(targetRow, 11, 1, 6), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
      // R to S: Photo taken?, Daily score
      sheet.getRange(prevRow, 18, 1, 2).copyTo(sheet.getRange(targetRow, 18, 1, 2), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    }
  }

  // Update yellow columns only if provided in payload
  if (payload.weight !== undefined && payload.weight !== null && payload.weight !== '') {
    sheet.getRange(targetRow, 3).setValue(Number(payload.weight));
  }
  if (payload.water !== undefined && payload.water !== null) {
    sheet.getRange(targetRow, 8).setValue(Number(payload.water));
  }
  if (payload.steps !== undefined && payload.steps !== null) {
    sheet.getRange(targetRow, 9).setValue(Number(payload.steps));
  }
  if (payload.sleep !== undefined && payload.sleep !== null) {
    sheet.getRange(targetRow, 10).setValue(Number(payload.sleep));
  }
  if (payload.mood !== undefined && payload.mood !== null) {
    sheet.getRange(targetRow, 17).setValue(Number(payload.mood));
  }
  if (payload.notes !== undefined && payload.notes !== null) {
    sheet.getRange(targetRow, 20).setValue(String(payload.notes));
  }

  SpreadsheetApp.flush();
  return { success: true, row: targetRow, date: dateStr };
}

/**
 * Appends a new food item to 'Food Log'
 * Columns: Date, Meal, Food item, Quantity, Calories (kcal), Protein (g), Carbs (g), Fat (g), Notes
 */
function addFoodRow(dateStr, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Food Log');
  if (!sheet) throw new Error('Food Log sheet not found');

  const targetDate = parseInputDate(dateStr);
  const targetRow = sheet.getLastRow() + 1;

  if (targetRow > sheet.getMaxRows()) {
    sheet.insertRowAfter(sheet.getMaxRows());
  }

  sheet.getRange(targetRow, 1).setValue(targetDate).setNumberFormat('dd-mmm-yy');
  sheet.getRange(targetRow, 2).setValue(payload.meal || 'Breakfast');
  sheet.getRange(targetRow, 3).setValue(payload.foodItem || payload.food || '');
  sheet.getRange(targetRow, 4).setValue(payload.quantity || '1 serving');
  sheet.getRange(targetRow, 5).setValue(Number(payload.calories || 0));
  sheet.getRange(targetRow, 6).setValue(Number(payload.protein || 0));
  sheet.getRange(targetRow, 7).setValue(Number(payload.carbs || 0));
  sheet.getRange(targetRow, 8).setValue(Number(payload.fat || 0));
  sheet.getRange(targetRow, 9).setValue(payload.notes || '');

  SpreadsheetApp.flush();
  return { success: true, row: targetRow, item: payload.foodItem };
}

/**
 * Deletes a row from Food Log
 */
function deleteFoodRow(rowIndex, dateStr, foodItem) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Food Log');
  if (!sheet) throw new Error('Food Log sheet not found');

  if (rowIndex && rowIndex >= 5 && rowIndex <= sheet.getLastRow()) {
    sheet.deleteRow(rowIndex);
    SpreadsheetApp.flush();
    return { success: true, deletedRow: rowIndex };
  }

  // Fallback search by date and food name
  if (dateStr && foodItem) {
    const targetDate = parseInputDate(dateStr);
    const data = sheet.getDataRange().getValues();
    for (let r = data.length - 1; r >= 4; r--) {
      if (isSameDate(data[r][0], targetDate) && String(data[r][2]).trim() === String(foodItem).trim()) {
        sheet.deleteRow(r + 1);
        SpreadsheetApp.flush();
        return { success: true, deletedRow: r + 1 };
      }
    }
  }

  return { success: false, error: 'Row not found' };
}

/**
 * Appends a new workout exercise to 'Workout Log'
 * Columns: Date, Workout type, Exercise, Sets, Reps, Weight (kg), Volume (kg), Duration (min), Calories burned, Notes
 */
function addWorkoutRow(dateStr, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Workout Log');
  if (!sheet) throw new Error('Workout Log sheet not found');

  const targetDate = parseInputDate(dateStr);
  const targetRow = sheet.getLastRow() + 1;

  if (targetRow > sheet.getMaxRows()) {
    sheet.insertRowAfter(sheet.getMaxRows());
  }

  const sets = Number(payload.sets || 0);
  const reps = Number(payload.reps || 0);
  const weight = Number(payload.weightKg || payload.weight || 0);

  sheet.getRange(targetRow, 1).setValue(targetDate).setNumberFormat('dd-mmm-yy');
  sheet.getRange(targetRow, 2).setValue(payload.workoutType || 'Push');
  sheet.getRange(targetRow, 3).setValue(payload.exercise || '');
  sheet.getRange(targetRow, 4).setValue(sets || '');
  sheet.getRange(targetRow, 5).setValue(reps || '');
  sheet.getRange(targetRow, 6).setValue(weight || '');
  // Set volume formula: Sets * Reps * Weight
  sheet.getRange(targetRow, 7).setFormula(`=IF(AND(ISNUMBER(D${targetRow}),ISNUMBER(E${targetRow}),ISNUMBER(F${targetRow})), D${targetRow}*E${targetRow}*F${targetRow}, "")`);
  sheet.getRange(targetRow, 8).setValue(payload.durationMin ? Number(payload.durationMin) : '');
  sheet.getRange(targetRow, 9).setValue(payload.caloriesBurned ? Number(payload.caloriesBurned) : '');
  sheet.getRange(targetRow, 10).setValue(payload.notes || '');

  SpreadsheetApp.flush();
  return { success: true, row: targetRow, exercise: payload.exercise };
}

/**
 * Deletes a row from Workout Log
 */
function deleteWorkoutRow(rowIndex, dateStr, exercise) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Workout Log');
  if (!sheet) throw new Error('Workout Log sheet not found');

  if (rowIndex && rowIndex >= 5 && rowIndex <= sheet.getLastRow()) {
    sheet.deleteRow(rowIndex);
    SpreadsheetApp.flush();
    return { success: true, deletedRow: rowIndex };
  }

  if (dateStr && exercise) {
    const targetDate = parseInputDate(dateStr);
    const data = sheet.getDataRange().getValues();
    for (let r = data.length - 1; r >= 4; r--) {
      if (isSameDate(data[r][0], targetDate) && String(data[r][2]).trim() === String(exercise).trim()) {
        sheet.deleteRow(r + 1);
        SpreadsheetApp.flush();
        return { success: true, deletedRow: r + 1 };
      }
    }
  }

  return { success: false, error: 'Row not found' };
}

/**
 * Appends a new work/task to 'Work Log'
 * Columns: Date, Task / what I did, Category, Hours, Status, Notes
 */
function addWorkRow(dateStr, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Work Log');
  if (!sheet) throw new Error('Work Log sheet not found');

  const targetDate = parseInputDate(dateStr);
  const targetRow = sheet.getLastRow() + 1;

  if (targetRow > sheet.getMaxRows()) {
    sheet.insertRowAfter(sheet.getMaxRows());
  }

  sheet.getRange(targetRow, 1).setValue(targetDate).setNumberFormat('dd-mmm-yy');
  sheet.getRange(targetRow, 2).setValue(payload.task || payload.description || '');
  sheet.getRange(targetRow, 3).setValue(payload.category || 'Work');
  sheet.getRange(targetRow, 4).setValue(Number(payload.hours || 0));
  sheet.getRange(targetRow, 5).setValue(payload.status || 'Done');
  sheet.getRange(targetRow, 6).setValue(payload.notes || '');

  SpreadsheetApp.flush();
  return { success: true, row: targetRow, task: payload.task };
}

/**
 * Deletes a row from Work Log
 */
function deleteWorkRow(rowIndex, dateStr, task) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Work Log');
  if (!sheet) throw new Error('Work Log sheet not found');

  if (rowIndex && rowIndex >= 5 && rowIndex <= sheet.getLastRow()) {
    sheet.deleteRow(rowIndex);
    SpreadsheetApp.flush();
    return { success: true, deletedRow: rowIndex };
  }

  if (dateStr && task) {
    const targetDate = parseInputDate(dateStr);
    const data = sheet.getDataRange().getValues();
    for (let r = data.length - 1; r >= 4; r--) {
      if (isSameDate(data[r][0], targetDate) && String(data[r][1]).trim() === String(task).trim()) {
        sheet.deleteRow(r + 1);
        SpreadsheetApp.flush();
        return { success: true, deletedRow: r + 1 };
      }
    }
  }

  return { success: false, error: 'Row not found' };
}

/**
 * Appends a new measurement to 'Measurements'
 * Columns: Date, Body fat (%), Chest (cm), Waist (cm), Hips (cm), Arms (cm), Thighs (cm), Notes
 */
function addMeasurementRow(dateStr, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Measurements');
  if (!sheet) throw new Error('Measurements sheet not found');

  const targetDate = parseInputDate(dateStr);
  const targetRow = sheet.getLastRow() + 1;

  if (targetRow > sheet.getMaxRows()) {
    sheet.insertRowAfter(sheet.getMaxRows());
  }

  sheet.getRange(targetRow, 1).setValue(targetDate).setNumberFormat('dd-mmm-yy');
  sheet.getRange(targetRow, 2).setValue(payload.bodyFat ? Number(payload.bodyFat) : '');
  sheet.getRange(targetRow, 3).setValue(payload.chest ? Number(payload.chest) : '');
  sheet.getRange(targetRow, 4).setValue(payload.waist ? Number(payload.waist) : '');
  sheet.getRange(targetRow, 5).setValue(payload.hips ? Number(payload.hips) : '');
  sheet.getRange(targetRow, 6).setValue(payload.arms ? Number(payload.arms) : '');
  sheet.getRange(targetRow, 7).setValue(payload.thighs ? Number(payload.thighs) : '');
  sheet.getRange(targetRow, 8).setValue(payload.notes || '');

  SpreadsheetApp.flush();
  return { success: true, row: targetRow };
}

// ============================================================================
// UTILITIES
// ============================================================================

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseNum(val) {
  if (val === null || val === undefined || val === '' || val === '-') return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function parseScore(val) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val > 1 ? val : Math.round(val * 100);
  const cleaned = String(val).replace('%', '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function formatSheetDate(val) {
  if (!val) return '';
  if (val instanceof Date) {
    const year = val.getFullYear();
    const month = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(val);
}

function parseInputDate(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;

  const s = String(dateStr).trim();
  if (s.length === 10 && s.charAt(4) === '-' && s.charAt(7) === '-') {
    const parts = s.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  // Try parsing natural date e.g. "22-Oct-26" or "22-Oct-2026"
  const parsed = new Date(s);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

function isSameDate(d1, d2) {
  if (!d1 || !d2) return false;
  const o1 = parseInputDate(d1);
  const o2 = parseInputDate(d2);
  return o1.getFullYear() === o2.getFullYear() &&
         o1.getMonth() === o2.getMonth() &&
         o1.getDate() === o2.getDate();
}

function getDayOfWeek(dateObj) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dateObj.getDay()];
}
