import { useEffect, useRef, useState } from "react";

type Params = {
  storageKey: string | null;
  onReset?: () => void;
};

/**
 * Manages the "public contract + phone" gating state.
 *
 * Behavior:
 * - resets auth state when contract token (storageKey) changes
 * - does NOT prefill the phone input (keeps it empty)
 * - auto-restores a previously verified phone from localStorage (if present)
 */
export function usePublicContractPhoneGate(params: Params) {
  const { storageKey, onReset } = params;

  const [authError, setAuthError] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(() => {
    if (!storageKey) return null;
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(storageKey) || null;
    } catch {
      return null;
    }
  });

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
    setPhoneInput("");

    // Restore previous verification for this token (if any).
    if (!storageKey) return;
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setVerifiedPhone(stored);
    } catch {
      // Ignore storage access errors (e.g., private mode restrictions).
    }
  }, [storageKey]);

  return {
    authError,
    setAuthError,
    phoneInput,
    setPhoneInput,
    verifiedPhone,
    setVerifiedPhone,
  };
}

