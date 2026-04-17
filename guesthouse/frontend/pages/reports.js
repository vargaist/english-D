import useSWR from "swr";
import Layout from "../components/Layout";
import { fetcher, fmtMoney } from "../lib/api";

export default function Reports() {
  const monthly = useSWR("/reports/monthly/?months=12", fetcher);
  const byProp = useSWR("/reports/by-property/", fetcher);
  const perBooking = useSWR("/reports/booking-profitability/", fetcher);

  return (
    <Layout title="Reports">
      <div className="section">
        <h2>Monthly revenue, expenses, profit</h2>
        <table className="table">
          <thead><tr><th>Month</th><th>Revenue</th><th>Commission</th><th>Expenses</th><th>Profit</th></tr></thead>
          <tbody>
            {(monthly.data || []).map((r) => (
              <tr key={r.month}>
                <td>{r.month}</td>
                <td>{fmtMoney(r.revenue)}</td>
                <td>{fmtMoney(r.commission)}</td>
                <td>{fmtMoney(r.expenses)}</td>
                <td>{fmtMoney(r.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>By property</h2>
        <table className="table">
          <thead><tr><th>Property</th><th>Bookings</th><th>Revenue</th><th>Commission</th><th>Expenses</th><th>Profit</th></tr></thead>
          <tbody>
            {(byProp.data || []).map((r) => (
              <tr key={r.property_id}>
                <td>{r.property_name}</td>
                <td>{r.bookings}</td>
                <td>{fmtMoney(r.revenue)}</td>
                <td>{fmtMoney(r.commission)}</td>
                <td>{fmtMoney(r.expenses)}</td>
                <td>{fmtMoney(r.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>Booking-level profitability</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Guest</th><th>Property</th><th>Check-in</th><th>Nights</th>
              <th>Gross</th><th>Commission</th><th>Linked costs</th><th>Profit (est.)</th>
            </tr>
          </thead>
          <tbody>
            {(perBooking.data || []).map((r) => (
              <tr key={r.id}>
                <td>{r.guest_name}</td>
                <td>{r.property_name}</td>
                <td>{r.check_in}</td>
                <td>{r.nights}</td>
                <td>{fmtMoney(r.gross_value)}</td>
                <td>{fmtMoney(r.commission)}</td>
                <td>{fmtMoney(r.linked_costs)}</td>
                <td>{fmtMoney(r.estimated_profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
