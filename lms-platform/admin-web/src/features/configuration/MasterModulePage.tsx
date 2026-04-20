import { useEffect, useState } from "react";
import { createMaster, listMaster, updateMaster } from "../../api/configApi";
import type { MasterDto } from "../../api/types";
import { Button } from "../../components/ui/Button";
import { CheckboxField } from "../../components/ui/CheckboxField";
import { Modal } from "../../components/ui/Modal";
import { TextField } from "../../components/ui/TextField";

interface Props {
  title: string;
  subtitle: string;
  path: string;
  includeEmail?: boolean;
}

export function MasterModulePage({ title, subtitle, path, includeEmail = false }: Props) {
  const [items, setItems] = useState<MasterDto[]>([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await listMaster(path));
      setMessage(null);
    } catch {
      setMessage("Could not load records. Check backend API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [path]);

  function startEdit(item: MasterDto) {
    setShowPopup(true);
    setEditingId(item.id);
    setCode(item.code);
    setName(item.name);
    setActive(item.active);
    setEmail(item.email ?? "");
  }

  function startAdd() {
    setShowPopup(true);
    setEditingId(null);
    setCode("");
    setName("");
    setEmail("");
    setActive(true);
  }

  function autoCodeFromName(value: string): string {
    return value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalizedCode = (editingId ? code : autoCodeFromName(name)).trim();
    try {
      if (editingId) {
        await updateMaster(`${path}/${editingId}`, { code: normalizedCode, name, active, ...(includeEmail ? { email } : {}) });
        setMessage("Updated successfully.");
      } else {
        await createMaster(path, { code: normalizedCode, name, active, ...(includeEmail ? { email } : {}) });
        setMessage("Created successfully.");
        setName("");
        setEmail("");
      }
      await load();
      setShowPopup(false);
    } catch {
      setMessage("Save failed. Validate values and try again.");
    }
  }

  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Configuration</span>
          <h1 className="crm-page-title">{title}</h1>
          <p className="crm-page-toolbar__hint" title={subtitle}>
            {subtitle}
          </p>
        </div>
        <div className="crm-page-toolbar__controls">
          <button type="button" className="btn-primary btn-primary--compact" onClick={startAdd}>
            Add
          </button>
        </div>
      </div>

      <section className="card crm-table-card">
        {loading ? <div className="crm-muted">Loading…</div> : null}
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.active ? "Active" : "Inactive"}</td>
                  <td>
                    <button type="button" className="crm-ghost-button" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="crm-muted">
                    No records yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={showPopup}
        onClose={() => setShowPopup(false)}
        title={editingId ? "Edit record" : "Add record"}
        description="Code is auto-generated from Name when adding new records."
      >
        <form className="crm-master-form crm-master-form--stacked" onSubmit={onSubmit}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="off" />
          <TextField
            label="Code"
            value={editingId ? code : autoCodeFromName(name)}
            onChange={(e) => setCode(e.target.value)}
            readOnly={!editingId}
            required
            title={editingId ? undefined : "Generated from name until you edit a record"}
          />
          {includeEmail ? (
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          ) : null}
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
