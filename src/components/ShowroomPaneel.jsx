import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const ShowroomPaneel = () => {
  const wallRef = useRef();

  // Wand instellen (je kunt hier animaties toevoegen, zoals het bewegen van de wand)
  useFrame(() => {
    if (wallRef.current) {
      // Je kunt hier animaties toevoegen als je wil (bijvoorbeeld de wand zelf bewegen)
    }
  });

  return (
    <mesh ref={wallRef} position={[0, 0, 0]}>
      <planeGeometry args={[10, 5]} /> {/* Paneel met afmetingen */}
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default ShowroomPaneel;
