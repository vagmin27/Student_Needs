/**
 * Compute the specific activity status and timeline contract for a booking.
 * Returns { activityStatus, title, subtitle, timestamp, color, canJoin }
 */
export function computeActivityStatus(booking, isStudent) {
  const currentTime = new Date();
  
  // Combine date and time strings to create start time
  // E.g. date: "2026-06-17", time: "15:30"
  let startTime = null;
  let endTime = null;
  if (booking.date && booking.time) {
    startTime = new Date(`${booking.date}T${booking.time}`);
    // Assume 1 hour session if not specified differently
    endTime = new Date(startTime.getTime() + 60 * 60 * 1000); 
  } else {
    startTime = new Date(booking.createdAt);
    endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
  }

  const { status, tutorJoinedAt, studentJoinedAt, cancelledAt } = booking;
  const isCancelled = status?.toLowerCase() === 'cancelled' || status?.toLowerCase() === 'declined' || !!cancelledAt;

  let activityStatus = 'upcoming';

  if (isCancelled) {
    activityStatus = 'cancelled';
  } else if (currentTime < startTime) {
    activityStatus = 'upcoming';
  } else if (currentTime >= startTime && currentTime <= endTime) {
    activityStatus = 'in_progress';
    // If it's over, see who showed up
  } else if (currentTime > endTime) {
    if (tutorJoinedAt && studentJoinedAt) {
      activityStatus = 'completed';
    } else if (!tutorJoinedAt && !studentJoinedAt) {
      activityStatus = 'missed';
    } else if (studentJoinedAt && !tutorJoinedAt) {
      activityStatus = 'tutor_absent';
    } else if (tutorJoinedAt && !studentJoinedAt) {
      activityStatus = 'student_absent';
    }
  }

  // Gracefully handle legacy bookings that might just be "completed" in string
  if (status?.toLowerCase() === 'completed' && activityStatus !== 'completed') {
    activityStatus = 'completed';
  }

  // Generate rendering contract
  let title = '';
  let summary = '';
  let color = '';
  let canJoin = false;
  
  // Use timestamp for timeline sorting
  const timestamp = booking.createdAt;

  switch (activityStatus) {
    case 'completed':
      title = 'Completed';
      summary = 'Session conducted';
      color = 'text-green-500';
      break;
    case 'missed':
      title = 'Missed Session';
      summary = 'Nobody joined';
      color = 'text-red-500';
      break;
    case 'tutor_absent':
      title = 'Tutor unavailable';
      summary = 'Tutor unavailable';
      color = 'text-orange-500';
      break;
    case 'student_absent':
      title = 'Student absent';
      summary = 'Student absent';
      color = 'text-yellow-500';
      break;
    case 'upcoming':
      title = 'Upcoming';
      summary = 'Session scheduled';
      color = 'text-blue-500';
      break;
    case 'in_progress':
      title = 'Class Live';
      summary = 'Class live';
      color = 'text-purple-500';
      canJoin = true;
      break;
    case 'cancelled':
      title = 'Cancelled';
      summary = 'Session cancelled';
      color = 'text-neutral-500'; // dark gray
      break;
  }

  return {
    activityStatus,
    title,
    subject: booking.subject || "Session",
    summary,
    timestamp,
    color,
    canJoin,
    originalStatus: status
  };
}
