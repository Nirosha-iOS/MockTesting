import { useEffect, useState } from "react";
import { createMapping, deleteMapping, listMappings, listMaster } from "../../api/configApi";
import type { MappingDto, MasterDto } from "../../api/types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { SelectField } from "../../components/ui/SelectField";

interface Props {
  title: string;
  subtitle: string;
  mappingPath: string;
  leftMasterPath: string;
  leftLabel: string;
  leftKey: "verticalId" | "roleId";
  rightMasterPath: string;
  rightLabel: string;
  rightKey: "roleId" | "functionId";
}

export function MappingModulePage(props: Props) {
  const [rows, setRows] = useState<MappingDto[]>([]);
  const [leftItems, setLeftItems] = useState<MasterDto[]>([]);
  const [rightItems, setRightItems] = useState<MasterDto[]>([]);
  const [leftId, setLeftId] = useState<number>(0);
  const [rightId, setRightId] = useState<number>(0);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    try {
      const [mappings, left, right] = await Promise.all([
        listMappings(props.mappingPath),
        listMaster(props.leftMasterPath),
        listMaster(props.rightMasterPath),
      ]);
      setRows(mappings);
      setLeftItems(left);
      setRightItems(right);
    } catch {
      setMessage("Could not load mapping data.");
    }
  }

  useEffect(() => {
    void load();
  }, [props.mappingPath, props.leftMasterPath, props.rightMasterPath]);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!leftId || !rightId) return;
    try {
      await createMapping(props.mappingPath, { [props.leftKey]: leftId, [props.rightKey]: rightId });
      setMessage("Mapping added.");
      setLeftId(0);
      setRightId(0);
      await load();
      setShowPopup(false);
    } catch {
      setMessage("Could not create mapping.");
    }
  }

  async function onDelete(id: number) {
    try {
      await deleteMapping(`${props.mappingPath}/${id}`);
      setMessage("Mapping removed.");
      await load();
    } catch {
      setMessage("Could not remove mapping.");
    }
  }

  function labelFor(id: number | undefined, items: MasterDto[]): string {
    if (!id) return "—";
    return items.find((i) => i.id === id)?.name ?? `${id}`;
  }

  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Configuration</span>
          <h1 className="crm-page-title">{props.title}</h1>
          <p className="crm-page-toolbar__hint" title={props.subtitle}>
            {props.subtitle}
          </p>
        </div>
        <div className="crm-page-toolbar__controls">
          <button type="button" className="btn-primary btn-primary--compact" onClick={() => setShowPopup(true)}>
            Add mapping
          </button>
        </div>
      </div>

      <section className="card crm-table-card">
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>{props.leftLabel}</th>
                <th>{props.rightLabel}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{labelFor(r[props.leftKey], leftItems)}</td>
                  <td>{labelFor(r[props.rightKey], rightItems)}</td>
                  <td>
                    <button type="button" className="crm-ghost-button" onClick={() => void onDelete(r.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="crm-muted">
                    No mappings yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={showPopup} onClose={() => setShowPopup(false)} title="Add mapping">
        <form className="crm-master-form crm-master-form--stacked" onSubmit={onAdd}>
          <SelectField label={props.leftLabel} value={leftId} onChange={(e) => setLeftId(Number(e.target.value))}>
            <option value={0} disabled>
              Select…
            </option>
            {leftItems.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </SelectField>
          <SelectField label={props.rightLabel} value={rightId} onChange={(e) => setRightId(Number(e.target.value))}>
            <option value={0} disabled>
              Select…
            </option>
            {rightItems.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </SelectField>
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
