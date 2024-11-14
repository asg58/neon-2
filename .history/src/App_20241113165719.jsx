import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GlassNeonText from './components/GlassNeonText';
import BloomEffect from './components/BloomEffect';
import ShowroomPaneel from './components/ShowroomPaneel';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export default function App() {
  const [bloomSettings, setBloomSettings] = useState({ strength: 1.5, radius: 0.2, threshold: 0.05 });
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [depth, setDepth] = useState(0.1);
  const [font, setFont] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Laad het font
  useEffect(() => {
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', (loadedFont) => setFont(loadedFont));
  }, []);

  const handleBloomChange = (e) => {
    const { name, value } = e.target;
    setBloomSettings((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <OrbitControls />
        {/* Voeg het ShowroomPaneel toe als wand */}
        <ShowroomPaneel />
        <GlassNeonText
          text={text}
          color={color}
          intensity={10}
          font={font}
          depth={depth}
          position={[0, 0, -2]} // Plaats de tekst in de juiste positie op de wand
          setIsDragging={setIsDragging}
        />
        <BloomEffect bloomSettings={bloomSettings} />
      </Canvas>

      {/* Knoppen en instellingen */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
        <h3>Neon Settings</h3>
        <div>
          <label>Text:</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <label>Text Color:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
      </div>
    </>
  );
}
