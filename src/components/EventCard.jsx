import { Link } from "react-router-dom";
import { formatDate, formatTime, getMonthDay } from "../lib/format";

const SOLD_OUT_OVERRIDES = new Set(["688023"]);

const VENUE_OVERRIDES = {
  showcase: { name: "The Showcase Room @ Culinary Drop Out", cityState: "Tempe, AZ", tz: "America/Phoenix" },
  royce: { name: "Royce Hall", cityState: "Los Angeles, CA", tz: "America/Los_Angeles" },
  houston: { name: "Houston Room", cityState: "Houston, TX", tz: "America/Chicago" },
  uc: { name: "The UC Theatre", cityState: "Berkeley, CA", tz: "America/Los_Angeles" },
  lakeside: { name: "Watsco Center", cityState: "Coral Gables, FL", tz: "America/New_York" },
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
  const venueData = venueTag ? VENUE_OVERRIDES[venueTag] : null;
  const venueName = venueData ? venueData.name : event.venue?.name;
  const venueTz = venueData?.tz;
  const isShowcase = event.tags?.some((t) => t.name.toLowerCase() === "showcase");
  const isPast = event.start_time && new Date(event.start_time) < new Date();

  return (
    <Link to={`/events/${event.id}`} className={`event-card${isPast ? " is-past" : ""}`}>
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
        {!isPast && !isShowcase && venueTag !== "houston" && <span className="coming-soon-overlay">COMING SOON</span>}
        {isPast && <span className="event-card-badge past">Past Event</span>}
        {!isPast && (event.sold_out || SOLD_OUT_OVERRIDES.has(String(event.id))) && <span className="event-card-badge sold-out">Sold Out</span>}
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
              {formatDate(event.start_time)} &middot; {formatTime(event.start_time, venueTz)}
              {event.end_time && ` - ${formatTime(event.end_time, venueTz)}`}
            </span>
            {venueName && (
              <span className="event-card-venue">{venueName}</span>
            )}
            {venueData?.cityState && (
              <span className="event-card-city">{venueData.cityState}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
