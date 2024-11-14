// App.jsx
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import NeonText from './components/NeonText';
import BloomEffect from './components/BloomEffect';
import ControlsPanel from './components/ControlsPanel';
import useFontLoader from './hooks/useFontLoader';

export default function App() {
  const [bloomSettings, setBloomSettings] = useState({
    strength: 2.5,
    radius: 0.5,
    threshold: 0.1,
  });
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [fontFiles, setFontFiles] = useState([]); // Lijst van lettertypebestanden
  const [selectedFont, setSelectedFont] = useState(null);

  // Haal fonts op van de server
  useEffect(() => {
    fetch('http://localhost:5000/api/fonts')
      .then((response) => response.json())
      .then((data) => {
        setFontFiles(data.fonts);
        setSelectedFont(data.fonts[0]); // Stel standaard het eerste lettertype in
      })
      .catch((error) => console.error('Error fetching fonts:', error));
  }, []);

  // Laad het geselecteerde lettertype
  const font = useFontLoader(selectedFont ? `/fonts/${selectedFont}` : null);

  const handleBloomChange = (e) => {
    const { name, value } = e.target;
    setBloomSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <OrbitControls />
        <NeonText text={text} color={color} intensity={10} font={font} />
        <BloomEffect bloomSettings={bloomSettings} />
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
      />
    </>
  );
}
