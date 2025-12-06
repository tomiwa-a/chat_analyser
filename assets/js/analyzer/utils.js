export function formatDate(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export const chartColors = {
  primary: "#7C3AED",
  secondary: "#06B6D4",
  accent: "#10B981",
  rose: "#F43F5E",
  orange: "#F97316",
  purple: "#A78BFA",
  blue: "#38BDF8",
  green: "#34D399",
};
