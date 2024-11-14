// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [fonts, setFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState('');
  const [text, setText] = useState('Neon Text');
  const [color, setColor] = useState("#39FF14");

  useEffect(() => {
    // Haal de lettertypen op van de server
    axios.get('/api/fonts')
      .then(response => {
        const fontFiles = response.data.fonts;
        setFonts(fontFiles);
        if (fontFiles.length > 0) {
          setSelectedFont(fontFiles[0]);
        }
      })
      .catch(error => {
        console.error("Er was een probleem met het ophalen van de lettertypen:", error);
      });
  }, []);

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <>
      <div>
        <h1>Neon Text Configurator</h1>
        <label>
          Choose Font:
          <select value={selectedFont} onChange={handleFontChange}>
            {fonts.map(font => (
              <option key={font} value={font}>
                {font.replace('.typeface.json', '')}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Enter Text:
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter neon text"
          />
        </label>
        <br />
        <label>
          Text Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
      </div>
    </>
  );
}
