import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GlassNeonText from './components/GlassNeonText';
import BloomEffect from './components/BloomEffect';
import ControlsPanel from './components/ControlsPanel';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export default function App() {
  const [bloomSettings, setBloomSettings] = useState({ strength: 1.5, radius: 0.2, threshold: 0.05 });
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
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        
        {/* Simple Wall Panel */}
        <mesh position={[0, 0, -5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 6]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Text Object */}
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
        <BloomEffect bloomSettings={bloomSettings} />
      </Canvas>

      {/* Knoppen en instellingen */}
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
