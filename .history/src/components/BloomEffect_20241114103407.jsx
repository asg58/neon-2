// BloomEffect.jsx
import React, { useRef, useEffect } from 'react';
import { useThree, extend, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import * as THREE from 'three';

extend({ EffectComposer, RenderPass, UnrealBloomPass });

export default function BloomEffect({ strength = 1.5, radius = 0.4, threshold = 0.2 }) {
  const { scene, camera, gl } = useThree();
  const composer = useRef();

  useEffect(() => {
    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      format: THREE.RGBFormat,
      minFilter: THREE.LinearFilter,
      stencilBuffer: false,
    });

    composer.current = new EffectComposer(gl, renderTarget);
    composer.current.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      strength,
      radius,
      threshold
    );
    composer.current.addPass(bloomPass);
  }, [scene, camera, gl, strength, radius, threshold]);

  useFrame(() => composer.current.render(), 1);

  return null;
}
