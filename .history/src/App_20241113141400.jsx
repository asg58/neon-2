// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

extend({ TextGeometry, EffectComposer, RenderPass, UnrealBloomPass });

function GlassNeonText({ text, color, intensity, font, envMap }) {
  const mesh = React.useRef();

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        depth: 0.1,
      });
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text]);

  return (
    <mesh ref={mesh}>
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        roughness={0.2}
        metalness={0.1}
        transmission={0.9}
        thickness={0.3}
        ior={1.4}
        reflectivity={0.8}
        envMap={envMap}
      />
    </mesh>
  );
}

export default function App() {
  const [bloomSettings, setBloomSettings] = useState({
    strength: 1.5,
    radius: 0.2,
    threshold: 0.05,
  });
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [font, setFont] = useState(null);
  const [fonts, setFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState('');

  // Haal de lettertypen op van de server
  useEffect(() => {
    axios.get('http://localhost:5000/fonts')
      .then(response => {
        if (response.data) {
          // Veronderstel dat de server de lijst met bestanden retourneert
          const fontFiles = response.data;
          setFonts(fontFiles);
          if (fontFiles.length > 0) {
            loadFont(fontFiles[0]);
          }
        } else {
          console.error("De opgehaalde response bevat geen 'fonts' gegevens.");
        }
      })
      .catch(error => {
        console.error("Er was een probleem met het ophalen van de lettertypen:", error);
      });
  }, []);

  // Functie om een lettertype te laden
  const loadFont = (fontFile) => {
    const loader = new FontLoader();
    loader.load(`http://localhost:5000/fonts/${fontFile}`, (loadedFont) => {
      setFont(loadedFont);
      setSelectedFont(fontFile);
    });
  };

  const handleBloomChange = (e) => {
    const { name, value } = e.target;
    setBloomSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFontChange = (e) => {
    const newFont = e.target.value;
    setSelectedFont(newFont);
    loadFont(newFont);
  };

  return (
    <>
      <Canvas
        dpr={Math.min(window.devicePixelRatio, 2)}
        style={{ width: '100vw', height: '100vh' }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <OrbitControls />
        <GlassNeonText text={text} color={color} intensity={10} font={font} />
      </Canvas>
      
      {/* Instellingen voor gloed, kleurkiezer, tekstinvoer en lettertypekiezer */}
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
              onChange={handleBloomChange}
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
              onChange={handleBloomChange}
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
              onChange={handleBloomChange}
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
              onChange={handleColorChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
          <br />
          <label>
            Text:
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter neon text"
              style={{ marginLeft: '10px', width: '200px' }}
            />
          </label>
        </div>
        <div>
          <h4>Font Selection</h4>
          <label>
            Font:
            <select value={selectedFont} onChange={handleFontChange} style={{ marginLeft: '10px' }}>
              {Array.isArray(fonts) && fonts.length > 0 ? (
                fonts.map(font => (
                  <option key={font} value={font}>
                    {font.replace('.typeface.json', '')}
                  </option>
                ))
              ) : (
                <option disabled>Geen lettertypen beschikbaar</option>
              )}
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
