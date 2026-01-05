import { translateSlotStatus } from "@common/translations";
import styles from "./SlotChip.module.css";

const SlotsChips = ({
  timeSlot,
  status,
  slotId,
  handleClick,
}: {
  timeSlot: any;
  status: string;
  slotId?: number;
  handleClick: (payload: {
    status: string;
    period: string;
    slotId?: number;
  }) => void;
}) => {
  const payload = { status, period: timeSlot.value, slotId };
  const isCardClickable = status === "available";
  return (
    <div
      key={timeSlot.value}
      className={`${styles.slotCard} ${styles[`is_${status}`]} ${
        isCardClickable ? styles.isClickable : styles.isNotClickable
      }`}
      onClick={() => {
        if (!isCardClickable) return;
        handleClick(payload);
      }}
      role={isCardClickable ? "button" : undefined}
      tabIndex={isCardClickable ? 0 : -1}
      onKeyDown={(e) => {
        if (!isCardClickable) return;
        if (e.key === "Enter" || e.key === " ") handleClick(payload);
      }}
    >
      <div className={styles.slotLeft}>{timeSlot.label}</div>

      <div className={styles.slotRight}>
        <span className={`${styles.statusPill} ${styles[`is_${status}`]}`}>
          <span className={styles.statusDot} />
          {translateSlotStatus(status)}
        </span>

        {status === "available" && (
          <button
            className={styles.slotActionPrimary}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(payload);
            }}
            type="button"
          >
            Apartar
          </button>
        )}

        {status === "held" && (
          <button
            className={styles.slotActionGhost}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(payload); // aquí Calendar ejecuta cancelHoldSlot
            }}
            type="button"
          >
            Cancelar apartado
          </button>
        )}
      </div>
    </div>
  );
};

export default SlotsChips;
