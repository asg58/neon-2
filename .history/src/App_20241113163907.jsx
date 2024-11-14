// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import * as THREE from 'three';
import GlassNeonText from './components/GlassNeonText';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

function App() {
  const [text, setText] = useState("Neon Text");
  const [color, setColor] = useState("#39FF14");
  const [intensity, setIntensity] = useState(2);
  const [font, setFont] = useState(null);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [bloomSettings, setBloomSettings] = useState({
    strength: 1.5,
    radius: 0.2,
    threshold: 0.05,
  });

  useEffect(() => {
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  // Update Bloom settings
  const handleBloomChange = (e) => {
    const { name, value } = e.target;
    setBloomSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
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
        <GlassNeonText
          text={text}
          color={color}
          intensity={intensity}
          font={font}
          depth={0.1}
          envMap={null} // Je kunt hier een omgevingsteksturen toevoegen als je wilt
          position={position}
          rotation={rotation}
          setIsDragging={setIsDragging}
        />
      </Canvas>

      {/* Instellingen voor gloed, kleurkiezer en tekstinvoer */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '10px',
          borderRadius: '8px',
        }}
      >
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
      </div>
    </>
  );
}

export default App;
