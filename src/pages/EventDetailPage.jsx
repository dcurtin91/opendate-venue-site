import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useEvent } from "../hooks/useEvents";
import { formatFullDate, formatTime, getPrimaryPerformer, getSupportPerformers } from "../lib/format";
import Loading, { ErrorMessage } from "../components/Loading";

function CreatorBio({ name, bioText }) {
  const [expanded, setExpanded] = useState(false);

  const fullText = bioText || `${name} is a Canadian creator, entrepreneur, actor, and media executive redefining what modern influence looks like. With a social audience of over 42 million, he first rose to prominence on TikTok and has since leveraged his platform into a multifaceted career spanning entertainment, business, and venture. ${name} is the co-founder of CrossCheck Studios, a Gen Z-focused media company built in partnership with Unrealistic Ideas, as well as Animal Capital, a venture fund investing in next-generation consumer and technology startups. He also played a key role in building one of the most successful creator-led podcasts, BFFs, helping shape the intersection of internet culture and mainstream media. Expanding into Hollywood, ${name} starred in A24's Dream Scenario alongside Nicolas Cage and led the viral sketch comedy series Read the Room, which generated over 60 million views in its first month. His work has earned recognition from Forbes 30 Under 30, Forbes Top Creators, Rolling Stone, Variety, and Business Insider. Known for his entrepreneurial drive and cultural impact, ${name} continues to bridge digital influence with traditional media, building brands and businesses that resonate with the next generation.`;

  const preview = fullText.slice(0, 150);

  return (
    <div>
      <h3 className="creator-name">{name}</h3>
      <div className="creator-bio">
        <p>{expanded ? fullText : `${preview}...`}</p>
        <button className="read-more-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : "Read more"}
        </button>
      </div>
    </div>
  );
}

const CREATOR_2_BIO = `Creator 2 is a leading social media and television personality and the founder and host of the hit podcast PlanBri Uncut. With a rare ability to connect with mass audiences across multiple demographics, she has built one of the most loyal followings in the media universe through her candor, sharp humor, and unfiltered perspective.\n\nIn 2025, Creator 2 appeared as a competitor on Season 4 of FOX's Special Forces: World's Toughest Test, where she spoke candidly about resilience, boundaries, and reclaiming her voice, finishing the competition as a runner-up. From 2020 to 2025, she also cohosted the juggernaut podcast BFFs alongside Josh Richards.\n\nOver the past year, Creator 2 has further distinguished herself by choosing transparency over silence, using her platform to advocate for honesty, empowerment, and the courage for women to share their stories and speak their truths.\n\nAn East Coast native, Creator 2 lives in New York City with her dog and two cats.`;

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

  const hasTag = (name) => event.tags?.some((t) => t.name.toLowerCase() === name);

  const venueOverrides = {
    showcase: { name: "The Showcase Room @ Culinary Drop Out", address: "129 S Farmer Ave, Tempe, AZ, 85281", tz: "America/Phoenix" },
    ackerman: { name: "Ackerman Hall", address: "308 Westwood Plaza, Los Angeles, CA, 90024", tz: "America/Los_Angeles" },
    houston: { name: "Houston Room", address: "4100 University Dr, Houston, TX, 77004", tz: "America/Chicago" },
    uc: { name: "The UC Theatre", address: "2036 University Avenue, Berkeley, CA, 94704", tz: "America/Los_Angeles" },
    lakeside: { name: "Lakeside Village Auditorium", address: "1280 Stanford Dr, Coral Gables, FL, 33146", tz: "America/New_York" },
  };

  const venueInfo = Object.keys(venueOverrides).reduce((found, tag) => found || (hasTag(tag) ? venueOverrides[tag] : null), null)
    || (event.venue ? { name: event.venue.name, address: event.venue.address_from_components } : null);

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
          {/* Date & Time + What to Expect */}
          <section className="event-section event-datetime-row">
            <div>
              <h2>Date & Time</h2>
              <div className="event-datetime">
                <p className="event-date">{formatFullDate(event.start_time)}</p>
                <p>{formatTime(event.start_time, venueInfo?.tz)}{event.end_time && ` - ${formatTime(event.end_time, venueInfo?.tz)}`}</p>
                {event.door_time && <p className="event-doors">Lines open at {formatTime(event.door_time, venueInfo?.tz)}</p>}
                {venueInfo && <p>{venueInfo.name}</p>}
                {venueInfo && <p>{venueInfo.address}</p>}
              </div>
            </div>
            <div className="expect-block">
              <h3 className="expect-heading">What to expect</h3>
              <ul className="expect-list">
                <li>Meet top creators</li>
                <li>Create content live</li>
                <li>Play + compete</li>
                <li>Participate in a live conversation with creators</li>
                <li>Enjoy light bites and refreshments</li>
              </ul>
            </div>
          </section>

          {/* Get to know Your Creator — showcase events only */}
          {event.tags?.some((t) => t.name.toLowerCase() === "showcase") && (
            <section className="event-section creator-section">
              <h3 className="creator-heading">Get to know Your Creator</h3>
              <div className="creator-card">
                {event.compressed_main_event_image_url && (
                  <img
                    src={event.compressed_main_event_image_url}
                    alt={event.title}
                    className="creator-img"
                  />
                )}
                <CreatorBio name={primary ? primary.name : event.title} />
              </div>
              {id === "688024" && (
                <div className="creator-card" style={{ marginLeft: 88, marginTop: 24 }}>
                  <CreatorBio name="Creator 2" bioText={CREATOR_2_BIO} />
                </div>
              )}
            </section>
          )}

          {/* Performers — non-showcase events */}
          {!event.tags?.some((t) => t.name.toLowerCase() === "showcase") && event.performers && event.performers.length > 0 && (
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


        </div>

        {/* Sidebar */}
        <aside className="event-detail-sidebar">
          <div className="ticket-card">
            <img
              src="/image (1).png"
              alt="Windows Campus Creator Tour"
              className="ticket-card-img"
            />
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
          {venueInfo && (
            <div className="venue-card">
              <h3>{venueInfo.name}</h3>
              <p>{venueInfo.address}</p>
            </div>
          )}
        </aside>
      </div>

      {/* Checkout Widget */}
      {!event.sold_out && !event.canceled_at && (
        <div ref={checkoutRef} className="container checkout-section">
          <h2 className="checkout-heading">RSVP</h2>
          <div className="checkout-alert">
            <strong>Note:</strong> There is a limit of one RSVP per person. You must use a valid <strong>.edu</strong> email address to register. <strong>Strict No Bags Policy.</strong> Limited Venue Capacity: Entry is first-come, first-served.
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
