export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Windows Campus Creator Tour. Powered by{" "}
          <a href="https://opendate.io" target="_blank" rel="noopener noreferrer">
            Opendate
          </a>
        </p>
      </div>
    </footer>
  );
}
