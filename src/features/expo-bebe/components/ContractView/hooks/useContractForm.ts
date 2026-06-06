import { useEffect, useMemo, useRef, useState } from "react";
import {
  Contract,
  Extra,
  GenerateContractPayload,
  GetBrandsResponse,
  GetPackagesResponse,
  Note,
  Payment,
  Promotion,
  UserInfo,
} from "../../../../../interfaces";
import type { GetSlotResponse } from "../../../../../interfaces/slots";
import { getBrands } from "../../../../../api/services/brandService";
import { getPackages } from "../../../../../api/services/packageService";
import { getExtras } from "../../../../../api/services/extrasService";
import { getUsers } from "../../../../../api/services/usersService";
import { generateContract } from "../../../../../api/services/contractService";
import { createPayment } from "../../../../../api/services/paymentService";
import { createNote } from "../../../../../api/services/notesService";
import { getPromotionsByBrandId } from "../../../../../api/services/promotionsService";
import {
  getSlots,
  getSlotsByMonthAndYear,
  holdSlot,
} from "../../../../../api/services/slotsService";
import type { ExtraLineItem, PackageLineItem } from "../../../types";
import type { ExpoBebeBrandKey } from "../../../types";
import type { ContractPeriod } from "../../../utils/calendar";
import { formatSkuDate, normalizeSkuText } from "../../../utils/sku";
import {
  LUSSO_BRAND_ID,
  brandBlockedMessage,
  isBrandBlockedForMonth,
} from "../../../utils/brandBlocking";
import {
  isValidEmailFormat,
  isValidPhoneLength,
  sanitizePhoneInput,
} from "../../../utils/contactValidation";
import { getBookedBrandIdsByMonth } from "../../../services/monthBrandUsage";

const pad = (n: number) => String(n).padStart(2, "0");
const DEFAULT_MIN_AMOUNT_HOLD_SLOT = 500;

interface UseContractFormOptions {
  brandKey?: ExpoBebeBrandKey;
  lockedBrandId?: number | null;
  lockedBrandName?: string;
  minAmountHoldSlot?: number | null;
  expoMonthlyRiskEnabled?: boolean;
  initialFecha?: string;
  initialPeriod?: ContractPeriod;
}

export function useContractForm({
  brandKey,
  lockedBrandId,
  lockedBrandName,
  minAmountHoldSlot,
  expoMonthlyRiskEnabled,
  initialFecha,
  initialPeriod,
}: UseContractFormOptions = {}) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const seededPeriodRef = useRef<ContractPeriod | null>(
    initialFecha && initialPeriod ? initialPeriod : null,
  );

  // API data
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [packages, setPackages] = useState<GetPackagesResponse[]>([]);
  const [extrasCatalog, setExtrasCatalog] = useState<Extra[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [slotAvailability, setSlotAvailability] = useState<GetSlotResponse[]>(
    [],
  );
  const [monthHasReservedDate, setMonthHasReservedDate] = useState(false);
  // Brand ids already booked in the selected date's month (Lusso rule).
  const [bookedBrandIds, setBookedBrandIds] = useState<number[]>([]);

  // Form fields
  const [fecha, setFecha] = useState(initialFecha ?? todayStr);
  const [period, setPeriod] = useState<ContractPeriod | null>(
    initialPeriod ?? null,
  );
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | "">("");
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");
  const [items, setItems] = useState<PackageLineItem[]>([]);
  const [selectedExtraId, setSelectedExtraId] = useState<number | "">("");
  const [extraItems, setExtraItems] = useState<ExtraLineItem[]>([]);
  const [anticipo, setAnticipo] = useState("500");
  const [formaPago, setFormaPago] = useState("cash");
  const [notas, setNotas] = useState("");

  // Submission
  const [contract, setContract] = useState<Contract | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const isLocked = !!contract;
  const isBrandSelectionLocked = !!lockedBrandId;
  const requiredMinAmountHoldSlot =
    minAmountHoldSlot ?? DEFAULT_MIN_AMOUNT_HOLD_SLOT;

  // Sync anticipo with minAmountHoldSlot once it resolves from the API
  useEffect(() => {
    setAnticipo(String(requiredMinAmountHoldSlot));
  }, [requiredMinAmountHoldSlot]);

  // Load brands
  useEffect(() => {
    getBrands()
      .then((data) => {
        const arr = Array.isArray(data) ? (data as GetBrandsResponse[]) : [];
        setBrands(arr);
        if (arr.length === 0) return;

        if (lockedBrandId) {
          setSelectedBrandId(lockedBrandId);
          return;
        }

        const matchedBrand = brandKey
          ? arr.find((brand) => brand.key?.toLowerCase() === brandKey)
          : null;

        setSelectedBrandId(matchedBrand?.id ?? arr[0].id);
      })
      .catch(() => setBrands([]));
  }, [brandKey, lockedBrandId]);

  // Load packages when brand changes
  useEffect(() => {
    if (!selectedBrandId) {
      setPackages([]);
      setSelectedPackageId("");
      return;
    }
    setSelectedPackageId("");
    getPackages({ brandId: Number(selectedBrandId) })
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => setPackages([]));
  }, [selectedBrandId]);

  // Load extras catalog when brand changes
  useEffect(() => {
    if (!selectedBrandId) {
      setExtrasCatalog([]);
      setSelectedExtraId("");
      return;
    }
    setSelectedExtraId("");
    getExtras({ brandId: Number(selectedBrandId) })
      .then((data) => setExtrasCatalog(Array.isArray(data) ? data : []))
      .catch(() => setExtrasCatalog([]));
  }, [selectedBrandId]);

  // Load promotions when brand changes
  useEffect(() => {
    if (!selectedBrandId) return;
    getPromotionsByBrandId({ brandId: Number(selectedBrandId) })
      .then((data) => setPromotions(Array.isArray(data) ? data : []))
      .catch(() => setPromotions([]));
  }, [selectedBrandId]);

  // Load slots for selected date
  useEffect(() => {
    if (!fecha) return;
    setPeriod((currentPeriod) => {
      if (seededPeriodRef.current && fecha === initialFecha) {
        const seededPeriod = seededPeriodRef.current;
        seededPeriodRef.current = null;
        return seededPeriod;
      }

      return currentPeriod === null ? currentPeriod : null;
    });

    getSlots(fecha, brandKey)
      .then((data) => setSlotAvailability(Array.isArray(data) ? data : []))
      .catch(() => setSlotAvailability([]));
  }, [brandKey, fecha, initialFecha]);

  useEffect(() => {
    if (!fecha || !selectedBrandId) {
      setMonthHasReservedDate(false);
      return;
    }

    const [yearStr, monthStr] = fecha.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (!year || !month) {
      setMonthHasReservedDate(false);
      return;
    }

    let cancelled = false;

    getSlotsByMonthAndYear(month, year, Number(selectedBrandId))
      .then((data) => {
        if (!cancelled) setMonthHasReservedDate(Boolean(data?.risk));
      })
      .catch(() => {
        if (!cancelled) setMonthHasReservedDate(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fecha, selectedBrandId]);

  // Load users
  useEffect(() => {
    getUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));
  }, []);

  const availabilityByPeriod = useMemo(() => {
    const norm = (p?: string | null) => {
      const s = (p ?? "").toLowerCase().trim();
      if (s === "am_block") return "matutine";
      if (s === "pm_block") return "vespertine";
      return null;
    };
    const out: Record<"matutine" | "vespertine", boolean | null> = {
      matutine: null,
      vespertine: null,
    };
    for (const it of slotAvailability ?? []) {
      const key = norm(it?.period);
      if (!key) continue;
      out[key] = Boolean(it?.available);
    }
    return out;
  }, [slotAvailability]);

  const extrasSubtotal = useMemo(
    () =>
      extraItems.reduce((s, it) => s + it.extra.price * it.quantity, 0),
    [extraItems],
  );
  const extrasDiscountTotal = useMemo(
    () =>
      extraItems.reduce(
        (s, it) =>
          s +
          (it.extra.price * it.quantity * (it.promotion?.value ?? 0)) / 100,
        0,
      ),
    [extraItems],
  );
  const subtotal = useMemo(
    () =>
      items.reduce((s, it) => s + it.pkg.basePrice * it.quantity, 0) +
      extrasSubtotal,
    [items, extrasSubtotal],
  );
  const selectedBrandName = useMemo(
    () =>
      lockedBrandName ||
      brands.find((brand) => brand.id === selectedBrandId)?.name ||
      "",
    [brands, lockedBrandName, selectedBrandId]
  );
  const discountTotal = useMemo(
    () =>
      items.reduce(
        (s, it) =>
          s +
          (it.pkg.basePrice * it.quantity * (it.promotion?.value ?? 0)) / 100,
        0,
      ) + extrasDiscountTotal,
    [items, extrasDiscountTotal],
  );
  const anticipoNum = Math.max(
    0,
    Number((anticipo || "0").replace(/[^\d.]/g, "")) || 0,
  );
  const fmtPrice = (n: number) => n.toLocaleString("es-MX");

  const handleAgregar = () => {
    if (isLocked || !selectedPackageId) return;
    const pkg = packages.find((p) => p.id === Number(selectedPackageId));
    if (!pkg) return;
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.pkg.id === pkg.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      const promo = promotions.find((p) => p.brandId === pkg.brandId) ?? null;
      return [...prev, { pkg, quantity: 1, promotion: promo }];
    });
    setSelectedPackageId("");
  };

  const handleAgregarExtra = () => {
    if (isLocked || !selectedExtraId) return;
    const extra = extrasCatalog.find((e) => e.id === Number(selectedExtraId));
    if (!extra) return;
    setExtraItems((prev) => {
      const idx = prev.findIndex((x) => x.extra.id === extra.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      const promo =
        promotions.find((p) => p.brandId === extra.brandId) ?? null;
      return [...prev, { extra, quantity: 1, promotion: promo }];
    });
    setSelectedExtraId("");
  };

  const incExtraItem = (id: number) =>
    setExtraItems((prev) =>
      prev.map((it) =>
        it.extra.id === id ? { ...it, quantity: it.quantity + 1 } : it,
      ),
    );
  const decExtraItem = (id: number) =>
    setExtraItems((prev) =>
      prev.map((it) =>
        it.extra.id === id
          ? { ...it, quantity: Math.max(1, it.quantity - 1) }
          : it,
      ),
    );
  const removeExtraItem = (id: number) =>
    setExtraItems((prev) => prev.filter((it) => it.extra.id !== id));

  const incItem = (id: number) =>
    setItems((prev) =>
      prev.map((it) =>
        it.pkg.id === id ? { ...it, quantity: it.quantity + 1 } : it,
      ),
    );
  const decItem = (id: number) =>
    setItems((prev) =>
      prev.map((it) =>
        it.pkg.id === id
          ? { ...it, quantity: Math.max(1, it.quantity - 1) }
          : it,
      ),
    );
  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((it) => it.pkg.id !== id));

  const handleSubmit = async () => {
    if (submitting || isLocked) return;
    setErrorMsg(null);
    const normalizedEmail = email.trim();
    const normalizedPhone = sanitizePhoneInput(telefono);

    if (!period) {
      setErrorMsg("Selecciona un slot horario.");
      return;
    }
    if (!selectedUserId) {
      setErrorMsg("Selecciona un vendedor.");
      return;
    }
    if (!nombre.trim()) {
      setErrorMsg("Ingresa el nombre del cliente.");
      return;
    }
    if (!isValidEmailFormat(normalizedEmail)) {
      setErrorMsg("Ingresa un email válido.");
      return;
    }
    if (!isValidPhoneLength(normalizedPhone)) {
      setErrorMsg("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }
    if (anticipoNum < requiredMinAmountHoldSlot) {
      setErrorMsg(
        `El anticipo mínimo es de $${fmtPrice(requiredMinAmountHoldSlot)}.`
      );
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Agrega al menos un paquete.");
      return;
    }

    setSubmitting(true);
    try {
      const held = await holdSlot({ eventDate: fecha, period });
      const sku = `${normalizeSkuText(items[0]?.pkg?.name).toLowerCase()}${formatSkuDate(held?.eventDate)}${normalizeSkuText(nombre)}`;

      const payload: GenerateContractPayload = {
        userId: Number(selectedUserId),
        slotId: held.id,
        brandId: Number(selectedBrandId),
        sku,
        clientName: nombre.trim(),
        clientPhone: normalizedPhone || null,
        clientEmail: normalizedEmail || null,
        subtotal,
        discountTotal,
        total: subtotal - discountTotal,
        packages: items.map((it) => ({
          packageId: it.pkg.id,
          quantity: it.quantity,
          promotionId: it.promotion?.id,
          basePriceSnapshot:
            it.pkg.basePrice * it.quantity -
            (it.pkg.basePrice * it.quantity * (it.promotion?.value ?? 0)) / 100,
        })),
        extras: extraItems.map((it) => ({
          extraId: it.extra.id,
          quantity: it.quantity,
          promotionId: it.promotion?.id,
          basePriceSnapshot:
            it.extra.price * it.quantity -
            (it.extra.price * it.quantity * (it.promotion?.value ?? 0)) / 100,
        })),
      };

      const newContract = await generateContract(payload);

      if (newContract) {
        const promises: Promise<Payment | Note>[] = [
          createPayment({
            contractId: newContract.id,
            amount: anticipoNum,
            method: formaPago,
            note: "Depósito inicial",
            receivedAt: new Date().toISOString(),
          }),
        ];
        if (notas.trim()) {
          promises.push(
            createNote({
              targetId: newContract.id,
              content: notas.trim(),
              scope: "contract",
              kind: "public",
            }),
          );
        }
        await Promise.all(promises);
        setContract(newContract);
      }
    } catch (e) {
      console.error("Error creating contract:", e);
      setErrorMsg("Ocurrió un error al generar el contrato. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setContract(null);
    setFecha(todayStr);
    setPeriod(null);
    setSelectedUserId("");
    setNombre("");
    setEmail("");
    setTelefono("");
    setSelectedPackageId("");
    setItems([]);
    setSelectedExtraId("");
    setExtraItems([]);
    setAnticipo(String(requiredMinAmountHoldSlot));
    setFormaPago("cash");
    setNotas("");
    setErrorMsg(null);
    setHasCopiedLink(false);
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const contractLink = contract?.token
    ? `${origin}/pages/reserva/${contract.token}`
    : "";

  return {
    // data
    brands,
    packages,
    extrasCatalog,
    users,
    // form state
    fecha,
    setFecha,
    period,
    setPeriod,
    selectedUserId,
    setSelectedUserId,
    nombre,
    setNombre,
    email,
    setEmail,
    telefono,
    setTelefono,
    selectedBrandId,
    setSelectedBrandId,
    selectedBrandName,
    isBrandSelectionLocked,
    selectedPackageId,
    setSelectedPackageId,
    items,
    selectedExtraId,
    setSelectedExtraId,
    extraItems,
    anticipo,
    setAnticipo,
    formaPago,
    setFormaPago,
    notas,
    setNotas,
    // submission
    contract,
    submitting,
    errorMsg,
    hasCopiedLink,
    setHasCopiedLink,
    // derived
    isLocked,
    expoMonthlyRiskEnabled,
    monthHasReservedDate,
    requiredMinAmountHoldSlot,
    availabilityByPeriod,
    subtotal,
    discountTotal,
    extrasSubtotal,
    anticipoNum,
    fmtPrice,
    contractLink,
    // handlers
    handleAgregar,
    incItem,
    decItem,
    removeItem,
    handleAgregarExtra,
    incExtraItem,
    decExtraItem,
    removeExtraItem,
    handleSubmit,
    resetForm,
  };
}

export type ContractFormVM = ReturnType<typeof useContractForm>;
