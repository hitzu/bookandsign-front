import { useCallback, useState } from "react";
import type { CreatePaymentPayload, Payment } from "../../../../interfaces";
import {
  createPayment,
  getPayments,
} from "../../../../api/services/paymentService";

type ToastVariant = "success" | "danger";

interface ToastState {
  show: boolean;
  message: string;
  variant: ToastVariant;
}

const initialToast: ToastState = {
  show: false,
  message: "",
  variant: "success",
};

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(initialToast);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    setToast({ show: true, message, variant });
  }, []);

  const fetchPayments = useCallback(
    async (contractId: number) => {
      setLoading(true);
      try {
        const response = await getPayments(contractId);
        setPayments(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPayments([]);
        showToast("Error al cargar los pagos", "danger");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const addPayment = useCallback(
    async (payload: CreatePaymentPayload): Promise<boolean> => {
      try {
        await createPayment(payload);
        await fetchPayments(payload.contractId);
        showToast("Pago registrado exitosamente", "success");
        return true;
      } catch (error) {
        console.error("Error creating payment:", error);
        showToast("Error al registrar el pago", "danger");
        return false;
      }
    },
    [fetchPayments, showToast]
  );

  return {
    payments,
    loading,
    toast,
    hideToast,
    fetchPayments,
    addPayment,
  };
}
