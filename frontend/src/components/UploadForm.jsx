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
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white" disabled={!file}>
        Upload
      </button>
      {status && (
        <div className="text-sm text-gray-600">
          Inserted {status.inserted} rows. Errors: {status.errors?.length ?? 0}
        </div>
      )}
    </form>
  );
}

