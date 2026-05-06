/**
 * Partners in Play — Community Gallery backend
 *
 * Deploy as a Google Apps Script Web App bound to a Google Sheet.
 * The sheet stores submissions; the admin moderates by editing the `status` column.
 *
 * Setup (10 min):
 *   1. Create a new Google Sheet. Add a tab named "posts".
 *   2. Add this row 1 (case-sensitive): timestamp | imageUrl | description | tags | name | status | id
 *   3. Tools → Apps Script. Paste this file. Save.
 *   4. (Optional) In Project Settings, set ADMIN_EMAIL via Script Properties or hard-code below.
 *   5. Deploy → New deployment → Web app:
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Copy the /exec URL into the frontend's VITE_GALLERY_API.
 *   6. Approve a post: change its status cell to "approved". The gallery only shows approved rows.
 */

const SHEET_NAME = 'posts';
// Set ADMIN_EMAIL to receive an email per submission. Leave '' to skip notifications.
const ADMIN_EMAIL = '';

function _sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['timestamp', 'imageUrl', 'description', 'tags', 'name', 'status', 'id']);
  }
  return sh;
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'list';
  if (action === 'list') {
    const sh = _sheet();
    const values = sh.getDataRange().getValues();
    if (values.length < 2) return _json({ posts: [] });
    const [head, ...rows] = values;
    const idx = (k) => head.indexOf(k);
    const posts = rows
      .filter((r) => String(r[idx('status')]).toLowerCase() === 'approved')
      .map((r) => ({
        id: r[idx('id')],
        timestamp: r[idx('timestamp')],
        imageUrl: r[idx('imageUrl')],
        description: r[idx('description')],
        tags: r[idx('tags')],
        name: r[idx('name')],
      }))
      .reverse();
    return _json({ posts });
  }
  return _json({ error: 'unknown action' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.action !== 'submit') return _json({ error: 'unknown action' });

    const id = Utilities.getUuid();
    const row = [
      new Date().toISOString(),
      String(body.imageUrl || ''),
      String(body.description || ''),
      String(body.tags || ''),
      String(body.name || ''),
      'pending',
      id,
    ];
    _sheet().appendRow(row);

    if (ADMIN_EMAIL) {
      const subject = 'New gallery submission to review';
      const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
      const body = `A new post is awaiting review.\n\nDescription: ${row[2]}\nTags: ${row[3]}\nName: ${row[4]}\nImage: ${row[1]}\n\nReview in the sheet:\n${sheetUrl}\n\nTo approve, set the row's "status" cell to "approved".`;
      MailApp.sendEmail(ADMIN_EMAIL, subject, body);
    }
    return _json({ ok: true, id });
  } catch (err) {
    return _json({ error: String(err) });
  }
}
