import { Link } from "react-router-dom";
import { formatDate, formatTime, getMonthDay } from "../lib/format";

const VENUE_OVERRIDES = {
  showcase: { name: "The Showcase Room @ Culinary Drop Out", address: "129 S Farmer Ave, Tempe, AZ, 85281" },
  ackerman: { name: "Ackerman Hall", address: "308 Westwood Plaza, Los Angeles, CA, 90024" },
  houston: { name: "Houston Room", address: "4100 University Dr, Houston, TX, 77004" },
  uc: { name: "The UC Theatre", address: "2036 University Avenue, Berkeley, CA, 94704" },
  lakeside: { name: "Lakeside Village Auditorium", address: "1280 Stanford Dr, Coral Gables, FL, 33146" },
};

export default function EventCard({ event }) {
  const { month, day } = getMonthDay(event.start_time);
  const supportActs = event.performers
    ?.filter((p) => p.act_type !== "primary")
    .map((p) => p.name)
    .join(", ");

  const venueTag = Object.keys(VENUE_OVERRIDES).find((tag) =>
    event.tags?.some((t) => t.name.toLowerCase() === tag)
  );
  const venueName = venueTag ? VENUE_OVERRIDES[venueTag].name : event.venue?.name;

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
              {event.end_time && ` - ${formatTime(event.end_time)}`}
            </span>
            {venueName && (
              <span className="event-card-venue">{venueName}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
