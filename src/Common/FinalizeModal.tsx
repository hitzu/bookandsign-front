import React from "react";
import { Button, Modal } from "react-bootstrap";

interface FinalizeModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const FinalizeModal = ({
  show,
  handleClose,
  handleConfirm,
}: FinalizeModalProps) => {
  return (
    <React.Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        id="finalizeContractModal"
        className="fade zoomIn"
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header closeButton style={{ borderBottom: "none" }} />
        <Modal.Body>
          <div className="mt-2 text-center">
            <i className="ti ti-check fs-1 text-success"></i>
            <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h5>¿El evento se realizó?</h5>
              <p className="text-muted mx-4 mb-0">
                ¿Confirmas que el evento de este contrato ya se realizó? Esta
                acción marcará el contrato como finalizado.
              </p>
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
            <Button
              type="button"
              variant="light"
              className="btn w-sm"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="success"
              className="btn w-sm"
              onClick={handleConfirm}
            >
              Sí, finalizar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default FinalizeModal;
