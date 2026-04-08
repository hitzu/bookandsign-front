export type ModalState =
  | "gallery-photo"
  | "share-confirm"
  | "post-download"
  | "personalize-editor"
  | "personalize-exit-confirm"
  | "personalize-final"
  | "dedicate-step-1"
  | "dedicate-step-2"
  | "dedicate-step-3"
  | "dedicate-confirm"
  | "dedicate-uploading"
  | "dedicate-error"
  | "dedicate-success";

export type ModalEvent =
  | { type: "OPEN_PHOTO"; photoId: string }
  | { type: "OPEN_SHARE_CONFIRM" }
  | { type: "CLOSE_SHARE_CONFIRM" }
  | { type: "SHARE_SUCCESS" }
  | { type: "DOWNLOAD_ORIGINAL_CLICKED" }
  | { type: "DOWNLOAD_ORIGINAL_SUCCESS" }
  | { type: "OPEN_PERSONALIZE" }
  | { type: "PERSONALIZE_DIRTY_CHANGED"; hasUnsavedChanges: boolean }
  | { type: "PERSONALIZE_BACK" }
  | { type: "PERSONALIZE_CANCEL_EXIT" }
  | { type: "PERSONALIZE_CONFIRM_EXIT" }
  | { type: "DOWNLOAD_PERSONALIZED_CLICKED" }
  | { type: "DOWNLOAD_PERSONALIZED_SUCCESS" }
  | { type: "OPEN_DEDICATE" }
  | { type: "DEDICATE_NEXT" }
  | { type: "DEDICATE_BACK" }
  | { type: "DEDICATE_OPEN_CONFIRM" }
  | { type: "DEDICATE_CANCEL_CONFIRM" }
  | { type: "DEDICATE_CONFIRM_SUBMIT" }
  | { type: "DEDICATE_UPLOAD_SUCCESS" }
  | { type: "DEDICATE_UPLOAD_ERROR" }
  | { type: "DEDICATE_RETRY" }
  | { type: "DEDICATE_BACK_TO_EDIT" }
  | { type: "RETURN_TO_GALLERY" };
