import React, { useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { MEDIA_DATA } from "../../media/mediaManifest";
import NewProductSlider, {
  PhotosCollection,
} from "@views/Application/E-details/NewProductSlider";
import styles from "../../assets/css/sales-photos.module.css";

export const Photos = () => {
  const [photosCollectionId, setPhotosCollectionId] =
    useState<string>("glitter_bar");

  const selectedPhotos: PhotosCollection[] = useMemo(() => {
    const section =
      MEDIA_DATA.sections.find((s) => s.id === photosCollectionId) ??
      MEDIA_DATA.sections[0];
    if (!section) return [];

    return section.photos.map((p, idx) => ({
      id: `${section.id}_${idx}`,
      url: p.src,
      urlFallback: p.fallbackSrc ?? "",
    }));
  }, [photosCollectionId]);

  return (
    <div className={styles.photosContainer}>
      <Row className="justify-content-center">
        <Col xs={12} lg={12} xl={10} xxl={8}>
          <div style={{ width: "100%" }}>
            <div className={styles.photosCollectionsPillGroup}>
              {MEDIA_DATA.sections.map((c) => {
                const isActive = c.id === photosCollectionId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPhotosCollectionId(c.id)}
                    className={
                      styles.photosCollectionsPill +
                      " " +
                      (isActive
                        ? styles.photosCollectionsPillActive
                        : styles.photosCollectionsPillInactive)
                    }
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} lg={12} xl={10} xxl={8}>
          <div className={styles.sliderWrap}>
            <NewProductSlider images={selectedPhotos} />
          </div>
        </Col>
      </Row>
    </div>

    // <div style={{ width: "100%" }}>
    //   {/* Filter pills (tabs) */}
    //   <div className={styles.photosCollectionsPillGroup}>
    //     {photosCollections.map((c) => {
    //       const isActive = c.id === photosCollectionId;
    //       return (
    //         <button
    //           key={c.id}
    //           type="button"
    //           onClick={() => setPhotosCollectionId(c.id)}
    //           className={
    //             styles.photosCollectionsPill +
    //             " " +
    //             (isActive
    //               ? styles.photosCollectionsPillActive
    //               : styles.photosCollectionsPillInactive)
    //           }
    //         >
    //           {c.title}
    //         </button>
    //       );
    //     })}
    //   </div>

    //   {/* Carousel (placeholder, touch-first) */}
    //   <div
    //     onTouchStart={onTouchStart}
    //     onTouchEnd={onTouchEnd}
    //     style={{
    //       width: "100%",
    //       maxWidth: 820,
    //       margin: "0 auto",
    //       padding: "0 12px",
    //       touchAction: "pan-y", // allow vertical page scroll, but we ignore vertical swipe intent inside
    //     }}
    //   >
    //     <div
    //       onClick={openFullscreen}
    //       style={{
    //         width: "100%",
    //         aspectRatio: "4 / 5",
    //         borderRadius: 18,
    //         border: "1px solid rgba(255,255,255,0.15)",
    //         background: "rgba(0,0,0,0.25)",
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //         position: "relative",
    //         overflow: "hidden",
    //         cursor: activeItem ? "zoom-in" : "default",
    //       }}
    //       aria-label="Carrusel de fotos"
    //     >
    //       <div
    //         style={{
    //           textAlign: "center",
    //           padding: 18,
    //           maxWidth: 520,
    //         }}
    //       >
    //         {isLoading && (
    //           <div style={{ fontSize: 18, opacity: 0.9 }}>Cargando fotos…</div>
    //         )}
    //         {!isLoading && error && (
    //           <div style={{ fontSize: 18, opacity: 0.9 }}>{error}</div>
    //         )}
    //         {!isLoading && !error && !activeItem && (
    //           <div style={{ fontSize: 18, opacity: 0.9 }}>
    //             No hay fotos en esta colección.
    //           </div>
    //         )}
    //       </div>

    //       {!isLoading && !error && activeItem && (
    //         <Image
    //           src={activeItem.src}
    //           alt={activeItem.alt}
    //           fill
    //           sizes="(max-width: 900px) 92vw, 820px"
    //           style={{ objectFit: "contain" }}
    //           // Supabase public URLs are already CDN-friendly; bypass Next image optimizer
    //           // to avoid 400s from remote pattern/URL encoding edge cases (e.g. spaces).
    //           unoptimized
    //           onError={(e) => {
    //             const img = e.currentTarget as unknown as HTMLImageElement;
    //             if (
    //               activeItem.fallbackSrc &&
    //               img.src !== activeItem.fallbackSrc
    //             ) {
    //               img.src = activeItem.fallbackSrc;
    //             }
    //           }}
    //           priority={activeIndex === 0}
    //         />
    //       )}

    //       {/* Non-interactive overlay copy (always visible) */}
    //       <div
    //         style={{
    //           position: "absolute",
    //           left: 0,
    //           right: 0,
    //           bottom: 0,
    //           padding: "14px 16px",
    //           background:
    //             "linear-gradient(transparent, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.7))",
    //           pointerEvents: "none",
    //         }}
    //       >
    //         <div style={{ fontSize: 16, opacity: 0.9 }}>
    //           {collections.find((c) => c.id === selectedCollectionId)?.title ??
    //             "Fotos"}
    //           {items.length > 0 ? ` · ${activeIndex + 1}/${items.length}` : ""}
    //         </div>
    //       </div>
    //     </div>

    //     {/* Big dots */}
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "center",
    //         gap: 10,
    //         padding: "14px 0 10px",
    //       }}
    //       aria-label="Indicadores"
    //     >
    //       {items.map((it, idx) => {
    //         const isActive = idx === activeIndex;
    //         return (
    //           <button
    //             key={it.id}
    //             type="button"
    //             onClick={() => setActiveIndex(idx)}
    //             aria-label={`Ir a elemento ${idx + 1}`}
    //             style={{
    //               width: 14,
    //               height: 14,
    //               borderRadius: 999,
    //               border: "1px solid rgba(255,255,255,0.6)",
    //               background: isActive
    //                 ? "rgba(255,255,255,0.85)"
    //                 : "transparent",
    //               padding: 0,
    //               touchAction: "manipulation",
    //             }}
    //           />
    //         );
    //       })}
    //     </div>

    //     {/* One-hand hint */}
    //     <div
    //       style={{
    //         textAlign: "center",
    //         fontSize: 16,
    //         opacity: 0.85,
    //         paddingBottom: 8,
    //       }}
    //     >
    //       {items.length > 0
    //         ? "Desliza para cambiar · Toca un punto para saltar"
    //         : isLoading
    //         ? "Preparando galería…"
    //         : "Sin elementos para mostrar"}
    //     </div>
    //   </div>

    //   {/* Fullscreen overlay */}
    //   {isFullscreen && activeItem && (
    //     <div
    //       role="dialog"
    //       aria-modal="true"
    //       aria-label="Foto en pantalla completa"
    //       onTouchStart={onTouchStart}
    //       onTouchEnd={onTouchEnd}
    //       onClick={() => setIsFullscreen(false)}
    //       style={{
    //         position: "fixed",
    //         inset: 0,
    //         background: "rgba(0,0,0,0.92)",
    //         zIndex: 9999,
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //         padding: 16,
    //       }}
    //     >
    //       {/* Close button */}
    //       <button
    //         type="button"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           setIsFullscreen(false);
    //         }}
    //         aria-label="Cerrar"
    //         style={{
    //           position: "absolute",
    //           top: 12,
    //           right: 12,
    //           width: 46,
    //           height: 46,
    //           borderRadius: 999,
    //           border: "1px solid rgba(255,255,255,0.25)",
    //           background: "rgba(255,255,255,0.12)",
    //           color: "white",
    //           fontSize: 28,
    //           lineHeight: "46px",
    //           textAlign: "center",
    //           padding: 0,
    //           touchAction: "manipulation",
    //         }}
    //       >
    //         ×
    //       </button>

    //       {/* Image */}
    //       <div
    //         onClick={(e) => e.stopPropagation()}
    //         style={{
    //           position: "relative",
    //           width: "min(1100px, 100%)",
    //           height: "min(92vh, 900px)",
    //         }}
    //       >
    //         <Image
    //           src={activeItem.src}
    //           alt={activeItem.alt}
    //           fill
    //           sizes="100vw"
    //           style={{ objectFit: "contain" }}
    //           unoptimized
    //           onError={(e) => {
    //             const img = e.currentTarget as unknown as HTMLImageElement;
    //             if (
    //               activeItem.fallbackSrc &&
    //               img.src !== activeItem.fallbackSrc
    //             ) {
    //               img.src = activeItem.fallbackSrc;
    //             }
    //           }}
    //           priority
    //         />

    //         {/* Footer text */}
    //         <div
    //           style={{
    //             position: "absolute",
    //             left: 0,
    //             right: 0,
    //             bottom: 0,
    //             padding: "14px 16px",
    //             background:
    //               "linear-gradient(transparent, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.7))",
    //             pointerEvents: "none",
    //             color: "white",
    //           }}
    //         >
    //           <div style={{ fontSize: 16, opacity: 0.9 }}>
    //             {collections.find((c) => c.id === selectedCollectionId)
    //               ?.title ?? "Fotos"}
    //             {items.length > 0
    //               ? ` · ${activeIndex + 1}/${items.length}`
    //               : ""}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};
