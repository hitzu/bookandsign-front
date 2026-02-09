import { useEffect, useRef, useState } from "react";

type Params = {
  storageKey: string | null;
  hintPhone?: string;
  onReset?: () => void;
};

/**
 * Manages the "public contract + phone" gating state.
 *
 * Behavior mirrors the previous inline effect in `PreparationSection`:
 * - resets auth state when contract token (storageKey) changes
 * - restores verified phone from localStorage when available
 * - prefills the input with a server-provided phone hint when no local value exists
 */
export function usePublicContractPhoneGate(params: Params) {
  const { storageKey, hintPhone, onReset } = params;

  const [authError, setAuthError] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);

  // Avoid making the caller memoize `onReset` just for dependency stability.
  const onResetRef = useRef<Params["onReset"]>(onReset);
  useEffect(() => {
    onResetRef.current = onReset;
  }, [onReset]);

  useEffect(() => {
    // Reset when navigating between contracts/tokens.
    onResetRef.current?.();
    setVerifiedPhone(null);
    setAuthError(null);

    if (typeof window === "undefined") return;

    const stored =
      storageKey != null ? window.localStorage.getItem(storageKey) : null;
    if (stored && stored.trim()) {
      setVerifiedPhone(stored.trim());
      setPhoneInput(stored.trim());
      return;
    }

    // Prefill with server-provided phone (hint), but still require user confirmation.
    setPhoneInput(hintPhone?.toString() ?? "");
  }, [hintPhone, storageKey]);

  return {
    authError,
    setAuthError,
    phoneInput,
    setPhoneInput,
    verifiedPhone,
    setVerifiedPhone,
  };
}

