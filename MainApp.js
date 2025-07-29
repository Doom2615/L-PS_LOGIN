// importing the necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// creating an express app
const app = express();

// importing the security
for (let file of fs.readdirSync(path.join(__dirname, 'security'))) {
    require(path.join(__dirname, 'security', file))(app);
}

// importing the middlewares
for (let file of fs.readdirSync(path.join(__dirname, 'middleware'))) {
    require(path.join(__dirname, 'middleware', file))(app);
}

// importing the routes
require(path.join(__dirname, 'routes', 'Index.js'))(app);
require(path.join(__dirname, 'routes', 'GrowtopiaWebview.js'))(app);

app.get('/', function (req, res) {
   res.send('L-PS Login Url');
});

app.get('/public/cache/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'cache', filename);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/octet-stream'); // Adjust for .rttex if known

    // Stream the file to handle large files
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      res.status(500).json({ error: 'Error streaming file' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 route
app.use((req, res) => {
    console.log(`[${new Date().toLocaleString()}] Missing file: ${req.url} [${req.method}] - ${res.statusCode}`);
    return res.sendStatus(404);
});

// exporting express app
module.exports = app;
