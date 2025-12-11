'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense } from 'react';

type SceneProps = {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  enableOrbit?: boolean;
  className?: string;
};

export function Scene({
  children,
  cameraPosition = [0, 0, 5],
  enableOrbit = true,
  className = '',
}: SceneProps) {
  return (
    <div className={`relative w-full h-[400px] ${className}`}>
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          {children}
          {enableOrbit && <OrbitControls enableZoom={true} />}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
