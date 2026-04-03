const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || "Venue";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} {SITE_TITLE}. Powered by{" "}
          <a href="https://opendate.io" target="_blank" rel="noopener noreferrer">
            Opendate
          </a>
        </p>
      </div>
    </footer>
  );
}
