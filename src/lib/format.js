// Parse a date string in the venue's local time by extracting the UTC offset
// from the ISO string (e.g. "2026-04-17T18:00:00.000-06:00") and using it
// so times display in the venue's timezone, not the browser's.
function getVenueTimeZone(dateString) {
  const match = dateString.match(/([+-]\d{2}):(\d{2})$/);
  if (!match) return undefined;
  const offsetMinutes = (parseInt(match[1]) * 60) + (Math.sign(parseInt(match[1])) * parseInt(match[2]));
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const mins = Math.abs(offsetMinutes) % 60;
  // Etc/GMT doesn't support non-hour offsets
  if (mins !== 0) return undefined;
  // Etc/GMT uses inverted signs
  const etcSign = offsetMinutes <= 0 ? "+" : "-";
  return `Etc/GMT${etcSign}${hours}`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const tz = getVenueTimeZone(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(tz && { timeZone: tz }),
  });
}

export function formatTime(dateString) {
  const date = new Date(dateString);
  const tz = getVenueTimeZone(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    ...(tz && { timeZone: tz }),
  });
}

export function formatFullDate(dateString) {
  const date = new Date(dateString);
  const tz = getVenueTimeZone(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(tz && { timeZone: tz }),
  });
}

export function getMonthDay(dateString) {
  const date = new Date(dateString);
  const tz = getVenueTimeZone(dateString);
  return {
    month: date.toLocaleDateString("en-US", { month: "short", ...(tz && { timeZone: tz }) }).toUpperCase(),
    day: parseInt(date.toLocaleDateString("en-US", { day: "numeric", ...(tz && { timeZone: tz }) })),
  };
}

export function getPrimaryPerformer(event) {
  if (!event.performers || event.performers.length === 0) return null;
  return (
    event.performers.find((p) => p.act_type === "primary") ||
    event.performers[0]
  );
}

export function getSupportPerformers(event) {
  if (!event.performers) return [];
  return event.performers.filter((p) => p.act_type !== "primary");
}
