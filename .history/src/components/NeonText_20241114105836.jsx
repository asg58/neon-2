// NeonText.jsx
import React, { useEffect, useRef } from 'react';
import { extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

extend({ TextGeometry });

export default function NeonText({ text, color, font, materialType, onDimensionsChange }) {
  const mesh = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (mesh.current && font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        depth: 0.1,
        curveSegments: 12,
      });
      geometry.center();
      mesh.current.geometry = geometry;

      // Bereken afmetingen en stuur deze terug in centimeters
      const { width, height, depth } = new THREE.Box3().setFromObject(mesh.current).getSize(new THREE.Vector3());
      onDimensionsChange({ width: width * 1, height: height * 1, depth: depth * 1 }); // schaal 1 unit = 1 cm
    }
  }, [font, text, onDimensionsChange]);

  // Kies het materiaaltype op basis van de keuze
  let material;
  if (materialType === "basic") {
    material = <meshBasicMaterial color={color} />;
  } else if (materialType === "emissive") {
    material = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />;
  } else if (materialType === "bloom") {
    material = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />;
  }

  // Labels voor afmetingen
  const ArrowLabel = ({ position, text }) => (
    <mesh position={position}>
      <textGeometry args={[text, { font, size: 0.2, height: 0.01 }]} />
      <meshBasicMaterial color="white" />
    </mesh>
  );

  return (
    <group>
      <mesh ref={mesh}>{material}</mesh>

      {/* Pijlen en labels voor afmetingen */}
      <ArrowLabel position={[0, -0.6, 0]} text={`Width: ${dimensions.width.toFixed(2)} cm`} />
      <ArrowLabel position={[0, dimensions.height / 2 + 0.2, 0]} text={`Height: ${dimensions.height.toFixed(2)} cm`} />
      <ArrowLabel position={[dimensions.width / 2 + 0.2, 0, 0]} text={`Depth: ${dimensions.depth.toFixed(2)} cm`} />
    </group>
  );
}
