import { Link } from "react-router-dom";
import { formatDate, formatTime, getMonthDay } from "../lib/format";

export default function EventCard({ event }) {
  const { month, day } = getMonthDay(event.start_time);
  const supportActs = event.performers
    ?.filter((p) => p.act_type !== "primary")
    .map((p) => p.name)
    .join(", ");

  return (
    <Link to={`/events/${event.id}`} className="event-card">
      <div className="event-card-image">
        {event.compressed_main_event_image_url ? (
          <img
            src={event.compressed_main_event_image_url}
            alt={event.title}
            loading="lazy"
          />
        ) : (
          <div className="event-card-image-placeholder">
            <span>{month}</span>
            <span className="event-card-image-day">{day}</span>
          </div>
        )}
        {event.sold_out && <span className="event-card-badge sold-out">Sold Out</span>}
        {event.canceled_at && <span className="event-card-badge canceled">Canceled</span>}
      </div>

      <div className="event-card-content">
        <div className="event-card-date">
          <span className="event-card-month">{month}</span>
          <span className="event-card-day">{day}</span>
        </div>

        <div className="event-card-info">
          <h3 className="event-card-title">{event.title}</h3>
          {supportActs && (
            <p className="event-card-support">with {supportActs}</p>
          )}
          <div className="event-card-meta">
            <span>
              {formatDate(event.start_time)} &middot; {formatTime(event.start_time)}
            </span>
            {event.venue && (
              <span className="event-card-venue">{event.venue.name}</span>
            )}
          </div>
        </div>
      </div>

      {event.tags && event.tags.length > 0 && (
        <div className="event-card-tags">
          {event.tags.slice(0, 3).map((tag) => (
            <span key={tag.id} className="tag">
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
