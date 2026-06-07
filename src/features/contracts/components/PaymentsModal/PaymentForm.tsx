import React from "react";
import { Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import type { CreatePaymentPayload, PaymentMethod } from "../../../../interfaces";
import { PAYMENT_METHOD_OPTIONS, type PaymentFormValues } from "./types";

const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("El monto debe ser un número")
    .positive("El monto debe ser mayor a 0")
    .required("El monto es requerido"),
  method: yup
    .string<PaymentMethod>()
    .oneOf(["cash", "transfer", "card"])
    .required("El método es requerido"),
  receivedAt: yup.string().required("La fecha es requerida"),
  note: yup.string(),
  reference: yup.string().when("method", {
    is: "transfer",
    then: (schema) => schema.required("La referencia es requerida"),
    otherwise: (schema) => schema.optional(),
  }),
});

function nowForDatetimeLocal(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
}

interface PaymentFormProps {
  contractId: number;
  onSubmit: (payload: CreatePaymentPayload) => Promise<boolean>;
}

export function PaymentForm({ contractId, onSubmit }: PaymentFormProps) {
  const formik = useFormik<PaymentFormValues>({
    initialValues: {
      amount: "",
      method: "cash",
      receivedAt: nowForDatetimeLocal(),
      note: "",
      reference: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload: CreatePaymentPayload = {
        contractId,
        amount: Number(values.amount),
        method: values.method,
        receivedAt: new Date(values.receivedAt).toISOString(),
      };

      if (values.method === "transfer" || values.method === "card") {
        const reference = values.reference.trim();
        if (reference) {
          payload.reference = reference;
        }
      }

      const note = values.note.trim();
      if (note) {
        payload.note = note;
      }

      const success = await onSubmit(payload);
      if (success) {
        resetForm({
          values: {
            amount: "",
            method: "cash",
            receivedAt: nowForDatetimeLocal(),
            note: "",
            reference: "",
          },
        });
      }
    },
  });

  const isTransfer = formik.values.method === "transfer";
  const showsReference =
    formik.values.method === "transfer" || formik.values.method === "card";

  return (
    <Form onSubmit={formik.handleSubmit}>
      <div className="row g-3">
        <Form.Group className="col-sm-6">
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            name="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.amount && !!formik.errors.amount}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.amount}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="col-sm-6">
          <Form.Label>Método</Form.Label>
          <Form.Select
            name="method"
            value={formik.values.method}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.method && !!formik.errors.method}
          >
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formik.errors.method}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="col-sm-6">
          <Form.Label>Fecha de pago</Form.Label>
          <Form.Control
            type="datetime-local"
            name="receivedAt"
            value={formik.values.receivedAt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.receivedAt && !!formik.errors.receivedAt}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.receivedAt}
          </Form.Control.Feedback>
        </Form.Group>

        {showsReference && (
          <Form.Group className="col-sm-6">
            <Form.Label>
              Referencia{!isTransfer && " (opcional)"}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="bank-tx-123"
              name="reference"
              value={formik.values.reference}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.reference && !!formik.errors.reference}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.reference}
            </Form.Control.Feedback>
          </Form.Group>
        )}

        <Form.Group className="col-12">
          <Form.Label>Nota (opcional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Nota del pago"
            name="note"
            value={formik.values.note}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Group>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <Button
          type="submit"
          variant="primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Guardando..." : "Registrar pago"}
        </Button>
      </div>
    </Form>
  );
}
