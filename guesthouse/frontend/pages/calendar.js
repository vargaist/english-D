import { useMemo, useState } from "react";
import useSWR from "swr";
import Layout from "../components/Layout";
import { fetcher, fmtDate } from "../lib/api";

// Simple 30-day grid: rooms x days. Enough for an owner to eyeball availability.
export default function Calendar() {
  const [start, setStart] = useState(() => new Date().toISOString().slice(0, 10));
  const end = useMemo(() => {
    const d = new Date(start);
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  }, [start]);

  const { data: rooms } = useSWR("/rooms/?active=true", fetcher);
  const { data: bookings } = useSWR(`/bookings/?start=${start}&end=${end}`, fetcher);

  const roomList = rooms?.results || rooms || [];
  const bookingList = bookings?.results || bookings || [];

  const days = useMemo(() => {
    const out = [];
    const d = new Date(start);
    for (let i = 0; i < 30; i++) {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + i);
      out.push(copy.toISOString().slice(0, 10));
    }
    return out;
  }, [start]);

  // index bookings by room+day
  const cells = useMemo(() => {
    const map = {};
    for (const b of bookingList) {
      for (const r of b.rooms || []) {
        const ci = new Date(b.check_in);
        const co = new Date(b.check_out);
        for (let d = new Date(ci); d < co; d.setDate(d.getDate() + 1)) {
          const key = `${r.room}_${d.toISOString().slice(0, 10)}`;
          map[key] = b;
        }
      }
    }
    return map;
  }, [bookingList]);

  return (
    <Layout title="Calendar (30-day view)">
      <div className="toolbar">
        <label>Start: <input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <span style={{ color: "var(--muted)" }}>through {fmtDate(end)}</span>
      </div>
      <div style={{ overflowX: "auto", background: "#fff", border: "1px solid var(--border)", borderRadius: 10 }}>
        <table style={{ borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ position: "sticky", left: 0, background: "#f3f4f6", padding: "8px 12px", textAlign: "left", minWidth: 160 }}>Room</th>
              {days.map((d) => (
                <th key={d} style={{ padding: "6px 4px", borderLeft: "1px solid var(--border)", background: "#f3f4f6", minWidth: 28, fontWeight: 500 }}>
                  {new Date(d).getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roomList.map((r) => (
              <tr key={r.id}>
                <td style={{ position: "sticky", left: 0, background: "#fff", padding: "6px 12px", borderTop: "1px solid var(--border)" }}>
                  {r.property_name} · {r.name}
                </td>
                {days.map((d) => {
                  const b = cells[`${r.id}_${d}`];
                  return (
                    <td key={d} title={b ? `${b.guest_name} (${b.source_label})` : ""}
                        style={{
                          borderTop: "1px solid var(--border)",
                          borderLeft: "1px solid var(--border)",
                          background: b ? "var(--brand-soft)" : "#fff",
                          height: 24,
                        }} />
                  );
                })}
              </tr>
            ))}
            {roomList.length === 0 && <tr><td className="empty" colSpan={days.length + 1}>No rooms.</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
