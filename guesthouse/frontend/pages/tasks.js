import useSWR, { mutate } from "swr";
import Layout from "../components/Layout";
import { api, fetcher, fmtDate } from "../lib/api";

export default function Tasks() {
  const { data } = useSWR("/tasks/", fetcher);
  const rows = data?.results || data || [];

  const toggle = async (t) => {
    const status = t.status === "completed" ? "pending" : "completed";
    const completed_date = status === "completed" ? new Date().toISOString().slice(0, 10) : null;
    await api(`/tasks/${t.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status, completed_date }),
    });
    mutate("/tasks/");
  };

  return (
    <Layout title="Tasks">
      <table className="table">
        <thead>
          <tr><th></th><th>Type</th><th>Property</th><th>Due</th><th>Status</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <td>
                <input type="checkbox" checked={t.status === "completed"} onChange={() => toggle(t)} />
              </td>
              <td>{t.task_type}</td>
              <td>{t.property_name}</td>
              <td>{fmtDate(t.due_date)}</td>
              <td>
                <span className={`badge ${t.status === "completed" ? "ok" : t.status === "pending" ? "warn" : "muted"}`}>
                  {t.status}
                </span>
              </td>
              <td>{t.notes}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="6" className="empty">No tasks.</td></tr>}
        </tbody>
      </table>
    </Layout>
  );
}
