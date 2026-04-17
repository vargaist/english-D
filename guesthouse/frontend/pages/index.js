import useSWR from "swr";
import Layout from "../components/Layout";
import { fetcher, fmtMoney, fmtDate } from "../lib/api";

export default function Dashboard() {
  const { data, error } = useSWR("/dashboard/", fetcher);

  if (error) return <Layout title="Dashboard"><div className="alert">Failed to load dashboard.</div></Layout>;
  if (!data) return <Layout title="Dashboard"><div className="empty">Loading…</div></Layout>;

  return (
    <Layout title="Dashboard">
      {data.alerts?.length > 0 && (
        <div className="alert">
          {data.alerts.map((a, i) => (
            <div key={i}>
              {a.type === "missing_payout" && <>⚠️ {a.count} completed booking(s) without a payout marked.</>}
              {a.type === "overdue_task" && <>⏰ {a.count} overdue task(s).</>}
            </div>
          ))}
        </div>
      )}

      <div className="cards">
        <Card label="Arrivals today" value={data.arrivals.length} />
        <Card label="Departures today" value={data.departures.length} />
        <Card label="Occupied tonight" value={data.occupied_tonight} />
        <Card label="Bookings this month" value={data.bookings_this_month} />
        <Card label="Revenue (month)" value={fmtMoney(data.gross_revenue_month)} />
        <Card label="Expenses (month)" value={fmtMoney(data.expense_total_month)} />
        <Card label="Profit (month)" value={fmtMoney(data.estimated_profit_month)} />
      </div>

      <div className="section">
        <h2>Occupancy by property</h2>
        <table className="table">
          <thead>
            <tr><th>Property</th><th>Total rooms</th><th>Occupied</th><th>Occupancy</th></tr>
          </thead>
          <tbody>
            {data.occupancy_by_property.map((p) => (
              <tr key={p.property_id}>
                <td>{p.property_name}</td>
                <td>{p.total_rooms}</td>
                <td>{p.occupied_rooms}</td>
                <td>{p.occupancy_pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>Pending tasks</h2>
        {data.pending_tasks.length === 0 ? (
          <div className="empty">Nothing pending. Nice.</div>
        ) : (
          <table className="table">
            <thead><tr><th>Type</th><th>Property</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>
              {data.pending_tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.task_type}</td>
                  <td>{t.property_name}</td>
                  <td>{fmtDate(t.due_date)}</td>
                  <td><span className="badge muted">{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="section">
        <h2>Recent expenses</h2>
        <table className="table">
          <thead><tr><th>Date</th><th>Property</th><th>Category</th><th>Amount</th></tr></thead>
          <tbody>
            {data.recent_expenses.map((e) => (
              <tr key={e.id}>
                <td>{fmtDate(e.date)}</td>
                <td>{e.property_name}</td>
                <td>{e.category_label}</td>
                <td>{fmtMoney(e.amount, e.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

function Card({ label, value }) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
