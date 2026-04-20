import { useId, type InputHTMLAttributes } from "react";

export type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** When false, omits outer `crm-topbar-search` wrapper (e.g. toolbar embedding). */
  withTopbarSlot?: boolean;
  /** Associates a real `<label>` (visually hidden; use with `id` or auto-generated id). */
  label?: string;
  id?: string;
};

export function SearchField({ withTopbarSlot = true, className = "", label, id: idProp, ...props }: SearchFieldProps) {
  const uid = useId();
  const inputId = idProp ?? uid;
  const input = (
    <div className="crm-search-shell">
      <span className="crm-search-icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input type="search" id={inputId} className={["crm-search-input", className].filter(Boolean).join(" ")} {...props} />
    </div>
  );

  const labeled =
    label != null && label !== "" ? (
      <>
        <label className="crm-sr-only" htmlFor={inputId}>
          {label}
        </label>
        {input}
      </>
    ) : (
      input
    );

  if (!withTopbarSlot) {
    return <div role="search">{labeled}</div>;
  }

  return (
    <div className="crm-topbar-search" role="search">
      {labeled}
    </div>
  );
}
