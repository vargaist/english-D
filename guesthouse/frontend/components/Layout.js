import Link from "next/link";
import { useRouter } from "next/router";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/rooms", label: "Rooms" },
  { href: "/bookings", label: "Bookings" },
  { href: "/calendar", label: "Calendar" },
  { href: "/expenses", label: "Expenses" },
  { href: "/tasks", label: "Tasks" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export default function Layout({ children, title }) {
  const router = useRouter();
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Guesthouse</div>
        <nav>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={router.pathname === n.href ? "active" : ""}>
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="content">
        {title && <h1 className="h1">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
