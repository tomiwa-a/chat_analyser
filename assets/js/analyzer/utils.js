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

export const participantColors = [
  "#7C3AED", // purple
  "#06B6D4", // cyan
  "#10B981", // green
  "#F43F5E", // rose
  "#F97316", // orange
  "#A78BFA", // light purple
  "#38BDF8", // light blue
  "#34D399", // light green
  "#FB923C", // light orange
  "#E879F9", // pink
];

export function getParticipantColor(index) {
  return participantColors[index % participantColors.length];
}
