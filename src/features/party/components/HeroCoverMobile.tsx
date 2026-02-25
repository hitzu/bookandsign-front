import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import logoWhite from "@assets/images/logo-white.png";
import styles from "@assets/css/party-public.module.css";

type HeroCoverMobileProps = {
  eventName?: string;
  subtitle: string;
  coverUrls: string[];
  parallaxOffset?: number;
  onViewPhotos: () => void;
  onShareLink: () => void;
};

const HeroCoverMobile = ({
  eventName,
  subtitle,
  coverUrls,
  parallaxOffset = 0,
  onViewPhotos,
  onShareLink,
}: HeroCoverMobileProps) => {
  const reduceMotion = useReducedMotion();
  const heroTitle = eventName?.trim() || "Tu momento tu brillo";
  const [activeCoverIndex, setActiveCoverIndex] = useState(0);
  const availableCovers = useMemo(
    () => coverUrls.filter(Boolean),
    [coverUrls],
  );

  useEffect(() => {
    setActiveCoverIndex(0);
  }, [availableCovers.length]);

  useEffect(() => {
    if (reduceMotion || availableCovers.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveCoverIndex((previous) => {
        if (availableCovers.length <= 1) return 0;
        let next = previous;
        while (next === previous) {
          next = Math.floor(Math.random() * availableCovers.length);
        }
        return next;
      });
    }, 4200);

    return () => window.clearInterval(interval);
  }, [availableCovers.length, reduceMotion]);

  const activeCoverUrl = availableCovers[activeCoverIndex] || null;

  return (
    <section className={styles.mobileHero}>
      <motion.div
        className={styles.mobileHeroMedia}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
        style={
          reduceMotion
            ? undefined
            : {
                transform: `translate3d(0, ${Math.min(parallaxOffset, 28)}px, 0)`,
              }
        }
      >
        {activeCoverUrl ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={activeCoverUrl}
              src={activeCoverUrl}
              alt={heroTitle}
              className={styles.mobileHeroImage}
              loading="eager"
              initial={{ opacity: 0.72, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.64 }}
              transition={{ duration: reduceMotion ? 0 : 0.7 }}
            />
          </AnimatePresence>
        ) : (
          <div className={styles.mobileHeroPlaceholder}>
            <Image src={logoWhite} alt="Brillipoint" width={84} height={84} priority />
          </div>
        )}
        <div className={styles.mobileHeroVignette} />
      </motion.div>

      <div className={styles.mobileHeroContent}>
        <p className={styles.mobileEyebrow}>EXPERIENCIA BRILLIPOINT</p>
        <h1 className={styles.mobileHeroTitle}>{heroTitle}</h1>
        <p className={styles.mobileHeroSubtitle}>{subtitle}</p>
        <div className={styles.mobileHeroActions}>
          <button
            type="button"
            className={styles.mobileHeroCta}
            onClick={onViewPhotos}
            aria-label="Ver fotos de la galería"
          >
            Ver fotos
          </button>
          <button
            type="button"
            className={styles.mobileHeroSecondaryCta}
            onClick={onShareLink}
            aria-label="Compartir enlace del evento"
          >
            Compartir enlace
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroCoverMobile;
