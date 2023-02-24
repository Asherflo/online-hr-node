require("dotenv").config();
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const credentials = require('./credentials.json');


// const client = new OAuth2Client(
//     credentials.web.client_id,
//     credentials.web.client_secret,
//     credentials.web.redirect_uris[0]
//   );

const app = express();
const port = 3000;

// Set up Google Drive API client
// const auth = new google.auth.OAuth2({
//   clientId: process.env.CLIENT_ID,
//   clientSecret:process.env.CLIENT_SECRET,
//   redirectUri: process.env.REDIRECT_URI
// });


// async function getAccessToken(code) {
//     const { tokens } = await client.getToken(code);
//     auth.setCredentials({
//         access_token: tokens.access_token
//       });
//   }


// const drive = google.drive({ version: 'v3', auth });

// Set up multer storage engine to save uploaded file to disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle the form submission
app.post('/submit', upload.single('resume'), (req, res) => {
  const { name, email, phone } = req.body;
  const resumeFile = req.file;
  console.log(name);

  // Create a new file in Google Drive
  const fileMetadata = {
    name: resumeFile.originalname,
    parents: ['FOLDER_ID']
  };
  const media = {
    mimeType: resumeFile.mimetype,
    body: require('fs').createReadStream(resumeFile.path)
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, (err, file) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading file');
      return;
    }

    console.log(`File ID: ${file.data.id}`);

    // Save the application data to a Google Sheet
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.append({
      spreadsheetId: 'SPREADSHEET_ID',
      range: 'Sheet1!A:B',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, email, phone, file.data.id, new Date().toISOString()]]
      }
    }, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving data');
        return;
      }

      console.log(response.data);

      res.status(200).send('Application submitted successfully');
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
