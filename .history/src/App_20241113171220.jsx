import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GlassNeonText from './components/GlassNeonText';
import BloomEffect from './components/BloomEffect';
import ShowroomPanel from './components/ShowroomPanel'; // Updated to ShowroomPanel
import ControlsPanel from './components/ControlsPanel';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export default function App() {
  const [bloomSettings, setBloomSettings] = useState({ strength: 1.5, radius: 0.2, threshold: 0.05 });
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [depth, setDepth] = useState(0.1);
  const [font, setFont] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Font files in public/fonts
  const fontFiles = [
    'gentilis_bold.typeface.json',
    'helvetiker_regular.typeface.json',
    'optimer_bold.typeface.json',
    'roboto_bold.typeface.json'
  ];
  
  const [selectedFont, setSelectedFont] = useState(fontFiles[0]);

  // Load the selected font
  useEffect(() => {
    const loader = new FontLoader();
    loader.load(`/fonts/${selectedFont}`, (loadedFont) => setFont(loadedFont));
  }, [selectedFont]);

  const handleBloomChange = (e) => {
    const { name, value } = e.target;
    setBloomSettings((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <ambientLight intensity={0.5} />
        <OrbitControls enablePan={!isDragging} enableZoom={!isDragging} enableRotate={!isDragging} />
        
        {/* Use the new ShowroomPanel for the wall */}
        <ShowroomPanel />
        
        <BloomEffect bloomSettings={bloomSettings} />
        <GlassNeonText
          text={text}
          color={color}
          intensity={10}
          font={font}
          depth={depth}
          position={[0, 0, -2]}
          setIsDragging={setIsDragging}
        />
      </Canvas>

      <ControlsPanel
        bloomSettings={bloomSettings}
        onBloomChange={handleBloomChange}
        color={color}
        onColorChange={(e) => setColor(e.target.value)}
        text={text}
        onTextChange={(e) => setText(e.target.value)}
        depth={depth}
        onDepthChange={(e) => setDepth(parseFloat(e.target.value))}
        selectedFont={selectedFont}
        onFontChange={handleFontChange}
        fontFiles={fontFiles}
      />
    </>
  );
}
