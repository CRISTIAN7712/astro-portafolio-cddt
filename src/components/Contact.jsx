import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTACT_INFO = [
  {
    label: 'Ubicación',
    value: 'Bucaramanga, Santander',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: 'Teléfono',
    value: '+57 305 937 9897',
    href: 'wa.me/+573059379897',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: 'Correo',
    value: 'cristian.diaz8918@gmail.com',
    href: 'mailto:cristian.diaz8918@gmail.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ing-dev-cddt',
    href: 'https://linkedin.com/in/ing-dev-cddt',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      const elements = sectionRef.current.querySelectorAll('.animate-element');

      tl.fromTo(elements,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Mensaje enviado! Gracias por contactarme.");
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#05060d] flex items-center justify-center py-24 px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient neon background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[600px] rounded-full blur-[150px] opacity-30 animate-aurora"
          style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.35), rgba(168,85,247,0.35) 50%, transparent 70%)' }}
        />
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>

      <div className="max-w-6xl w-full relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

        {/* Left: Heading + contact info */}
        <div className="lg:col-span-2 flex flex-col space-y-10">

          <div className="animate-element">
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-cyan-400/80 mb-5">
              // 03 &mdash; Contacto
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white font-sans leading-[0.95] drop-shadow-xl mb-6">
              Hablemos <span className="text-gradient-neon section-heading-serif pr-2">hoy</span>
            </h2>
            <p className="text-white font-light text-base md:text-lg tracking-wide leading-relaxed max-w-md drop-shadow-xl">
            Estoy abierto a oportunidades de desarrollo backend, consultoría técnica y colaboraciones.
            Construyamos algo sólido juntos.
            </p>
          </div>

          <div className="animate-element space-y-3">
            {CONTACT_INFO.map((item, i) => {
              const Wrapper = item.href ? 'a' : 'div';
              return (
                <Wrapper
                  key={i}
                  href={item.href}
                  target={item.href?.startsWith('http') ? '_blank' : undefined}
                  rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: i % 2 === 0
                        ? 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(34,211,238,0.05))'
                        : 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
                      color: i % 2 === 0 ? '#22d3ee' : '#a855f7',
                      border: i % 2 === 0 ? '1px solid rgba(34,211,238,0.2)' : '1px solid rgba(168,85,247,0.2)'
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-100 mb-0.5 drop-shadow-md">
                      {item.label}
                    </div>
                    <div className="text-sm text-white group-hover:text-cyan-200 transition-colors duration-300 truncate drop-shadow-md">
                      {item.value}
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>

        {/* Right: Form card */}
        <div className="lg:col-span-3 relative animate-element">
          {/* Neon border wrapper */}
          <div
            className="absolute inset-0 rounded-2xl p-[1.5px]"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.35), rgba(168,85,247,0.35), rgba(244,114,182,0.25))'
            }}
          >
            <div className="w-full h-full rounded-2xl bg-[#0b0d17]" />
          </div>

          <div className="relative rounded-2xl p-8 md:p-10 bg-[#0b0d17]/90 backdrop-blur-xl">

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-semibold text-white tracking-tight">Envíame un mensaje</h3>
                <p className="text-sm text-gray-300 font-light mt-1 drop-shadow-sm">Respondo en menos de 24h.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-400">Online</span>
              </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nombre */}
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    required
                    autoComplete="name"
                    className="peer w-full bg-white/[0.03] border border-white/10 text-white text-base rounded-xl px-5 pt-5 pb-3 outline-none transition-all duration-300 focus:bg-white/[0.06] focus:border-cyan-400/60 focus:shadow-[0_0_25px_-5px_rgba(34,211,238,0.35)] placeholder-transparent"
                    placeholder=""
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-5 top-4 text-gray-100 text-base pointer-events-none transition-all duration-300 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:tracking-[0.25em] peer-focus:uppercase peer-focus:text-cyan-200 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:tracking-[0.25em] peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:text-gray-100 drop-shadow-md"
                  >
                    Nombre
                  </label>
                </div>

                {/* Correo */}
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    required
                    autoComplete="email"
                    className="peer w-full bg-white/[0.03] border border-white/10 text-white text-base rounded-xl px-5 pt-5 pb-3 outline-none transition-all duration-300 focus:bg-white/[0.06] focus:border-violet-400/60 focus:shadow-[0_0_25px_-5px_rgba(168,85,247,0.35)] placeholder-transparent"
                    placeholder=""
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-5 top-4 text-gray-300 text-base pointer-events-none transition-all duration-300 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:tracking-[0.25em] peer-focus:uppercase peer-focus:text-violet-300 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:tracking-[0.25em] peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:text-gray-300 drop-shadow-sm"
                  >
                    Correo
                  </label>
                </div>
              </div>

              {/* Asunto */}
              <div className="relative group">
                <input
                  type="text"
                  id="subject"
                  required
                  className="peer w-full bg-white/[0.03] border border-white/10 text-white text-base rounded-xl px-5 pt-5 pb-3 outline-none transition-all duration-300 focus:bg-white/[0.06] focus:border-cyan-400/60 focus:shadow-[0_0_25px_-5px_rgba(34,211,238,0.35)] placeholder-transparent"
                  placeholder=""
                />
                <label
                  htmlFor="subject"
                  className="absolute left-5 top-4 text-gray-300 text-base pointer-events-none transition-all duration-300 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:tracking-[0.25em] peer-focus:uppercase peer-focus:text-cyan-300 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:tracking-[0.25em] peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:text-gray-300 drop-shadow-sm"
                >
                  Asunto
                </label>
              </div>

              {/* Mensaje */}
              <div className="relative group">
                <textarea
                  id="message"
                  required
                  rows="5"
                  className="peer w-full bg-white/[0.03] border border-white/10 text-white text-base rounded-xl px-5 pt-5 pb-3 outline-none transition-all duration-300 focus:bg-white/[0.06] focus:border-violet-400/60 focus:shadow-[0_0_25px_-5px_rgba(168,85,247,0.35)] placeholder-transparent resize-none"
                  placeholder=""
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute left-5 top-4 text-gray-300 text-base pointer-events-none transition-all duration-300 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:tracking-[0.25em] peer-focus:uppercase peer-focus:text-violet-300 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:tracking-[0.25em] peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:text-gray-300 drop-shadow-sm"
                >
                  Mensaje
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="relative group overflow-hidden rounded-full w-full px-10 py-4 text-white text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500"
                >
                  {/* Gradient bg */}
                  <span
                    className="absolute inset-0 rounded-full transition-all duration-500 group-hover:brightness-125"
                    style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #f472b6 100%)' }}
                  />
                  {/* Shimmer overlay */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                  {/* Glow shadow */}
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: '0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(34,211,238,0.3)' }}
                  />

                  <span className="relative z-10 flex items-center justify-center gap-3 text-[#05060d] font-semibold">
                    <span>Enviar mensaje</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10 px-6">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-200 drop-shadow-md">
          © {new Date().getFullYear()} Cristian David Díaz Tovar &mdash; Ingeniería de Software
        </p>
      </div>
    </section>
  );
}
