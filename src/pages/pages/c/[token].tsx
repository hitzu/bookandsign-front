import NonLayout from "@layout/NonLayout";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import logoWhite from "@assets/images/logo-white.png";
import styles from "@assets/css/contract-public.module.css";
import { getContractByToken } from "../../../api/services/contractService";
import {
  getPackageTerms,
  getPublicTerms,
  getTerms,
} from "../../../api/services/termsService";
import {
  ContractSlot,
  GetContractByIdResponse,
  Note,
  Terms,
} from "../../../interfaces";
import { translateContractSlotPurpose } from "@common/translations";
import { formatLongSpanishDate } from "@common/dates";
import { getPublicNotes } from "../../../api/services/notesService";

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

  const normalizeWhatsAppPhone = (raw: string) => raw.replace(/[^\d]/g, "");

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

  const whatsappHref = useMemo(() => {
    const phoneRaw = (
      process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "5212215775211"
    ).trim();
    const phone = normalizeWhatsAppPhone(phoneRaw);
    const contractId = data?.contract?.id;
    const date = slots?.length
      ? slots[0]?.slot?.eventDate
        ? ` el ${slots[0]?.slot?.eventDate}`
        : ""
      : "";
    const text = `Hola, Tengo una duda sobre mi reserva Brillipoint${
      contractId ? ` (Contrato #${contractId})` : ""
    }${date}.`;
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${phone}?text=${encoded}`;
  }, [data?.contract?.id, slots?.length ? slots[0]?.slot?.eventDate : null]);

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
      <Row className={`mb-4 ${styles["center-information-content"]}`}>
        <Col xs={12} md={10}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Consideraciones importantes</h2>
            {packageTerms.length === 0 && terms.length === 0 ? (
              <p className={styles.termsIntro}>
                No hay términos y condiciones vinculados a los servicios de este
                contrato.
              </p>
            ) : (
              <>
                <p className={styles.termsIntro}>
                  Estos son los términos y condiciones de los servicios
                  contratados.
                </p>

                <ul className={styles.termsList}>
                  {terms.map((t) => (
                    <li key={t.id} className={styles.termsItem}>
                      <div className={styles.termTitle}>{t.title}</div>
                      <div className={styles.termContent}>{t.content}</div>
                    </li>
                  ))}
                  {packageTerms.map((t) => (
                    <li key={t.id} className={styles.termsItem}>
                      <div className={styles.termTitle}>{t.title}</div>
                      <div className={styles.termContent}>{t.content}</div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </Col>
      </Row>

      {/* SOCIAL CTA */}
      <Row className="mb-4">
        <Col xs={12}>
          <div className={styles.socialCtaWrap}>
            <div className={styles.socialCtaCard}>
              <div style={{ display: "grid", gap: "0.25rem" }}>
                <div className={styles.socialCtaTitle}>
                  ¿Tienes dudas sobre tu reserva?
                </div>
                <div className={styles.socialCtaSubtitle}>
                  Estamos listos para ayudarte por WhatsApp
                </div>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={styles.whatsappBtn}
              >
                <span className={styles.btnIcon} aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 2.667C8.643 2.667 2.667 8.643 2.667 16c0 2.373.62 4.691 1.799 6.73L2.667 29.333l6.843-1.769A13.27 13.27 0 0 0 16 29.333c7.357 0 13.333-5.976 13.333-13.333S23.357 2.667 16 2.667Zm0 24A10.6 10.6 0 0 1 10.4 25.07l-.4-.235-4.06 1.05 1.085-3.956-.26-.41A10.61 10.61 0 1 1 16 26.667Z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <path
                      d="M22.24 18.645c-.33-.165-1.957-.965-2.26-1.076-.303-.11-.524-.165-.744.165-.22.33-.855 1.076-1.05 1.296-.193.22-.386.247-.716.082-.33-.165-1.395-.514-2.658-1.64-.982-.876-1.645-1.958-1.84-2.288-.193-.33-.021-.509.144-.674.149-.148.33-.386.495-.579.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.579-.082-.165-.744-1.797-1.02-2.46-.268-.642-.54-.555-.744-.565l-.634-.012c-.22 0-.578.082-.88.413-.303.33-1.156 1.13-1.156 2.756 0 1.626 1.185 3.198 1.35 3.418.165.22 2.333 3.56 5.65 4.99.79.34 1.405.543 1.885.695.792.252 1.512.217 2.08.132.635-.095 1.957-.8 2.233-1.57.275-.772.275-1.434.193-1.57-.082-.138-.303-.22-.634-.386Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Escríbenos por WhatsApp
              </a>

              <div className={styles.socialFollow}>
                <div className={styles.socialFollowLabel}>
                  Síguenos en redes
                </div>

                <div className={styles.socialButtons}>
                  <a
                    href="https://www.instagram.com/brillipoint/"
                    target="_blank"
                    rel="noreferrer"
                    className={[
                      styles.socialBtn,
                      styles.socialBtnInstagram,
                    ].join(" ")}
                  >
                    <span className={styles.btnIcon} aria-hidden="true">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Z"
                          fill="currentColor"
                          opacity="0.95"
                        />
                        <path
                          d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
                          fill="currentColor"
                        />
                        <path
                          d="M17.6 6.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    Instagram
                  </a>

                  <a
                    href="https://www.facebook.com/profile.php?id=61579380963496"
                    target="_blank"
                    rel="noreferrer"
                    className={[
                      styles.socialBtn,
                      styles.socialBtnFacebook,
                    ].join(" ")}
                  >
                    <span className={styles.btnIcon} aria-hidden="true">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.5 21v-7h2.4l.4-3H13.5V9.2c0-.87.24-1.46 1.5-1.46h1.6V5.06c-.28-.04-1.24-.12-2.36-.12-2.33 0-3.94 1.42-3.94 4.03V11H8v3h2.8v7h2.7Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    Facebook
                  </a>
                </div>
              </div>

              <div className={styles.socialThanks}>
                ✨ Gracias por vivir la experiencia Brillipoint ✨
              </div>

              {/* legacy links (kept for reference) */}
              <div style={{ display: "none" }} aria-hidden="true">
                <a
                  href="https://www.instagram.com/brillipoint/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61579380963496"
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

ContractPublicPage.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);
export default ContractPublicPage;
