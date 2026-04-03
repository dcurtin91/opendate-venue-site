export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatFullDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getMonthDay(dateString) {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate(),
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
