'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

type AnimatedCubeProps = {
  position?: [number, number, number];
  color?: string;
  hoverColor?: string;
  size?: number;
};

export function AnimatedCube({
  position = [0, 0, 0],
  color = '#4f46e5',
  hoverColor = '#6366f1',
  size = 1,
}: AnimatedCubeProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position as [number, number, number]}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial 
        color={hovered ? hoverColor : color} 
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
}
