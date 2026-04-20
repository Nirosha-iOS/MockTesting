import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultRequiredByField, type LeadFormFieldKey } from "../leads/createLeadFieldConfig";
import { loadLeadFormRequiredMap, saveLeadFormRequiredMap } from "./leadFormRulesStorage";

export interface LeadFormRulesContextValue {
  requiredByField: Record<LeadFormFieldKey, boolean>;
  setFieldRequired: (name: LeadFormFieldKey, required: boolean) => void;
  setRequiredMap: (map: Record<LeadFormFieldKey, boolean>) => void;
  resetToDefaults: () => void;
}

const LeadFormRulesContext = createContext<LeadFormRulesContextValue | undefined>(undefined);

export function LeadFormRulesProvider({ children }: { children: ReactNode }) {
  const [requiredByField, setRequiredByFieldState] = useState(loadLeadFormRequiredMap);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "lms-admin-lead-form-required" || e.key === null) {
        setRequiredByFieldState(loadLeadFormRequiredMap());
      }
    }
    function onCustom() {
      setRequiredByFieldState(loadLeadFormRequiredMap());
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("lms-lead-form-rules-changed", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lms-lead-form-rules-changed", onCustom);
    };
  }, []);

  const setFieldRequired = useCallback((name: LeadFormFieldKey, required: boolean) => {
    setRequiredByFieldState((prev) => {
      const next = { ...prev, [name]: required };
      saveLeadFormRequiredMap(next);
      return next;
    });
  }, []);

  const setRequiredMap = useCallback((map: Record<LeadFormFieldKey, boolean>) => {
    saveLeadFormRequiredMap(map);
    setRequiredByFieldState(map);
  }, []);

  const resetToDefaults = useCallback(() => {
    const next = defaultRequiredByField();
    saveLeadFormRequiredMap(next);
    setRequiredByFieldState(next);
  }, []);

  const value = useMemo(
    () => ({ requiredByField, setFieldRequired, setRequiredMap, resetToDefaults }),
    [requiredByField, setFieldRequired, setRequiredMap, resetToDefaults],
  );

  return <LeadFormRulesContext.Provider value={value}>{children}</LeadFormRulesContext.Provider>;
}

export function useLeadFormRules() {
  const ctx = useContext(LeadFormRulesContext);
  if (!ctx) {
    throw new Error("useLeadFormRules must be used within LeadFormRulesProvider");
  }
  return ctx;
}
