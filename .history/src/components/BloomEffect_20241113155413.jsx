// components/BloomEffect.jsx
import React, { useRef, useEffect } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three'; // Importeer THREE voor de benodigde functies
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

extend({ EffectComposer, RenderPass, UnrealBloomPass });

export default function BloomEffect({ bloomSettings }) {
  const { scene, camera, gl } = useThree();
  const composer = useRef();

  useEffect(() => {
    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth * 2, window.innerHeight * 2);
    composer.current = new EffectComposer(gl, renderTarget);
    composer.current.setSize(window.innerWidth * 2, window.innerHeight * 2);
    composer.current.addPass(new RenderPass(scene, camera));
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomSettings.strength,
      bloomSettings.radius,
      bloomSettings.threshold
    );
    
    composer.current.addPass(bloomPass);
  }, [scene, camera, gl, bloomSettings]);

  useEffect(() => {
    if (composer.current?.passes[1]) {
      const bloomPass = composer.current.passes[1];
      bloomPass.strength = bloomSettings.strength;
      bloomPass.radius = bloomSettings.radius;
      bloomPass.threshold = bloomSettings.threshold;
    }
  }, [bloomSettings]);

  useFrame(() => composer.current?.render(), 1);

  return null;
}
