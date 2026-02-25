import React, { useEffect, useRef } from "react";
import styles from "@assets/css/party-public.module.css";

type InfiniteLoaderProps = {
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  onLoadMore: () => void;
  onRetry: () => void;
};

const InfiniteLoader = ({
  hasMore,
  isLoading,
  error,
  onLoadMore,
  onRetry,
}: InfiniteLoaderProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || isLoading || Boolean(error)) return;
    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [error, hasMore, isLoading, onLoadMore]);

  if (!hasMore && !isLoading && !error) return null;

  return (
    <div className={styles.infiniteWrap}>
      {error ? (
        <button type="button" className={styles.retryBtn} onClick={onRetry}>
          Reintentar
        </button>
      ) : null}

      {isLoading ? (
        <div className={styles.mobileSkeletonGrid}>
          {new Array(6).fill(0).map((_, index) => (
            <div key={index} className={styles.mobileSkeletonCard} />
          ))}
        </div>
      ) : null}

      <div ref={sentinelRef} className={styles.infiniteSentinel} aria-hidden="true" />
    </div>
  );
};

export default InfiniteLoader;
