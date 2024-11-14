// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Gebruik CORS om toegang van andere domeinen mogelijk te maken
app.use(cors());

// Statische bestanden serveren uit de 'public' map
app.use(express.static('public'));

// API-endpoint voor het ophalen van beschikbare lettertypen
app.get('/api/fonts', (req, res) => {
  // Pad naar de fonts directory
  const fontsDir = path.join(__dirname, 'public', 'fonts');
  
  // Lees de inhoud van de fonts directory
  fs.readdir(fontsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading fonts directory' });
    }

    // Filter alleen de .typeface.json bestanden (die lettertypen zijn)
    const fontFiles = files.filter(file => file.endsWith('.typeface.json'));
    
    // Retourneer de lijst van lettertypen in JSON formaat
    res.json({ fonts: fontFiles });
  });
});

// Start de server op poort 5000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
