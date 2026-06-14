'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';
import type { Banner } from '@/types';

interface HeroSliderProps {
  banners: Banner[];
}

/** Wraps first 3 words in a gold italic highlight span */
function HighlightedTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  const highlighted = words.slice(0, 3).join(' ');
  const rest = words.slice(3).join(' ');
  return (
    <>
      <span className="hero-highlight">{highlighted}</span>
      {rest ? <> {rest}</> : null}
    </>
  );
}

/**
 * Per-banner alignment lookup.
 *
 * 1st image  "Brilliance in Every"  → RIGHT (necklace/jewel is on the LEFT side of the image)
 * 2nd image  "Simple Elegance"      → LEFT  (rings are on the RIGHT side)
 * All others                        → LEFT  (safe default)
 */
function getAlignment(title: string): 'left' | 'right' {
  const t = title.toLowerCase();
  // ONLY the specific banner where jewellery is on the left gets RIGHT alignment.
  // We check for "brilliance" but make sure it's not the "Pure Diamond" banner.
  if (t.includes('brilliance') && !t.includes('pure diamond')) return 'right';
  
  return 'left';
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        html, body { overflow-x: hidden; max-width: 100%; }

        /* ── Section wrapper ── */
        .hero-section {
          width: 100%;
          overflow: hidden;
          position: relative;
          z-index: 0;
        }

        /* ── Slide inner: standard height ── */
        .hero-slide-inner {
          position: relative;
          width: 100%;
          height: 82vh;
          min-height: 500px;
          max-height: 750px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        /* ── Full-cover image ── */
        .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          image-rendering: auto;
        }
        .hero-img-desktop { display: block; }
        .hero-img-mobile  { display: none; }

        @media (max-width: 639px) {
          .hero-img-desktop { display: none; }
          .hero-img-mobile  { display: block; }
        }

        /* ── Directional gradient overlays ── */
        .hero-overlay-left {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            95deg,
            rgba(0,0,0,0.80) 0%,
            rgba(0,0,0,0.42) 48%,
            rgba(0,0,0,0.04) 100%
          );
          z-index: 1;
        }
        .hero-overlay-right {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            265deg,
            rgba(0,0,0,0.80) 0%,
            rgba(0,0,0,0.42) 48%,
            rgba(0,0,0,0.04) 100%
          );
          z-index: 1;
        }

        /* ── Text content box ── */
        .hero-content {
          position: relative;
          z-index: 2;
          padding: 0 5vw;
          max-width: min(850px, 78vw);
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        /* ── Eyebrow subtitle ── */
        .hero-subtitle {
          font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #d4af6a;
          font-weight: 500;
          margin: 0;
        }

        /* ── Main title: Full text, very wide ── */
        .hero-title {
          font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-size: clamp(1.3rem, 2.3vw, 2.1rem);
          font-weight: 500;
          color: #ffffff;
          line-height: 1.22;
          letter-spacing: 0;
          margin: 0;
          /* No clamping: full text shown naturally */
        }

        /* Gold italic first-3-words */
        .hero-highlight {
          color: #d4af6a;
          font-style: italic;
        }

        /* ── Thin gold divider ── */
        .hero-divider {
          width: 48px;
          height: 1.5px;
          background: rgba(212, 175, 106, 0.70);
          border: none;
          margin: 0;
          flex-shrink: 0;
        }

        /* ── CTA button with right-arrow icon ── */
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 11px 28px 11px 28px;
          font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.30em;
          text-transform: uppercase;
          color: #ffffff;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.75);
          cursor: pointer;
          text-decoration: none;
          width: fit-content;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          transition: background 0.30s ease, border-color 0.30s ease, color 0.30s ease;
        }

        /* Arrow icon — slides in from left on hover */
        .hero-btn .btn-arrow {
          display: inline-flex;
          align-items: center;
          transform: translateX(-4px);
          opacity: 0.75;
          transition: transform 0.30s ease, opacity 0.30s ease;
        }
        .hero-btn:hover .btn-arrow {
          transform: translateX(4px);
          opacity: 1;
        }
        .hero-btn:hover {
          background: #d4af6a;
          border-color: #d4af6a;
          color: #1a0a00;
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 639px) {
          .hero-slide-inner {
            height: 75vh;
            min-height: 450px;
            max-height: 650px;
            align-items: center;
            justify-content: center !important;
          }
          .hero-content {
            max-width: 90%;
            padding: 0 6vw;
            gap: 12px;
          }
          .hero-subtitle {
            font-size: 0.58rem;
            letter-spacing: 0.20em;
          }
          .hero-title {
            font-size: clamp(1.15rem, 5.8vw, 1.65rem);
            font-weight: 500;
          }
          .hero-btn { font-size: 0.65rem; padding: 9px 20px; }
          .hero-overlay-left,
          .hero-overlay-right {
            background: radial-gradient(
              ellipse at center,
              rgba(0,0,0,0.18) 0%,
              rgba(0,0,0,0.72) 100%
            );
          }
        }

        /* ── Swiper pagination ── */
        .swiper-pagination-bullet {
          background: rgba(255,255,255,0.55) !important;
          opacity: 1 !important;
          width: 7px !important;
          height: 7px !important;
        }
        .swiper-pagination-bullet-active {
          background: #d4af6a !important;
          width: 22px !important;
          border-radius: 4px !important;
          transition: width 0.3s ease !important;
        }
      `}</style>

      <section className="hero-section">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          spaceBetween={0}
          slidesPerView={1}
          loop={banners.length > 1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: false }}
          style={{ overflow: 'hidden' }}
        >
          {banners.length ? banners.map((banner) => {
            const isRight = getAlignment(banner.title || '') === 'right';

            return (
              <SwiperSlide key={banner._id}>
                <div
                  className="hero-slide-inner"
                  style={{ justifyContent: isRight ? 'flex-end' : 'flex-start' }}
                >
                  {/* Desktop image */}
                  <img
                    src={banner.image || 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1920&q=90'}
                    alt={banner.title}
                    className="hero-img hero-img-desktop"
                    fetchPriority="high"
                    decoding="async"
                  />

                  {/* Mobile image */}
                  <img
                    src={banner.mobileImage || banner.image || 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=768&q=90'}
                    alt={banner.title}
                    className="hero-img hero-img-mobile"
                    fetchPriority="high"
                    decoding="async"
                  />

                  {/* Directional gradient overlay */}
                  <div className={isRight ? 'hero-overlay-right' : 'hero-overlay-left'} />

                  {/* Text content */}
                  <div className="hero-content">

                    {/* Eyebrow */}
                    {banner.subtitle && (
                      <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                        className="hero-subtitle"
                      >
                        {banner.subtitle}
                      </motion.p>
                    )}

                    {/* Title — full text, 2-3 lines */}
                    {banner.title && (
                      <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.12 }}
                        className="hero-title"
                      >
                        <HighlightedTitle title={banner.title} />
                      </motion.h1>
                    )}

                    {/* Gold divider */}
                    <motion.hr
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 48, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.22 }}
                      className="hero-divider"
                    />

                    {/* CTA button with animated right arrow */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.36 }}
                    >
                      <a href={banner.ctaLink || '/shop'} className="hero-btn">
                        {banner.ctaLabel || 'Explore'}
                        {/* Right arrow SVG icon */}
                        <span className="btn-arrow">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </span>
                      </a>
                    </motion.div>

                  </div>
                </div>
              </SwiperSlide>
            );
          }) : (
            <SwiperSlide>
              <div className="hero-slide-inner" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: '#d4af6a', fontFamily: 'serif', fontSize: '1.2rem' }}>
                  Loading…
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </section>
    </>
  );
}
