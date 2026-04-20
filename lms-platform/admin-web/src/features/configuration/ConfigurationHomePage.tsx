import { Link } from "react-router-dom";
import { CONFIG_NAV } from "./configNav";

export function ConfigurationHomePage() {
  const cards = CONFIG_NAV.filter((n) => !n.end);

  return (
    <div>
      <section className="card crm-config-intro">
        <h2 className="crm-type-3">Module checklist</h2>
        <p className="crm-type-2 crm-settings-muted">
          Open each area from the left menu or the cards below. <strong>Lead form rules</strong> is available now; the rest are placeholders until
          their APIs exist.
        </p>
      </section>
      <ul className="crm-config-card-grid">
        {cards.map((item) => (
          <li key={item.to}>
            <Link to={item.to} className="crm-config-card">
              <span className="crm-config-card-title">{item.label}</span>
              <span className="crm-config-card-cta">Open →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
