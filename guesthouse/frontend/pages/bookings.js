import useSWR from "swr";
import Layout from "../components/Layout";
import { fetcher, fmtMoney, fmtDate } from "../lib/api";

export default function Bookings() {
  const { data } = useSWR("/bookings/?ordering=-check_in", fetcher);
  const rows = data?.results || data || [];
  return (
    <Layout title="Bookings">
      <div className="toolbar">
        <button className="btn" disabled>Add booking (TODO: form)</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Guest</th><th>Property</th><th>Source</th>
            <th>Check-in</th><th>Check-out</th><th>Nights</th>
            <th>Gross</th><th>Profit (est.)</th><th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id}>
              <td>{b.guest_name}</td>
              <td>{b.property_name}</td>
              <td>{b.source_label}</td>
              <td>{fmtDate(b.check_in)}</td>
              <td>{fmtDate(b.check_out)}</td>
              <td>{b.nights}</td>
              <td>{fmtMoney(b.gross_value, b.currency)}</td>
              <td>{fmtMoney(b.estimated_profit, b.currency)}</td>
              <td>
                <span className={`badge ${b.payment_status === "paid" ? "ok" : b.payment_status === "pending" ? "warn" : "muted"}`}>
                  {b.payment_status}
                </span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="9" className="empty">No bookings.</td></tr>}
        </tbody>
      </table>
    </Layout>
  );
}
