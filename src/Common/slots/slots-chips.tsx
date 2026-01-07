import { translateSlotStatus } from "@common/translations";
import styles from "./SlotChip.module.css";
import { GetContractByIdResponse, GetSlotResponse } from "../../interfaces";
import { getContractById } from "src/api/services/contractService";
import { useEffect, useState } from "react";

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
