// src/components/NeonText.jsx
import React, { useEffect, useRef, useState } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import calculateDimensions from '../utils/calculateDimensions';

extend({ TextGeometry });

export default function NeonText({ text, color, font, materialType, onDimensionsChange }) {
  const mesh = useRef();
  const [scale, setScale] = useState(1); // State voor de grootte van de tekst

  useEffect(() => {
    if (font && mesh.current) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        depth: 0.1,
        curveSegments: 12,
      });
      mesh.current.geometry = geometry;

      const dimensions = calculateDimensions(mesh.current);
      onDimensionsChange(dimensions);
    }
  }, [font, text, scale]);

  useFrame(() => {
    // Pas de schaal aan voor real-time aanpassing
    mesh.current.scale.set(scale, scale, scale);

    // Bereken afmetingen en update tijdens het schalen
    const dimensions = calculateDimensions(mesh.current);
    onDimensionsChange(dimensions);
  });

  // Muis-handlers voor schaalaanpassing
  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    e.target.onpointermove = handlePointerMove;
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    e.target.onpointermove = null;
  };

  const handlePointerMove = (e) => {
    e.stopPropagation();
    const delta = e.movementX * 0.01; // Schaal aan de hand van de muisbeweging
    setScale((prevScale) => Math.max(0.1, prevScale + delta));
  };

  // Kies het materiaaltype op basis van de keuze
  let material;
  if (materialType === "basic") {
    material = <meshBasicMaterial color={color} />;
  } else if (materialType === "emissive") {
    material = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />;
  } else if (materialType === "bloom") {
    material = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />;
  }

  return (
    <mesh
      ref={mesh}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      position={[0, 0, 0]}
    >
      {material}
    </mesh>
  );
}
