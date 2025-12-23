import { useState } from "react";

export default function AISummarizer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSummarize() {
    setErr("");
    setSummary("");
    if (!file) return setErr("Please upload a PDF or TXT file.");

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/summarize", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setSummary(data.summary);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>AI Lecture Summarizer</h2>
      <p className="muted">Upload a lecture file (PDF/TXT) and get a study summary.</p>

      <div className="card" style={{ marginTop: 12 }}>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <button className="btn btn-primary" onClick={handleSummarize} disabled={loading}>
            {loading ? "Summarizing..." : "Summarize"}
          </button>
          {file && <span className="muted">{file.name}</span>}
        </div>

        {err && <div style={{ marginTop: 12, color: "#fb7185" }}>{err}</div>}

        {summary && (
          <pre
            style={{
              marginTop: 12,
              whiteSpace: "pre-wrap",
              background: "rgba(2,6,23,0.55)",
              padding: 14,
              borderRadius: 14,
              border: "1px solid rgba(148,163,184,0.2)",
            }}
          >
            {summary}
          </pre>
        )}
      </div>
    </div>
  );
}
