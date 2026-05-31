// profileCompleteness.js
// Single source of truth for calculating profile completeness and missing fields

/**
 * Calculates Student Profile Completeness
 * Matches Backend/utils/Referrals/calculateProfileScore.js
 * @param {Object} student
 * @returns {Object} { score: number, missingFields: string[] }
 */
export const calculateStudentProfileCompleteness = (student) => {
  if (!student) return { score: 0, missingFields: [] };

  let score = 0;
  const missingFields = [];

  // Basic Details (20%) - 4% each
  if (student.firstName) score += 4; else missingFields.push("First Name");
  if (student.lastName) score += 4; else missingFields.push("Last Name");
  if (student.email) score += 4; else missingFields.push("Email");
  if (student.phoneNumber) score += 4; else missingFields.push("Phone");
  if (student.image) score += 4; else missingFields.push("Profile Picture");

  // Education (20%) - 4% each
  if (student.college || student.collegeName) score += 4; else missingFields.push("College");
  if (student.branch) score += 4; else missingFields.push("Branch");
  if (student.degree) score += 4; else missingFields.push("Degree");
  if (student.graduationYear) score += 4; else missingFields.push("Graduation Year");
  if (student.cgpa) score += 4; else missingFields.push("CGPA");

  // Skills (20%)
  if (student.skills && student.skills.length > 0) {
    score += 20;
  } else {
    missingFields.push("Skills");
  }

  // Resume (20%)
  // Support both backend populated resume and frontend file upload state check
  if (student.resume && (student.resume.data || student.resume.fileName || student.resume.uploadedAt)) {
    score += 20;
  } else {
    missingFields.push("Resume");
  }

  // Links (20%) - 7% LinkedIn, 7% GitHub, 6% Portfolio
  if (student.linkedinUrl || (student.linkedIn && student.linkedIn.linkedInUrl)) {
    score += 7;
  } else {
    missingFields.push("LinkedIn");
  }

  if (student.githubUrl) {
    score += 7;
  } else {
    missingFields.push("GitHub");
  }

  if (student.portfolioUrl) {
    score += 6;
  } else {
    missingFields.push("Portfolio");
  }

  return {
    score: Math.min(score, 100),
    missingFields,
  };
};

/**
 * Calculates Tutor Profile Completeness
 * Matches Backend/routes/Tutorials/tutorRoutes.js
 * @param {Object} tutor
 * @returns {Object} { score: number, missingFields: string[] }
 */
export const calculateTutorProfileCompleteness = (tutor) => {
  if (!tutor) return { score: 0, missingFields: [] };

  let score = 0;
  const missingFields = [];

  if (tutor.fName) score += 4; else missingFields.push("First Name");
  if (tutor.lName) score += 4; else missingFields.push("Last Name");
  if (tutor.email) score += 4; else missingFields.push("Email");
  if (tutor.contact) score += 4; else missingFields.push("Contact Phone");
  if (tutor.bio) score += 4; else missingFields.push("Bio");

  // Helper helper to check array or string
  const checkArray = (val) => {
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'string') return val.trim().length > 0;
    return false;
  };

  if (checkArray(tutor.subjects)) score += 10; else missingFields.push("Subjects");
  if (checkArray(tutor.skills)) score += 10; else missingFields.push("Skills");
  if (tutor.expertise) score += 10; else missingFields.push("Expertise Area");
  if (tutor.experience) score += 10; else missingFields.push("Experience");
  if (tutor.hourlyRate) score += 10; else missingFields.push("Hourly Rate");

  if (checkArray(tutor.availableDays)) score += 5; else missingFields.push("Available Days");
  if (checkArray(tutor.availableTimeSlots)) score += 5; else missingFields.push("Available Time Slots");

  if (tutor.profilePic || tutor.pic) score += 5; else missingFields.push("Profile Picture");
  if (tutor.linkedinUrl) score += 5; else missingFields.push("LinkedIn");
  if (tutor.githubUrl) score += 5; else missingFields.push("GitHub");
  if (tutor.portfolioUrl) score += 5; else missingFields.push("Portfolio");

  return {
    score: Math.min(score, 100),
    missingFields,
  };
};

/**
 * Calculates Alumni Profile Completeness
 * Matches Backend/controllers/Referrals/AlumniProfile.js
 * @param {Object} alumni
 * @returns {Object} { score: number, missingFields: string[] }
 */
export const calculateAlumniProfileCompleteness = (alumni) => {
  if (!alumni) return { score: 0, missingFields: [] };

  let score = 0;
  const missingFields = [];

  if (alumni.firstName) score += 5; else missingFields.push("First Name");
  if (alumni.lastName) score += 5; else missingFields.push("Last Name");
  if (alumni.email) score += 5; else missingFields.push("Email");
  if (alumni.image) score += 5; else missingFields.push("Profile Picture");

  if (alumni.company) score += 8; else missingFields.push("Company");
  if (alumni.jobTitle) score += 8; else missingFields.push("Job Title");
  if (alumni.yearsOfExperience !== undefined && alumni.yearsOfExperience !== null && alumni.yearsOfExperience !== "") score += 7; else missingFields.push("Years of Experience");
  
  if (alumni.skills && alumni.skills.length > 0) {
    score += 7;
  } else {
    missingFields.push("Skills");
  }

  if (alumni.referralPreferences) score += 10; else missingFields.push("Referral Preferences");
  if (alumni.hiringInterests) score += 10; else missingFields.push("Hiring Interests");

  if (alumni.bio) score += 6; else missingFields.push("Bio");
  if (alumni.careerJourney) score += 6; else missingFields.push("Career Journey");
  if (alumni.linkedinUrl) score += 6; else missingFields.push("LinkedIn");
  if (alumni.githubUrl) score += 6; else missingFields.push("GitHub");
  if (alumni.portfolioUrl) score += 6; else missingFields.push("Portfolio");

  return {
    score: Math.min(score, 100),
    missingFields,
  };
};
