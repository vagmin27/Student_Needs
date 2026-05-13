// utils/calculateProfileScore.js

export const calculateProfileCompleteness = (student) => {
  let score = 0;

  const fields = [
    { field: student.firstName, weight: 7 },
    { field: student.lastName, weight: 7 },
    { field: student.email, weight: 6 },
    { field: student.image, weight: 5 },
    { field: student.college, weight: 10 },
    { field: student.branch, weight: 8 },
    { field: student.graduationYear, weight: 8 },
    { field: student.skills && student.skills.length > 0, weight: 10 },
    { field: student.projects && student.projects.length > 0, weight: 10 },
    { field: student.certifications && student.certifications.length > 0, weight: 5 },
    { field: student.preferredRoles && student.preferredRoles.length > 0, weight: 5 },
    { field: student.resume && student.resume.data, weight: 7 },
    { field: student.linkedIn && student.linkedIn.data, weight: 5 },
    { field: student.linkedIn && student.linkedIn.linkedInUrl, weight: 2 },
    { field: student.githubUrl, weight: 5 },
  ];

  fields.forEach(({ field, weight }) => {
    if (field) score += weight;
  });

  return Math.min(score, 100);
};