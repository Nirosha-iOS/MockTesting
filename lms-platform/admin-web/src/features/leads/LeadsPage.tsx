import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLeads, fetchLeadsByAssignedEmpId } from "../../api/leadsApi";
import type { LeadResponse } from "../../api/types";
import { Button } from "../../components/ui/Button";
import { SearchField } from "../../components/ui/SearchField";
import { Select } from "../../components/ui/Select";
import { CreateLeadPanel } from "./CreateLeadPanel";

function stageBadgeClass(stage: string) {
  const s = stage.toUpperCase();
  if (s === "NEW") return "crm-badge crm-badge-new";
  if (s === "QUALIFIED") return "crm-badge crm-badge-qualified";
  if (s === "CONTACTED") return "crm-badge crm-badge-contacted";
  if (s === "LOST") return "crm-badge crm-badge-lost";
  return "crm-badge";
}

export function LeadsPage() {
  const [leads, setLeads] = useState<LeadResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("ALL");
  const [assignedEmpFilter, setAssignedEmpFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = assignedEmpFilter.trim() ? await fetchLeadsByAssignedEmpId(assignedEmpFilter.trim()) : await fetchLeads();
      setLeads(data);
    } catch {
      setError("Unable to load leads. Ensure the API is running and you are signed in.");
    } finally {
      setLoading(false);
    }
  }, [assignedEmpFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchesStage = stageFilter === "ALL" || l.stage === stageFilter;
      const q = query.trim().toLowerCase();
      const phone = (l.mobile ?? l.phone ?? "").toLowerCase();
      const company = (l.companyName ?? l.company ?? "").toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        phone.includes(q) ||
        company.includes(q) ||
        (l.leadId && l.leadId.toLowerCase().includes(q)) ||
        (l.leadSource && l.leadSource.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        (l.campaignId && l.campaignId.toLowerCase().includes(q));
      return matchesStage && matchesQuery;
    });
  }, [leads, query, stageFilter]);

  const stages = useMemo(() => {
    const set = new Set(leads.map((l) => l.stage));
    return ["ALL", ...Array.from(set).sort()];
  }, [leads]);

  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Pipeline</span>
          <h1 className="crm-page-title">Leads</h1>
        </div>
        <div className="crm-page-toolbar__controls">
          <SearchField withTopbarSlot={false} label="Search leads" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select label="Stage" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <input
            className="input crm-page-toolbar__input-narrow"
            type="text"
            placeholder="Assignee ID"
            value={assignedEmpFilter}
            onChange={(e) => setAssignedEmpFilter(e.target.value)}
            aria-label="Assignee employee ID"
            autoComplete="off"
          />
          <Button variant="ghost" type="button" onClick={() => void load()} disabled={loading}>
            Refresh
          </Button>
          <Link className="crm-ghost-button" to="/configuration/bulk-upload">
            Bulk upload
          </Link>
          <Button variant="primaryCompact" aria-label="Create new lead" type="button" onClick={() => setShowCreate(true)}>
            Create lead
          </Button>
        </div>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}

      <div className="card crm-table-card">
        {loading ? <div className="crm-muted">Loading pipeline…</div> : null}
        {!loading && filtered.length === 0 ? <div className="crm-muted">No leads match your filters.</div> : null}
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Lead ID</th>
                <th>Email</th>
                <th>Source</th>
                <th>Mobile</th>
                <th>Stage</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="crm-table-row">
                  <td>
                    <Link className="crm-link-strong" to={`/leads/${l.id}`}>
                      {l.fullName}
                    </Link>
                    {(l.companyName ?? l.company) ? (
                      <div className="crm-list-sub">{l.companyName ?? l.company}</div>
                    ) : null}
                  </td>
                  <td className="crm-muted">{l.leadId ?? "—"}</td>
                  <td>{l.email}</td>
                  <td>{l.leadSource ? <span className="crm-source-pill">{l.leadSource.replace(/_/g, " ")}</span> : "—"}</td>
                  <td>{l.mobile || l.phone || "—"}</td>
                  <td>
                    <span className={stageBadgeClass(l.stage)}>{l.stage}</span>
                  </td>
                  <td className="crm-muted">{new Date(l.createdDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate ? <CreateLeadPanel onCreated={() => void load()} onClose={() => setShowCreate(false)} /> : null}
    </div>
  );
}
