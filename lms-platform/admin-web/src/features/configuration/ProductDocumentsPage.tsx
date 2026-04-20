import { useEffect, useState } from "react";
import { createProductDocument, listMaster, listProductDocuments, updateProductDocument } from "../../api/configApi";
import type { MasterDto, ProductDocumentDto } from "../../api/types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { SelectField } from "../../components/ui/SelectField";
import { TextField } from "../../components/ui/TextField";

export function ProductDocumentsPage() {
  const [docs, setDocs] = useState<ProductDocumentDto[]>([]);
  const [products, setProducts] = useState<MasterDto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productId, setProductId] = useState(0);
  const [documentName, setDocumentName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    try {
      const [d, p] = await Promise.all([listProductDocuments(), listMaster("/api/v1/config/products")]);
      setDocs(d);
      setProducts(p);
    } catch {
      setMessage("Could not load product document data.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function startEdit(d: ProductDocumentDto) {
    setShowPopup(true);
    setEditingId(d.id);
    setProductId(d.productId);
    setDocumentName(d.documentName);
    setDocumentUrl(d.documentUrl);
    setDocumentType(d.documentType ?? "");
  }

  function startAdd() {
    setShowPopup(true);
    setEditingId(null);
    setProductId(0);
    setDocumentName("");
    setDocumentUrl("");
    setDocumentType("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;
    const payload = { productId, documentName, documentUrl, documentType: documentType || null };
    try {
      if (editingId) {
        await updateProductDocument(editingId, payload);
        setMessage("Document updated.");
      } else {
        await createProductDocument(payload);
        setMessage("Document added.");
        setDocumentName("");
        setDocumentUrl("");
        setDocumentType("");
      }
      await load();
      setShowPopup(false);
    } catch {
      setMessage("Could not save product document.");
    }
  }

  const productLabel = (id: number) => products.find((p) => p.id === id)?.name ?? `#${id}`;

  return (
    <div className="crm-page crm-page--dense">
      <div className="crm-page-toolbar card">
        <div className="crm-page-toolbar__left">
          <span className="crm-page-toolbar__eyebrow">Configuration</span>
          <h1 className="crm-page-title">Product documents</h1>
          <p className="crm-page-toolbar__hint" title="One product can have multiple documents for policy, brochure, and compliance references.">
            Multiple docs per product (policy, brochure, compliance)
          </p>
        </div>
        <div className="crm-page-toolbar__controls">
          <button type="button" className="btn-primary btn-primary--compact" onClick={startAdd}>
            Add document
          </button>
        </div>
      </div>

      <section className="card crm-table-card">
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Document</th>
                <th>Type</th>
                <th>URL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id}>
                  <td>{productLabel(d.productId)}</td>
                  <td>{d.documentName}</td>
                  <td>{d.documentType ?? "—"}</td>
                  <td>{d.documentUrl}</td>
                  <td>
                    <button type="button" className="crm-ghost-button" onClick={() => startEdit(d)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="crm-muted">
                    No documents yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={showPopup} onClose={() => setShowPopup(false)} title={editingId ? "Edit document" : "Add document"}>
        <form className="crm-master-form crm-master-form--stacked" onSubmit={onSubmit}>
          <SelectField label="Product" value={productId} onChange={(e) => setProductId(Number(e.target.value))} required>
            <option value={0} disabled>
              Select product
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </SelectField>
          <TextField label="Document name" value={documentName} onChange={(e) => setDocumentName(e.target.value)} required />
          <TextField label="Document URL" type="url" value={documentUrl} onChange={(e) => setDocumentUrl(e.target.value)} required />
          <TextField label="Type" value={documentType} onChange={(e) => setDocumentType(e.target.value)} placeholder="PDF, URL, Doc…" />
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
