import React from "react";
import { GallerySessionItem } from "../../../../interfaces/eventGallery";
import SessionCard from "../SessionCard";
import styles from "@assets/css/party-public.module.css";

interface SessionsGridProps {
  sessions: GallerySessionItem[];
  onSelectSession: (sessionToken: string) => void;
}

const SessionsGrid = ({ sessions, onSelectSession }: SessionsGridProps) => (
  <section id="galeria" className={styles.sessionsGridSection}>
    <div className={styles.mobileGalleryHeader}>
      <p>
        {sessions.length} sesión{sessions.length !== 1 ? "es" : ""} en este
        evento
      </p>
    </div>
    <div className={styles.mobileMasonry}>
      {sessions.map((session) => (
        <SessionCard
          key={session.sessionToken}
          session={session}
          onClick={() => onSelectSession(session.sessionToken)}
        />
      ))}
    </div>
  </section>
);

export default SessionsGrid;
