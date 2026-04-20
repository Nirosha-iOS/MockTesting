import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLeadById, reassignLead } from "../../api/leadsApi";
import type { LeadResponse } from "../../api/types";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { toDisplayText } from "./productMapping";

function fmt(s: string | null | undefined) {
  return s && s.trim() !== "" ? s : "—";
}

export function LeadDetailPage() {
  const { leadId } = useParams();
  const [lead, setLead] = useState<LeadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newAssignee, setNewAssignee] = useState("");
  const [unavailableFrom, setUnavailableFrom] = useState("");
  const [unavailableTo, setUnavailableTo] = useState("");
  const [reason, setReason] = useState("");
  const [assignMsg, setAssignMsg] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(leadId);
    if (Number.isNaN(id)) {
      setError("Invalid lead id");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchLeadById(id);
        if (!cancelled) {
          setLead(data);
        }
      } catch {
        if (!cancelled) {
          setError("Lead not found or API unavailable.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  if (error) {
    return (
      <div className="crm-page">
        <div className="error-banner">{error}</div>
        <Link to="/leads" className="crm-link-strong">
          ← Back to leads
        </Link>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="crm-page">
        <div className="crm-muted">Loading record…</div>
      </div>
    );
  }

  const mobile = lead.mobile ?? lead.phone ?? "";
  const company = lead.companyName ?? lead.company ?? "";
  const created = lead.createdDate ?? (lead as { createdAt?: string }).createdAt;

  async function onReassign(e: React.FormEvent) {
    e.preventDefault();
    if (!lead) return;
    if (!newAssignee.trim()) return;
    try {
      const updated = await reassignLead(lead.id, {
        newAssignedEmpId: newAssignee.trim(),
        reason: reason.trim() || undefined,
        unavailableFrom: unavailableFrom || undefined,
        unavailableTo: unavailableTo || undefined,
      });
      setLead(updated);
      setAssignMsg(`Lead reassigned to ${updated.assignedTo}.`);
    } catch {
      setAssignMsg("Could not reassign lead. Check employee ID and try again.");
    }
  }

  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <nav className="crm-breadcrumb crm-breadcrumb--compact" aria-label="Breadcrumb">
            <Link to="/leads">Leads</Link>
            <span aria-hidden>/</span>
            <span>{lead.fullName}</span>
          </nav>
          <span className="crm-page-toolbar__eyebrow">Lead record</span>
          <h1 className="crm-page-title">{lead.fullName}</h1>
          <p
            className="crm-page-toolbar__hint"
            title={`#${lead.id}${lead.leadId ? ` · ${lead.leadId}` : ""} · ${lead.status ?? lead.stage}${lead.priority ? ` · Priority ${lead.priority}` : ""}`}
          >
            #{lead.id}
            {lead.leadId ? ` · ${lead.leadId}` : ""} · Status <strong>{lead.status ?? lead.stage}</strong>
            {lead.priority ? ` · Priority ${lead.priority}` : ""}
          </p>
        </div>
        <div className="crm-page-toolbar__controls crm-record-actions">
          <button type="button" className="crm-ghost-button" disabled>
            Convert (soon)
          </button>
          <button type="button" className="btn-primary btn-primary--compact" disabled>
            Log call
          </button>
        </div>
      </div>

      <div className="crm-record-grid">
        <section className="card crm-record-main">
          <h3>Overview</h3>
          <dl className="crm-dl">
            <div>
              <dt>Lead ID</dt>
              <dd>{fmt(lead.leadId)}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{lead.email}</dd>
            </div>
            <div>
              <dt>Mobile</dt>
              <dd>{fmt(mobile)}</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>{fmt(company)}</dd>
            </div>
            <div>
              <dt>Lead source</dt>
              <dd>{lead.leadSource ? lead.leadSource.replace(/_/g, " ") : "—"}</dd>
            </div>
            <div>
              <dt>Product interested</dt>
              <dd>{toDisplayText(lead.productInterested)}</dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>{fmt(lead.budget)}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{fmt(lead.description)}</dd>
            </div>
            <div>
              <dt>Country</dt>
              <dd>{fmt(lead.country)}</dd>
            </div>
            <div>
              <dt>State</dt>
              <dd>{fmt(lead.state)}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{fmt(lead.city)}</dd>
            </div>
            <div>
              <dt>Pincode</dt>
              <dd>{fmt(lead.pincode)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{lead.status ?? lead.stage}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>{fmt(lead.priority)}</dd>
            </div>
            <div>
              <dt>Assigned to</dt>
              <dd>{fmt(lead.assignedTo)}</dd>
            </div>
            <div>
              <dt>Expected close</dt>
              <dd>{fmt(lead.expectedCloseDate)}</dd>
            </div>
            <div>
              <dt>Campaign ID</dt>
              <dd>{fmt(lead.campaignId)}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{created ? new Date(created).toLocaleString() : "—"}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{lead.updatedDate ? new Date(lead.updatedDate).toLocaleString() : "—"}</dd>
            </div>
            <div>
              <dt>Created by</dt>
              <dd>{fmt(lead.createdBy)}</dd>
            </div>
          </dl>
        </section>
        <aside className="card crm-record-side">
          <h3>Activity</h3>
          <ul className="crm-timeline">
            <li>
              <span className="crm-timeline-dot" />
              <div>
                <strong>Record created</strong>
                <div className="crm-muted">{created ? new Date(created).toLocaleString() : "—"}</div>
              </div>
            </li>
            <li className="crm-muted">Calls, tasks, and meetings will render here from the activity service.</li>
          </ul>
          <hr />
          <h3>Reassign lead</h3>
          <form className="crm-master-form crm-master-form--stacked" onSubmit={onReassign}>
            <TextField label="New assigned employee ID" value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)} required />
            <TextField label="Unavailable from" type="date" value={unavailableFrom} onChange={(e) => setUnavailableFrom(e.target.value)} />
            <TextField label="Unavailable to" type="date" value={unavailableTo} onChange={(e) => setUnavailableTo(e.target.value)} />
            <TextField label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Leave / unavailable…" />
            <div className="crm-popup-form-actions">
              <Button type="submit">Assign to another user</Button>
            </div>
          </form>
          {assignMsg ? <div className="crm-inline-alert">{assignMsg}</div> : null}
        </aside>
      </div>
    </div>
  );
}
