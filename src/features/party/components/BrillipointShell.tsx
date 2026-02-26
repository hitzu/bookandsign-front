import React, { ReactNode } from "react";
import styles from "@assets/css/party-public.module.css";

type BrillipointShellProps = {
  children: ReactNode;
};

const BrillipointShell = ({ children }: BrillipointShellProps) => {
  return <div className={styles.pageRoot}>{children}</div>;
};

export default BrillipointShell;
