import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { name: 'Inicio', href: '#' },
  { name: 'Perfil', href: '#about' },
  { name: 'Experiencia', href: '#projects' },
  { name: 'Contacto', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navRef = useRef(null);
  const linksRef = useRef([]);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);
  const glowRef = useRef(null);

  // Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial Load Animation
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    if (linksRef.current.length > 0) {
      tl.fromTo(linksRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        "-=0.6"
      );
    }
  }, []);

  // Mouse Glow Interaction
  const handleMouseMove = (e) => {
    if (!glowRef.current || !navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(glowRef.current, {
      x,
      y,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  // Mobile Menu Animation Toggle
  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        clipPath: 'circle(150% at 90% 10%)',
        duration: 0.8,
        ease: 'power3.inOut'
      });
      gsap.fromTo(mobileLinksRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        clipPath: 'circle(0% at 90% 10%)',
        duration: 0.6,
        ease: 'power3.inOut'
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        onMouseMove={handleMouseMove}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 overflow-hidden ${
          isScrolled
            ? 'bg-[#05060d]/60 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.25)] py-3'
            : 'bg-transparent py-6'
        }`}
      >
        {/* Animated neon glow that follows the cursor */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute w-[420px] h-[420px] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-0 md:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(168,85,247,0.18) 45%, transparent 70%)'
          }}
        />

        {/* Subtle top gradient line when scrolled */}
        <div
          className={`absolute top-0 left-0 w-full h-[1px] transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(90deg, transparent, #22d3ee, #a855f7, #f472b6, transparent)' }}
        />

        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-10">

          {/* Logo */}
          <a href="#" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-violet-500 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              <div className="relative w-9 h-9 rounded-lg bg-[#05060d] border border-white/10 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180">
                  <defs>
                    <linearGradient id="logoGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <path d="M6 4 L6 20 M6 12 L14 12 M18 4 L18 20" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <span className="font-mono tracking-[0.3em] uppercase text-xs ml-1 text-gradient-cool font-bold">
              CDDT
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                ref={el => linksRef.current[index] = el}
                className="relative text-gray-200 hover:text-white text-sm font-medium tracking-wide transition-colors duration-300 group py-1 drop-shadow-sm"
              >
                <span className="relative z-10">{link.name}</span>
                {/* Neon gradient underline */}
                <span
                  className="absolute -bottom-1 left-1/2 w-0 h-[2px] transition-all duration-500 group-hover:w-full group-hover:left-0 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #22d3ee, #a855f7)' }}
                />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#contact"
              ref={el => linksRef.current[NAV_LINKS.length] = el}
              className="relative inline-flex items-center px-6 py-2.5 rounded-full overflow-hidden group text-white text-sm font-medium tracking-wider transition-all duration-500"
            >
              {/* Gradient border */}
              <span
                className="absolute inset-0 rounded-full p-[1.5px]"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #a855f7, #f472b6)'
                }}
              >
                <span className="absolute inset-[1.5px] rounded-full bg-[#05060d]" />
              </span>
              {/* Hover fill */}
              <span
                className="absolute inset-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #a855f7, #f472b6)' }}
              />
              <span className="relative z-10 group-hover:text-[#05060d] transition-colors duration-500 flex items-center gap-2 drop-shadow-md">
                Contactar
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="md:hidden p-2 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-[2px] transition-transform duration-300 rounded-full ${isMobileMenuOpen ? 'rotate-45 translate-y-[10px]' : ''}`}
                style={{ background: 'linear-gradient(90deg, #22d3ee, #a855f7)' }}
              />
              <span
                className={`w-full h-[2px] transition-opacity duration-300 rounded-full ${isMobileMenuOpen ? 'opacity-0' : ''}`}
                style={{ background: 'linear-gradient(90deg, #22d3ee, #a855f7)' }}
              />
              <span
                className={`w-full h-[2px] transition-transform duration-300 rounded-full ${isMobileMenuOpen ? '-rotate-45 -translate-y-[10px]' : ''}`}
                style={{ background: 'linear-gradient(90deg, #22d3ee, #a855f7)' }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 flex flex-col justify-center items-center"
        style={{
          clipPath: 'circle(0% at 90% 10%)',
          background:
            'radial-gradient(circle at 85% 15%, rgba(168,85,247,0.15) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(34,211,238,0.12) 0%, transparent 50%), rgba(5, 6, 13, 0.98)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="flex flex-col space-y-8 text-center mt-10">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              ref={el => mobileLinksRef.current[index] = el}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-light text-gray-100 hover:text-white transition-colors tracking-widest relative group drop-shadow-md"
            >
              {link.name}
              <span
                className="absolute -bottom-2 left-1/2 w-0 h-[2px] transition-all duration-500 group-hover:w-1/2 group-hover:left-1/4 rounded-full"
                style={{ background: 'linear-gradient(90deg, #22d3ee, #a855f7)' }}
              />
            </a>
          ))}

          <a
            href="#contact"
            ref={el => mobileLinksRef.current[NAV_LINKS.length] = el}
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 px-8 py-3 rounded-full text-white tracking-widest transition-all duration-300 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(168,85,247,0.15))',
              border: '1px solid rgba(168,85,247,0.4)'
            }}
          >
            Escríbeme
          </a>
        </div>
      </div>
    </>
  );
}
