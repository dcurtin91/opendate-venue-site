import { useParams, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useEvent } from "../hooks/useEvents";
import { formatFullDate, formatTime, getPrimaryPerformer, getSupportPerformers } from "../lib/format";
import Loading, { ErrorMessage } from "../components/Loading";

export default function EventDetailPage() {
  const { id } = useParams();
  const { data: event, loading, error } = useEvent(id);
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (!event || event.sold_out || event.canceled_at) return;

    const iframeId = `od-confirm-${id}-iframe`;

    if (!document.querySelector('script[src*="od_embed.js"]')) {
      const embedScript = document.createElement("script");
      embedScript.src = "https://app.opendate.io/packs/od_embed.js";
      document.body.appendChild(embedScript);
    }

    const timer = setTimeout(() => {
      if (window.ODEmbed) {
        window.ODEmbed(iframeId);
      }
    }, 500);

    // Listen for order completion from the checkout iframe
    const params = new URLSearchParams(window.location.search);
    const handleMessage = (msg) => {
      if (msg.data?.from !== "WebOrderForm.jsx") return;

      if (msg.data.command === "ga.purchase") {
        const orderData = {
          event_id: id,
          event_title: event.title,
          transaction_id: msg.data.data.transaction_id,
          total: msg.data.data.value,
          currency: msg.data.data.currency,
          source_url: window.location.href,
          affiliate: params.get("affiliate_link") || params.get("utm_source") || null,
          timestamp: new Date().toISOString(),
        };

        console.log("[Affiliate Conversion]", orderData);

        fetch("https://opendate.app.n8n.cloud/webhook/ef07acc5-ff0e-48f9-bdc8-a83ab0eb2db0", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", handleMessage);
    };
  }, [id, event]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!event) return null;

  const primary = getPrimaryPerformer(event);
  const support = getSupportPerformers(event);

  return (
    <div className="event-detail">
      <div className="event-detail-hero">
        <div className="event-detail-hero-overlay">
          <div className="container">
            <Link to="/" className="back-link">&larr; All Events</Link>
            <h1>{event.title}</h1>
            {event.presenter && <p className="event-presenter">Presented by {event.presenter}</p>}
          </div>
        </div>
      </div>

      <div className="container event-detail-body">
        <div className="event-detail-main">
          {/* Date & Time */}
          <section className="event-section">
            <h2>Date & Time</h2>
            <div className="event-datetime">
              <p className="event-date">{formatFullDate(event.start_time)}</p>
              <p>{formatTime(event.start_time)}</p>
            </div>
          </section>

          {/* Performers */}
          {event.performers && event.performers.length > 0 && (
            <section className="event-section">
              <h2>Lineup</h2>
              <div className="performers-list">
                {primary && (
                  <div className="performer primary-performer">
                    {primary.image_url && (
                      <img src={primary.image_url} alt={primary.name} className="performer-img" />
                    )}
                    <div>
                      <h3>{primary.name}</h3>
                      <span className="performer-type">Headliner</span>
                    </div>
                  </div>
                )}
                {support.map((performer) => (
                  <div key={performer.id} className="performer">
                    {performer.image_url && (
                      <img src={performer.image_url} alt={performer.name} className="performer-img" />
                    )}
                    <div>
                      <h3>{performer.name}</h3>
                      <span className="performer-type">Support</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <section className="event-section">
              <div className="event-tags">
                {event.tags.map((tag) => (
                  <span key={tag.id} className="tag">{tag.name}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="event-detail-sidebar">
          <div className="ticket-card">
            {event.compressed_main_event_image_url && (
              <img
                src={event.compressed_main_event_image_url}
                alt={event.title}
                className="ticket-card-img"
              />
            )}
            {event.sold_out ? (
              <div className="ticket-sold-out">Sold Out</div>
            ) : event.canceled_at ? (
              <div className="ticket-canceled">Event Canceled</div>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => checkoutRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                RSVP
              </button>
            )}

          </div>

          {/* Venue Info */}
          {event.venue && (
            <div className="venue-card">
              <h3>{event.venue.name}</h3>
              <p>{event.venue.address_from_components}</p>
              {event.venue.phone && <p>{event.venue.phone}</p>}
              {event.venue.website && (
                <a href={event.venue.website} target="_blank" rel="noopener noreferrer">
                  Venue Website
                </a>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Checkout Widget */}
      {!event.sold_out && !event.canceled_at && (
        <div ref={checkoutRef} className="container checkout-section">
          <h2 className="checkout-heading">RSVP</h2>
          <div className="checkout-alert">
            <strong>Note:</strong> There is a limit of one RSVP per person. You must use a valid .edu email address to register.
          </div>
          <div className="checkout-embed">
            <iframe
              src={`https://app.opendate.io/confirms/${id}/web_orders/new?parent_url=${encodeURIComponent(window.location.href)}`}
              id={`od-confirm-${id}-iframe`}
              title={event.title}
              scrolling="no"
              allowpaymentrequest="true"
              style={{ border: "none", width: "1px", minWidth: "100%", height: "600px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
