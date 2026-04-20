import { useEffect, useId, type ReactNode } from "react";
import { IconButton } from "./IconButton";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional helper line under the title (also wired to `aria-describedby`). */
  description?: string;
  children: ReactNode;
  /** Sticky footer row (e.g. form actions). */
  footer?: ReactNode;
};

/**
 * Centered modal with dimmed backdrop. Backdrop uses pointerdown + target guard so outside dismiss
 * stays reliable after interacting with inputs; Escape closes.
 */
export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="crm-popup-overlay"
      role="presentation"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
        onClose();
      }}
    >
      <div
        className="card crm-popup-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="crm-popup-header">
          <h2 id={titleId}>{title}</h2>
          <IconButton type="button" aria-label="Close" onClick={onClose}>
            ✕
          </IconButton>
        </div>
        {description ? (
          <p id={descId} className="crm-settings-muted">
            {description}
          </p>
        ) : null}
        {children}
        {footer}
      </div>
    </div>
  );
}
