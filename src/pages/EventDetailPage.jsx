import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useEvent } from "../hooks/useEvents";
import { formatFullDate, formatTime, getPrimaryPerformer, getSupportPerformers } from "../lib/format";
import Loading, { ErrorMessage } from "../components/Loading";
import PromoBanner from "../components/PromoBanner";

const CREATOR_1_BIO = `Josh Richards is a Canadian creator, entrepreneur, actor, and media executive redefining what modern influence looks like. With a social audience of over 42 million, he first rose to prominence on TikTok and has since leveraged his platform into a multifaceted career spanning entertainment, business, and venture.\n\nJosh is the co-founder of CrossCheck Studios, a Gen Z-focused media company, as well as Animal Capital, a venture fund investing in next-generation consumer and technology startups. He also played a key role in building one of the most successful creator-led podcasts, BFFs, helping shape the intersection of internet culture and mainstream media.\n\nExpanding into Hollywood, Josh starred in A24's Dream Scenario alongside Nicolas Cage and led the viral sketch comedy series Read the Room, which generated over 60 million views in its first month. His work has earned recognition from Forbes 30 Under 30, Forbes Top Creators, Rolling Stone, Variety, and Business Insider.\n\nKnown for his entrepreneurial drive and cultural impact, Josh continues to bridge digital influence with traditional media, building brands and businesses that resonate with the next generation.`;

const WAITLIST_WEBHOOK_URL = "https://opendate.app.n8n.cloud/webhook/f2cdf2a9-b383-4ec9-96db-31d80da7b5c0";

const SOLD_OUT_OVERRIDES = new Set(["688023"]);

function WaitlistForm({ eventId, eventTitle }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const isEduEmail = (val) => /^[^\s@]+@[^\s@]+\.edu$/i.test(val.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (!isEduEmail(email)) {
      setErrorMsg("Please use a valid .edu email address.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(WAITLIST_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          event_title: eventTitle,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          source_url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
    } catch (err) {
      console.error("[Waitlist submission]", err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="waitlist-success">
        <h3>You're on the list!</h3>
        <p>We'll email you at {email} if a spot opens up.</p>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
      <div className="waitlist-row">
        <label className="waitlist-field">
          <span>First name</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
        </label>
        <label className="waitlist-field">
          <span>Last name</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </label>
      </div>
      <label className="waitlist-field">
        <span>Email (.edu required)</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@school.edu"
        />
      </label>
      {errorMsg && <p className="waitlist-error">{errorMsg}</p>}
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Join Waitlist"}
      </button>
    </form>
  );
}

function CreatorBio({ name, bioText }) {
  const [expanded, setExpanded] = useState(false);

  const fullText = bioText || CREATOR_1_BIO;
  const paragraphs = fullText.split("\n\n");
  const preview = paragraphs[0].slice(0, 150);

  return (
    <div>
      <h3 className="creator-name">{name}</h3>
      <div className="creator-bio">
        {expanded
          ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
          : <p>{preview}...</p>}
        <button className="read-more-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : "Read more"}
        </button>
      </div>
    </div>
  );
}

const CREATOR_4_BIO = `Ayan Broomfield is a 27-year-old former NCAA national tennis champion. She continues to fulfill her passion for tennis alongside her boyfriend, pro tennis player Frances Tiafoe, bringing her followers along as she travels to major tournaments worldwide. After graduating from UCLA with a degree in Women's Studies and a highly successful college tennis career, Ayan continues to dominate on and off the court. In addition, she is no stranger to being in front of the camera, sharing the screen with Will Smith in the Academy Award-nominated King Richard, and most recently featured in Season 2 of the popular Netflix documentary Break Point. Her on-screen experience transitioned to social media, sharing her love for all things beauty, fashion & fitness with her growing and engaged followers. Through her nonprofit, The Ayan Broomfield Foundation, she launched Ayan's Aces, a national initiative bringing Women of Color to some of the sport's biggest stages: Indian Wells, Miami Open, Citi DC Open, the Toronto Open, and U.S. Open, while fostering mentorship, representation, and inclusion in tennis. Ayan has managed to bring over 400 women of color to professional tennis tournaments, this year alone! Ayan has partnered with global brands, including Lululemon, Sephora, Cadillac, Grey Goose, and more!`;

const CREATOR_3_BIO = `Olandria Carthen is an American media personality, model, and rising fashion tastemaker who first captured national attention as a fan-favorite in the franchise on Love Island USA Season 7. An Alabama native, she was affectionately dubbed the "Bama Barbie" as she captured hearts by being unapologetically herself. Her magnetic presence has kept those same viewers and millions of new fans hooked far beyond the show's finale, setting media abuzz wherever she is seen. Aside from being coined the breakout star, she has since rapidly become TV's biggest breakout star of the year and fashion's newest "it-girl". Her engagement and influence are astounding - commanding headlines on most major media and shaping conversations for her style and cultural influence. She's being recognized as a fashion tastemaker by most of the mainstream media daily, being featured in CR Fashion Book, Vanity Fair, Vogue, and InStyle, to name a few.\n\nBorn to young parents and as a first-generation to high school and Tuskegee University graduate, Olandria's purpose is to use her influence with intention and utilize platform to empower others to celebrate representation and amplify underrecognized voices in fashion, education, and beyond. Whether on-screen, on the runway, at HBCUs across the US, or at the center of cultural conversation online, she continues to drive impactful conversations with purpose and prove that brains and beauty can coexist beautifully.`;

const CREATOR_2_BIO = `Brianna LaPaglia is a leading social media and television personality and the founder and host of the hit podcast PlanBri Uncut. With a rare ability to connect with mass audiences across multiple demographics, she has built one of the most loyal followings in the media universe through her candor, sharp humor, and unfiltered perspective.\n\nIn 2025, Brianna appeared as a competitor on Season 4 of FOX's Special Forces: World's Toughest Test, where she spoke candidly about resilience, boundaries, and reclaiming her voice, finishing the competition as a runner-up. From 2020 to 2025, she also cohosted the juggernaut podcast BFFs alongside Josh Richards.\n\nOver the past year, Brianna has further distinguished herself by choosing transparency over silence, using her platform to advocate for honesty, empowerment, and the courage for women to share their stories and speak their truths.\n\nAn East Coast native, Brianna lives in New York City with her dog and two cats.`;

export default function EventDetailPage() {
  const { id } = useParams();
  const { data: event, loading, error } = useEvent(id);
  const checkoutRef = useRef(null);
  const waitlistRef = useRef(null);

  const isSoldOut = event ? (event.sold_out || SOLD_OUT_OVERRIDES.has(id)) : false;
  const showWaitlist = event ? (event.sold_out && !SOLD_OUT_OVERRIDES.has(id)) : false;

  useEffect(() => {
    if (!event || showWaitlist || event.canceled_at) return;

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
    royce: { name: "Royce Hall", address: "10745 Dickson Ct, Los Angeles, CA, 90095", tz: "America/Los_Angeles" },
    houston: { name: "Houston Room", address: "4100 University Dr, Houston, TX, 77004", tz: "America/Chicago" },
    uc: { name: "The UC Theatre", address: "2036 University Avenue, Berkeley, CA, 94704", tz: "America/Los_Angeles" },
    lakeside: { name: "Lakeside Village Auditorium", address: "1280 Stanford Dr, Coral Gables, FL, 33146", tz: "America/New_York" },
  };

  const venueInfo = Object.keys(venueOverrides).reduce((found, tag) => found || (hasTag(tag) ? venueOverrides[tag] : null), null)
    || (event.venue ? { name: event.venue.name, address: event.venue.address_from_components } : null);

  return (
    <div className="event-detail">
      <PromoBanner />
      <div className="event-detail-hero">
        <div className="event-detail-hero-overlay">
          <div className="container">
            <Link to="/" className="back-link">&larr; All Events</Link>
            <div className="event-detail-hero-content">
              <img
                src="/windows11-logo.svg"
                alt="Windows 11"
                className="event-detail-hero-logo"
              />
              <h1>{event.title}</h1>
              {event.presenter && <p className="event-presenter">Presented by {event.presenter}</p>}
            </div>
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

          {/* Get to know Your Creator — showcase events */}
          {hasTag("showcase") && (
            <section className="event-section creator-section">
              <h3 className="creator-heading">Get to Know Your Creator & Host</h3>
              <div className="creator-card">
                {event.compressed_main_event_image_url && (
                  <img
                    src={event.compressed_main_event_image_url}
                    alt={event.title}
                    className="creator-img"
                  />
                )}
                <CreatorBio name="Josh Richards" />
              </div>
              {id === "688024" && (
                <div className="creator-card" style={{ marginTop: 24 }}>
                  <img
                    src="/Bri Headshot.jpeg"
                    alt="Brianna LaPaglia"
                    className="creator-img"
                  />
                  <CreatorBio name="Brianna LaPaglia" bioText={CREATOR_2_BIO} />
                </div>
              )}
            </section>
          )}

          {/* Get to know Your Creator — houston events */}
          {hasTag("houston") && (
            <section className="event-section creator-section">
              <h3 className="creator-heading">Get to Know Your Creator & Host</h3>
              <div className="creator-card">
                <img
                  src="/MmOEEEqR.jpeg"
                  alt="Olandria Carthen"
                  className="creator-img"
                />
                <CreatorBio name="Olandria Carthen" bioText={CREATOR_3_BIO} />
              </div>
              <div className="creator-card" style={{ marginTop: 24 }}>
                <img
                  src="/0O4A3021.jpg"
                  alt="Ayan Broomfield"
                  className="creator-img"
                />
                <CreatorBio name="Ayan Broomfield" bioText={CREATOR_4_BIO} />
              </div>
            </section>
          )}

          {/* Performers — non-showcase events */}
          {!hasTag("showcase") && !hasTag("houston") && event.performers && event.performers.length > 0 && (
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
            {isSoldOut ? (
              <>
                <div className="ticket-sold-out">Sold Out</div>
                {showWaitlist && (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => waitlistRef.current?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Join Waitlist
                  </button>
                )}
              </>
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

      {/* Waitlist */}
      {showWaitlist && (
        <div ref={waitlistRef} className="container checkout-section">
          <h2 className="checkout-heading">Join the Waitlist</h2>
          <div className="checkout-alert">
            <strong>This event is sold out.</strong> Add yourself to the waitlist and we'll email you if a spot opens up. You must use a valid <strong>.edu</strong> email address.
          </div>
          <WaitlistForm eventId={id} eventTitle={event.title} />
        </div>
      )}

      {/* Checkout Widget */}
      {!showWaitlist && !event.canceled_at && (
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
