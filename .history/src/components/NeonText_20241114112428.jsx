// src/components/NeonText.jsx
import React, { useEffect, useRef } from 'react';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import calculateDimensions from '../utils/calculateDimensions';

extend({ TextGeometry });

export default function NeonText({ text, color, font, materialType, onDimensionsChange }) {
  const mesh = useRef();

  useEffect(() => {
    if (font && mesh.current) {
      console.log("Font en mesh geladen in NeonText:", font);

      const geometry = new TextGeometry(text, {
        font: font,
        size: 1,
        depth: 0.1,
        curveSegments: 12,
      });
      geometry.center();
      mesh.current.geometry = geometry;

      // Bereken afmetingen via de hulpfunctie
      const dimensions = calculateDimensions(mesh.current);
      console.log("Afmetingen berekend:", dimensions); // Debug log
      
      // Alleen aanroepen als afmetingen veranderen
      if (
        dimensions.width !== mesh.current.prevWidth ||
        dimensions.height !== mesh.current.prevHeight ||
        dimensions.depth !== mesh.current.prevDepth
      ) {
        onDimensionsChange(dimensions);
        mesh.current.prevWidth = dimensions.width;
        mesh.current.prevHeight = dimensions.height;
        mesh.current.prevDepth = dimensions.depth;
      }
    }
  }, [font, text]); // Vermijd loop door alleen font en text als afhankelijkheden te gebruiken

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
