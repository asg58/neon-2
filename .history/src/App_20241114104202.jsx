// App.jsx
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import NeonText from './components/NeonText';
import BloomEffect from './components/BloomEffect';
import ControlsPanel from './components/ControlsPanel';
import useFetchFonts from './hooks/useFetchFonts';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export default function App() {
  const [bloomSettings, setBloomSettings] = useState({
    strength: 1.5,
    radius: 0.4,
    threshold: 0.2,
  });
  const [color, setColor] = useState("#39FF14"); // Standaardkleur groen
  const [text, setText] = useState("Neon Text");
  const { fonts, error } = useFetchFonts();

  const [selectedFont, setSelectedFont] = useState("");
  const [font, setFont] = useState(null);
  const [materialType, setMaterialType] = useState("basic");

  // Zet selectedFont naar het eerste font zodra fonts zijn geladen
  useEffect(() => {
    if (fonts.length > 0 && !selectedFont) {
      setSelectedFont(fonts[0]);
    }
  }, [fonts, selectedFont]);

  // Laad het geselecteerde font zodra het verandert
  useEffect(() => {
    if (selectedFont) {
      const loader = new FontLoader();
      loader.load(`/fonts/${selectedFont}`, (loadedFont) => {
        setFont(loadedFont);
      });
    }
  }, [selectedFont]);

  const handleBloomChange = (e) => {
    const { name, value } = e.target;
    setBloomSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  if (error) return <div>Error loading fonts: {error.message}</div>;

  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <OrbitControls />
        
        {/* NeonText-component met de gekozen materialType */}
        <NeonText text={text} color={color} font={font} materialType={materialType} />

        {/* BloomEffect toegevoegd voor het neon-gloweffect */}
        {materialType === "bloom" && (
          <BloomEffect strength={bloomSettings.strength} radius={bloomSettings.radius} threshold={bloomSettings.threshold} />
        )}
      </Canvas>

      <ControlsPanel
        bloomSettings={bloomSettings}
        onBloomChange={handleBloomChange}
        color={color}
        onColorChange={(e) => setColor(e.target.value)}
        text={text}
        onTextChange={(e) => setText(e.target.value)}
        selectedFont={selectedFont}
        onFontChange={(e) => setSelectedFont(e.target.value)}
        fontFiles={fonts}
        materialType={materialType}
        onMaterialChange={setMaterialType}
      />
    </>
  );
}
