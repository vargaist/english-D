import useSWR from "swr";
import Layout from "../components/Layout";
import { fetcher } from "../lib/api";

export default function Properties() {
  const { data, error } = useSWR("/properties/", fetcher);
  const rows = data?.results || data || [];

  return (
    <Layout title="Properties">
      {error && <div className="alert">Failed to load.</div>}
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Address</th><th>Rooms</th><th>Status</th><th>Currency</th></tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.address}</td>
              <td>{p.room_count}</td>
              <td><span className={`badge ${p.status === "active" ? "ok" : "muted"}`}>{p.status}</span></td>
              <td>{p.currency}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="5" className="empty">No properties yet.</td></tr>}
        </tbody>
      </table>
    </Layout>
  );
}
