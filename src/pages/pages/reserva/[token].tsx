import NonLayout from "@layout/NonLayout";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import logoWhite from "@assets/images/logo-white.png";
import styles from "@assets/css/contract-public.module.css";
import { getContractByToken } from "../../../api/services/contractService";
import { getPublicTerms } from "../../../api/services/termsService";
import {
  ContractSlot,
  GetContractByIdResponse,
  Note,
  Terms,
} from "../../../interfaces";
import { translateContractSlotPurpose } from "@common/translations";
import { formatLongSpanishDate } from "@common/dates";
import { getPublicNotes } from "../../../api/services/notesService";
import { SocialMediaPlugin } from "../../../views/Booking/SocialMediaPlugin";
import TermsAndConditions from "@views/Booking/TermsAndConditions";

const ContractPublicPage = () => {
  const router = useRouter();
  const token = router.query.token as string | undefined;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GetContractByIdResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<ContractSlot[]>([]);
  const [terms, setTerms] = useState<Terms[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const halfwayDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + (end.getTime() - start.getTime()) / 2);
  };

  useEffect(() => {
    const loadContract = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const res = await getContractByToken(token);
        setData(res);
        const eventDate = new Date(res.contractSlots[0].slot.eventDate);
        const slotsToShow: ContractSlot[] = [
          {
            id: 0,
            purpose: "creation_date",
            slotId: 0,
            contractId: 0,
            slot: {
              contractId: 0,
              id: 0,
              eventDate: res.contract.createdAt,
              status: "reserved",
            },
          },
          {
            id: 0,
            purpose: "halfway_date",
            slotId: 0,
            contractId: 0,
            slot: {
              contractId: 0,
              id: 0,
              eventDate: halfwayDate(
                eventDate,
                new Date(res.contract.createdAt)
              ).toISOString(),
              status: "reserved",
            },
          },
          ...res.contractSlots,
        ];
        setSlots(slotsToShow);
      } catch (_e: unknown) {
        setError("No se pudo cargar tu reserva. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadContract();
  }, [token]);

  useEffect(() => {
    try {
      if (!data?.contract?.id) return;
      const loadTermsAndNotes = async () => {
        try {
          const terms = await getPublicTerms({ scope: "global" });
          if (
            data?.packages &&
            data?.packages.length > 0 &&
            data?.packages[0].package.id
          ) {
            const promises = data?.packages.map((currentPackage) =>
              getPublicTerms({
                targetId: currentPackage.package.id,
                scope: "package",
              })
            );
            const packageTerms = await Promise.all(promises);
            setTerms([...terms, ...packageTerms.flat()]);

            const notes = await getPublicNotes(data?.contract?.id, "contract");
            setNotes([...notes]);
          } else {
            setTerms(terms);
          }
        } catch (error) {
          console.error("Error loading terms and notes:", error);
        }
      };
      loadTermsAndNotes();
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  }, [data?.contract]);

  const formatMoney = (amount: number) => {
    const n = Number.isFinite(amount) ? amount : 0;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);
  };

  const items = data?.packages ?? [];
  const packageTerms = useMemo((): Terms[] => {
    const dedup = new Map<number, Terms>();
    for (const it of items) {
      const terms = it?.package?.terms ?? [];
      for (const t of terms) {
        if (t?.id == null) continue;
        if (!dedup.has(t.id)) dedup.set(t.id, t);
      }
    }
    return Array.from(dedup.values());
  }, [items]);

  const paidAmount = data?.paidAmount ?? 0;

  const paymentsSorted = useMemo(() => {
    const payments = (data?.payments ?? []).slice();
    payments.sort((a, b) => {
      const aRaw = a?.receivedAt ?? "";
      const bRaw = b?.receivedAt ?? "";
      const aD = aRaw.includes("T")
        ? new Date(aRaw)
        : new Date(`${aRaw}T00:00:00`);
      const bD = bRaw.includes("T")
        ? new Date(bRaw)
        : new Date(`${bRaw}T00:00:00`);
      const aT = Number.isNaN(aD.getTime()) ? 0 : aD.getTime();
      const bT = Number.isNaN(bD.getTime()) ? 0 : bD.getTime();
      return aT - bT; // oldest -> newest
    });
    return payments;
  }, [data?.payments]);

  const paidAmountFromPayments = useMemo(() => {
    if (paymentsSorted.length === 0) return paidAmount;
    return paymentsSorted.reduce((sum, p) => sum + (p?.amount ?? 0), 0);
  }, [paidAmount, paymentsSorted]);

  const [expandedItemIds, setExpandedItemIds] = useState<Set<number>>(
    () => new Set()
  );

  if (loading) {
    return (
      <div className={styles.contractPublicContainer}>
        <div className={styles.contentMax}>
          <header className={styles.header}>
            <div className={styles.logoWrap} style={{ opacity: 0.9 }}>
              <Image src={logoWhite} alt="Brillipoint" width={96} height={96} />
            </div>
            <div className={styles.skeletonLineLg} />
            <div className={styles.skeletonLineMd} />
          </header>

          <div style={{ display: "grid", gap: "1rem" }}>
            <section className={styles.card}>
              <div className={styles.skeletonLineMd} style={{ margin: 0 }} />
              <div className={styles.sectionBody}>
                <Container fluid className={styles.noPad}>
                  <Row className={styles.gutterMd}>
                    <Col xs={12} md={6}>
                      <div className={styles.skeletonBox} />
                    </Col>
                    <Col xs={12} md={6}>
                      <div className={styles.skeletonBox} />
                    </Col>
                    <Col xs={12} md={6}>
                      <div className={styles.skeletonBox} />
                    </Col>
                    <Col xs={12} md={6}>
                      <div className={styles.skeletonBox} />
                    </Col>
                  </Row>
                </Container>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.skeletonLineMd} style={{ margin: 0 }} />
              <div className={styles.sectionBody}>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <div className={styles.skeletonBox} />
                  <div className={styles.skeletonBox} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.contractPublicContainer}>
        <div className={styles.contentMax}>
          <header className={styles.header}>
            <div className={styles.logoWrap}>
              <Image src={logoWhite} alt="Brillipoint" width={96} height={96} />
            </div>
            <h1 className={styles.title}>Tu reserva Brillipoint </h1>
          </header>

          <section className={`${styles.card} ${styles.errorCard}`}>
            <div className={styles.errorTitle}>
              No pudimos cargar tu reserva
            </div>
            <p className={styles.errorText}>
              {error ??
                "Ocurrió un problema al cargar la información del contrato."}
            </p>
            <button
              type="button"
              onClick={() => router.reload()}
              className={styles.btnRetry}
            >
              Reintentar
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contractPublicContainer}>
      <Row className="mb-4">
        <Col xs={12}>
          <header className={styles.header}>
            <div className={styles.logoWrap}>
              <Image
                src={logoWhite}
                alt="Brillipoint"
                width={104}
                height={104}
              />
            </div>

            <h1 className={styles.title}>Tu reserva Brillipoint ✨</h1>
          </header>
        </Col>
      </Row>

      {/* CLIENT DATA */}
      <Row className={`mb-4 ${styles["center-information-content"]}`}>
        <Col xs={12} md={10}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Datos del cliente</h2>
            <div className={styles.sectionBody}>
              <Container fluid className={styles.noPad}>
                <Row className={styles.gutterMd}>
                  <Col xs={12} md={4}>
                    <div className={styles.kv}>
                      <div className={styles.kvLabel}>Nombre</div>
                      <div className={styles.kvValue}>
                        {data.contract?.clientName ?? "—"}
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} md={4}>
                    <div className={styles.kv}>
                      <div className={styles.kvLabel}>Email</div>
                      <div className={styles.kvValue}>
                        {data.contract?.clientEmail ?? "—"}
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} md={4}>
                    <div className={styles.kv}>
                      <div className={styles.kvLabel}>Teléfono</div>
                      <div className={styles.kvValue}>
                        {data.contract?.clientPhone ?? "—"}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </section>
        </Col>
      </Row>

      {/* EVENT DATES */}
      <Row className={`mb-4 ${styles["center-information-content"]}`}>
        <Col xs={12} md={10}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Fechas de los eventos</h2>
            <div className={styles.sectionBody}>
              {slots.map((slot) => (
                <div key={slot.id} className={styles.financeRow}>
                  <span className={styles.financeValue}>
                    {translateContractSlotPurpose(slot.purpose)}
                  </span>
                  <span>
                    {formatLongSpanishDate(new Date(slot.slot?.eventDate))}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Col>
      </Row>

      <Row className={`mb-4 ${styles["center-information-content"]}`}>
        <Col xs={12} md={10}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Servicios contratados</h2>{" "}
            <button
              type="button"
              className={styles.detailToggle}
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Ocultar detalles" : "Ver detalles"}
            </button>
            <div className={styles.sectionBody}>
              {items.length === 0 ? (
                <div
                  style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}
                >
                  Aún no hay servicios vinculados a este contrato.
                </div>
              ) : (
                <ul className={styles.list}>
                  {items.map((it) => {
                    const products =
                      it.package?.packageProducts
                        ?.map((pp) => pp.product?.name)
                        .filter(Boolean) ?? [];
                    const pkg = it.package;
                    const qty = it.quantity ?? 1;

                    return (
                      <li key={it.id} className={styles.listItem}>
                        <div className={styles.itemRow}>
                          <div style={{ minWidth: 0 }}>
                            <div className={styles.itemName}>
                              {pkg?.name ?? "Paquete"}
                              {qty > 1 ? (
                                <span className={styles.itemQty}>×{qty}</span>
                              ) : null}
                            </div>
                            <div className={styles.itemName}>
                              {it.promotion?.name ?? "—"}
                            </div>
                          </div>

                          <div style={{ flexShrink: 0, textAlign: "right" }}>
                            <div className={styles.itemPrice}>
                              {formatMoney(it.package.basePrice * qty)}
                            </div>
                            <div className={styles.itemPrice}>
                              -{" "}
                              {formatMoney(
                                (it.package.basePrice *
                                  qty *
                                  (it.promotion?.value ?? 0)) /
                                  100
                              )}
                            </div>
                          </div>
                        </div>

                        {isExpanded ? (
                          <div className={styles.detailsBlock}>
                            {products.length > 0 ? (
                              <ul className={styles.detailsList}>
                                {products.map((name, idx) => (
                                  <li key={`${it.packageId}-${idx}`}>{name}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </Col>
      </Row>

      {/* RESUMEN FINANCIERO */}
      <Row className={`mb-4 ${styles["center-information-content"]}`}>
        <Col xs={12} md={10}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Tu pago y saldo</h2>
            <div
              className={styles.sectionBody}
              style={{ display: "grid", gap: "0.75rem" }}
            >
              <div className={styles.financeRow}>
                <span>Subtotal</span>
                <span className={styles.financeValue}>
                  {formatMoney(data.contract.subtotal)}
                </span>
              </div>

              <div className={styles.financeRow}>
                <span>Descuentos</span>
                <span className={styles.financeDiscount}>
                  –{formatMoney(data.contract.discountTotal)}
                </span>
              </div>

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <div className={styles.totalLabel}>Total final</div>
                <div className={styles.totalValue}>
                  {formatMoney(data.contract.total)}{" "}
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.subSectionTitle}>Historial de pagos</div>

              {paymentsSorted.length === 0 ? (
                <div className={styles.emptySubText}>
                  Aún no hay pagos registrados.
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.35rem" }}>
                  {paymentsSorted.map((p, idx) => (
                    <div key={p.id ?? idx} className={styles.financeRow}>
                      <span>
                        Total pagado {idx + 1}:{" "}
                        {formatLongSpanishDate(new Date(p.receivedAt))}
                      </span>
                      <span className={styles.financeValue}>
                        {formatMoney(p.amount ?? 0)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.divider} />

              <div className={styles.financeRow}>
                <span>Total pagado</span>
                <span className={styles.financeValue}>
                  {formatMoney(paidAmountFromPayments)}
                </span>
              </div>

              <div className={styles.financeRow}>
                <span>Restante por pagar</span>
                <span
                  className={
                    styles.financeValue +
                    " " +
                    styles.financeValuePaymentPending
                  }
                >
                  {formatMoney(data.contract.total - paidAmountFromPayments)}
                  <span className={styles.moveValueText}> + traslado</span>
                </span>
              </div>
            </div>
          </section>
        </Col>
      </Row>

      {/* NOTAS */}
      {notes?.length > 0 && (
        <Row className={`mb-4 ${styles["center-information-content"]}`}>
          <Col xs={12} md={10}>
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Notas de la reserva</h2>
              <p className={styles.termsIntro}>
                Promociones, descuentos y notas importantes aplicados a tu
                reserva.
              </p>

              <ul className={styles.termsList}>
                {notes.map((t) => (
                  <li key={t.id} className={styles.termsItem}>
                    <div className={styles.termTitle}>{t.content}</div>
                  </li>
                ))}
              </ul>
            </section>
          </Col>
        </Row>
      )}

      {/* CONSIDERACIONES IMPORTANTES */}
      <TermsAndConditions packageTerms={packageTerms} terms={terms} />

      {/* SOCIAL MEDIA PLUGIN */}
      <SocialMediaPlugin data={data} slot={slots[0]} />
    </div>
  );
};

ContractPublicPage.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);
export default ContractPublicPage;
