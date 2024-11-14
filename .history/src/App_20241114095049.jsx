import React, { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

extend({ TextGeometry, EffectComposer, RenderPass, UnrealBloomPass });

// Vertex shader voor de glow
const GlowVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

// Fragment shader voor de glow
const GlowFragmentShader = `
  uniform vec3 glowColor;
  uniform float glowIntensity;
  varying vec3 vNormal;

  void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(glowColor * glowIntensity * intensity, 1.0);
  }
`;

function NeonText({ text, color, intensity, font }) {
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
      {/* Basis neon tekst */}
      <mesh ref={mesh}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} />
      </mesh>

      {/* Glow effect met GLSL shader */}
      <mesh ref={glowMesh} scale={1.15}>
        <shaderMaterial
          vertexShader={GlowVertexShader}
          fragmentShader={GlowFragmentShader}
          blending={THREE.AdditiveBlending}
          transparent={true}
          uniforms={{
            glowColor: { value: new THREE.Color(color) },
            glowIntensity: { value: 2.5 }
          }}
        />
      </mesh>
    </>
  );
}

function BloomEffect({ bloomSettings }) {
  const { scene, camera, gl } = useThree();
  const composer = useRef();

  useEffect(() => {
    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      format: THREE.RGBFormat,
      minFilter: THREE.LinearMipmapLinearFilter,
      generateMipmaps: true,
    });

    composer.current = new EffectComposer(gl, renderTarget);
    composer.current.setSize(window.innerWidth, window.innerHeight);
    composer.current.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
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
    strength: 2.5,
    radius: 0.5,
    threshold: 0.1,
  });
  const [color, setColor] = useState("#39FF14");
  const [text, setText] = useState("Neon Text");
  const [font, setFont] = useState(null);

  const fontFiles = [
    'gentilis_bold.typeface.json',
    'helvetiker_regular.typeface.json',
    'optimer_bold.typeface.json',
    'roboto_bold.typeface.json',
  ];

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

  const handleColorChange = (e) => setColor(e.target.value);
  const handleTextChange = (e) => setText(e.target.value);
  const handleFontChange = (e) => setSelectedFont(e.target.value);

  return (
    <>
      <Canvas dpr={Math.min(window.devicePixelRatio, 2)} style={{ width: '100vw', height: '100vh' }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <OrbitControls />
        <NeonText text={text} color={color} intensity={10} font={font} />
        <BloomEffect bloomSettings={bloomSettings} />
      </Canvas>
      
      {/* UI voor instellingen */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }}>
        <h3>Neon Settings</h3>
        <div>
          <h4>Bloom Settings</h4>
          <label>
            Strength: {bloomSettings.strength}
            <input type="range" name="strength" min="0" max="5" step="0.1" value={bloomSettings.strength} onChange={handleBloomChange} />
          </label>
          <br />
          <label>
            Radius: {bloomSettings.radius}
            <input type="range" name="radius" min="0" max="2" step="0.1" value={bloomSettings.radius} onChange={handleBloomChange} />
          </label>
          <br />
          <label>
            Threshold: {bloomSettings.threshold}
            <input type="range" name="threshold" min="0" max="1" step="0.05" value={bloomSettings.threshold} onChange={handleBloomChange} />
          </label>
        </div>
        <div>
          <h4>Text Settings</h4>
          <label>
            Text Color:
            <input type="color" value={color} onChange={handleColorChange} style={{ marginLeft: '10px' }} />
          </label>
          <br />
          <label>
            Text:
            <input type="text" value={text} onChange={handleTextChange} placeholder="Enter neon text" style={{ marginLeft: '10px', width: '200px' }} />
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
