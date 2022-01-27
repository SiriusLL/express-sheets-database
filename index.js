const express = require("express");
const dotenv = require("dotenv");
const { google } = require("googleapis");

dotenv.config();

const app = express();

app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "client_secret.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.SPREADSHEET_ID;
  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  const sheetTitle = metaData.data.sheets[0].properties.title;
  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: sheetTitle,
  });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: `${sheetTitle}!A:B`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [["make a testqq", "test completeqq"]],
    },
  });

  res.send(getRows.data.values);
});

app.listen(1337, (req, res) => console.log("running on 1337"));

// https://www.youtube.com/watch?v=PFJNJQCU_lo
// https://www.youtube.com/watch?v=VPI27L_fQC4
