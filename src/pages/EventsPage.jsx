import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";
import Pagination from "../components/Pagination";
import Loading, { ErrorMessage } from "../components/Loading";

const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || "Venue";
const SITE_DESCRIPTION = import.meta.env.VITE_SITE_DESCRIPTION || "Live music and events";

export default function EventsPage({ past = false }) {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useEvents({ page, past });

  return (
    <div className="events-page">
      <section className="hero">
        <div className="container">
          <h1>{past ? "Past Events" : SITE_TITLE}</h1>
          <p className="hero-subtitle">
            {past ? "Look back at our previous shows" : SITE_DESCRIPTION}
          </p>
        </div>
      </section>

      <section className="container events-section">
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
      </section>
    </div>
  );
}
