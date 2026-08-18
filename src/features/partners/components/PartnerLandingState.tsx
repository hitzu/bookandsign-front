import baseStyles from "./PartnerLandingView.module.css";
import stateStyles from "./PartnerLandingState.module.css";
import { PartnerLandingErrorState } from "../types";

type Props = {
  state: PartnerLandingErrorState;
};

const styles = { ...baseStyles, ...stateStyles };

export const PartnerLandingState = ({ state }: Props) => (
  <main className={styles.statePage}>
    <a className={styles.skipLink} href="#state-content">
      Saltar al contenido
    </a>
    <section id="state-content" className={styles.stateCard} aria-live="polite">
      <p className={styles.eyebrow}>Brillipoint × Partners</p>
      <h1>{state.title}</h1>
      <p>{state.message}</p>
      <span className={styles.stateMeta}>
        {state.slug ? `Partner: ${state.slug}` : "Partner pendiente"}
        {state.occasion ? ` · Ocasión: ${state.occasion}` : ""}
      </span>
    </section>
  </main>
);
