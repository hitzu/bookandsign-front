import NonLayout from "@layout/NonLayout";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import logoWhite from "@assets/images/logo-white.png";
import styles from "@assets/css/contract-public.module.css";
import { getContractByToken } from "src/api/services/contractService";
import { GetContractByIdResponse, Terms } from "src/interfaces";
import { formatLongSpanishDate } from "@common/dates";

const ContractPublicPage = () => {
  const router = useRouter();
  const token = router.query.token as string | undefined;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GetContractByIdResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getContractByToken(token);
        setData(res);
      } catch (_e: unknown) {
        setError("No se pudo cargar tu reserva. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const slot = data?.slots?.[0] ?? null;

  const formatMoney = (amount: number) => {
    const n = Number.isFinite(amount) ? amount : 0;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);
  };

  const normalizeWhatsAppPhone = (raw: string) => raw.replace(/[^\d]/g, "");

  const unitPriceForPkg = (base: number, discountPct: number | null) => {
    const baseSafe = Number.isFinite(base) ? base : 0;
    const pct = Math.min(100, Math.max(0, discountPct ?? 0));
    return Math.max(0, baseSafe - (baseSafe * pct) / 100);
  };

  const items = data?.items ?? [];
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

  const totals = useMemo(() => {
    const baseTotal = items.reduce((sum, it) => {
      const base = it?.package?.basePrice ?? 0;
      const qty = it?.quantity ?? 0;
      return sum + base * qty;
    }, 0);

    const totalWithDiscount = items.reduce((sum, it) => {
      const base = it?.package?.basePrice ?? 0;
      const qty = it?.quantity ?? 0;
      const unit = unitPriceForPkg(base, it?.package?.discount ?? null);
      return sum + unit * qty;
    }, 0);

    const discountAmount = Math.max(0, baseTotal - totalWithDiscount);
    return { baseTotal, totalWithDiscount, discountAmount };
  }, [items]);

  const paidAmount = data?.paidAmount ?? 0;
  const totalFinal =
    (data?.contract?.totalAmount ?? 0) > 0
      ? data?.contract?.totalAmount ?? totals.totalWithDiscount
      : totals.totalWithDiscount;
  const remaining = Math.max(0, totalFinal - paidAmount);

  const whatsappHref = useMemo(() => {
    const phoneRaw = (
      process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "5212215775211"
    ).trim();
    const phone = normalizeWhatsAppPhone(phoneRaw);
    const contractId = data?.contract?.id;
    const date = slot?.eventDate ? ` el ${slot.eventDate}` : "";
    const text = `Hola ✨ Tengo una duda sobre mi reserva Brillipoint${
      contractId ? ` (Contrato #${contractId})` : ""
    }${date}.`;
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${phone}?text=${encoded}`;
  }, [data?.contract?.id, slot?.eventDate]);

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
            <h1 className={styles.title}>Tu reserva Brillipoint ✨</h1>
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
      <div className={styles.contentMax}>
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.logoWrap}>
            <Image src={logoWhite} alt="Brillipoint" width={104} height={104} />
          </div>

          <h1 className={styles.title}>Tu reserva Brillipoint ✨</h1>
        </header>

        <main style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {/* RESUMEN DEL EVENTO */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>
              Resumen del evento con contrato #{data.contract.id}
            </h2>
            <div className={styles.sectionBody}>
              <Container fluid className={styles.noPad}>
                <Row className={styles.gutterMd}>
                  <Col xs={12} md={6}>
                    <div className={styles.kv}>
                      <div className={styles.kvLabel}>Fecha del evento</div>
                      <div className={styles.kvValue}>
                        {slot?.eventDate
                          ? formatLongSpanishDate(
                              new Date(`${slot.eventDate}T00:00:00`)
                            )
                          : "—"}
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} md={6}>
                    <div className={styles.kv}>
                      <div className={styles.kvLabel}>Nombre</div>
                      <div className={styles.kvValue}>
                        {slot?.leadName ?? "—"}
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} md={6}>
                    <div className={styles.kv}>
                      <div className={styles.kvLabel}>Email</div>
                      <div className={styles.kvValue}>
                        {slot?.leadEmail ?? "—"}
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} md={6}>
                    <div className={styles.kv}>
                      <div className={styles.kvLabel}>Teléfono</div>
                      <div className={styles.kvValue}>
                        {slot?.leadPhone ?? "—"}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </section>

          {/* SERVICIOS CONTRATADOS */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Servicios contratados</h2>
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
                    const pkg = it.package;
                    const qty = it.quantity ?? 1;
                    const base = pkg?.basePrice ?? 0;
                    const unit = unitPriceForPkg(base, pkg?.discount ?? null);
                    const line = unit * qty;
                    const savings = Math.max(0, base * qty - line);

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
                            {pkg?.description ? (
                              <div className={styles.itemDesc}>
                                {pkg.description}
                              </div>
                            ) : null}

                            {savings > 0 ? (
                              <div className={styles.promo}>
                                Incluye descuento Expo (ahorras{" "}
                                {formatMoney(savings)})
                              </div>
                            ) : null}
                          </div>

                          <div style={{ flexShrink: 0, textAlign: "right" }}>
                            <div className={styles.itemPrice}>
                              {formatMoney(line)}
                            </div>
                            {qty > 1 ? (
                              <div className={styles.itemUnit}>
                                {formatMoney(unit)} c/u
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* RESUMEN FINANCIERO */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Resumen financiero</h2>
            <div
              className={styles.sectionBody}
              style={{ display: "grid", gap: "0.75rem" }}
            >
              <div className={styles.financeRow}>
                <span>Precio base</span>
                <span className={styles.financeValue}>
                  {formatMoney(totals.baseTotal)}
                </span>
              </div>

              <div className={styles.financeRow}>
                <span>Descuentos</span>
                <span className={styles.financeDiscount}>
                  –{formatMoney(totals.discountAmount)}
                </span>
              </div>

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <div className={styles.totalLabel}>Total final</div>
                <div className={styles.totalValue}>
                  {formatMoney(totalFinal)}
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.financeRow}>
                <span>Anticipo pagado</span>
                <span className={styles.financeValue}>
                  {formatMoney(paidAmount)}
                </span>
              </div>

              <div className={styles.financeRow}>
                <span>Restante por pagar</span>
                <span className={styles.financeValue}>
                  {formatMoney(remaining)}
                </span>
              </div>
            </div>
          </section>

          {/* CONSIDERACIONES IMPORTANTES */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>
              Consideraciones importantes ✨
            </h2>
            {packageTerms.length === 0 ? (
              <p className={styles.termsIntro}>
                No hay términos y condiciones vinculados a los servicios de este
                contrato.
              </p>
            ) : (
              <>
                <p className={styles.termsIntro}>
                  Estos son los términos y condiciones de los servicios
                  contratados. Léelos con calma.
                </p>

                <ul className={styles.termsList}>
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
        </main>

        {/* SOCIAL CTA */}
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
              <div className={styles.socialFollowLabel}>Síguenos en redes</div>

              <div className={styles.socialButtons}>
                <a
                  href="https://www.instagram.com/brillipoint/"
                  target="_blank"
                  rel="noreferrer"
                  className={[styles.socialBtn, styles.socialBtnInstagram].join(
                    " "
                  )}
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
                  className={[styles.socialBtn, styles.socialBtnFacebook].join(
                    " "
                  )}
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
      </div>
    </div>
  );
};

ContractPublicPage.getLayout = (page: ReactElement) => (
  <NonLayout>{page}</NonLayout>
);
export default ContractPublicPage;
