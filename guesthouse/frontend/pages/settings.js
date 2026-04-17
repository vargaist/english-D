import Layout from "../components/Layout";

export default function Settings() {
  return (
    <Layout title="Settings">
      <div className="card">
        <div className="label">Owner</div>
        <div className="value">Single-user MVP</div>
        <p style={{ color: "var(--muted)", marginTop: 10 }}>
          Multi-user, roles, Airbnb iCal sync, invoice uploads and Romanian tax exports
          are planned. Edit <code>/api/booking-sources/</code> and
          <code>/api/expense-categories/</code> via the Django admin for now
          (<a href="http://localhost:8000/admin/">/admin</a>).
        </p>
      </div>
    </Layout>
  );
}
