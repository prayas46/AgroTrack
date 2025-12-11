'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type FarmSceneProps = {
  className?: string;
};

export function FarmScene({ className = '' }: FarmSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const container = mountRef.current;
    
    // Get container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(15, 10, 15);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    
    // Clear any existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Create farm landscape
    const groundGeometry = new THREE.PlaneGeometry(20, 20, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a7c59,
      roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    
    // Create crop rows
    const cropGeometry = new THREE.ConeGeometry(0.3, 1, 8);
    const cropMaterial = new THREE.MeshStandardMaterial({ color: 0x7cb342 });
    
    const crops: THREE.Mesh[] = [];
    for (let i = 0; i < 30; i++) {
      const crop = new THREE.Mesh(cropGeometry, cropMaterial);
      crop.position.set((i % 6) * 3 - 7.5, 0.5, Math.floor(i / 6) * 3 - 7.5);
      scene.add(crop);
      crops.push(crop);
    }
    
    // Create irrigation sprinklers
    const sprinklerGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1, 8);
    const sprinklerMaterial = new THREE.MeshStandardMaterial({ color: 0x2196f3 });
    
    const sprinklers = [];
    for (let i = 0; i < 4; i++) {
      const sprinkler = new THREE.Mesh(sprinklerGeometry, sprinklerMaterial);
      sprinkler.position.set((i % 2) * 12 - 6, 0.5, Math.floor(i / 2) * 12 - 6);
      scene.add(sprinkler);
      sprinklers.push(sprinkler);
    }
    
    // Create water droplets
    const dropletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const dropletMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.6
    });
    
    interface Droplet {
      mesh: THREE.Mesh;
      speed: number;
      startY: number;
      offset: number;
    }
    const droplets: Droplet[] = [];
    for (let i = 0; i < 50; i++) {
      const droplet = new THREE.Mesh(dropletGeometry, dropletMaterial);
      const startY = Math.random() * 5 + 2;
      droplet.position.set(
        Math.random() * 15 - 7.5,
        startY,
        Math.random() * 15 - 7.5
      );
      scene.add(droplet);
      droplets.push({
        mesh: droplet,
        speed: 0.02 + Math.random() * 0.03,
        startY: startY,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Animation
    let animationFrameId: number;
    const startTime = Date.now();
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const time = (Date.now() - startTime) * 0.001;
      
      // Animate droplets
      droplets.forEach((droplet, index) => {
        droplet.mesh.position.y = droplet.startY + Math.sin(time * droplet.speed + droplet.offset) * 2;
        droplet.mesh.rotation.x += 0.01;
        droplet.mesh.rotation.y += 0.01;
        
        if (droplet.mesh.position.y < 0) {
          droplet.mesh.position.y = droplet.startY;
        }
      });
      
      // Animate crops
      crops.forEach((crop, index) => {
        crop.scale.y = 1 + Math.sin(time * 0.5 + crop.position.x) * 0.3;
      });
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
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
