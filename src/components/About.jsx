import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Reuse our hero assets for the dual-identity mask effect prototype
import imgSpiderman from '../assets/spiderman/20260407_055437.png';
import imgMan from '../assets/man/1775519899126.png';

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  { name: 'Java + Spring Boot', level: 'Senior', color: 'cyan' },
  { name: 'Node.js & SQL', level: 'Advanced', color: 'violet' },
  { name: 'Microservicios', level: 'Advanced', color: 'cyan' },
  { name: 'Clean Architecture', level: 'Expert', color: 'violet' },
];

export default function About() {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const maskRef = useRef(null);

  const [, setMousePos] = useState({ x: 50, y: 50 });

  // 1. ScrollTrigger entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      const textElements = textContainerRef.current.querySelectorAll('.stagger-reveal');
      const imgElement = imageContainerRef.current;

      tl.fromTo(imgElement,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
      )
        .fromTo(textElements,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" },
          "-=0.8"
        );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Interactive Spotlight Mask (inverted behavior:
  //    at rest the base spiderman image shows fully;
  //    on hover a circular spotlight reveals the developer underneath)
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePos({ x, y });

    gsap.to(maskRef.current, {
      '--x': `${x}%`,
      '--y': `${y}%`,
      '--r': '18%', // grow the reveal circle
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(maskRef.current, {
      '--x': '50%',
      '--y': '50%',
      '--r': '0%', // collapse back so the base image is fully visible
      duration: 0.6,
      ease: 'power3.out'
    });
  };

  return (
    <section
      id='about'
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#05060d] flex items-center justify-center py-24 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Ambient neon aurora background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 animate-aurora"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.55), transparent 70%)' }}
        />
        <div
          className="absolute bottom-[5%] right-[10%] w-[550px] h-[550px] rounded-full blur-[130px] opacity-30 animate-aurora"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.55), transparent 70%)', animationDelay: '-4s' }}
        />
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>

      <div className="max-w-[90rem] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

        {/* Left Column: Interactive Portrait */}
        <div
          ref={imageContainerRef}
          className="relative w-full aspect-[4/5] max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden cursor-crosshair group"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform: 'translateZ(0)' }}
        >
          {/* Neon border gradient frame */}
          <div
            className="absolute inset-0 rounded-2xl p-[1.5px] z-20 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(34,211,238,0.5) 0%, rgba(168,85,247,0.5) 50%, rgba(244,114,182,0.4) 100%)'
            }}
          >
            <div className="w-full h-full rounded-2xl bg-[#05060d]" />
          </div>

          <div className="absolute inset-[1.5px] rounded-2xl overflow-hidden z-10">
            {/* Base Layer: Superhero Persona (Vibrant) - INVERTIDO */}
            <img
              src={imgSpiderman}
              alt="Superhero Persona"
              className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-all duration-700 group-hover:scale-105"
            />

            {/* Cyan/violet colorize overlay on base */}
            <div
              className="absolute inset-0 mix-blend-color opacity-30"
              style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)' }}
            />

            {/* Masked Overlay: Developer Portrait (Moody/Dark) - Revelado al hover */}
            <div
              ref={maskRef}
              className="absolute inset-0 w-full h-full"
              style={{
                '--x': '50%',
                '--y': '50%',
                '--r': '0%',
                clipPath: 'circle(var(--r) at var(--x) var(--y))',
                WebkitClipPath: 'circle(var(--r) at var(--x) var(--y))'
              }}
            >
              <img
                src={imgMan}
                alt="Developer Persona Revealed"
                className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-70 brightness-75 contrast-125 scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out"
              />

              {/* Inner spotlight edge glow */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#05060d]/20 to-[#05060d]/80" />

              {/* Neon rim around the spotlight (only visible inside the revealed clip) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at var(--x) var(--y), transparent calc(var(--r) - 4%), rgba(34,211,238,0.55) calc(var(--r) - 1%), rgba(168,85,247,0.45) calc(var(--r) + 1%), transparent calc(var(--r) + 4%))',
                }}
              />
            </div>

            {/* Scanning line effect */}
            <div
              className="absolute inset-x-0 h-[2px] opacity-60 pointer-events-none animate-scan"
              style={{ background: 'linear-gradient(90deg, transparent, #22d3ee, #a855f7, transparent)' }}
            />

            {/* Interaction Hint Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-24 h-24 rounded-full border border-cyan-400/30 scale-150 animate-ping absolute" />
            </div>

            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-cyan-400/60" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-violet-400/60" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-violet-400/60" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-cyan-400/60" />

            {/* Instruction label - Texto actualizado para efecto invertido */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                Revela tu esencia
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Story & Details */}
        <div ref={textContainerRef} className="flex flex-col justify-center space-y-10">

          <div className="overflow-hidden">
            <p className="stagger-reveal font-mono text-xs tracking-[0.35em] uppercase text-cyan-300 mb-4 drop-shadow-md">
              // 01 &mdash; Perfil
            </p>
          </div>

          <div className="overflow-hidden -mt-6">
            <h2 className="stagger-reveal text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white font-sans leading-[0.95]">
              Perfil <br />
              <span className="text-gradient-neon section-heading-serif pr-4">Profesional</span>
            </h2>
          </div>

          <div className="overflow-hidden">
            <p className="stagger-reveal text-lg md:text-xl text-white font-light leading-relaxed max-w-xl drop-shadow-xl">
              Ingeniero de Sistemas y Especialista en Ingeniería de Software con sólida experiencia
              en desarrollo <span className="text-cyan-200 font-semibold">backend</span>.
              He trabajado en la implementación de <span className="text-violet-300 font-semibold drop-shadow-md">microservicios</span>,
              contenedorización con Docker y adopción de prácticas modernas de desarrollo para entregar
              productos robustos y mantenibles.
            </p>
          </div>

          {/* Expertise Highlights */}
          <div className="overflow-hidden">
            <div className="stagger-reveal grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-white/10 max-w-xl">
              {SKILLS.map((skill, i) => (
                <div
                  key={i}
                  className="group relative flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover gradient glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: skill.color === 'cyan'
                        ? 'radial-gradient(circle at 0% 50%, rgba(34,211,238,0.12), transparent 70%)'
                        : 'radial-gradient(circle at 0% 50%, rgba(168,85,247,0.12), transparent 70%)'
                    }}
                  />
                  <div
                    className="relative w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: skill.color === 'cyan' ? '#22d3ee' : '#a855f7',
                      boxShadow: skill.color === 'cyan'
                        ? '0 0 12px rgba(34,211,238,0.8)'
                        : '0 0 12px rgba(168,85,247,0.8)'
                    }}
                  />
                  <div className="relative flex-1 min-w-0">
                    <div className="text-sm font-medium text-white tracking-wide truncate drop-shadow-sm">
                      {skill.name}
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-100 drop-shadow-sm">
                      {skill.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Block */}
          <div className="overflow-hidden mt-2">
            <blockquote
              className="stagger-reveal pl-6 py-2 relative"
              style={{
                borderLeft: '2px solid transparent',
                borderImage: 'linear-gradient(180deg, #22d3ee, #a855f7) 1 100%'
              }}
            >
              <p className="text-xl md:text-2xl text-white section-heading-serif drop-shadow-xl">
                &ldquo;Liderazgo técnico, arquitectura sólida y enfoque práctico para construir software con impacto.&rdquo;
              </p>
            </blockquote>
          </div>

        </div>

      </div>
    </section>
  );
}
