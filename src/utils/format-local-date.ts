export function formatDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const formatDate_YYYY_MM_DD = (date: Date): string => {
  return date.toLocaleDateString("en-CA");
};

export const formatDate_DD_MMMM_YYYY = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    // weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const timeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "Justo ahora";
  }

  const intervals: { [key: string]: number } = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `Hace ${interval} ${unit}${interval > 1 ? "s" : ""}`;
    }
  }

  return "Justo ahora";
};
