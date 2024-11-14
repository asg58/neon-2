// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three/examples/jsm/postprocessing';
import { useFrame } from '@react-three/fiber';

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

function BloomEffect() {
  const { scene, camera, gl } = useThree();
  const composer = useRef();

  useEffect(() => {
    composer.current = new EffectComposer(gl);
    composer.current.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5; // Hoe sterk de gloed is
    bloomPass.radius = 0.5; // De straal van de gloed
    composer.current.addPass(bloomPass);
  }, [scene, camera, gl]);

  useFrame(() => composer.current?.render(), 1);

  return null;
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <OrbitControls />
      <NeonText text="Neon Text" color="#00ff00" intensity={5} />
      <BloomEffect />
    </Canvas>
  );
}
