// utils/calculateProfileScore.js

export const calculateProfileCompleteness = (student) => {
  let score = 0;

  // Basic Details (20%) - 4% each for firstName, lastName, email, phoneNumber, image
  let basicDetailsScore = 0;
  if (student.firstName) basicDetailsScore += 4;
  if (student.lastName) basicDetailsScore += 4;
  if (student.email) basicDetailsScore += 4;
  if (student.phoneNumber) basicDetailsScore += 4;
  if (student.image) basicDetailsScore += 4;
  score += basicDetailsScore;

  // Education (20%) - 4% each for college, branch, degree, graduationYear, cgpa
  let eduScore = 0;
  if (student.college) eduScore += 4;
  if (student.branch) eduScore += 4;
  if (student.degree) eduScore += 4;
  if (student.graduationYear) eduScore += 4;
  if (student.cgpa) eduScore += 4;
  score += eduScore;

  // Skills (20%) - 20% if there is at least one skill
  if (student.skills && student.skills.length > 0) {
    score += 20;
  }

  // Resume (20%) - 20% if resume exists
  if (student.resume && student.resume.data) {
    score += 20;
  }

  // Links (20%) - 7% LinkedIn, 7% GitHub, 6% Portfolio
  let linksScore = 0;
  if (student.linkedinUrl || (student.linkedIn && student.linkedIn.linkedInUrl)) linksScore += 7;
  if (student.githubUrl) linksScore += 7;
  if (student.portfolioUrl) linksScore += 6;
  score += linksScore;

  return Math.min(score, 100);
};