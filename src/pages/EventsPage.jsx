import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";
import Pagination from "../components/Pagination";
import Loading, { ErrorMessage } from "../components/Loading";

export default function EventsPage({ past = false }) {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useEvents({ page, past });

  return (
    <div className="events-page">
      {past ? (
        <section className="hero">
          <div className="container">
            <h1>Past Events</h1>
            <p className="hero-subtitle">Look back at our previous shows</p>
          </div>
        </section>
      ) : (
        <section className="tour-intro">
          <div className="container">
            <img src="/windows11-logo.svg" alt="Windows 11" className="tour-intro-logo" />
            <h1 className="tour-intro-heading">Windows Campus Creator Tour</h1>
            <p className="tour-intro-body">
              Most campus tours tell you what to think. We're here to show you
              how to build. Windows Campus Creator Tour is a 5-city campus
              takeover designed to bridge the gap between your degree and your
              digital future. Each stop features a heavyweight creator in a
              fireside-style conversation. No PR-polished scripts here, just
              transparent insights into the breakthroughs, the failures, and the
              real-world hustle of the creator economy.
            </p>
            <div className="tour-intro-cta">
              <p className="tour-intro-cta-label">Catch the Tour</p>
              <p className="tour-intro-cta-sub">
                5 Stops. Unlimited Potential. Is your campus on the list?
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="events-section">
        <div className="container">
          {loading && <Loading />}
          {error && <ErrorMessage message={error.message} />}

          {data && data.collection && (
            <>
              {data.collection.length === 0 ? (
                <div className="empty-state">
                  <p>{past ? "No past events to show." : "No upcoming events at this time. Check back soon!"}</p>
                </div>
              ) : (
                <>
                  <div className="events-grid">
                    {data.collection.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                  <Pagination
                    currentPage={data.current_page}
                    totalPages={data.total_pages}
                    onPageChange={setPage}
                  />
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
