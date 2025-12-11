'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FarmScene } from './3d/FarmScene';
import { SoilScanner } from './3d/SoilScanner';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function Hero3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [activeScene, setActiveScene] = useState<'farm' | 'scanner'>('farm');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax effects
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, 50]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isClient]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-950 via-black to-gray-950"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black/40 to-cyan-900/20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      </div>

      {/* Scene Toggle Button */}
      <motion.button
        className="absolute top-8 right-8 z-50 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
        onClick={() => {
          setActiveScene(prev => prev === 'farm' ? 'scanner' : 'farm');
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span
          key={activeScene}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {activeScene === 'farm' ? '🔍' : '🌱'}
        </motion.span>
        <span>{activeScene === 'farm' ? 'View Soil Scanner' : 'View Farm Scene'}</span>
      </motion.button>

      {/* Farm Scene */}
      <motion.div 
        className="absolute inset-0 z-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ 
          opacity: activeScene === 'farm' ? 1 : 0, 
          scale: activeScene === 'farm' ? 1 : 0.98,
          pointerEvents: activeScene === 'farm' ? 'auto' : 'none',
          transition: { duration: 0.5 }
        }}
      >
        <FarmScene className="w-full h-full" />
        
        {/* Animated sun */}
        <motion.div
          className="absolute top-20 right-20 text-6xl"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          ☀️
        </motion.div>
      </motion.div>

      {/* Soil Scanner Scene */}
      <motion.div 
        className="absolute inset-0 z-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ 
          opacity: activeScene === 'scanner' ? 1 : 0, 
          scale: activeScene === 'scanner' ? 1 : 0.98,
          pointerEvents: activeScene === 'scanner' ? 'auto' : 'none',
          transition: { duration: 0.5 }
        }}
      >
        <SoilScanner className="w-full h-full" />
        
        {/* Scanner wave effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(0,230,118,0.15) 0%, transparent 70%)',
            transform: 'translateZ(0)'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.5],
            opacity: [0, 0.2, 0],
          }}
        />
      </motion.div>

      {/* Mouse Follow Effect */}
      {isClient && (
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full pointer-events-none z-10"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            x: '-50%',
            y: '-50%',
            position: 'absolute',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* Main Content */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full px-4">
        <motion.h1 
          className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            AgroTrack
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-300 font-light tracking-wider mb-12 text-center max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Smart Agriculture Resource Management System
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
        >
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 text-white rounded-2xl font-bold text-xl tracking-wider overflow-hidden shadow-2xl"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 60px rgba(34, 197, 94, 0.6)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <span className="relative z-10">Get Started</span>
            <motion.svg
              className="w-6 h-6 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ 
                x: [0, 5, 0],
              }}
              transition={{
                x: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}