// App.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useDrag } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

extend({ TextGeometry, EffectComposer, RenderPass, UnrealBloomPass });

function ShowroomModel({ lightIntensity, lightColor }) {
  const { scene } = useGLTF('/models/room-transformed.glb');

  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(lightColor, lightIntensity);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(lightColor, lightIntensity, 50);
    pointLight.position.set(5, 10, 5);
    scene.add(pointLight);

    return () => {
      scene.remove(ambientLight);
      scene.remove(pointLight);
    };
  }, [scene, lightIntensity, lightColor]);

  return <primitive object={scene} scale={1.5} />;
}

function GlassNeonText({ text, color, intensity, font, depth, envMap, position, rotation, onClick }) {
  const mesh = useRef();
  const [currentPosition, setCurrentPosition] = useState(position);

  // Drag handler
  const bind = useDrag(({ offset: [x, y] }) => {
    setCurrentPosition([position[0] + x, position[1] + y, position[2]]);
  });

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        depth: depth,
      });
      geometry.center();
      mesh.current.geometry = geometry;
    }
  }, [font, text, depth]);

  return (
    <mesh ref={mesh} position={currentPosition} rotation={rotation} onClick={onClick} castShadow {...bind()}>
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

function BloomEffect({ bloomSettings, children }) {
  const { gl, camera, scene } = useThree();
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
  }, [gl, camera, scene]);

  useEffect(() => {
    if (composer.current?.bloomPass) {
      composer.current.bloomPass.strength = bloomSettings.strength;
      composer.current.bloomPass.radius = bloomSettings.radius;
      composer.current.bloomPass.threshold = bloomSettings.threshold;
    }
  }, [bloomSettings]);

  useFrame(() => composer.current?.render(), 1);

  return <>{children}</>;
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
  const [lightIntensity, setLightIntensity] = useState(0.8);
  const [lightColor, setLightColor] = useState("#ffffff");
  const fontFiles = ['gentilis_bold.typeface.json', 'helvetiker_regular.typeface.json'];
  const [selectedFont, setSelectedFont] = useState(fontFiles[0]);
  const [textPosition, setTextPosition] = useState([-4.5, 1.5, -3]);
  const [textRotation, setTextRotation] = useState([0, Math.PI / 2, 0]);

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

  const handleLightIntensityChange = (e) => {
    setLightIntensity(parseFloat(e.target.value));
  };

  const handleLightColorChange = (e) => {
    setLightColor(e.target.value);
  };

  return (
    <>
      <Canvas dpr={Math.min(window.devicePixelRatio, 2)} style={{ width: '100vw', height: '100vh' }} shadows>
        <ambientLight intensity={0.5} />
        <OrbitControls />

        <ShowroomModel lightIntensity={lightIntensity} lightColor={lightColor} />

        <BloomEffect bloomSettings={bloomSettings}>
          <GlassNeonText
            text={text}
            color={color}
            intensity={10}
            font={font}
            depth={depth}
            position={textPosition}
            rotation={textRotation}
            onClick={() => alert("Tekst geselecteerd!")}
          />
        </BloomEffect>
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
          <h4>Lighting Settings</h4>
          <label>
            Light Intensity: {lightIntensity.toFixed(1)}
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={lightIntensity}
              onChange={handleLightIntensityChange}
            />
          </label>
          <br />
          <label>
            Light Color:
            <input
              type="color"
              value={lightColor}
              onChange={handleLightColorChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
      </div>
    </>
  );
}
