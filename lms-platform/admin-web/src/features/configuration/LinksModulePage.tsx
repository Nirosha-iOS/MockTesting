import { useEffect, useState } from "react";
import { createLink, listLinks, updateLink } from "../../api/configApi";
import type { ResourceLinkDto } from "../../api/types";
import { Button } from "../../components/ui/Button";
import { CheckboxField } from "../../components/ui/CheckboxField";
import { Modal } from "../../components/ui/Modal";
import { TextField } from "../../components/ui/TextField";

export function LinksModulePage() {
  const [rows, setRows] = useState<ResourceLinkDto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    try {
      setRows(await listLinks());
    } catch {
      setMessage("Could not load links.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function startEdit(row: ResourceLinkDto) {
    setShowPopup(true);
    setEditingId(row.id);
    setTitle(row.title);
    setUrl(row.url);
    setCategory(row.category ?? "");
    setActive(row.active);
  }

  function startAdd() {
    setShowPopup(true);
    setEditingId(null);
    setTitle("");
    setUrl("");
    setCategory("");
    setActive(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { title, url, category: category || null, active };
    try {
      if (editingId) {
        await updateLink(editingId, payload);
        setMessage("Link updated.");
      } else {
        await createLink(payload);
        setMessage("Link added.");
        setTitle("");
        setUrl("");
        setCategory("");
      }
      await load();
      setShowPopup(false);
    } catch {
      setMessage("Could not save link.");
    }
  }

  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Configuration</span>
          <h1 className="crm-page-title">Links</h1>
          <p className="crm-page-toolbar__hint" title="Manage deep links and reference URLs consumed by web and mobile modules.">
            Reference URLs for web and mobile
          </p>
        </div>
        <div className="crm-page-toolbar__controls">
          <button type="button" className="btn-primary btn-primary--compact" onClick={startAdd}>
            Add link
          </button>
        </div>
      </div>

      <section className="card crm-table-card">
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>Category</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.url}</td>
                  <td>{r.category ?? "—"}</td>
                  <td>{r.active ? "Active" : "Inactive"}</td>
                  <td>
                    <button type="button" className="crm-ghost-button" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="crm-muted">
                    No links configured.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={showPopup} onClose={() => setShowPopup(false)} title={editingId ? "Edit link" : "Add link"}>
        <form className="crm-master-form crm-master-form--stacked" onSubmit={onSubmit}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <TextField label="URL" type="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
          <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <CheckboxField label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
          <div className="crm-popup-form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowPopup(false)}>
              Cancel
            </Button>
            <Button type="submit">OK</Button>
          </div>
        </form>
        {message ? <div className="crm-inline-alert">{message}</div> : null}
      </Modal>
    </div>
  );
}
