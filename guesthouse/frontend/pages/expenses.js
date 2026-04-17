import useSWR from "swr";
import Layout from "../components/Layout";
import { fetcher, fmtMoney, fmtDate } from "../lib/api";

export default function Expenses() {
  const { data } = useSWR("/expenses/?ordering=-date", fetcher);
  const rows = data?.results || data || [];
  return (
    <Layout title="Expenses">
      <div className="toolbar">
        <button className="btn" disabled>Add expense (TODO)</button>
      </div>
      <table className="table">
        <thead>
          <tr><th>Date</th><th>Property</th><th>Category</th><th>Description</th><th>Supplier</th><th>Amount</th></tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <td>{fmtDate(e.date)}</td>
              <td>{e.property_name}</td>
              <td>{e.category_label}</td>
              <td>{e.description}</td>
              <td>{e.supplier}</td>
              <td>{fmtMoney(e.amount, e.currency)}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="6" className="empty">No expenses.</td></tr>}
        </tbody>
      </table>
    </Layout>
  );
}
