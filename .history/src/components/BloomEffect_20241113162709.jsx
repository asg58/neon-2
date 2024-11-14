// BloomEffect.jsx
import React, { useRef, useEffect } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import * as THREE from 'three';

extend({ EffectComposer, RenderPass, UnrealBloomPass });

export default function BloomEffect({ bloomSettings }) {
  const { scene, camera, gl } = useThree();
  const composer = useRef();

  useEffect(() => {
    // Schaalfactor voor resolutie
    const resolutionScale = 0.75; // Pas dit aan tussen 0.5 en 1 voor beste prestaties

    // Instellen van renderTarget met hogere resolutie en anti-aliasing
    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth * resolutionScale,
      window.innerHeight * resolutionScale,
      {
        format: THREE.RGBFormat,
        minFilter: THREE.LinearFilter,
        generateMipmaps: true,
      }
    );

    // Composer aanmaken
    composer.current = new EffectComposer(gl, renderTarget);
    composer.current.setSize(window.innerWidth * resolutionScale, window.innerHeight * resolutionScale);
    composer.current.addPass(new RenderPass(scene, camera));

    // Bloom-pass met de ingestelde sterkte, radius en drempel
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth * resolutionScale, window.innerHeight * resolutionScale),
      bloomSettings.strength,
      bloomSettings.radius,
      bloomSettings.threshold
    );
    composer.current.addPass(bloomPass);
    composer.current.bloomPass = bloomPass;

    return () => renderTarget.dispose();
  }, [scene, camera, gl, bloomSettings]);

  useEffect(() => {
    if (composer.current?.bloomPass) {
      composer.current.bloomPass.strength = bloomSettings.strength;
      composer.current.bloomPass.radius = bloomSettings.radius;
      composer.current.bloomPass.threshold = bloomSettings.threshold;
    }
  }, [bloomSettings]);

  // Gebruik de frame loop om de compositie te renderen
  useFrame(() => composer.current?.render(), 1);

  return null;
}
