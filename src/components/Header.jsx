import { Link } from "react-router-dom";

const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || "Venue";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="header-logo">
          {SITE_TITLE}
        </Link>
        <nav className="header-nav">
          <Link to="/">Events</Link>
          <Link to="/past">Past Events</Link>
        </nav>
      </div>
    </header>
  );
}
