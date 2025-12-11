'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type SoilScannerProps = {
  className?: string;
};

export function SoilScanner({ className = '' }: SoilScannerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(6, 4, 6);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    const soilGeometry = new THREE.BoxGeometry(4, 2, 4);
    const soilMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8d6e63,
      roughness: 0.9
    });
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    scene.add(soil);
    
    const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00e676,
      transparent: true,
      opacity: 0.6
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.y = 3;
    scene.add(beam);
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 4;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xff9800,
      transparent: true
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.position.y = 1;
    scene.add(particles);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    
    let animationFrameId: number;
    const startTime = Date.now();
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const time = (Date.now() - startTime) * 0.001;
      
      beam.position.y = 2.5 + Math.sin(time * 2) * 0.5;
      beam.rotation.x = time;
      
      particles.rotation.y = time * 0.5;
      
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.01;
        if (positions[i + 1] > 2) {
          positions[i + 1] = -2;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
}
