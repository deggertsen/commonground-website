# Contact Form Setup — Google Apps Script

The contact form sends submissions to a Google Apps Script endpoint that emails the data to hello@commongroundhoa.com.

## Setup Steps (5 minutes, one time)

1. Go to https://script.google.com
2. Click "New Project"
3. Delete the default code and paste the following:

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  
  var subject = 'New Lead: ' + (data.community || data.name);
  var body = 'New Common Ground Lead\n\n' +
    'Name: ' + data.name + '\n' +
    'Community: ' + data.community + '\n' +
    'Email: ' + data.email + '\n' +
    'Number of Units: ' + data.units + '\n' +
    'Message: ' + data.message + '\n\n' +
    'Submitted: ' + new Date().toLocaleString();
  
  GmailApp.sendEmail('hello@commongroundhoa.com', subject, body, {
    replyTo: data.email,
    name: 'Common Ground Website'
  });
  
  // Also log to a spreadsheet for tracking
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  sheet.appendRow([new Date(), data.name, data.community, data.email, data.units, data.message]);
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. (Optional) Create a Google Sheet for lead tracking, copy its ID, and replace `SPREADSHEET_ID`. Or remove the spreadsheet lines.
5. Click "Deploy" > "New Deployment"
6. Type: "Web app"
7. Execute as: "Me"
8. Who has access: "Anyone"
9. Click "Deploy" and authorize when prompted
10. Copy the deployment URL (looks like `https://script.google.com/macros/s/ABC.../exec`)
11. In `script.js`, replace `APPS_SCRIPT_ID` with just the ID part, or replace the full URL

That's it! Form submissions will email you AND log to a spreadsheet.
