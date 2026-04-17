import useSWR from "swr";
import Layout from "../components/Layout";
import { fetcher } from "../lib/api";

export default function Rooms() {
  const { data } = useSWR("/rooms/", fetcher);
  const rows = data?.results || data || [];
  return (
    <Layout title="Rooms">
      <table className="table">
        <thead>
          <tr><th>Property</th><th>Room</th><th>Type</th><th>Capacity</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.property_name}</td>
              <td>{r.name}</td>
              <td>{r.room_type}</td>
              <td>{r.capacity}</td>
              <td><span className={`badge ${r.active ? "ok" : "muted"}`}>{r.active ? "active" : "inactive"}</span></td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="5" className="empty">No rooms.</td></tr>}
        </tbody>
      </table>
    </Layout>
  );
}
