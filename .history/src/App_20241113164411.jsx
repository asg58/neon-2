import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GlassNeonText from './components/GlassNeonText';
import BloomEffect from './components/BloomEffect';
import * as THREE from 'three';

export default function App() {
  const [text, setText] = useState("Neon Text");
  const [color, setColor] = useState("#39FF14");
  const [font, setFont] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Laad het lettertype in (gebruik een statisch lettertype of een map)
  useEffect(() => {
    const loader = new THREE.FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  const handleTextChange = (e) => setText(e.target.value);
  const handleColorChange = (e) => setColor(e.target.value);

  return (
    <>
      <Canvas>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <OrbitControls />
        <GlassNeonText
          text={text}
          color={color}
          font={font}
          setIsDragging={setIsDragging}
        />
        <BloomEffect />
      </Canvas>
      
      {/* Knoppen en instellingen */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
        <h3>Neon Settings</h3>
        <div>
          <label>Text:</label>
          <input type="text" value={text} onChange={handleTextChange} />
        </div>
        <div>
          <label>Text Color:</label>
          <input type="color" value={color} onChange={handleColorChange} />
        </div>
        {/* Voeg een knop toe voor andere functies */}
        <button onClick={() => setText("Updated Neon Text!")}>Update Text</button>
      </div>
    </>
  );
}
