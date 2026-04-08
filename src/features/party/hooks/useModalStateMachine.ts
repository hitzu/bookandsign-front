import { useCallback, useReducer } from "react";
import { ModalState, ModalEvent } from "../types/modal";

interface ModalContext {
  isDirty: boolean;
}

interface ModalStateWithContext {
  state: ModalState;
  context: ModalContext;
}

const initialState: ModalStateWithContext = {
  state: "gallery-photo",
  context: { isDirty: false },
};

function modalReducer(
  current: ModalStateWithContext,
  event: ModalEvent,
): ModalStateWithContext {
  const { state, context } = current;

  // Global resets — work from ANY state
  if (event.type === "OPEN_PHOTO") {
    return { state: "gallery-photo", context: { isDirty: false } };
  }
  if (event.type === "OPEN_DEDICATE") {
    return { state: "dedicate-step-1", context: { isDirty: false } };
  }
  if (event.type === "OPEN_PERSONALIZE") {
    return { state: "personalize-editor", context: { isDirty: false } };
  }

  switch (state) {
    case "gallery-photo":
      if (event.type === "OPEN_SHARE_CONFIRM")
        return { ...current, state: "share-confirm" };
      if (event.type === "DOWNLOAD_ORIGINAL_SUCCESS")
        return { ...current, state: "post-download" };
      // OPEN_PERSONALIZE and OPEN_DEDICATE handled as global resets above
      break;

    case "share-confirm":
      if (event.type === "CLOSE_SHARE_CONFIRM")
        return { ...current, state: "gallery-photo" };
      if (event.type === "SHARE_SUCCESS")
        return { ...current, state: "gallery-photo" };
      break;

    case "post-download":
      if (event.type === "RETURN_TO_GALLERY")
        return { ...current, state: "gallery-photo" };
      break;

    case "personalize-editor":
      if (event.type === "PERSONALIZE_DIRTY_CHANGED")
        return { ...current, context: { isDirty: event.hasUnsavedChanges } };
      if (event.type === "DOWNLOAD_PERSONALIZED_SUCCESS")
        return { ...current, state: "personalize-final" };
      if (
        event.type === "PERSONALIZE_BACK" ||
        event.type === "RETURN_TO_GALLERY"
      )
        return context.isDirty
          ? { ...current, state: "personalize-exit-confirm" }
          : { ...current, state: "gallery-photo", context: { isDirty: false } };
      break;

    case "personalize-exit-confirm":
      if (event.type === "PERSONALIZE_CANCEL_EXIT")
        return { ...current, state: "personalize-editor" };
      if (event.type === "PERSONALIZE_CONFIRM_EXIT")
        return { state: "gallery-photo", context: { isDirty: false } };
      break;

    case "personalize-final":
      if (event.type === "RETURN_TO_GALLERY")
        return { ...current, state: "gallery-photo" };
      break;

    case "dedicate-step-1":
      if (event.type === "DEDICATE_NEXT")
        return { ...current, state: "dedicate-step-2" };
      if (event.type === "DEDICATE_BACK" || event.type === "RETURN_TO_GALLERY")
        return { ...current, state: "gallery-photo" };
      break;

    case "dedicate-step-2":
      if (event.type === "DEDICATE_BACK")
        return { ...current, state: "dedicate-step-1" };
      if (event.type === "DEDICATE_NEXT")
        return { ...current, state: "dedicate-step-3" };
      if (event.type === "RETURN_TO_GALLERY")
        return { ...current, state: "gallery-photo" };
      break;

    case "dedicate-step-3":
      if (event.type === "DEDICATE_BACK")
        return { ...current, state: "dedicate-step-2" };
      if (event.type === "DEDICATE_OPEN_CONFIRM")
        return { ...current, state: "dedicate-confirm" };
      if (event.type === "RETURN_TO_GALLERY")
        return { ...current, state: "gallery-photo" };
      break;

    case "dedicate-confirm":
      if (event.type === "DEDICATE_CANCEL_CONFIRM")
        return { ...current, state: "dedicate-step-3" };
      if (event.type === "DEDICATE_CONFIRM_SUBMIT")
        return { ...current, state: "dedicate-uploading" };
      break;

    case "dedicate-uploading":
      if (event.type === "DEDICATE_UPLOAD_SUCCESS")
        return { ...current, state: "dedicate-success" };
      if (event.type === "DEDICATE_UPLOAD_ERROR")
        return { ...current, state: "dedicate-error" };
      break;

    case "dedicate-error":
      if (event.type === "DEDICATE_RETRY")
        return { ...current, state: "dedicate-uploading" };
      if (event.type === "DEDICATE_BACK_TO_EDIT")
        return { ...current, state: "dedicate-step-3" };
      break;

    case "dedicate-success":
      if (event.type === "RETURN_TO_GALLERY")
        return { ...current, state: "gallery-photo" };
      break;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(`[ModalSM] Transicion invalida: ${state} + ${event.type}`);
  }
  return current;
}

export const useModalStateMachine = (startState?: ModalState) => {
  const [{ state, context }, dispatch] = useReducer(modalReducer, {
    state: startState ?? "gallery-photo",
    context: { isDirty: false },
  });

  const reset = useCallback(() => dispatch({ type: "OPEN_PHOTO", photoId: "" }), [dispatch]);

  return { state, context, dispatch, reset };
};
