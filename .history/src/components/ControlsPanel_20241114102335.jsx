// ControlsPanel.jsx
import React from 'react';

export default function ControlsPanel({
  color,
  onColorChange,
  text,
  onTextChange,
  selectedFont,
  onFontChange,
  fontFiles
}) {
  return (
    <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
      <h3>Text Settings</h3>
      <div>
        <label>
          Text Color:
          <input
            type="color"
            value={color}
            onChange={onColorChange}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <br />
        <label>
          Text:
          <input
            type="text"
            value={text}
            onChange={onTextChange}
            placeholder="Enter text"
            style={{ marginLeft: '10px', width: '200px' }}
          />
        </label>
      </div>
      <div>
        <h4>Font Selection</h4>
        <label>
          Font:
          <select value={selectedFont || ""} onChange={onFontChange} style={{ marginLeft: '10px' }}>
            {fontFiles.map((fontFile) => (
              <option key={fontFile} value={fontFile}>
                {fontFile.replace('.typeface.json', '')}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
