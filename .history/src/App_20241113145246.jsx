// App.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

extend({ TextGeometry, EffectComposer, RenderPass, UnrealBloomPass });

function ShowroomModel() {
  const { scene } = useGLTF('/models/room-transformed.glb'); // Verwijzing naar je model
  return <primitive object={scene} scale={1.5} />;
}

function GlassNeonText({ text, color, intensity, font, depth, envMap, position }) {
  const mesh = useRef();

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        depth: depth,
      });
      geometry.translate(0, 0, -depth / 2);
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text, depth]);

  return (
    <mesh ref={mesh} position={position} castShadow>
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        roughness={0.2}
        metalness={0.1}
        transmission={0.9}
        thickness={0.3}
        ior={1.4}
        reflectivity={0.8}
        envMap={envMap}
      />
    </mesh>
  );
}

function BloomEffect({ bloomSettings }) {
  const { scene, camera, gl } = useThree();
  const composer = useRef();

  useEffect(() => {
    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth * 2, window.innerHeight * 2, {
      format: THREE.RGBFormat,
      minFilter: THREE.LinearMipmapLinearFilter,
      generateMipmaps: true,
    });

    composer.current = new EffectComposer(gl, renderTarget);
    composer.current.setSize(window.innerWidth * 2, window.innerHeight * 2);
    composer.current.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth * 2, window.innerHeight * 2),
      bloomSettings.strength,
      bloomSettings.radius,
      bloomSettings.threshold
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
    strength: 1.5,
    radius: 0.2,
    threshold: 0.05,
  });
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [depth, setDepth] = useState(0.1);
  const [font, setFont] = useState(null);
  const fontFiles = ['gentilis_bold.typeface.json', 'helvetiker_regular.typeface.json'];
  const [selectedFont, setSelectedFont] = useState(fontFiles[0]);

  useEffect(() => {
    loadFont(selectedFont);
  }, [selectedFont]);

  const loadFont = (fontFile) => {
    const loader = new FontLoader();
    loader.load(`/fonts/${fontFile}`, (loadedFont) => {
      setFont(loadedFont);
    });
  };

  const handleBloomChange = (e) => {
    const { name, value } = e.target;
    setBloomSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  const handleDepthChange = (e) => {
    setDepth(parseFloat(e.target.value));
  };

  return (
    <>
      <Canvas
        dpr={Math.min(window.devicePixelRatio, 2)}
        style={{ width: '100vw', height: '100vh' }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} intensity={0.8} castShadow />
        <OrbitControls />

        {/* Laad het .glb showroommodel */}
        <ShowroomModel />

        {/* Plaats de neon-tekst in de showroom */}
        <GlassNeonText
          text={text}
          color={color}
          intensity={10}
          font={font}
          depth={depth}
          position={[0, 1, -2]}
        />
        <BloomEffect bloomSettings={bloomSettings} />
      </Canvas>

      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
        <h3>Neon Settings</h3>
        <div>
          <h4>Bloom Settings</h4>
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
        <div>
          <h4>Text Settings</h4>
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
          <br />
          <label>
            Depth: {depth.toFixed(2)}
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={depth}
              onChange={handleDepthChange}
            />
          </label>
        </div>
        <div>
          <h4>Font Selection</h4>
          <label>
            Font:
            <select value={selectedFont} onChange={handleFontChange} style={{ marginLeft: '10px' }}>
              {fontFiles.map((fontFile) => (
                <option key={fontFile} value={fontFile}>
                  {fontFile.replace('.typeface.json', '')}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
