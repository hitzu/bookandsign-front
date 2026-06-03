import { useEffect, useMemo, useState } from "react";
import {
  Contract,
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
import { getUsers } from "../../../../../api/services/usersService";
import { generateContract } from "../../../../../api/services/contractService";
import { createPayment } from "../../../../../api/services/paymentService";
import { createNote } from "../../../../../api/services/notesService";
import { getPromotionsByBrandId } from "../../../../../api/services/promotionsService";
import { getSlots, holdSlot } from "../../../../../api/services/slotsService";
import type { PackageLineItem } from "../../../types";
import { formatSkuDate, normalizeSkuText } from "../../../utils/sku";
import {
  LUSSO_BRAND_ID,
  brandBlockedMessage,
  isBrandBlockedForMonth,
} from "../../../utils/brandBlocking";
import { getBookedBrandIdsByMonth } from "../../../services/monthBrandUsage";

const pad = (n: number) => String(n).padStart(2, "0");

export function useContractForm() {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // API data
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [packages, setPackages] = useState<GetPackagesResponse[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [slotAvailability, setSlotAvailability] = useState<GetSlotResponse[]>(
    [],
  );
  // Brand ids already booked in the selected date's month (Lusso rule).
  const [bookedBrandIds, setBookedBrandIds] = useState<number[]>([]);

  // Form fields
  const [fecha, setFecha] = useState(todayStr);
  const [period, setPeriod] = useState<"am_block" | "pm_block" | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | "">("");
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");
  const [items, setItems] = useState<PackageLineItem[]>([]);
  const [anticipo, setAnticipo] = useState("500");
  const [formaPago, setFormaPago] = useState("cash");
  const [notas, setNotas] = useState("");

  // Submission
  const [contract, setContract] = useState<Contract | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const isLocked = !!contract;

  // Load brands
  useEffect(() => {
    getBrands()
      .then((data) => {
        const arr = Array.isArray(data) ? (data as GetBrandsResponse[]) : [];
        setBrands(arr);
        if (arr.length > 0) setSelectedBrandId(arr[0].id);
      })
      .catch(() => setBrands([]));
  }, []);

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
    setPeriod(null);
    getSlots(fecha)
      .then((data) => setSlotAvailability(Array.isArray(data) ? data : []))
      .catch(() => setSlotAvailability([]));
  }, [fecha]);

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

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.pkg.basePrice * it.quantity, 0),
    [items],
  );
  const discountTotal = useMemo(
    () =>
      items.reduce(
        (s, it) =>
          s +
          (it.pkg.basePrice * it.quantity * (it.promotion?.value ?? 0)) / 100,
        0,
      ),
    [items],
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
    if (anticipoNum < 500) {
      setErrorMsg("El anticipo mínimo es de $500.");
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
        sku,
        clientName: nombre.trim(),
        clientPhone: telefono || null,
        clientEmail: email || null,
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
    setAnticipo("500");
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
    selectedPackageId,
    setSelectedPackageId,
    items,
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
    availabilityByPeriod,
    subtotal,
    discountTotal,
    anticipoNum,
    fmtPrice,
    contractLink,
    // handlers
    handleAgregar,
    incItem,
    decItem,
    removeItem,
    handleSubmit,
    resetForm,
  };
}

export type ContractFormVM = ReturnType<typeof useContractForm>;
