export const getTimeAgo = (dateString: string): string => {
  const inputDate = new Date(dateString);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffInMs = now.getTime() - inputDate.getTime();

  // Convert milliseconds to different time units
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44); // Approximate average days per month

  // Determine which unit to display
  if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  if (weeks > 0) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  return "Just now";
};
