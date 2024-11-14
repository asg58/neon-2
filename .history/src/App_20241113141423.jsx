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

function GlassNeonText({ text, color, intensity, font, envMap }) {
  const mesh = useRef();

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        depth: 0.1,
      });
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text]);

  return (
    <mesh ref={mesh}>
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

function SceneWithReflection({ text, color, font }) {
  const cubeRenderTarget = useRef(
    new THREE.WebGLCubeRenderTarget(512, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    })
  );
  const cubeCamera = useRef();
  const { scene, gl } = useThree();

  useFrame(() => {
    if (cubeCamera.current) {
      cubeCamera.current.update(gl, scene);
    }
  });

  return (
    <>
      <cubeCamera ref={cubeCamera} args={[0.1, 10, cubeRenderTarget.current]} position={[0, 1, 0]} />
      <GlassNeonText text={text} color={color} intensity={10} font={font} envMap={cubeRenderTarget.current.texture} />
    </>
  );
}

export default function App() {
  const [bloomSettings, setBloomSettings] = useState({
    strength: 1.5,
    radius: 0.2,
    threshold: 0.05,
  });
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [font, setFont] = useState(null);
  
  // Voeg hier alle lettertypebestanden toe die je hebt in public/fonts/
  const fontFiles = [
    'gentilis_bold.typeface.json',
    'helvetiker_regular.typeface.json',
    'optimer_bold.typeface.json',
    'roboto_bold.typeface.json',
    // Voeg meer lettertypen toe zoals nodig
  ];

  const [fonts, setFonts] = useState(fontFiles);
  const [selectedFont, setSelectedFont] = useState(fontFiles[0]);

  // Laden van het standaard lettertype bij het opstarten
  useEffect(() => {
    loadFont(selectedFont);
  }, [selectedFont]);

  // Functie om een lettertype te laden op basis van gebruikersselectie
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

  return (
    <>
      <Canvas
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
        style={{ width: '100vw', height: '100vh' }} // Canvas op volledig scherm
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <OrbitControls />
        <SceneWithReflection text={text} color={color} font={font} />
        <BloomEffect bloomSettings={bloomSettings} />
      </Canvas>
      
      {/* Instellingen voor gloed, kleurkiezer, tekstinvoer en lettertypekiezer */}
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
        </div>
        <div>
          <h4>Font Selection</h4>
          <label>
            Font:
            <select value={selectedFont} onChange={handleFontChange} style={{ marginLeft: '10px' }}>
              {fonts.map((fontFile) => (
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
