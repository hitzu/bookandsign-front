import React from "react";
import { Spinner, Table } from "react-bootstrap";
import type { Payment, PaymentMethod } from "../../../../interfaces";
import { PAYMENT_METHOD_LABELS } from "./types";

interface PaymentsListProps {
  payments: Payment[];
  loading: boolean;
}

const METHOD_BADGE_COLOR: Record<PaymentMethod, string> = {
  cash: "success",
  transfer: "info",
  card: "primary",
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export function PaymentsList({ payments, loading }: PaymentsListProps) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" size="sm" /> Cargando pagos...
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <p className="text-muted text-center py-4 mb-0">
        No hay pagos registrados todavía.
      </p>
    );
  }

  return (
    <Table responsive hover size="sm" className="mb-0">
      <thead className="table-light">
        <tr>
          <th>Fecha</th>
          <th>Método</th>
          <th className="text-end">Monto</th>
          <th>Referencia / Nota</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr key={payment.id}>
            <td>{formatDate(payment.receivedAt)}</td>
            <td>
              <span
                className={`badge bg-light-${
                  METHOD_BADGE_COLOR[payment.method] ?? "secondary"
                } rounded-pill`}
              >
                {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
              </span>
            </td>
            <td className="text-end">{formatAmount(payment.amount)}</td>
            <td className="text-muted">
              {payment.reference || payment.note || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
