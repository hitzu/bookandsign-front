import React, { useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import logoWhite from "@assets/images/logo-white.png";
import styles from "@assets/css/party-public.module.css";

type IntroHeroProps = {
  isVisible: boolean;
  title?: string;
};

const IntroHero = ({
  isVisible,
  title = "Bienvenido a la experiencia Brillipoint ✨",
}: IntroHeroProps) => {
  const reduceMotion = useReducedMotion();
  const floatingParticles = useMemo(
    () =>
      new Array(8)
        .fill(0)
        .map((_, index) => <div key={index} className={styles.particle} />),
    [],
  );

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.section
          className={styles.introScreen}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduceMotion ? 0 : 0.8 },
          }}
        >
          <div className={styles.particleLayer}>{floatingParticles}</div>
          <motion.div
            className={styles.introLogo}
            initial={{ scale: 0.96, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.2 }}
          >
            <Image src={logoWhite} alt="Brillipoint" width={220} height={220} priority />
          </motion.div>
          <motion.h1
            className={styles.introTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.9,
              delay: reduceMotion ? 0 : 0.3,
            }}
          >
            {title}
          </motion.h1>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
};

export default IntroHero;
