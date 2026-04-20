import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLeads } from "../../api/leadsApi";
import { listEmployees, listMaster } from "../../api/configApi";

export function DashboardPage() {
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [leads, products, users] = await Promise.all([
          fetchLeads(),
          listMaster("/api/v1/config/products"),
          listEmployees(),
        ]);
        if (cancelled) return;
        setLeadCount(leads.length);
        setProductCount(products.length);
        setUserCount(users.length);
      } catch {
        if (cancelled) return;
        setLeadCount(null);
        setProductCount(null);
        setUserCount(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = useMemo(
    () => [
      { label: "Leads", value: leadCount === null ? "—" : String(leadCount), hint: "Total leads available in the current workspace." },
      { label: "Products", value: productCount === null ? "—" : String(productCount), hint: "Configured product masters available for mapping." },
      { label: "Users", value: userCount === null ? "—" : String(userCount), hint: "Employee users configured for assignment and ownership." },
      { label: "Bulk lead upload", value: "Ready", hint: "CSV / Excel entry point is enabled for admin onboarding." },
    ],
    [leadCount, productCount, userCount],
  );

  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Workspace</span>
          <h1 className="crm-page-title">Overview</h1>
          <p
            className="crm-page-toolbar__hint"
            title="Admin operations hub for configuration-first rollout. Set masters, upload leads in bulk, then mobile can consume the same setup."
          >
            Configuration-first rollout · same API for mobile
          </p>
        </div>
        <div className="crm-page-toolbar__controls">
          <Link className="crm-ghost-button" to="/configuration/bulk-upload">
            Bulk upload
          </Link>
          <Link className="crm-ghost-button" to="/configuration">
            Configuration
          </Link>
          <Link className="btn-primary btn-primary--compact" to="/leads">
            Leads
          </Link>
        </div>
      </div>

      <section className="crm-kpi-grid">
        {kpis.map((k) => (
          <article key={k.label} className="crm-kpi-card">
            <div className="crm-kpi-label">{k.label}</div>
            <div className="crm-kpi-value">{k.value}</div>
            <p className="crm-kpi-hint">{k.hint}</p>
          </article>
        ))}
      </section>

      <section className="crm-two-col">
        <div className="card crm-panel">
          <h3>Admin flow</h3>
          <ol className="crm-steps">
            <li>Configure lead required fields and role mappings in Configuration.</li>
            <li>Set product, vertical, and role-function masters before field rollout.</li>
            <li>Use Bulk Lead Upload for CSV/Excel onboarding with sample template.</li>
            <li>Review Leads and assign lifecycle ownership from admin.</li>
          </ol>
        </div>
        <div className="card crm-panel">
          <h3>Quick links</h3>
          <ul className="crm-bullet-list">
            <li>
              <Link to="/configuration/lead-form">Lead form rules</Link> for required field governance.
            </li>
            <li>
              <Link to="/configuration/bulk-upload">Bulk upload</Link> to import leads from CSV/Excel.
            </li>
            <li>
              <Link to="/configuration/role-function-mapping">Role ↔ function mapping</Link> for permission control.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
