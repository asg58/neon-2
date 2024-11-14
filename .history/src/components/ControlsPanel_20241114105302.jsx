// ControlsPanel.jsx
import React from 'react';

export default function ControlsPanel({
  bloomSettings,
  onBloomChange,
  color,
  onColorChange,
  text,
  onTextChange,
  selectedFont,
  onFontChange,
  fontFiles,
  materialType,
  onMaterialChange,
  dimensions,
}) {
  return (
    <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
      <h3>Neon Settings</h3>
      <div>
        <h4>Bloom Settings</h4>
        <label>
          Strength: {bloomSettings.strength}
          <input
            type="range"
            name="strength"
            min="0"
            max="5"
            step="0.1"
            value={bloomSettings.strength}
            onChange={onBloomChange}
          />
        </label>
        <br />
        <label>
          Radius: {bloomSettings.radius}
          <input
            type="range"
            name="radius"
            min="0"
            max="2"
            step="0.1"
            value={bloomSettings.radius}
            onChange={onBloomChange}
          />
        </label>
        <br />
        <label>
          Threshold: {bloomSettings.threshold}
          <input
            type="range"
            name="threshold"
            min="0"
            max="1"
            step="0.05"
            value={bloomSettings.threshold}
            onChange={onBloomChange}
          />
        </label>
      </div>
      <div>
        <h4>Text Settings</h4>
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
      <div>
        <h4>Material Type</h4>
        <label>
          Material:
          <select value={materialType} onChange={(e) => onMaterialChange(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="basic">Basic</option>
            <option value="emissive">Emissive</option>
            <option value="bloom">Bloom</option>
          </select>
        </label>
      </div>
      <div>
        <h4>Dimensions</h4>
        <p>Width: {dimensions.width.toFixed(2)} units</p>
        <p>Height: {dimensions.height.toFixed(2)} units</p>
        <p>Depth: {dimensions.depth.toFixed(2)} units</p>
      </div>
    </div>
  );
}
