// NeonText.jsx
import React, { useEffect, useRef } from 'react';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

extend({ TextGeometry });

export default function NeonText({ text, color, font, materialType, onDimensionsChange }) {
  const mesh = useRef();

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

      // Bereken de afmetingen van de tekst en stuur deze via de callback
      const { width, height, depth } = new THREE.Box3().setFromObject(mesh.current).getSize(new THREE.Vector3());
      onDimensionsChange({ width, height, depth });
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

  return <mesh ref={mesh}>{material}</mesh>;
}
