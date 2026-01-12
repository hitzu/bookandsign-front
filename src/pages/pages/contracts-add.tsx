import React, { ReactElement, useEffect, useMemo, useState } from "react";
import NonLayout from "@layout/NonLayout";
import styles from "../../assets/css/contract-creation.module.css";
import logoWhite from "@assets/images/logo-white.png";
import Image from "next/image";
import { Row, Col, Form, Toast } from "react-bootstrap";
import { getBrands } from "../../api/services/brandService";
import { getPackages } from "../../api/services/packageService";
import {
  Contract,
  GenerateContractPayload,
  Slot,
  Promotion,
  UserInfo,
  GetPackagesResponse,
  GetBrandsResponse,
  Payment,
  Note,
} from "../../interfaces";
import { bookSlot, getSlots, holdSlot } from "../../api/services/slotsService";
import { generateContract } from "../../api/services/contractService";
import { createNote } from "../../api/services/notesService";
import QRCode from "react-qr-code";
import { createPayment } from "../../api/services/paymentService";

import type { GetSlotResponse } from "../../interfaces/slots";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import dynamic from "next/dynamic";
import { getUsers } from "../../api/services/usersService";
import { getPromotionsByBrandId } from "../../api/services/promotionsService";

const Flatpickr = dynamic(
  () => import("react-flatpickr").then((mod: any) => mod.default as any),
  { ssr: false }
) as any;

type ClientDraft = {
  leadName: string;
  leadEmail: string | null;
  leadPhone: string | null;
};

type PackageLineItem = {
  pkg: GetPackagesResponse;
  quantity: number;
  promotion: Promotion | null;
};

type CurrencyCode = "MXN" | "USD";

const SKU_MONTHS_ES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

const normalizeSkuText = (value?: string | null) => {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents/diacritics
    .replace(/\s+/g, "") // remove spaces
    .replace(/[^0-9a-zA-Z]/g, ""); // keep only alphanumerics
};

// Converts "2026-01-16" -> "16Jan26"
const formatSkuDate = (isoDate?: string | null) => {
  if (!isoDate) return "";
  const [yyyy, mm, dd] = isoDate.split("-");
  const monthIdx = Number(mm) - 1;
  const month = SKU_MONTHS_ES[monthIdx] ?? "";
  const year2 = (yyyy ?? "").slice(-2);
  if (!dd || !month || !year2) return "";
  return `${dd}${month}${year2}`;
};

const ContractsAddPage = () => {
  const [slot, setSlot] = useState<Slot | null>(null);
  const [date, setDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "am_block" | "pm_block" | null
  >(null);
  const [slotAvailability, setSlotAvailability] = useState<GetSlotResponse[]>(
    []
  );
  const [contract, setContract] = useState<Contract | null>(null);
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | "">("");

  const [packages, setPackages] = useState<GetPackagesResponse[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");

  const [qtyToAdd, setQtyToAdd] = useState<number>(1);
  const [items, setItems] = useState<PackageLineItem[]>([]);

  const [deposit, setDeposit] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [notes, setNotes] = useState<string>("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const [clientDraft, setClientDraft] = useState<ClientDraft>({
    leadName: "",
    leadEmail: null,
    leadPhone: null,
  });

  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");

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
    const loadPromotions = async () => {
      try {
        const data = await getPromotionsByBrandId({
          brandId: Number(selectedBrandId),
        });
        setPromotions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading promotions:", e);
        setPromotions([]);
      }
    };
    loadPromotions();
  }, []);

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        if (!date) return;
        const data = await getSlots(date);
        setSlotAvailability(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error fetching slot:", e);
        setSlotAvailability([]);
      }
    };
    fetchSlot();
  }, [date]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading users:", e);
        setUsers([]);
      }
    };
    loadUsers();
  }, []);

  const availabilityByPeriod = useMemo(() => {
    const normalizePeriod = (p?: string | null) => {
      const s = (p ?? "").toLowerCase().trim();
      // Backend periods: "am_block" | "pm_block"
      if (s === "am_block") return "matutine";
      if (s === "pm_block") return "vespertine";
      return null;
    };

    const out: Record<"matutine" | "vespertine", boolean | null> = {
      matutine: null,
      vespertine: null,
    };

    for (const it of slotAvailability ?? []) {
      const key = normalizePeriod(it?.period);
      if (!key) continue;
      out[key] = Boolean(it?.available);
    }

    return out;
  }, [slotAvailability]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(n);

  const formatCurrencyParts = (
    amount: number,
    currency: CurrencyCode = "MXN"
  ) => {
    const roundedCents = Math.round(
      (Number.isFinite(amount) ? amount : 0) * 100
    );
    const hasCents = Math.abs(roundedCents % 100) !== 0;
    const nf = new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-MX", {
      style: "currency",
      currency,
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: hasCents ? 2 : 0,
    });

    const parts = nf.formatToParts(amount);
    const symbol = parts.find((p) => p.type === "currency")?.value ?? "";
    const number = parts
      .filter((p) => p.type !== "currency" && p.type !== "literal")
      .map((p) => p.value)
      .join("");
    const rest = parts
      .filter((p) => p.type !== "currency")
      .map((p) => p.value)
      .join("")
      .trim();

    // `rest` is locale-aware (includes separators). `number` is the digit-y part.
    return { symbol, number: number || rest, formatted: rest };
  };

  const depositNumber = Math.max(
    0,
    Number((deposit || "0").replace(/[^\d.]/g, "")) || 0
  );

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.pkg.basePrice * it.quantity, 0);
  }, [items]);

  const discountTotal = useMemo(() => {
    return items.reduce(
      (sum, it) =>
        sum +
        (it.pkg.basePrice * it.quantity * (it.promotion?.value ?? 0)) / 100,
      0
    );
  }, [items]);

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
      const promotionForThisPackage = promotions.find(
        (p) => p.brandId === pkg.brandId
      );
      return [
        ...prev,
        { pkg, quantity: addQty, promotion: promotionForThisPackage ?? null },
      ];
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

  const createContract = async () => {
    try {
      if (!selectedPeriod) {
        setToastMessage("No se ha seleccionado el periodo");
        setToastVariant("danger");
        setShowToast(true);
        return;
      }
      if (!selectedUserId) {
        setToastMessage("No se ha seleccionado el vendedor");
        setToastVariant("danger");
        setShowToast(true);
        return;
      }
      if (!clientDraft.leadName?.trim()) {
        setToastMessage("No se ha seleccionado el nombre del cliente");
        setToastVariant("danger");
        setShowToast(true);
        return;
      }

      if (depositNumber < 500) {
        setToastMessage("El anticipo mínimo es de 500 pesos");
        setToastVariant("danger");
        setShowToast(true);
        return;
      }

      const held = await holdSlot({
        eventDate: date,
        period: selectedPeriod,
      });
      setSlot(held);

      const sku = `${normalizeSkuText(
        items?.[0]?.pkg?.name
      ).toLowerCase()}${formatSkuDate(held?.eventDate)}${normalizeSkuText(
        clientDraft.leadName
      )}`;

      const payload: GenerateContractPayload = {
        userId: Number(selectedUserId),
        slotId: held.id,
        sku,
        clientName: clientDraft.leadName.trim(),
        clientPhone: clientDraft.leadPhone,
        clientEmail: clientDraft.leadEmail,
        subtotal: subtotal,
        discountTotal: discountTotal,
        total: subtotal - discountTotal,
        packages: items.map((item) => ({
          packageId: item.pkg.id,
          quantity: item.quantity,
          promotionId: item.promotion?.id,
          basePriceSnapshot:
            item.pkg.basePrice * item.quantity -
            (item.pkg.basePrice *
              item.quantity *
              (item.promotion?.value ?? 0)) /
              100,
        })),
      };

      const contract = await generateContract(payload);

      if (contract) {
        const promises: Promise<Payment | Note>[] = [
          createPayment({
            contractId: contract.id,
            amount: depositNumber,
            method: paymentMethod,
            note: "Depósito inicial",
            receivedAt: new Date().toISOString(),
          }),
        ];

        if (notes) {
          promises.push(
            createNote({
              targetId: contract.id,
              content: notes,
              scope: "contract",
              kind: "public",
            })
          );
        }
        await Promise.all(promises);
      }
      setContract(contract);

      await bookSlot({ slotId: held.id, contractId: contract.id });
    } catch (error) {
      console.error("Error generating contract:", error);
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const contractLink = contract?.token
    ? `${origin}/pages/c/${contract.token}`
    : "";

  function clearFormData(): void {
    setContract(null);
    setSlot(null);
    setItems([]);
    setDeposit("0");
    setPaymentMethod("cash");
    setNotes("");
    setClientDraft({ leadName: "", leadEmail: null, leadPhone: null });
    setSelectedPackageId("");
    setQtyToAdd(1);
    setSelectedPeriod(null);
    setDate(new Date().toISOString().slice(0, 10));
    setSelectedUserId("");
  }

  return (
    <div className={styles.contractCreationContainer}>
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Éxito" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </div>

      <Row className="justify-content-center">
        <Col>
          <Row className="mb-4">
            <Col className="text-center">
              <div className={styles.logoContainer}>
                <Image src={logoWhite} alt="logo" width={100} height={100} />
              </div>
            </Col>
          </Row>

          {/* Fecha de la reserva */}
          <Row className="mb-4 justify-content-center">
            <Col xs={12}>
              <div className={styles.reservationCard}>
                <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                  <div
                    className={styles.reservationTitle}
                    style={{ marginBottom: 0 }}
                  >
                    Fecha de la reserva
                  </div>
                </div>

                <Row className="mt-3">
                  <Col xs={4}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Selecciona la fecha
                        <span className={styles.required}>*</span>
                      </label>
                      <Flatpickr
                        value={date}
                        options={{
                          locale: Spanish,
                          dateFormat: "Y-m-d", // <- what the API expects
                          altInput: true,
                          altFormat: "d/m/Y",
                          disableMobile: true,
                          minDate: "today",
                          // avoid clipping/z-index issues inside cards/containers
                          appendTo:
                            typeof window !== "undefined"
                              ? document.body
                              : undefined,
                        }}
                        onChange={(_: any, dateStr: string) => {
                          // `dateStr` is in `dateFormat` -> "YYYY-MM-DD"
                          setDate(dateStr);
                          setSelectedPeriod(null);
                        }}
                        render={(props: any, ref: any) => (
                          <input
                            {...props}
                            ref={ref}
                            className={styles.formInput}
                            disabled={isLocked}
                            placeholder="Selecciona la fecha"
                          />
                        )}
                      />
                    </div>
                  </Col>

                  <Col xs={4}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Slots</label>
                      <div className="d-flex flex-wrap gap-3">
                        <Form.Check
                          type="radio"
                          id="slot-matutine"
                          name="slot-period"
                          label={
                            availabilityByPeriod.matutine === false
                              ? "Matutino (no disponible)"
                              : "Matutino (Antes de las 4:00 PM)"
                          }
                          value="am_block"
                          checked={selectedPeriod === "am_block"}
                          disabled={
                            isLocked || availabilityByPeriod.matutine === false
                          }
                          onChange={() => setSelectedPeriod("am_block")}
                        />
                        <Form.Check
                          type="radio"
                          id="slot-vespertine"
                          name="slot-period"
                          label={
                            availabilityByPeriod.vespertine === false
                              ? "Vespertino (no disponible)"
                              : "Vespertino (Despues de las 4:00 PM)"
                          }
                          value="pm_block"
                          checked={selectedPeriod === "pm_block"}
                          disabled={
                            isLocked ||
                            availabilityByPeriod.vespertine === false
                          }
                          onChange={() => setSelectedPeriod("pm_block")}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col xs={4}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Vendedor generador del contrato
                        <span className={styles.required}>*</span>
                      </label>
                      <select
                        className={styles.formInput}
                        value={selectedUserId}
                        disabled={isLocked}
                        onChange={(e) =>
                          setSelectedUserId(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                      >
                        <option value="">Selecciona un vendedor</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name ??
                              [user.firstName, user.lastName]
                                .filter(Boolean)
                                .join(" ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* CLIENT DATA */}
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
                </div>

                <Row className="mt-3">
                  <Col xs={4}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Nombre del cliente
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        className={styles.formInput}
                        value={clientDraft.leadName}
                        disabled={isLocked}
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

                  <Col xs={4}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email</label>
                      <input
                        className={styles.formInput}
                        type="email"
                        value={clientDraft.leadEmail ?? ""}
                        disabled={isLocked}
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

                  <Col xs={4}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Teléfono</label>
                      <input
                        className={styles.formInput}
                        type="tel"
                        value={clientDraft.leadPhone ?? ""}
                        disabled={isLocked}
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

                  <Col xs={12} sm={6} md={4}>
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
                  <Col xs={12}>
                    <div className={styles.financialCard}>
                      <div className={styles.financialSection}>
                        <div className={styles.financialRow}>
                          <div className={styles.financialLabel}>Subtotal</div>
                          <div className={styles.financialValueMuted}>
                            <span className={styles.moneySymbol}>
                              {formatCurrencyParts(subtotal, "MXN").symbol}
                            </span>
                            <span className={styles.moneyNumber}>
                              {formatCurrencyParts(subtotal, "MXN").number}
                            </span>
                          </div>
                        </div>

                        {promotions.length > 0 &&
                          items.length > 0 &&
                          items.map((it) => (
                            <div className={styles.financialRow}>
                              <div className={styles.financialLabel}>
                                {
                                  promotions.find(
                                    (p) => p.brandId === it.pkg.brandId
                                  )?.name
                                }
                              </div>
                              <div className={styles.discountWrap}>
                                <span className={styles.discountSubtext}>
                                  -
                                  {
                                    formatCurrencyParts(discountTotal, "MXN")
                                      .symbol
                                  }{" "}
                                  {
                                    formatCurrencyParts(
                                      (it.pkg.basePrice *
                                        it.quantity *
                                        (it.promotion?.value ?? 0)) /
                                        100,
                                      "MXN"
                                    ).number
                                  }
                                </span>
                              </div>
                            </div>
                          ))}

                        <div className={styles.financialRow}>
                          <div className={styles.financialLabel}>
                            Precio final
                          </div>
                          <div className={styles.financialValueFinal}>
                            <span className={styles.moneySymbol}>
                              {
                                formatCurrencyParts(
                                  subtotal - discountTotal,
                                  "MXN"
                                ).symbol
                              }
                            </span>
                            <span className={styles.moneyNumberBig}>
                              {
                                formatCurrencyParts(
                                  subtotal - discountTotal,
                                  "MXN"
                                ).number
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.financialDivider} />

                      <div className={styles.financialSection}>
                        <div className={styles.financialRow}>
                          <label
                            className={styles.financialLabel}
                            htmlFor="deposit-amount"
                          >
                            Anticipo Mín.{" "}
                            {formatCurrencyParts(500, "MXN").symbol}
                            {formatCurrencyParts(500, "MXN").number}
                          </label>

                          <div className={styles.depositField}>
                            <span
                              className={styles.depositPrefix}
                              aria-hidden="true"
                            >
                              {formatCurrencyParts(0, "MXN").symbol}
                            </span>
                            <input
                              id="deposit-amount"
                              className={`${styles.depositInput} ${
                                false ? styles.depositInputError : ""
                              }`}
                              value={deposit}
                              disabled={isLocked}
                              onChange={(e) => setDeposit(e.target.value)}
                              inputMode="decimal"
                              placeholder="0.00"
                              aria-invalid={false}
                              aria-describedby="deposit-help deposit-error"
                            />
                          </div>
                        </div>

                        <div className={styles.financialRow}>
                          <label
                            className={styles.financialLabel}
                            htmlFor="deposit-amount"
                          >
                            Forma de pago
                          </label>

                          <div className={styles.depositField}>
                            <select
                              className={styles.formInput}
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                              <option value="cash">Efectivo</option>
                              <option value="card">Tarjeta</option>
                              <option value="transfer">Transferencia</option>
                            </select>
                          </div>
                        </div>

                        {false && (
                          <div
                            id="deposit-error"
                            className={styles.depositError}
                            role="alert"
                          >
                            {false}
                          </div>
                        )}

                        <div className={styles.financialRow}>
                          <div className={styles.financialLabel}>Restante</div>
                          <div className={styles.remainingDue}>
                            <span className={styles.moneyNumberRemaining}>
                              {
                                formatCurrencyParts(
                                  subtotal - discountTotal - depositNumber,
                                  "MXN"
                                ).symbol
                              }
                            </span>
                            <span className={styles.moneyNumberRemaining}>
                              {
                                formatCurrencyParts(
                                  subtotal - discountTotal - depositNumber,
                                  "MXN"
                                ).number
                              }
                            </span>
                            + traslado
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* Notes */}
          <Row className="mb-4 justify-content-center">
            <Col xs={12}>
              <div className={styles.reservationCard}>
                <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                  <div
                    className={styles.reservationTitle}
                    style={{ marginBottom: 0 }}
                  >
                    Promociones/Aclaraciones (opcional):
                  </div>
                </div>

                <Row className="mt-3">
                  <Col xs={12}>
                    <div className={styles.financialCard}>
                      <label className={styles.formLabel}></label>
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
                    type="button"
                    className={styles.btnCancel}
                    onClick={clearFormData}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={createContract}
                    disabled={!items.length}
                  >
                    Cerrar Contrato
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
                  onClick={clearFormData}
                  type="button"
                  className={styles.btnCancel}
                >
                  Volver
                </button>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  disabled={!contractLink}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(contractLink);
                      setHasCopiedLink(true);
                      setTimeout(() => setHasCopiedLink(false), 1500);
                    } catch (error) {
                      console.error("Error copying link:", error);
                    }
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

ContractsAddPage.getLayout = (page: ReactElement) => {
  return <NonLayout>{page}</NonLayout>;
};

export default ContractsAddPage;
