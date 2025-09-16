import { useState } from "react";
import { api } from "../api.js";

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return;
    const res = await api.uploadFile(file);
    setStatus(res);
    onUploaded?.(res);
  }

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form-field">
        <label className="label">Upload CSV/XLSX</label>
        <input className="input" type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="form-helper">Max 10MB. Columns: date, facility, activity, amount, unit.</div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-primary" disabled={!file}>
          Upload
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setFile(null)}>Clear</button>
      </div>
      {status && (
        <div className="form-helper">
          Inserted {status.inserted} rows. Errors: {status.errors?.length ?? 0}
        </div>
      )}
    </form>
  );
}

