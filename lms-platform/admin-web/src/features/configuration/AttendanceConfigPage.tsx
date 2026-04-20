import { useEffect, useState } from "react";
import { createAttendanceConfig, listAttendanceConfigs, updateAttendanceConfig } from "../../api/configApi";
import type { AttendanceConfigDto } from "../../api/types";
import { Button } from "../../components/ui/Button";
import { CheckboxField } from "../../components/ui/CheckboxField";
import { Modal } from "../../components/ui/Modal";
import { TextField } from "../../components/ui/TextField";

export function AttendanceConfigPage() {
  const [rows, setRows] = useState<AttendanceConfigDto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutTime, setCheckOutTime] = useState("18:00");
  const [graceMinutes, setGraceMinutes] = useState(15);
  const [active, setActive] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    try {
      setRows(await listAttendanceConfigs());
    } catch {
      setMessage("Could not load attendance configurations.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function startEdit(row: AttendanceConfigDto) {
    setShowPopup(true);
    setEditingId(row.id);
    setName(row.name);
    setCheckInTime(row.checkInTime);
    setCheckOutTime(row.checkOutTime);
    setGraceMinutes(row.graceMinutes);
    setActive(row.active);
  }

  function startAdd() {
    setShowPopup(true);
    setEditingId(null);
    setName("");
    setCheckInTime("09:00");
    setCheckOutTime("18:00");
    setGraceMinutes(15);
    setActive(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name, checkInTime, checkOutTime, graceMinutes, active };
    try {
      if (editingId) {
        await updateAttendanceConfig(editingId, payload);
        setMessage("Attendance config updated.");
      } else {
        await createAttendanceConfig(payload);
        setMessage("Attendance config added.");
        setName("");
      }
      await load();
      setShowPopup(false);
    } catch {
      setMessage("Could not save attendance config.");
    }
  }

  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Configuration</span>
          <h1 className="crm-page-title">Attendance</h1>
          <p className="crm-page-toolbar__hint" title="Define attendance timing windows and grace limits for sales governance.">
            Check-in / check-out windows and grace minutes
          </p>
        </div>
        <div className="crm-page-toolbar__controls">
          <button type="button" className="btn-primary btn-primary--compact" onClick={startAdd}>
            Add policy
          </button>
        </div>
      </div>

      <section className="card crm-table-card">
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Grace</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.checkInTime}</td>
                  <td>{r.checkOutTime}</td>
                  <td>{r.graceMinutes} min</td>
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
                  <td colSpan={6} className="crm-muted">
                    No attendance policies yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={showPopup} onClose={() => setShowPopup(false)} title={editingId ? "Edit policy" : "Add policy"}>
        <form className="crm-master-form crm-master-form--stacked" onSubmit={onSubmit}>
          <TextField label="Policy name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Check-in" type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} required />
          <TextField label="Check-out" type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} required />
          <TextField
            label="Grace (minutes)"
            type="number"
            min={0}
            max={300}
            value={graceMinutes}
            onChange={(e) => setGraceMinutes(Number(e.target.value))}
            required
          />
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
