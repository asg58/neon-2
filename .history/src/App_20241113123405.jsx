// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

extend({ TextGeometry, EffectComposer, RenderPass, UnrealBloomPass });

function NeonText({ text, color, intensity }) {
  const mesh = useRef();
  const [font, setFont] = useState(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load('/fonts/gentilis_bold.typeface.json', (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        depth: 0.2,
      });
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text]);

  return (
    <mesh ref={mesh}>
      <meshStandardMaterial emissive={color} emissiveIntensity={intensity} />
    </mesh>
  );
}

function BloomEffect({ bloomSettings }) {
  const { scene, camera, gl } = useThree();
  const composer = useRef();

  useEffect(() => {
    composer.current = new EffectComposer(gl);
    composer.current.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomSettings.strength, // Sterkte van de gloed
      bloomSettings.radius, // Radius van de gloed
      bloomSettings.threshold // Drempelwaarde
    );
    composer.current.addPass(bloomPass);
    composer.current.bloomPass = bloomPass;
  }, [scene, camera, gl]);

  useEffect(() => {
    if (composer.current?.bloomPass) {
      composer.current.bloomPass.strength = bloomSettings.strength;
      composer.current.bloomPass.radius = bloomSettings.radius;
      composer.current.bloomPass.threshold = bloomSettings.threshold;
    }
  }, [bloomSettings]);

  useFrame(() => composer.current?.render(), 1);

  return null;
}

export default function App() {
  const [bloomSettings, setBloomSettings] = useState({
    strength: 2.0,
    radius: 0.5,
    threshold: 0.1,
  });

  const handleBloomChange = (e) => {
    const { name, value } = e.target;
    setBloomSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  return (
    <>
      <Canvas>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <OrbitControls />
        <NeonText text="Neon Text" color="#00ff00" intensity={5} />
        <BloomEffect bloomSettings={bloomSettings} />
      </Canvas>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white' }}>
        <h3>Bloom Settings</h3>
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
    </>
  );
}
