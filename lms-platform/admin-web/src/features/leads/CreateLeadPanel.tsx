import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createLead } from "../../api/leadsApi";
import { listMaster } from "../../api/configApi";
import type { MasterDto } from "../../api/types";
import { CrmFormField } from "../../components/form/CrmFormField";
import { useLeadFormRules } from "../configuration/LeadFormRulesContext";
import {
  LEAD_CREATE_FIELD_DEFS,
  emptyLeadFormValues,
  validateLeadCreate,
  type LeadFieldDefinition,
  type LeadFormFieldKey,
  type LeadFormValues,
} from "./createLeadFieldConfig";
import { leadFormValuesToCreatePayload } from "./createLeadPayload";
import { buildLeadFormRowCsv, buildLeadImportTemplateCsv, triggerCsvDownload } from "./leadCsvExport";
import { encodeLeadProductMap } from "./productMapping";

interface Props {
  onCreated: () => void;
  onClose: () => void;
}

type ProductMapDraft = {
  key: string;
  productId: number;
  countApplicable: boolean;
  totalCount: string;
  mappedCount: string;
};

function fieldControl(
  def: LeadFieldDefinition,
  inputId: string,
  values: LeadFormValues,
  setField: (k: LeadFormFieldKey, v: string) => void,
  error?: string,
) {
  const common = {
    id: inputId,
    className: "input" + (def.type === "select" ? " crm-select crm-select--full" : ""),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${inputId}-err` : undefined,
  };

  if (def.type === "textarea") {
    return (
      <textarea
        {...common}
        rows={def.rows ?? 4}
        maxLength={def.maxLength}
        placeholder={def.placeholder}
        value={values[def.name]}
        onChange={(e) => setField(def.name, e.target.value)}
      />
    );
  }

  if (def.type === "select" && def.options) {
    return (
      <select {...common} value={values[def.name]} onChange={(e) => setField(def.name, e.target.value)}>
        {def.options.map((o) => (
          <option key={o.value || `opt-${o.label}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      {...common}
      type={def.type === "email" ? "email" : def.type === "tel" ? "tel" : def.type === "date" ? "date" : "text"}
      maxLength={def.maxLength}
      placeholder={def.placeholder}
      value={values[def.name]}
      onChange={(e) => setField(def.name, e.target.value)}
      autoComplete={def.name === "email" ? "email" : def.name === "fullName" ? "name" : def.name === "companyName" ? "organization" : undefined}
    />
  );
}

export function CreateLeadPanel({ onCreated, onClose }: Props) {
  const titleId = useId();
  const fid = useId();
  const optionsDetailsRef = useRef<HTMLDetailsElement>(null);
  const { requiredByField } = useLeadFormRules();
  const [values, setValues] = useState<LeadFormValues>(emptyLeadFormValues);
  const [errors, setErrors] = useState<Partial<Record<LeadFormFieldKey, string>>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<MasterDto[]>([]);
  const [productRows, setProductRows] = useState<ProductMapDraft[]>([]);

  const sections = useMemo(() => {
    const names = [...new Set(LEAD_CREATE_FIELD_DEFS.map((d) => d.section))];
    return names.map((title) => ({
      title,
      fields: LEAD_CREATE_FIELD_DEFS.filter((d) => d.section === title),
    }));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listMaster("/api/v1/config/products");
        if (!cancelled) {
          setProducts(rows.filter((row) => row.active));
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function setField(name: LeadFormFieldKey, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function closeOptionsMenu() {
    const el = optionsDetailsRef.current;
    if (el) el.open = false;
  }

  function onDownloadTemplate() {
    triggerCsvDownload("lead-import-template.csv", buildLeadImportTemplateCsv());
    closeOptionsMenu();
  }

  function onExportCurrentRow() {
    triggerCsvDownload(`lead-export-${new Date().toISOString().slice(0, 10)}.csv`, buildLeadFormRowCsv(values));
    closeOptionsMenu();
  }

  function addProductRow() {
    setProductRows((prev) => [
      ...prev,
      {
        key: `${Date.now()}-${prev.length}`,
        productId: 0,
        countApplicable: false,
        totalCount: "",
        mappedCount: "",
      },
    ]);
  }

  function updateProductRow(key: string, patch: Partial<ProductMapDraft>) {
    setProductRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function removeProductRow(key: string) {
    setProductRows((prev) => prev.filter((row) => row.key !== key));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const productInterestedValue = encodeLeadProductMap(
      productRows
        .filter((row) => row.productId > 0)
        .map((row) => {
          const picked = products.find((p) => p.id === row.productId);
          return {
            productId: row.productId,
            productName: picked?.name ?? "",
            countApplicable: row.countApplicable,
            totalCount: row.totalCount === "" ? undefined : Number(row.totalCount),
            mappedCount: row.mappedCount === "" ? undefined : Number(row.mappedCount),
          };
        }),
    );
    const valuesForValidation = { ...values, productInterested: productInterestedValue };
    const nextErrors = validateLeadCreate(valuesForValidation, requiredByField);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setBusy(true);
    setError(null);
    try {
      await createLead(leadFormValuesToCreatePayload(valuesForValidation));
      onCreated();
      onClose();
      setValues(emptyLeadFormValues());
      setErrors({});
      setProductRows([]);
    } catch {
      setError("Could not create lead. Check the form and your connection, then try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="crm-drawer-overlay"
      role="presentation"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
        onClose();
      }}
    >
      <aside
        className="crm-drawer crm-drawer--wide crm-drawer--record"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="crm-drawer-header">
          <div>
            <h2 id={titleId} className="crm-drawer-title">
              Create lead
            </h2>
            <p className="crm-drawer-intro">
              Required fields follow <strong>Configuration → Lead form rules</strong>. Red asterisk marks required; id and timestamps are set when you
              save.
            </p>
          </div>
          <div className="crm-drawer-header-actions">
            <details ref={optionsDetailsRef} className="crm-drawer-options">
              <summary className="crm-drawer-options-summary">Options</summary>
              <div className="crm-drawer-options-menu" role="menu" aria-label="Create lead options">
                <button type="button" className="crm-drawer-options-item" role="menuitem" onClick={onDownloadTemplate}>
                  Export — import template (CSV)
                </button>
                <button type="button" className="crm-drawer-options-item" role="menuitem" onClick={onExportCurrentRow}>
                  Export — current fields (CSV)
                </button>
              </div>
            </details>
            <button type="button" className="crm-icon-button crm-drawer-close" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <form className="crm-drawer-form crm-create-lead-form" onSubmit={onSubmit}>
          {sections.map(({ title, fields }) => (
            <section key={title} className="crm-form-section" aria-label={title}>
              <h3 className="crm-form-section-title">{title}</h3>
              <div className="crm-create-lead-fields">
                {fields.map((def) => {
                  const inputId = `${fid}-${def.name}`;
                  const req = requiredByField[def.name] ?? false;
                  const err = errors[def.name];
                  if (def.name === "productInterested") {
                    return (
                      <CrmFormField key={def.name} label={def.label} required={req} error={err} htmlFor={inputId}>
                        <div className="crm-product-map">
                          {productRows.length === 0 ? <p className="crm-muted">No product mapped yet.</p> : null}
                          {productRows.map((row) => {
                            const pending =
                              row.countApplicable && row.totalCount !== ""
                                ? Math.max(0, Number(row.totalCount || 0) - Number(row.mappedCount || 0))
                                : undefined;
                            return (
                              <div key={row.key} className="crm-product-map__row">
                                <label className="crm-inline-field">
                                  <span>Product</span>
                                  <select
                                    className="input crm-select crm-select--full"
                                    value={row.productId}
                                    onChange={(ev) => updateProductRow(row.key, { productId: Number(ev.target.value) })}
                                  >
                                    <option value={0}>Select product</option>
                                    {products.map((opt) => (
                                      <option key={opt.id} value={opt.id}>
                                        {opt.name}
                                      </option>
                                    ))}
                                  </select>
                                </label>

                                <label className="crm-inline-field crm-inline-field--compact">
                                  <span>Count applicable</span>
                                  <input
                                    type="checkbox"
                                    checked={row.countApplicable}
                                    onChange={(ev) =>
                                      updateProductRow(row.key, {
                                        countApplicable: ev.target.checked,
                                        totalCount: ev.target.checked ? row.totalCount : "",
                                        mappedCount: ev.target.checked ? row.mappedCount : "",
                                      })
                                    }
                                  />
                                </label>

                                {row.countApplicable ? (
                                  <>
                                    <label className="crm-inline-field">
                                      <span>Total count</span>
                                      <input
                                        className="input"
                                        type="number"
                                        min={0}
                                        value={row.totalCount}
                                        onChange={(ev) => updateProductRow(row.key, { totalCount: ev.target.value })}
                                      />
                                    </label>
                                    <label className="crm-inline-field">
                                      <span>Mapped count</span>
                                      <input
                                        className="input"
                                        type="number"
                                        min={0}
                                        value={row.mappedCount}
                                        onChange={(ev) => updateProductRow(row.key, { mappedCount: ev.target.value })}
                                      />
                                    </label>
                                    <div className="crm-inline-field">
                                      <span>Pending</span>
                                      <div className="crm-product-map__pending">{pending ?? 0}</div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="crm-inline-field">
                                    <span>Pending</span>
                                    <div className="crm-product-map__pending">N/A</div>
                                  </div>
                                )}

                                <button type="button" className="crm-ghost-button" onClick={() => removeProductRow(row.key)}>
                                  Remove
                                </button>
                              </div>
                            );
                          })}
                          <button type="button" className="crm-ghost-button" onClick={addProductRow}>
                            + Add product mapping
                          </button>
                        </div>
                      </CrmFormField>
                    );
                  }
                  return (
                    <CrmFormField key={def.name} label={def.label} required={req} error={err} htmlFor={inputId}>
                      {fieldControl(def, inputId, values, setField, err)}
                    </CrmFormField>
                  );
                })}
              </div>
            </section>
          ))}

          <div className="crm-drawer-actions">
            <button type="button" className="crm-ghost-button" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button className="btn-primary" type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create lead"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
