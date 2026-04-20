import { useEffect, useState } from "react";
import { createEmployee, listEmployees, updateEmployee } from "../../api/configApi";
import type { EmployeeDto } from "../../api/types";
import { Button } from "../../components/ui/Button";
import { CheckboxField } from "../../components/ui/CheckboxField";
import { Modal } from "../../components/ui/Modal";
import { TextField } from "../../components/ui/TextField";

export function EmployeesPage() {
  const [rows, setRows] = useState<EmployeeDto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [managerEmpCode, setManagerEmpCode] = useState("");
  const [unavailableFrom, setUnavailableFrom] = useState("");
  const [unavailableTo, setUnavailableTo] = useState("");
  const [active, setActive] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    try {
      setRows(await listEmployees());
      setMessage(null);
    } catch {
      setMessage("Could not load employees.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function autoCodeFromName(value: string): string {
    return value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40);
  }

  function startAdd() {
    setEditingId(null);
    setShowPopup(true);
    setCode("");
    setName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setDesignation("");
    setManagerEmpCode("");
    setUnavailableFrom("");
    setUnavailableTo("");
    setActive(true);
  }

  function startEdit(e: EmployeeDto) {
    setEditingId(e.id);
    setShowPopup(true);
    setCode(e.code);
    setName(e.name);
    setEmail(e.email);
    setPhone(e.phone ?? "");
    setDepartment(e.department ?? "");
    setDesignation(e.designation ?? "");
    setManagerEmpCode(e.managerEmpCode ?? "");
    setUnavailableFrom(e.unavailableFrom ?? "");
    setUnavailableTo(e.unavailableTo ?? "");
    setActive(e.active);
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const payload: Omit<EmployeeDto, "id"> = {
      code: editingId ? code.trim() : autoCodeFromName(name),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      department: department.trim() || null,
      designation: designation.trim() || null,
      managerEmpCode: managerEmpCode.trim() || null,
      unavailableFrom: unavailableFrom || null,
      unavailableTo: unavailableTo || null,
      active,
    };
    try {
      if (editingId) {
        await updateEmployee(editingId, payload);
        setMessage("Employee updated.");
      } else {
        await createEmployee(payload);
        setMessage("Employee created.");
      }
      await load();
      setShowPopup(false);
    } catch {
      setMessage("Could not save employee.");
    }
  }

  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Configuration</span>
          <h1 className="crm-page-title">Employees</h1>
          <p className="crm-page-toolbar__hint" title="Employee id is used for lead creator ownership and lead assignment routing.">
            Lead ownership and assignment by employee id
          </p>
        </div>
        <div className="crm-page-toolbar__controls">
          <button type="button" className="btn-primary btn-primary--compact" onClick={startAdd}>
            Add employee
          </button>
        </div>
      </div>

      <section className="card crm-table-card">
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Manager</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.code}</td>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.department ?? "—"}</td>
                  <td>{r.managerEmpCode ?? "—"}</td>
                  <td>{r.active ? "Active" : "Inactive"}</td>
                  <td>
                    <button type="button" className="crm-ghost-button" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={showPopup} onClose={() => setShowPopup(false)} title={editingId ? "Edit employee" : "Add employee"}>
        <form className="crm-master-form crm-master-form--stacked" onSubmit={onSubmit}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          <TextField
            label="Employee ID"
            value={editingId ? code : autoCodeFromName(name)}
            onChange={(e) => setCode(e.target.value)}
            readOnly={!editingId}
            required
          />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <TextField label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          <TextField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} autoComplete="organization" />
          <TextField label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
          <TextField label="Manager employee ID" value={managerEmpCode} onChange={(e) => setManagerEmpCode(e.target.value)} />
          <TextField label="Unavailable from" type="date" value={unavailableFrom} onChange={(e) => setUnavailableFrom(e.target.value)} />
          <TextField label="Unavailable to" type="date" value={unavailableTo} onChange={(e) => setUnavailableTo(e.target.value)} />
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
