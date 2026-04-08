"use client";

import React from "react";
import styles from "@assets/css/party-public.module.css";

type PolaroidFrameProps = {
  children: React.ReactNode;
};

const PolaroidFrame = ({ children }: PolaroidFrameProps) => (
  <div className={styles.polaroidFrame}>
    <div className={styles.polaroidContentArea}>{children}</div>
    <div className={styles.polaroidWhiteArea}>
      <span className={styles.polaroidPlaceholder}>
        Aqui ira tu dedicatoria
      </span>
    </div>
  </div>
);

export default PolaroidFrame;
