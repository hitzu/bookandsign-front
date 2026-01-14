import React, { useEffect, useMemo, useState } from "react";

import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import styles from "./NewProductSlider.module.css";

export type PhotosCollection = {
  id: string;
  url: string;
  urlFallback: string;
};

const NewProductSlider = (params: { images: PhotosCollection[] }) => {
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => params.images ?? [], [params.images]);
  const hasSlides = slides.length > 0;

  // When the collection changes, reset to the first slide to avoid out-of-range indices.
  useEffect(() => {
    setActiveIndex(0);
    mainSwiper?.slideTo(0, 0);
  }, [mainSwiper, slides]);

  return (
    <React.Fragment>
      {!hasSlides ? (
        <div
          style={{ padding: "18px 12px", textAlign: "center", opacity: 0.8 }}
        >
          No hay fotos en esta colección.
        </div>
      ) : (
        <div className={styles.sliderRoot}>
          <Swiper
            onSwiper={setMainSwiper}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
            spaceBetween={10}
            modules={[Navigation]}
            className={styles.mainSwiper}
          >
            {slides.map((img, idx) => (
              <SwiperSlide key={img.id}>
                <div className={styles.slideFrame}>
                  <img
                    src={img.url}
                    alt={`Foto ${idx + 1}`}
                    className={styles.mainImg}
                    loading={idx === 0 ? "eager" : "lazy"}
                    onError={(e) => {
                      if (!img.urlFallback) return;
                      const el = e.currentTarget as HTMLImageElement;
                      if (el.src !== img.urlFallback) el.src = img.urlFallback;
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {slides.length > 1 && (
            <div style={{ paddingTop: 12 }}>
              <div className={styles.thumbsStrip}>
                {slides.map((img, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={`${img.id}-thumb`}
                      type="button"
                      aria-label={`Ver foto ${idx + 1}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => mainSwiper?.slideTo(idx)}
                      className={styles.thumbButton}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className={styles.thumbImg}
                        loading="lazy"
                        onError={(e) => {
                          if (!img.urlFallback) return;
                          const el = e.currentTarget as HTMLImageElement;
                          if (el.src !== img.urlFallback)
                            el.src = img.urlFallback;
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default NewProductSlider;
