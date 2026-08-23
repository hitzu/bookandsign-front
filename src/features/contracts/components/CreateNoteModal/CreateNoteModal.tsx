import React, { useState } from "react";
import { Button, Form, Modal, Toast } from "react-bootstrap";
import { createNote } from "../../../../api/services/notesService";

interface CreateNoteModalProps {
  show: boolean;
  contractId: number;
  handleClose: () => void;
}

const toastStyles = {
  position: "fixed" as const,
  top: "20px",
  right: "20px",
  zIndex: 9999,
};

export function CreateNoteModal({
  show,
  contractId,
  handleClose,
}: CreateNoteModalProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" as "success" | "danger" });

  const hideToast = () => setToast((prev) => ({ ...prev, show: false }));

  const resetAndClose = () => {
    setContent("");
    handleClose();
  };

  const handleSubmit = async () => {
    if (!content.trim() || !contractId) {
      return;
    }
    setSubmitting(true);
    try {
      await createNote({
        scope: "contract",
        targetId: contractId,
        kind: "public",
        content: content.trim(),
      });
      setToast({ show: true, message: "Nota creada exitosamente", variant: "success" });
      resetAndClose();
    } catch (error) {
      console.error("Error creating note:", error);
      setToast({ show: true, message: "Error al crear la nota", variant: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div style={toastStyles}>
        <Toast onClose={hideToast} show={toast.show} delay={4000} autohide bg={toast.variant}>
          <Toast.Header>
            <strong className="me-auto">
              {toast.variant === "success" ? "Éxito" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </div>

      <Modal
        show={show}
        onHide={resetAndClose}
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Crear nota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="noteContent">
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe la nota del evento..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="light" onClick={resetAndClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
          >
            {submitting ? "Guardando..." : "Guardar nota"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
