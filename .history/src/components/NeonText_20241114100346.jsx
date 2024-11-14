// NeonText.jsx
import React, { useEffect, useRef } from 'react';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { GlowVertexShader, GlowFragmentShader } from '../shaders/GlowShaders';

extend({ TextGeometry });

export default function NeonText({ text, color, intensity, font }) {
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
