import { Link } from "react-router-dom";

const reportCards = [
  {
    title: "Lead Intake vs Conversion",
    description: "Track daily/weekly lead inflow, stage movement, and conversion ratio by source and product.",
    audience: "Sales head, Ops manager",
  },
  {
    title: "Sales Rep Productivity",
    description: "Measure calls, follow-ups, meetings, and opportunities handled per employee with SLA compliance.",
    audience: "Regional manager",
  },
  {
    title: "Pipeline Aging & SLA Risk",
    description: "Identify opportunities stuck in stage and records that are breaching follow-up SLA windows.",
    audience: "Inside sales lead",
  },
  {
    title: "Vertical / Product Performance",
    description: "Compare win rates, deal velocity, and average ticket size across verticals and products.",
    audience: "Business leadership",
  },
  {
    title: "Bulk Upload Audit",
    description: "See upload batches, accepted rows, rejected rows, and validation error trends over time.",
    audience: "Data governance",
  },
  {
    title: "Attendance vs Field Outcomes",
    description: "Correlate check-in/out compliance with lead follow-up outcomes for field sales governance.",
    audience: "Field operations",
  },
];

export function ReportsPage() {
  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Reports</span>
          <h1 className="crm-page-title">Sales governance</h1>
          <p className="crm-page-toolbar__hint" title="Use-case oriented reports for sales governance, compliance, and performance reviews.">
            Governance, compliance, and performance use cases
          </p>
        </div>
        <div className="crm-page-toolbar__controls">
          <Link className="crm-ghost-button" to="/configuration">
            Configuration
          </Link>
          <Link className="crm-ghost-button" to="/configuration/bulk-upload">
            Bulk upload
          </Link>
          <Link className="btn-primary btn-primary--compact" to="/leads">
            Leads
          </Link>
        </div>
      </div>

      <section className="crm-kpi-grid">
        <article className="crm-kpi-card">
          <div className="crm-kpi-label">Report templates</div>
          <div className="crm-kpi-value">{reportCards.length}</div>
          <p className="crm-kpi-hint">Business-ready templates scaffolded for governance.</p>
        </article>
        <article className="crm-kpi-card">
          <div className="crm-kpi-label">Data status</div>
          <div className="crm-kpi-value">Admin-first</div>
          <p className="crm-kpi-hint">Reports will bind to backend aggregates as APIs land.</p>
        </article>
        <article className="crm-kpi-card">
          <div className="crm-kpi-label">Coverage</div>
          <div className="crm-kpi-value">Lead to field</div>
          <p className="crm-kpi-hint">Includes lifecycle, productivity, and attendance governance.</p>
        </article>
      </section>

      <section className="crm-report-grid">
        {reportCards.map((item) => (
          <article key={item.title} className="card crm-panel crm-report-card">
            <h3>{item.title}</h3>
            <p className="crm-settings-muted">{item.description}</p>
            <p className="crm-report-audience">Primary audience: {item.audience}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
