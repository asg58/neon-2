import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GlassNeonText from './components/GlassNeonText';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import * as THREE from 'three';

export default function App() {
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [depth, setDepth] = useState(0.1);
  const [font, setFont] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Font-bestanden in de public/fonts-map
  const fontFiles = [
    'gentilis_bold.typeface.json',
    'helvetiker_regular.typeface.json',
    'optimer_bold.typeface.json',
    'roboto_bold.typeface.json'
  ];

  const [selectedFont, setSelectedFont] = useState(fontFiles[0]);

  // Laad het lettertype op basis van geselecteerde waarde
  useEffect(() => {
    const loader = new FontLoader();
    loader.load(`/fonts/${selectedFont}`, (loadedFont) => setFont(loadedFont));
  }, [selectedFont]);

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  return (
    <>
      <Canvas 
        style={{ width: '100vw', height: '100vh' }}
        gl={{ antialias: true }} // Schakel anti-aliasing in voor een betere kwaliteit
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />

        {/* Simple Wall Panel */}
        <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
          <planeGeometry args={[10, 6]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Glass Neon Text */}
        <GlassNeonText
          text={text}
          color={color}
          intensity={10}
          font={font}
          depth={depth}
          position={[0, 0, -4]} // Position the text just in front of the panel
          setIsDragging={setIsDragging}
        />

        <OrbitControls enablePan={!isDragging} enableZoom={!isDragging} enableRotate={!isDragging} />
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
        <div>
          <label>Text Depth:</label>
          <input type="number" value={depth} onChange={(e) => setDepth(parseFloat(e.target.value))} />
        </div>
        <div>
          <label>Font Selection:</label>
          <select value={selectedFont} onChange={handleFontChange}>
            {fontFiles.map((fontFile) => (
              <option key={fontFile} value={fontFile}>
                {fontFile.replace('.typeface.json', '')}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
