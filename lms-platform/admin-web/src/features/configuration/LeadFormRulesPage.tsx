import { LEAD_CREATE_FIELD_DEFS } from "../leads/createLeadFieldConfig";
import { useLeadFormRules } from "./LeadFormRulesContext";

export function LeadFormRulesPage() {
  const { requiredByField, setFieldRequired, resetToDefaults } = useLeadFormRules();

  return (
    <div className="card crm-config-panel">
      <header className="crm-config-panel-header">
        <div>
          <h2 className="crm-type-3">Lead create — required fields</h2>
          <p className="crm-type-2 crm-settings-muted">
            Controls which fields show a red asterisk and block submit when empty on <strong>Create lead</strong>. Stored in this browser; a
            future release can sync to the server for mobile and other clients.
          </p>
        </div>
        <button type="button" className="crm-ghost-button" onClick={resetToDefaults}>
          Reset to defaults
        </button>
      </header>

      <ul className="crm-create-field-rules-list crm-create-field-rules-list--config">
        {LEAD_CREATE_FIELD_DEFS.map((def) => (
          <li key={def.name}>
            <label className="crm-create-field-rules-item">
              <input
                type="checkbox"
                checked={requiredByField[def.name] ?? false}
                onChange={() => setFieldRequired(def.name, !(requiredByField[def.name] ?? false))}
              />
              <span>
                <strong>{def.label}</strong>
                <span className="crm-config-field-meta"> ({def.section})</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
