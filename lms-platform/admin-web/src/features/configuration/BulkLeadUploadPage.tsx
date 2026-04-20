import { useEffect, useMemo, useState } from "react";
import { createBulkUploadJob, listBulkUploadJobs } from "../../api/configApi";
import {
  BulletList,
  Button,
  Card,
  FileUploadField,
  InlineAlert,
  PageHeader,
  Text,
} from "../../components/ui";
import { buildLeadImportTemplateCsv, buildLeadImportTemplateExcel, triggerCsvDownload, triggerExcelDownload } from "../leads/leadCsvExport";
import { validateLeadCsv, type BulkValidationResult } from "./leadBulkUploadValidation";

export function BulkLeadUploadPage() {
  const [fileName, setFileName] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [validation, setValidation] = useState<BulkValidationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [jobs, setJobs] = useState<Array<{ id: number; fileName: string; status: string; createdAt: string }>>([]);

  const acceptedExtensions = useMemo(() => [".csv", ".xlsx", ".xls"], []);

  async function loadJobs() {
    try {
      const rows = await listBulkUploadJobs();
      setJobs(rows.map((r) => ({ id: r.id, fileName: r.fileName, status: r.status, createdAt: r.createdAt })).slice(0, 10));
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    void loadJobs();
  }, []);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) {
      setFileName("");
      setValidation(null);
      setMessage(null);
      return;
    }
    setFileName(f.name);
    const extension = f.name.split(".").pop()?.toLowerCase();
    if (extension !== "csv") {
      setValidation(null);
      setMessage("Excel upload endpoint will be wired server-side. For preview/validation, upload CSV now.");
      return;
    }

    setBusy(true);
    try {
      const text = await f.text();
      const result = validateLeadCsv(text);
      setValidation(result);
      await createBulkUploadJob({
        fileName: f.name,
        fileType: extension.toUpperCase(),
        status: result.rowErrors.length > 0 || result.missingRequiredColumns.length > 0 ? "VALIDATION_FAILED" : "VALIDATED",
        totalRows: result.rows.length,
        successRows: Math.max(0, result.rows.length - result.rowErrors.length),
        errorRows: result.rowErrors.length,
      });
      await loadJobs();
      if (result.rowErrors.length || result.missingRequiredColumns.length || result.unknownColumns.length) {
        setMessage("Validation found issues. Fix and re-upload.");
      } else {
        setMessage("CSV looks good. Ready for backend ingestion endpoint.");
      }
    } catch {
      setValidation(null);
      setMessage("Could not read file. Please try another CSV.");
    } finally {
      setBusy(false);
    }
  }

  function onDownloadSample() {
    triggerCsvDownload("lead-bulk-upload-sample.csv", buildLeadImportTemplateCsv());
  }

  function onDownloadExcelSample() {
    triggerExcelDownload("lead-bulk-upload-sample.xls", buildLeadImportTemplateExcel());
  }

  return (
    <div className="crm-page crm-page--dense">
      <PageHeader
        variant="dense"
        eyebrow="Configuration"
        title="Bulk lead upload"
        subtitle="CSV / Excel · use sample template for column mapping"
      />

      <Card tone="configPanel">
        <header className="crm-config-panel-header">
          <Text as="h2" variant="panelHeader">
            Upload file
          </Text>
          <Text as="p" variant="panelHeaderLead">
            Supported formats: CSV, XLSX, XLS. CSV gets client-side preview and validation based on your configured required fields.
          </Text>
        </header>

        <div className="crm-bulk-upload-toolbar">
          <div className="crm-bulk-upload-toolbar__file">
            <FileUploadField
              id="lead-bulk-upload-file"
              label="Choose file"
              accept={acceptedExtensions.join(",")}
              onChange={onPickFile}
              disabled={busy}
              aria-label="Upload lead file"
            />
          </div>
          <div className="crm-bulk-upload-toolbar__actions">
            <Button type="button" variant="ghost" onClick={onDownloadSample}>
              Download sample CSV
            </Button>
            <Button type="button" variant="ghost" onClick={onDownloadExcelSample}>
              Download sample Excel
            </Button>
          </div>
        </div>

        <div className="crm-bulk-upload-status" role="status">
          {fileName ? (
            <>
              Selected: <strong>{fileName}</strong>
            </>
          ) : (
            "No file selected yet."
          )}
        </div>

        {message ? <InlineAlert>{message}</InlineAlert> : null}

        {validation ? (
          <div className="crm-bulk-validation">
            <div className="crm-two-col">
              <Card tone="panel" className="crm-panel">
                <Text as="h3" variant="sectionHeading">
                  Validation summary
                </Text>
                <BulletList>
                  <li>Total rows detected: {validation.rows.length}</li>
                  <li>Missing required columns: {validation.missingRequiredColumns.length}</li>
                  <li>Unknown columns: {validation.unknownColumns.length}</li>
                  <li>Row-level errors: {validation.rowErrors.length}</li>
                </BulletList>
              </Card>
              <Card tone="panel" className="crm-panel">
                <Text as="h3" variant="sectionHeading">
                  Header checks
                </Text>
                <BulletList>
                  {validation.missingRequiredColumns.length > 0 ? (
                    <li>Missing required: {validation.missingRequiredColumns.join(", ")}</li>
                  ) : (
                    <li>No required columns missing.</li>
                  )}
                  {validation.unknownColumns.length > 0 ? <li>Unknown columns: {validation.unknownColumns.join(", ")}</li> : <li>No unknown columns found.</li>}
                </BulletList>
              </Card>
            </div>

            {validation.rowErrors.length > 0 ? (
              <Card tone="panel" className="crm-panel">
                <Text as="h3" variant="sectionHeading">
                  Row issues
                </Text>
                <BulletList>
                  {validation.rowErrors.slice(0, 15).map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                  {validation.rowErrors.length > 15 ? <li>...and {validation.rowErrors.length - 15} more</li> : null}
                </BulletList>
              </Card>
            ) : null}

            <Card tone="panel" className="crm-panel">
              <Text as="h3" variant="sectionHeading">
                Preview (first 10 rows)
              </Text>
              {validation.rows.length === 0 ? (
                <Text variant="muted">No data rows found.</Text>
              ) : (
                <div className="crm-table-wrap">
                  <table className="crm-table">
                    <thead>
                      <tr>
                        {validation.headers.map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {validation.rows.slice(0, 10).map((row, i) => (
                        <tr key={`preview-row-${i}`}>
                          {validation.headers.map((h, idx) => (
                            <td key={`${h}-${idx}`}>{row[idx] ?? ""}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </Card>

      <Card tone="panel" className="crm-panel">
        <Text as="h3" variant="sectionHeading">
          Recent upload audits
        </Text>
        <BulletList>
          {jobs.map((j) => (
            <li key={j.id}>
              {j.fileName} — {j.status} — {new Date(j.createdAt).toLocaleString()}
            </li>
          ))}
          {jobs.length === 0 ? <li>No upload jobs yet.</li> : null}
        </BulletList>
      </Card>
    </div>
  );
}
