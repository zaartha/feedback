// ─────────────────────────────────────────────────────────────
//  PASTE THIS INTO GOOGLE APPS SCRIPT
//  Extensions → Apps Script → replace everything → Save → Deploy
//
//  Works automatically for ANY number of sessions.
//  Each unique session name gets its own sheet tab.
// ─────────────────────────────────────────────────────────────

// Column definitions per session type
// Add entries here if you create new session types with different fields
var SHEET_COLUMNS = {
  'AI-Assisted Engineering': [
    'Timestamp', 'Session', 'Overall (1-5)', 'Pace',
    'Skill Level Match (1-5)', 'Topics Most Valuable',
    'Prompt Confidence (1-5)', 'Likely to Change Workflow (1-5)',
    'Examples Relevant (1-5)', 'Desired Follow-Up Topics',
    'Tools Using / Planning', 'Will Try This Week', 'Improvements'
  ],
  'Git Best Practices': [
    'Timestamp', 'Session', 'Overall (1-5)', 'Pace',
    'Git Comfort Level (1-5)', 'Topics Most Valuable',
    'Will Follow Commit Format (1-5)', 'Had Branching Strategy Before',
    'Conflict Strategies Practical (1-5)', 'Desired Follow-Up Topics',
    'Hardest Practice to Adopt', 'Will Try This Week', 'Improvements'
  ],
  // Default columns used for any new session type not listed above
  'default': [
    'Timestamp', 'Session', 'Overall (1-5)', 'Pace',
    'Topics Most Valuable', 'Desired Follow-Up Topics',
    'Will Try This Week', 'Improvements'
  ]
};

// Field name → column mapping per session type
var FIELD_MAP = {
  'AI-Assisted Engineering': [
    'timestamp', 'session', 'overall', 'pace', 'skillLevel', 'topics',
    'promptConfidence', 'likelyToChange', 'examplesRelevant',
    'followUp', 'toolsUsing', 'tryThisWeek', 'improvements'
  ],
  'Git Best Practices': [
    'timestamp', 'session', 'overall', 'pace', 'comfortLevel', 'topics',
    'commitAdoption', 'branchingBefore', 'conflictPractical',
    'followUp', 'hardestPractice', 'tryThisWeek', 'improvements'
  ],
  'default': [
    'timestamp', 'session', 'overall', 'pace',
    'topics', 'followUp', 'tryThisWeek', 'improvements'
  ]
};

function doPost(e) {
  try {
    var ss   = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var sessionName = (data.session || 'Unknown Session').trim();

    // Get or create the sheet tab for this session
    var sheet = ss.getSheetByName(sessionName);
    if (!sheet) {
      sheet = ss.insertSheet(sessionName);
      var headers = SHEET_COLUMNS[sessionName] || SHEET_COLUMNS['default'];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1c2333');
      headerRange.setFontColor('#e8ecf4');
      sheet.setFrozenRows(1);
    }

    // Build the row using the field map for this session
    var fields = FIELD_MAP[sessionName] || FIELD_MAP['default'];
    data.timestamp = new Date();
    var row = fields.map(function(field) {
      return field === 'timestamp' ? new Date() : (data[field] || '');
    });

    sheet.appendRow(row);

    // Auto-resize on early submissions
    if (sheet.getLastRow() <= 5) {
      var cols = SHEET_COLUMNS[sessionName] || SHEET_COLUMNS['default'];
      sheet.autoResizeColumns(1, cols.length);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', sheet: sessionName }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Run this manually in Apps Script to verify the setup
// ── Utility ──────────────────────────────────────────────────
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Connected to: ' + ss.getName());
  Logger.log('URL: ' + ss.getUrl());
  Logger.log('Ready — deploy as Web App and paste the URL into config.js');
}

