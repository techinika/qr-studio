/* eslint-disable @typescript-eslint/no-explicit-any */
export const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export const formatMonthYear = (date: any): string => {
  if (!date) return "N/A";

  const d = date ? date.toDate() : new Date(date);

  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export const formatDateFull = (date: any): string => {
  if (!date) return "N/A";

  const d = date ? date.toDate() : new Date(date);

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const timeAgo = (date: any): string => {
  if (!date) return "";
  const d = date?.toDate ? date.toDate() : new Date(date);
  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return "just now";
};
