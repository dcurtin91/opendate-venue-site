export default function Loading() {
  return (
    <div className="loading">
      <div className="loading-spinner" />
      <p>Loading events...</p>
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <p>Something went wrong</p>
      <p className="error-detail">{message}</p>
    </div>
  );
}
