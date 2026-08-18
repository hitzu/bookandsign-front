import Image from "next/image";
import baseStyles from "./PartnerLandingView.module.css";
import sectionStyles from "./PartnerLandingSections.module.css";
import { useRef } from "react";
import { PartnerLandingReadyState, PartnerLandingVisual } from "../types";
import { tokensToCssVars } from "../utils/tokens";

type Props = { landing: PartnerLandingReadyState };
const styles = { ...baseStyles, ...sectionStyles };

const renderVisual = (visual: PartnerLandingVisual, isHero = false) => {
  const imageUrl = typeof visual.imageSrc === "string" ? visual.imageSrc : visual.imageSrc?.src;
  return (
  <figure className={isHero ? styles.heroArt : styles.galleryCard}>
    <div className={`${isHero ? styles.visualBlockHero : styles.visualBlock} ${styles[`tone${visual.tone}`]}`} role="img" aria-label={visual.ariaLabel}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority={isHero}
          sizes={isHero ? "(min-width: 800px) 45vw, 100vw" : "(min-width: 800px) 34vw, 84vw"}
          style={{ objectFit: "cover", objectPosition: visual.focalPoint ?? "center" }}
        />
      ) : (
        <strong>{visual.title}</strong>
      )}
    </div>
    <figcaption>{visual.caption}</figcaption>
  </figure>
  );
};

const GalleryCarousel = ({ gallery, label }: { gallery: PartnerLandingVisual[]; label: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const move = (direction: number) => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollBy({ left: direction * Math.max(element.clientWidth * 0.78, 300), behavior: "smooth" });
  };

  return <div className={styles.carouselFrame}>
    <button className={styles.carouselButton} type="button" aria-label="Ver imágenes anteriores" onClick={() => move(-1)}>←</button>
    <div ref={scrollRef} className={styles.galleryScroll} role="region" aria-label={label} tabIndex={0}>{gallery.map((visual) => <div key={visual.title}>{renderVisual(visual)}</div>)}</div>
    <button className={styles.carouselButton} type="button" aria-label="Ver más imágenes" onClick={() => move(1)}>→</button>
  </div>;
};

export const PartnerLandingView = ({ landing }: Props) => {
  const { partner, content } = landing;
  const logoUrl = typeof partner.logoSrc === "string" ? partner.logoSrc : partner.logoSrc?.src;
  return <main className={styles.page} style={tokensToCssVars(landing.tokens)}>
    <a className={styles.skipLink} href="#main-content">Saltar al contenido</a>
    <header className={styles.topbar}>
      <div className={styles.partnerLockup} aria-label={`Experiencia de ${partner.visibleName}`}>{logoUrl ? <img className={styles.partnerLogo} src={logoUrl} alt={partner.visibleName} /> : <span className={styles.logoChip}>{partner.visibleName}</span>}<span className={styles.organizerLabel}>Curada por {partner.organizerName}</span></div>
      <span className={styles.pill}>{content.occasionLabel}</span>
    </header>
    <section id="main-content" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroCopy}><p className={styles.eyebrow}>Seleccionada para ti por {partner.organizerName}</p><h1 id="hero-title">{content.heroTitle}</h1><p className={styles.lede}>{content.heroLead}</p></div>
      {renderVisual(content.gallery[0], true)}
    </section>
    <section className={`${styles.sectionAlt} ${styles.layoutSectionAlt} ${styles.centeredIntro}`}><div className={`${styles.shell} ${styles.layoutShell}`}><p className={styles.eyebrow}>Integrada desde la planeación</p><h2>{content.belongingTitle}</h2><p className={styles.lede}>{content.belongingLead}</p></div></section>
    <section className={`${styles.section} ${styles.layoutSection}`}><div className={styles.experienceGrid}><div><p className={styles.eyebrow}>La experiencia</p><h2>{content.experienceTitle}</h2><p>{content.experienceLead}</p></div><div className={styles.inclusionStack}>{content.inclusions.map((item) => <article className={styles.inclusion} key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>
    <section className={`${styles.sectionAlt} ${styles.layoutSectionAlt}`}><div className={`${styles.shell} ${styles.layoutShell}`}><p className={styles.eyebrow}>Pensada para tus invitados</p><h2>Momentos que se quedan mucho después de la fiesta.</h2><div className={styles.grid}>{content.benefits.map((item) => <article className={styles.card} key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>
    <section className={`${styles.section} ${styles.layoutSection}`} aria-labelledby="gallery-title"><p className={styles.eyebrow}>La atmósfera</p><h2 id="gallery-title">Así se ve y se siente en tu celebración.</h2><p className={styles.carouselHint}>Una muestra real de cómo luce esta estación el día del evento.</p><GalleryCarousel gallery={content.gallery} label={content.galleryLabel} /></section>
    <section className={`${styles.sectionAlt} ${styles.layoutSectionAlt}`}><div className={`${styles.shell} ${styles.layoutShell}`}><p className={styles.eyebrow}>Cómo funciona</p><h2>Un proceso sencillo.</h2><div className={styles.grid}>{content.process.map((item, index) => <article className={styles.card} key={item.title}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>
    <section className={`${styles.section} ${styles.layoutSection} ${styles.centeredReadiness}`}><p className={styles.eyebrow}>Planeado antes del gran día</p><h2>{content.readinessTitle}</h2><p className={styles.lede}>{content.readinessLead}</p><div className={styles.callout}><strong>A tu medida, hasta en el último detalle.</strong><span>Tonos, estilo y personalización se afinan junto con {partner.organizerName} para que se vea como si siempre hubiera sido parte de tu celebración.</span></div></section>
    <section className={`${styles.sectionAlt} ${styles.layoutSectionAlt}`}><div className={styles.faq}><p className={styles.eyebrow}>Preguntas frecuentes</p><h2>Lo esencial antes de continuar.</h2>{content.faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
    <section id="contacto" className={`${styles.section} ${styles.layoutSection}`}><div className={styles.ctaBand}><p className={styles.eyebrow}>El siguiente paso sigue con ella</p><h2>{content.ctaTitle}</h2><p>{content.ctaBody}</p><span className={styles.ctaNote}>Consulta disponibilidad y propuesta directamente con {partner.organizerName}.</span></div></section>
    <footer className={styles.footer}>Una experiencia presentada por {partner.visibleName}<span>Brillipoint · producción y operación</span></footer>
  </main>;
};
