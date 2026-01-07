import { translateSlotStatus } from "@common/translations";
import styles from "./SlotChip.module.css";
import {
  GetContractByIdResponse,
  GetSlotResponse,
  Note,
} from "../../interfaces";
import { getContractById } from "src/api/services/contractService";
import { useEffect, useState } from "react";
import { getNotes } from "../../api/services/notesService";

const SlotsChips = ({
  timeSlot,
  status,
  slot,
  handleClick,
  handleCancelHold,
}: {
  timeSlot: any;
  status: string;
  slot?: GetSlotResponse;
  handleClick: (payload: {
    status: string;
    period: string;
    slotId?: number;
  }) => void;
  handleCancelHold: (slotId: number) => void;
}) => {
  const slotId = slot?.slot?.id;
  const contractId = slot?.slot?.contractId;

  const [contract, setContract] = useState<GetContractByIdResponse | null>(
    null
  );
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!slotId) return;
      const notes = await getNotes(slotId, "slot");
      setNotes(notes);
    };
    fetchNotes();
  }, [slotId]);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        if (!contractId) {
          setContract(null);
          return;
        }
        const contract = await getContractById(Number(contractId));
        setContract(contract);
      } catch (error) {
        console.error("Error fetching contract:", error);
      }
    };
    fetchContract();
  }, [contractId]);

  const payload = { status, period: timeSlot.value, slotId };
  const isCardClickable = status === "available" || status === "held";
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
          <div>
            <div className={styles.contractInfo}>
              <p>Cliente: {slot?.slot?.leadName}</p>
              {notes.length > 0 && (
                <p>Notas: {notes.map((note) => note.content).join(", ")}</p>
              )}
            </div>

            <button
              className={styles.slotActionGhost}
              onClick={(e) => {
                e.stopPropagation();
                if (!slotId) return;
                handleCancelHold(slotId);
              }}
              type="button"
            >
              Cancelar apartado
            </button>
          </div>
        )}

        {contract && (
          <div className={styles.contractInfo}>
            <p>Cliente: {slot?.slot?.leadName}</p>
            <p>
              Paquetes seleccionados:{" "}
              {contract.items.map((item) => item.package.name).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotsChips;
