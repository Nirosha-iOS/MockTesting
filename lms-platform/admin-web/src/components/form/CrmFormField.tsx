import type { ReactNode } from "react";

export interface CrmFormFieldProps {
  /** Visible label (sentence case recommended). */
  label: string;
  /** When true, shows a red asterisk and participates in required validation upstream. */
  required?: boolean;
  /** Shown below the control; also set aria-invalid on the control by the parent via id. */
  error?: string;
  htmlFor: string;
  children: ReactNode;
}

/**
 * Simple label + control + error layout. Pair with `validateLeadCreate` / per-field `required` flags from config.
 */
export function CrmFormField({ label, required, error, htmlFor, children }: CrmFormFieldProps) {
  return (
    <div className="crm-form-field">
      <label className="crm-form-field__label" htmlFor={htmlFor}>
        <span className="crm-form-field__label-text">{label}</span>
        {required ? (
          <span className="crm-form-field__required" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div className="crm-form-field__control">{children}</div>
      {error ? (
        <p id={`${htmlFor}-err`} className="crm-form-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
