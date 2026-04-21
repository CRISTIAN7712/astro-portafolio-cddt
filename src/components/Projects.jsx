import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import imgSpiderman from '../assets/spiderman/20260407_055437.png';
import imgMan from '../assets/man/1775519899126.png';

gsap.registerPlugin(ScrollTrigger);

const MISSIONS = [
  {
    id: '01',
    name: 'CampusLands',
    role: 'Trainer · Desarrollo de software',
    description: 'Formación intensiva de desarrolladores junior en Java, Spring Boot y bases de datos. Diseño de currículo y mentoría técnica.',
    tech: ['Java', 'Spring Boot', 'SQL', 'Mentoría'],
    image: imgSpiderman,
    link: '#',
    accent: 'cyan',
  },
  {
    id: '02',
    name: 'Sistemas Palacios',
    role: 'Ingeniero de Innovación',
    description: 'Desarrollo y mantenimiento de aplicaciones críticas con Spring Boot y Laravel. Despliegues 40% más rápidos con Docker y Clean Architecture.',
    tech: ['Spring Boot', 'Laravel', 'Docker', 'SCRUM'],
    image: imgMan,
    link: '#',
    accent: 'violet',
  },
  {
    id: '03',
    name: 'Prevenir Express',
    role: 'Prácticas · Ingeniería de Sistemas',
    description: 'Soluciones con Node.js, control de versiones en GitHub, revisiones de código y pair programming.',
    tech: ['Node.js', 'GitHub', 'Patrones de diseño', 'Pair programming'],
    image: imgSpiderman,
    link: '#',
    accent: 'pink',
  }
];

const ACCENT_COLORS = {
  cyan:   { rgb: '34,211,238',  solid: '#22d3ee' },
  violet: { rgb: '168,85,247',  solid: '#a855f7' },
  pink:   { rgb: '244,114,182', solid: '#f472b6' },
};

const ProjectCard = ({ project }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const imageRef = useRef(null);

  const accent = ACCENT_COLORS[project.accent] || ACCENT_COLORS.cyan;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotateY: x * 12,
      rotateX: -y * 12,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.4
    });

    gsap.to(glowRef.current, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
      duration: 0.2
    });

    gsap.to(imageRef.current, {
      x: -x * 20,
      y: -y * 20,
      scale: 1.1,
      ease: 'power2.out',
      duration: 0.4
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      ease: 'power3.out',
      duration: 0.6
    });

    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.4
    });

    gsap.to(imageRef.current, {
      x: 0,
      y: 0,
      scale: 1.0,
      ease: 'power3.out',
      duration: 0.6
    });
  };

  return (
    <div
      className="project-card relative w-full h-[420px] rounded-xl overflow-hidden cursor-pointer group bg-[#0b0d17] border border-white/5"
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: `0 8px 30px -10px rgba(${accent.rgb}, 0.1)`
      }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Subtle animated border glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${accent.solid}20, transparent 40%, ${accent.solid}10)`,
          padding: '1px'
        }}
      >
        <div className="w-full h-full rounded-xl bg-[#0b0d17]" />
      </div>

      {/* Background Image Layer */}
      <div className="absolute inset-[1.5px] z-[2] rounded-2xl overflow-hidden bg-[#0b0d17]">
        <img
          ref={imageRef}
          src={project.image}
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
          style={{
            filter: 'brightness(0.6) contrast(1.1)',
            transition: 'filter 0.5s ease, transform 0.5s ease'
          }}
        />
        {/* Subtle gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d17] via-[#0b0d17]/40 to-transparent z-10" />
        {/* Accent glow overlay - subtle */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10"
          style={{
            background: `radial-gradient(ellipse at top right, ${accent.solid}22, transparent 60%)`
          }}
        />
      </div>

      {/* Subtle hover glow - more refined */}
      <div
        ref={glowRef}
        className="absolute w-64 h-64 rounded-full blur-[60px] pointer-events-none z-[3] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${accent.solid}40, transparent 70%)` }}
      />



      {/* Minimal corner accent */}
      <div className="absolute top-4 left-4 w-8 h-8 pointer-events-none z-20">
        <div className="absolute top-0 left-0 w-3 h-0.5 rounded-full" style={{ background: accent.solid }} />
        <div className="absolute top-0 left-0 w-0.5 h-3 rounded-full" style={{ background: accent.solid }} />
      </div>

      {/* Foreground Content - cleaner structure */}
      <div className="absolute inset-0 z-30 p-6 flex flex-col justify-end pointer-events-none">
        {/* Content wrapper with better spacing */}
        <div className="space-y-3">
          {/* Role label - more subtle */}
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] tracking-[0.25em] uppercase px-2 py-0.5 rounded"
              style={{
                color: accent.solid,
                background: `rgba(${accent.rgb}, 0.12)`
              }}
            >
              {project.role}
            </span>
            <span className="font-mono text-[9px] text-gray-400">EXP-{project.id}</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {project.name}
          </h3>

          {/* Description */}
          <p className="text-gray-200 text-sm leading-relaxed font-light">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="font-mono text-[9px] uppercase tracking-wide px-2 py-0.5 rounded text-gray-300 transition-colors duration-200 hover:text-white"
                style={{
                  background: `rgba(255,255,255,0.08)`,
                  border: `1px solid rgba(${accent.rgb}, 0.2)`
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Link */}
        <div className="mt-4 pt-3 border-t border-white/10 pointer-events-auto">
          <a
            href={project.link}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-gray-300 hover:text-white transition-colors group/link"
          >
            <span>Ver proyecto</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform group-hover/link:translate-x-0.5 transition-transform"
              style={{ color: accent.solid }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};


export default function Projects() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(headerRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
      );

      const cards = sectionRef.current.querySelectorAll('.project-card');

      tl.fromTo(cards,
        { opacity: 0, y: 100, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" },
        "-=0.6"
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full min-h-screen bg-[#05060d] py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden"
    >
      {/* Ambient background layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] rounded-full blur-[150px] opacity-25"
          style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.5), transparent 70%)' }}
        />
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>

      <div className="max-w-[90rem] mx-auto w-full relative z-10">

        {/* Header Block */}
        <div ref={headerRef} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 relative pb-8">
          {/* Gradient divider line */}
          <div
            className="absolute bottom-0 left-0 w-full h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5), rgba(168,85,247,0.5), transparent)' }}
          />

          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-cyan-400/80 mb-5">
              // 02 &mdash; Experiencia
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold tracking-tighter text-white font-sans leading-[0.95] drop-shadow-lg">
              Experiencia <span className="text-gradient-neon section-heading-serif pr-2">Profesional</span>
            </h2>
          </div>
          <p className="text-gray-100 font-light tracking-wide text-base md:text-lg max-w-sm leading-relaxed md:text-right drop-shadow-md">
            Trayectoria en entrenamiento técnico, desarrollo backend y modernización de sistemas empresariales.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {MISSIONS.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}
