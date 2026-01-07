import React, { ReactElement, useEffect, useMemo, useState } from "react";
import NonLayout from "@layout/NonLayout";
import styles from "../../../assets/css/contract-creation.module.css";
import logoWhite from "@assets/images/logo-white.png";
import Image from "next/image";
import { Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { getBrands } from "../../../api/services/brandService";
import { getPackages } from "../../../api/services/packageService";
import type { GetBrandsResponse } from "../../../interfaces/brands";
import type { GetPackagesResponse } from "../../../interfaces/packages";
import {
  Contract,
  GenerateContractPayload,
  GetProductsResponse,
  Slot,
} from "../../../interfaces";
import {
  bookSlot,
  getSlotById,
  updateLeadInfo,
} from "../../../api/services/slotsService";
import { formatLongSpanishDate } from "@common/dates";
import {
  generateContract,
  getContractById,
} from "../../../api/services/contractService";
import { createNote } from "../../../api/services/notesService";
import QRCode from "react-qr-code";

type ClientDraft = {
  leadName: string;
  leadEmail: string | null;
  leadPhone: string | null;
};

type PackageLineItem = {
  pkg: GetPackagesResponse;
  quantity: number;
};

const ContractCreationPage = () => {
  const router = useRouter();
  const { slotId } = router.query;
  const [slot, setSlot] = useState<Slot | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | "">("");

  const [packages, setPackages] = useState<GetPackagesResponse[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");

  const [qtyToAdd, setQtyToAdd] = useState<number>(1);
  const [items, setItems] = useState<PackageLineItem[]>([]);

  const [deposit, setDeposit] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");

  const [clientDraft, setClientDraft] = useState<ClientDraft>({
    leadName: "",
    leadEmail: null,
    leadPhone: null,
  });

  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const isLocked = !!contract;

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = (await getBrands()) as GetBrandsResponse[];
        setBrands(Array.isArray(data) ? data : []);
        if (data.length > 0) {
          setSelectedBrandId(data[0].id);
        }
      } catch (e) {
        console.error("Error loading brands:", e);
        setBrands([]);
      }
    };

    loadBrands();
  }, []);

  useEffect(() => {
    const loadPackages = async () => {
      if (!selectedBrandId) {
        setPackages([]);
        setSelectedPackageId("");
        return;
      }

      try {
        setSelectedPackageId("");
        const data = await getPackages({ brandId: Number(selectedBrandId) });
        setPackages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading packages:", e);
        setPackages([]);
      }
    };

    loadPackages();
  }, [selectedBrandId]);

  useEffect(() => {
    if (!slotId) return;
    const fetchSlot = async () => {
      try {
        const slot = await getSlotById(Number(slotId));

        if (slot.contractId) {
          const contract = await getContractById(Number(slot.contractId));
          setContract(contract.contract);
        } else {
          setContract(null);
        }

        setClientDraft({
          leadName: slot.leadName ?? "",
          leadEmail: slot.leadEmail ?? "",
          leadPhone: slot.leadPhone ?? "",
        });

        setDate(slot.eventDate);

        setIsEditingClient(false);

        setSlot(slot);
      } catch (e) {
        console.error("Error fetching slot:", e);
      }
    };
    fetchSlot();
  }, [slotId]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(n);

  const unitPriceForPackage = (p: GetPackagesResponse) => {
    const base = p.basePrice ?? 0;
    const discountPct = Math.min(100, Math.max(0, p.discount ?? 0));
    return Math.max(0, base - (base * discountPct) / 100);
  };

  const total = items.reduce(
    (sum, it) => sum + it.pkg.basePrice * it.quantity,
    0
  );

  const totalWithDiscount = items.reduce(
    (sum, it) => sum + unitPriceForPackage(it.pkg) * it.quantity,
    0
  );

  const depositNumber = Math.max(
    0,
    Number((deposit || "0").replace(/[^\d.]/g, "")) || 0
  );

  const handleAddSelectedPackage = () => {
    if (isLocked) return;
    if (!selectedPackageId) return;
    const pkg = packages.find((p) => p.id === Number(selectedPackageId));
    if (!pkg) return;

    const addQty = Number.isFinite(qtyToAdd) && qtyToAdd > 0 ? qtyToAdd : 1;

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.pkg.id === pkg.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + addQty };
        return copy;
      }
      return [...prev, { pkg, quantity: addQty }];
    });

    setQtyToAdd(1);
    setSelectedPackageId("");
  };

  const incItem = (packageId: number) => {
    if (isLocked) return;
    setItems((prev) =>
      prev.map((it) =>
        it.pkg.id === packageId ? { ...it, quantity: it.quantity + 1 } : it
      )
    );
  };

  const decItem = (packageId: number) => {
    if (isLocked) return;
    setItems((prev) =>
      prev
        .map((it) =>
          it.pkg.id === packageId
            ? { ...it, quantity: Math.max(1, it.quantity - 1) }
            : it
        )
        .filter(Boolean)
    );
  };

  const removeItem = (packageId: number) => {
    if (isLocked) return;
    setItems((prev) => prev.filter((it) => it.pkg.id !== packageId));
  };

  const handleStartEditClient = () => {
    if (isLocked) return;
    setIsEditingClient(true);
  };

  const handleCancelEditClient = () => {
    setClientDraft({
      leadName: slot?.leadName ?? "",
      leadEmail: slot?.leadEmail ?? "",
      leadPhone: slot?.leadPhone ?? "",
    });
    setIsEditingClient(false);
  };

  const handleSaveClient = async () => {
    if (isLocked) return;
    try {
      await updateLeadInfo(Number(slotId), {
        ...(clientDraft.leadName?.trim()
          ? { leadName: clientDraft.leadName.trim() }
          : {}),
        ...(clientDraft.leadEmail?.trim()
          ? { leadEmail: clientDraft.leadEmail.trim() }
          : {}),
        ...(clientDraft.leadPhone?.trim()
          ? { leadPhone: clientDraft.leadPhone.trim() }
          : {}),
      });

      setIsEditingClient(false);
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleGenerateContract = async () => {
    try {
      const payload: GenerateContractPayload = {
        slotId: Number(slotId),
        packages: items.map((item) => ({
          packageId: item.pkg.id,
          quantity: item.quantity,
          source: "package",
        })),
      };
      const contract = await generateContract(payload);

      if (contract) {
        await createNote({
          targetId: contract.id,
          content: notes,
          scope: "contract",
          kind: "internal",
        });
      }
      setContract(contract);

      await bookSlot({ slotId: Number(slotId), contractId: contract.id });
    } catch (error) {
      console.error("Error generating contract:", error);
    }
  };

  const promotionalProducts = useMemo(() => {
    const byId = new Map<number, Omit<GetProductsResponse, "brand">>();

    for (const it of items) {
      for (const pp of it.pkg.packageProducts ?? []) {
        if (pp.product?.isPromotional) byId.set(pp.product.id, pp.product);
      }
    }

    return Array.from(byId.values());
  }, [items]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const contractLink = contract?.token
    ? `${origin}/pages/c/${contract.token}`
    : "";

  return (
    <div className={styles.contractCreationContainer}>
      <Row className="justify-content-center">
        <Col>
          <Row className="mb-4">
            <Col className="text-center">
              <div className={styles.logoContainer}>
                <Image src={logoWhite} alt="logo" width={100} height={100} />

                <h1 className={styles.contractTitle}>
                  Contrato de Reserva para la fecha{" "}
                  {formatLongSpanishDate(
                    new Date(slot?.eventDate || new Date())
                  )}
                </h1>
              </div>
            </Col>
          </Row>

          {/* CLIENT DATA (read-only by default, editable on "Modificar") */}
          <Row className="mb-4 justify-content-center">
            <Col xs={12}>
              <div className={styles.reservationCard}>
                <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                  <div
                    className={styles.reservationTitle}
                    style={{ marginBottom: 0 }}
                  >
                    Datos del cliente
                  </div>

                  {!isEditingClient && !isLocked && (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={handleStartEditClient}
                    >
                      Modificar
                    </button>
                  )}
                </div>

                <Row className="mt-3">
                  <Col xs={12} md={6}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Nombre del cliente
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.formInput}
                        value={clientDraft.leadName}
                        disabled={!isEditingClient || isLocked}
                        onChange={(e) =>
                          setClientDraft((p) => ({
                            ...p,
                            leadName: e.target.value,
                          }))
                        }
                        placeholder="Nombre y apellidos"
                        autoComplete="name"
                      />
                    </div>
                  </Col>

                  <Col xs={12} md={6}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email</label>
                      <input
                        className={styles.formInput}
                        type="email"
                        value={clientDraft.leadEmail ?? ""}
                        disabled={!isEditingClient || isLocked}
                        onChange={(e) =>
                          setClientDraft((p) => ({
                            ...p,
                            leadEmail: e.target.value,
                          }))
                        }
                        placeholder="correo@ejemplo.com"
                        autoComplete="email"
                      />
                    </div>
                  </Col>

                  <Col xs={12} md={6}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Teléfono</label>
                      <input
                        className={styles.formInput}
                        type="tel"
                        value={clientDraft.leadPhone ?? ""}
                        disabled={!isEditingClient || isLocked}
                        onChange={(e) =>
                          setClientDraft((p) => ({
                            ...p,
                            leadPhone: e.target.value,
                          }))
                        }
                        placeholder="10 dígitos"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </div>
                  </Col>
                </Row>

                {isEditingClient && !isLocked && (
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={handleCancelEditClient}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={handleSaveClient}
                    >
                      Guardar
                    </button>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* PACKAGE SELECTION */}
          <Row className="mb-4 justify-content-center">
            <Col xs={12}>
              <div className={styles.reservationCard}>
                <div
                  className={styles.reservationTitle}
                  style={{ marginBottom: 0 }}
                >
                  Productos/Servicios
                </div>

                {/* Pickers row (responsive) */}
                <Row className="mt-3 g-3 align-items-end">
                  <Col xs={12} md={4}>
                    <div
                      className={styles.formGroup}
                      style={{ marginBottom: 0 }}
                    >
                      <label className={styles.formLabel}>Marca</label>
                      <select
                        className={styles.formInput}
                        value={selectedBrandId}
                        disabled={isLocked}
                        onChange={(e) =>
                          setSelectedBrandId(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                      >
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <Col xs={12} md={4}>
                    <div
                      className={styles.formGroup}
                      style={{ marginBottom: 0 }}
                    >
                      <label className={styles.formLabel}>Paquete</label>
                      <select
                        className={styles.formInput}
                        value={selectedPackageId}
                        disabled={isLocked}
                        onChange={(e) =>
                          setSelectedPackageId(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                      >
                        <option value="">Selecciona un paquete</option>
                        {packages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {formatMoney(p.basePrice)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <Col xs={12} sm={6} md={2}>
                    <div
                      className={styles.formGroup}
                      style={{ marginBottom: 0 }}
                    >
                      <label className={styles.formLabel}>Cantidad</label>
                      <input
                        className={styles.formInput}
                        type="number"
                        min={1}
                        value={qtyToAdd}
                        onChange={(e) =>
                          setQtyToAdd(Math.max(1, Number(e.target.value) || 1))
                        }
                        disabled={!selectedPackageId || isLocked}
                      />
                    </div>
                  </Col>

                  <Col xs={12} sm={6} md={2}>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={handleAddSelectedPackage}
                      disabled={!selectedPackageId || isLocked}
                      style={{ width: "100%" }}
                    >
                      Agregar
                    </button>
                  </Col>
                </Row>

                {/* Included items list */}
                <div className="mt-4">
                  <div className={styles.formLabel} style={{ marginBottom: 8 }}>
                    Productos incluidos:
                  </div>

                  {items.length === 0 ? (
                    <div style={{ color: "rgba(255,255,255,0.7)" }}>
                      Aún no has agregado paquetes.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {items.map((it) => (
                        <div
                          key={it.pkg.id}
                          style={{
                            border: "2px solid rgba(255,255,255,0.25)",
                            borderRadius: 14,
                            padding: "14px 14px",
                            background: "rgba(0,0,0,0.25)",
                          }}
                          className="d-flex align-items-center justify-content-between gap-3 flex-wrap"
                        >
                          <div style={{ minWidth: 220 }}>
                            <div style={{ color: "white", fontWeight: 800 }}>
                              {it.pkg.name}
                            </div>
                            <div style={{ color: "#34d399", fontWeight: 800 }}>
                              {formatMoney(it.pkg.basePrice)} c/u
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            {!isLocked ? (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-outline-light rounded-circle"
                                  style={{ width: 40, height: 40 }}
                                  onClick={() => decItem(it.pkg.id)}
                                  aria-label="Disminuir"
                                >
                                  -
                                </button>

                                <div
                                  style={{
                                    minWidth: 34,
                                    textAlign: "center",
                                    color: "white",
                                    fontWeight: 900,
                                    fontSize: 18,
                                  }}
                                >
                                  {it.quantity}
                                </div>

                                <button
                                  type="button"
                                  className="btn btn-outline-light rounded-circle"
                                  style={{ width: 40, height: 40 }}
                                  onClick={() => incItem(it.pkg.id)}
                                  aria-label="Aumentar"
                                >
                                  +
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-danger rounded-circle"
                                  style={{ width: 40, height: 40 }}
                                  onClick={() => removeItem(it.pkg.id)}
                                  aria-label="Eliminar"
                                >
                                  ×
                                </button>
                              </>
                            ) : (
                              <div style={{ color: "white", fontWeight: 900 }}>
                                Cantidad: {it.quantity}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <hr
                  style={{
                    borderColor: "rgba(255,255,255,0.18)",
                    margin: "22px 0",
                  }}
                />

                {/* Financial summary */}
                <Row className="g-3">
                  <Col xs={12} lg={8}>
                    <div
                      style={{
                        border: "2px solid rgba(255,255,255,0.18)",
                        borderRadius: 14,
                        padding: 16,
                        background: "rgba(0,0,0,0.18)",
                      }}
                    >
                      <div
                        style={{
                          color: "white",
                          fontWeight: 900,
                          marginBottom: 12,
                        }}
                      >
                        Resumen Financiero:
                      </div>

                      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                        <div
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 800,
                          }}
                        >
                          Precio base:
                        </div>
                        <div
                          style={{
                            color: "#34d399",
                            fontWeight: 900,
                            fontSize: 28,
                            lineHeight: 1,
                          }}
                        >
                          {formatMoney(total)}
                        </div>
                      </div>

                      {items.length > 0 && (
                        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                          <div
                            style={{
                              color: "rgba(255,255,255,0.9)",
                              fontWeight: 800,
                            }}
                          >
                            Descuento por expo Bodas y Quince:
                          </div>
                          <div
                            style={{
                              color: "#34d399",
                              fontWeight: 900,
                              fontSize: 28,
                              lineHeight: 1,
                            }}
                          >
                            -10%
                          </div>
                        </div>
                      )}

                      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                        <div
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 800,
                          }}
                        >
                          Precio final:
                        </div>
                        <div
                          style={{
                            color: "#34d399",
                            fontWeight: 900,
                            fontSize: 28,
                            lineHeight: 1,
                          }}
                        >
                          {formatMoney(totalWithDiscount)}
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mt-3">
                        <div
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 800,
                          }}
                        >
                          Anticipo:
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <div style={{ color: "white", fontWeight: 900 }}>
                            $
                          </div>
                          <input
                            className={styles.formInput}
                            style={{ width: 140, padding: "0.6rem 0.75rem" }}
                            value={deposit}
                            disabled={isLocked}
                            onChange={(e) => setDeposit(e.target.value)}
                            inputMode="decimal"
                          />
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mt-3">
                        <div
                          style={{
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 800,
                          }}
                        >
                          Restante:
                        </div>
                        <div style={{ color: "white", fontWeight: 900 }}>
                          {formatMoney(
                            Math.max(0, totalWithDiscount - depositNumber)
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Notes */}
                  <Col xs={12} lg={4}>
                    <div
                      className={styles.formGroup}
                      style={{ marginBottom: 0 }}
                    >
                      <label className={styles.formLabel}>
                        Promociones/Aclaraciones (opcional):
                      </label>
                      <textarea
                        className={styles.formTextarea}
                        rows={6}
                        value={notes}
                        disabled={isLocked}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notas adicionales"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {!contract && (
            <Row className="mb-4 justify-content-center">
              <Col xs={12}>
                <div className={styles.pageActions}>
                  <button
                    onClick={() => {
                      console.log("Cancelar click", {
                        date,
                        slotId: router.query.slotId,
                      });
                      router.push({
                        pathname: "/pages/calendar",
                        query: date ? { date } : {},
                      });
                    }}
                    type="button"
                    className={styles.btnCancel}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleGenerateContract}
                  >
                    Generar Contrato
                  </button>
                </div>
              </Col>
            </Row>
          )}
          {contract && (
            <>
              <div className={styles.contractShareTitle}>
                "Contrato generado"
              </div>

              <div className={styles.contractShareQrBox}>
                {contract.token ? (
                  <QRCode value={contractLink} size={320} />
                ) : (
                  <div style={{ color: "#111" }}>
                    No hay link para generar QR
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-center">
                <button
                  onClick={() => {
                    console.log("Cancelar click", {
                      date,
                      slotId: router.query.slotId,
                    });
                    router.push({
                      pathname: "/pages/calendar",
                      query: date ? { date } : {},
                    });
                  }}
                  type="button"
                  className={styles.btnCancel}
                >
                  Volver al calendario
                </button>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  disabled={!contractLink}
                  onClick={async () => {
                    await navigator.clipboard.writeText(contractLink);
                    setHasCopiedLink(true);
                    setTimeout(() => setHasCopiedLink(false), 1500);
                  }}
                >
                  {hasCopiedLink ? "Link copiado" : "Copiar link"}
                </button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

ContractCreationPage.getLayout = (page: ReactElement) => {
  return <NonLayout>{page}</NonLayout>;
};

export default ContractCreationPage;
