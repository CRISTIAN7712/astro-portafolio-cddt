import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { vertexShader, fragmentShader } from './HeroShaders';

import imgSpiderman from '../assets/spiderman/20260407_055437.png';
import imgMan from '../assets/man/1775519899126.png';

export default function Hero() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const textRef = useRef(null);

  // Create refs to hold things that need cleanup or updates
  const uniformRef = useRef(null);
  const mouseTarget = useRef({ x: 0.5, y: 0.5 });
  const mouseCurrent = useRef({ x: 0.5, y: 0.5 });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Initial Hero Entrance Animation (AOS style smooth fade-up)
    gsap.fromTo(container,
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 2, ease: "power3.out", delay: 0.1 }
    );

    // Text entrance animation (Fade down)
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.8 }
      );
    }

    // 1. Setup Three.js Scene
    const scene = new THREE.Scene();

    // We use an orthographic camera to map perfectly to a screen setup
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // 2. Load textures
    const textureLoader = new THREE.TextureLoader();
    let isTexturesLoaded = false;

    // Define uniforms up front so they can be mutated
    const uniforms = {
      uTexture1: { value: null }, // Spiderman
      uTexture2: { value: null }, // Man
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHovered: { value: 0.0 }, // 0 to 1 value smoothly handled by GSAP
      uRadius: { value: 0.25 }, // Reveal radius size
      uSoftness: { value: 0.15 }, // Softness of the edge
      uScale: { value: 0.05 }, // Scale zoom amount
      uResolution: { value: new THREE.Vector2(width, height) },
      uImageResolution: { value: new THREE.Vector2(1920, 1080) } // Assuming 16:9 for default
    };

    uniformRef.current = uniforms;

    Promise.all([
      textureLoader.loadAsync(imgSpiderman),
      textureLoader.loadAsync(imgMan)
    ]).then(([tex1, tex2]) => {
      tex1.generateMipmaps = false;
      tex1.minFilter = THREE.LinearFilter;
      tex1.magFilter = THREE.LinearFilter;

      tex2.generateMipmaps = false;
      tex2.minFilter = THREE.LinearFilter;
      tex2.magFilter = THREE.LinearFilter;

      uniforms.uTexture1.value = tex1;
      uniforms.uTexture2.value = tex2;

      if (tex1.image) {
        uniforms.uImageResolution.value.set(tex1.image.width, tex1.image.height);
      }

      isTexturesLoaded = true;
    });

    // 3. Create full-screen plane geometry and shader material
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. GSAP Ticker for render loop and smooth lerping
    const renderTick = () => {
      if (!isTexturesLoaded) return;

      mouseCurrent.current.x = gsap.utils.interpolate(mouseCurrent.current.x, mouseTarget.current.x, 0.1);
      mouseCurrent.current.y = gsap.utils.interpolate(mouseCurrent.current.y, mouseTarget.current.y, 0.1);

      uniforms.uMouse.value.set(mouseCurrent.current.x, mouseCurrent.current.y);

      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: mouseCurrent.current.x * width,
          y: mouseCurrent.current.y * height,
        });
      }

      renderer.render(scene, camera);
    };

    gsap.ticker.add(renderTick);

    // 5. Setup interaction event handlers
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width;
      const y = 1.0 - ((e.clientY - rect.top) / height);

      mouseTarget.current.x = x;
      mouseTarget.current.y = y;

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out"
        });
      }
    };

    const onMouseEnter = () => {
      setIsHovered(true);
      gsap.to(uniforms.uHovered, {
        value: 1.0,
        duration: 1.2,
        ease: "power3.out"
      });
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    const onMouseLeave = () => {
      setIsHovered(false);
      gsap.to(uniforms.uHovered, {
        value: 0.0,
        duration: 1.2,
        ease: "power3.out"
      });
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    // 6. Handle resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('resize', onResize);

    // Mobile fallback (Tap)
    const onTouch = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        mouseTarget.current.x = (touch.clientX - rect.left) / width;
        mouseTarget.current.y = 1.0 - ((touch.clientY - rect.top) / height);

        if (!isHovered) {
          onMouseEnter();
        }
      }
    };

    container.addEventListener('touchstart', onTouch);
    container.addEventListener('touchmove', onTouch);

    // 7. Cleanup
    return () => {
      gsap.ticker.remove(renderTick);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('touchstart', onTouch);
      container.removeEventListener('touchmove', onTouch);

      container.removeChild(renderer.domElement);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05060d] flex items-center justify-center">

      {/* Animated aurora background (behind the shader) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-40 animate-aurora"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.6), transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 -right-1/4 w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-35 animate-aurora"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.65), transparent 70%)', animationDelay: '-6s' }}
        />
      </div>

      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-[1] select-none"
      />

      {/* Grid overlay (subtle tech feel) */}
      <div className="absolute inset-0 z-[2] pointer-events-none grid-overlay opacity-40" />

      {/* Custom Cursor / Light Bloom Overlay */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-40 h-40 rounded-full pointer-events-none z-20 mix-blend-screen opacity-0 scale-0"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.35) 0%, rgba(168,85,247,0.25) 40%, transparent 70%)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Foreground UI Components */}
      <div ref={textRef} className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center mx-auto w-full max-w-[90rem] px-8 lg:px-16 mt-20">
        <div
          className="w-full flex flex-col md:flex-row justify-between md:items-end transition-all duration-700 ease-out transform gap-10"
          style={{ transform: isHovered ? 'translateY(-20px)' : 'translateY(0px)' }}
        >

          {/* Left Side: Intro and Title */}
          <div className="flex-1 max-w-lg lg:max-w-xl text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gray-300">
                Disponible para proyectos
              </span>
            </div>

            <p className="font-mono text-xs md:text-sm text-white/95 tracking-[0.3em] uppercase mb-5 drop-shadow-lg">
              // Cristian David Díaz Tovar
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[3.75rem] font-bold tracking-tighter drop-shadow-2xl leading-[1.05] font-sans">
              Ingeniero de <span className="text-gradient-cool">Sistemas</span><br />
              <span className="text-gradient-neon section-heading-serif pr-2">y Especialista</span> en<br />
              Ingeniería de <span className="text-gradient-cool">Software</span>
            </h1>
          </div>

          {/* Right Side: Description and CTA */}
          <div className="flex-1 max-w-md text-left md:text-right flex flex-col md:items-end">
            <p className="w-full md:w-[28rem] text-base md:text-lg text-white drop-shadow-xl font-light tracking-wide leading-relaxed mb-8">
              Backend Developer con experiencia en{' '}
              <span className="text-cyan-300 font-semibold drop-shadow-md">Java (Spring Boot)</span>,{' '}
              <span className="text-violet-300 font-semibold drop-shadow-md">Node.js</span>,{' '}
              <span className="text-cyan-300 font-semibold drop-shadow-md">SQL</span>, microservicios y Docker.
              Transformo necesidades de negocio en soluciones escalables con{' '}
              <span className="text-gradient-neon font-semibold">Clean Architecture</span> y principios SOLID.
            </p>

            <div className="flex flex-col md:flex-row gap-4 pointer-events-auto">
              <a
                href="#projects"
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full overflow-hidden text-sm tracking-[0.2em] uppercase font-medium transition-all duration-500"
              >
                {/* Gradient border */}
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #22d3ee, #a855f7, #f472b6)' }}
                />
                <span className="absolute inset-[1.5px] rounded-full bg-[#05060d] group-hover:opacity-0 transition-opacity duration-500" />
                <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 flex items-center gap-2">
                  Ver experiencia
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </a>

              <a
                href="#contact"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/40 bg-white/[0.08] backdrop-blur-sm text-white text-sm tracking-[0.2em] uppercase font-semibold hover:border-white/60 hover:bg-white/[0.15] transition-all duration-300 drop-shadow-xl"
              >
                Contactar
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/90 drop-shadow-md">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-cyan-400/80 to-transparent" />
      </div>

      {/* Overlay border/frame for cinematic effect */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#05060d] to-transparent z-[3] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05060d] to-transparent z-[3] pointer-events-none" />
    </div>
  );
}
