import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="header-logo">
          Windows Campus Creator Tour
        </Link>
        <nav className="header-nav">
          <Link to="/">Events</Link>
          <Link to="/past">Past Events</Link>
        </nav>
      </div>
    </header>
  );
}
