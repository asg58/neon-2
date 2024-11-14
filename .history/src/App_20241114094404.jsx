// App.js
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { GlowVertexShader } from './GlowVertexShader';
import { GlowFragmentShader } from './GlowFragmentShader';

extend({ TextGeometry });

function NeonText({ text, color, font }) {
  const mesh = useRef();
  const glowMesh = useRef();

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        height: 0.1,
      });
      geometry.center();
      mesh.current.geometry = geometry;
      glowMesh.current.geometry = geometry;
    }
  }, [font, text]);

  return (
    <>
      {/* Basis neon tekst met emissive kleur */}
      <mesh ref={mesh}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>

      {/* Glow effect met GLSL shader */}
      <mesh ref={glowMesh} scale={1.1}>
        <shaderMaterial
          vertexShader={GlowVertexShader}
          fragmentShader={GlowFragmentShader}
          blending={THREE.AdditiveBlending}
          transparent={true}
          uniforms={{
            glowColor: { value: new THREE.Color(color) },
            glowIntensity: { value: 1.5 }
          }}
        />
      </mesh>
    </>
  );
}

export default function App() {
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [font, setFont] = useState(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  const handleColorChange = (e) => setColor(e.target.value);
  const handleTextChange = (e) => setText(e.target.value);

  return (
    <>
      <Canvas
        dpr={Math.min(window.devicePixelRatio, 2)}
        style={{ width: '100vw', height: '100vh' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <OrbitControls />
        <NeonText text={text} color={color} font={font} />
      </Canvas>

      {/* UI voor het aanpassen van tekst en kleur */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
        <h3>Neon Settings</h3>
        <div>
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
