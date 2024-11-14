// App.jsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import NeonText from './components/NeonText';
import BloomEffect from './components/BloomEffect';
import ControlsPanel from './components/ControlsPanel';
import useFontLoader from './hooks/useFontLoader';

export default function App() {
  const [bloomSettings, setBloomSettings] = useState({
    strength: 1.5,
    radius: 0.4,
    threshold: 0.2,
  });
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [materialType, setMaterialType] = useState("basic");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, depth: 0 });

  // Custom hook om het font te laden
  const { font, fontFiles, selectedFont, setSelectedFont, error } = useFontLoader();

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
        
        <NeonText
          text={text}
          color={color}
          font={font}
          materialType={materialType}
          onDimensionsChange={setDimensions}
        />

        {materialType === "bloom" && (
          <BloomEffect
            strength={bloomSettings.strength}
            radius={bloomSettings.radius}
            threshold={bloomSettings.threshold}
          />
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
        fontFiles={fontFiles}
        materialType={materialType}
        onMaterialChange={setMaterialType}
        dimensions={dimensions}
      />
    </>
  );
}
