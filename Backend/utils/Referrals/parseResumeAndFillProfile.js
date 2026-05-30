import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { GoogleGenerativeAI } from "@google/generative-ai";

export const extractAndUpdateProfileFromResume = async (student, pdfBuffer) => {
  try {
    // 1. Extract text from PDF
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim() === "") {
      console.warn("Could not extract text from PDF.");
      return;
    }

    let responseText = "";

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Using mock auto-fill data.");
      responseText = `
      {
        "skills": ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
        "projects": [
          {
            "title": "E-Commerce Application",
            "description": "Full-stack application built with MERN stack.",
            "link": "https://github.com/example/ecommerce"
          }
        ],
        "preferredRoles": ["Software Engineer", "Full Stack Developer"],
        "branch": "Computer Science",
        "graduationYear": 2025,
        "certifications": [
          {
            "name": "AWS Certified Developer",
            "issuer": "Amazon Web Services"
          }
        ]
      }`;
    } else {
      // 2. Setup Gemini API
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // 3. Define the prompt
      const prompt = `
You are an expert resume parser. Extract the following information from the provided resume text and return it strictly as a JSON object matching the requested schema. Do not include markdown formatting or any other text.
Resume text:
${resumeText}

Schema:
{
  "skills": ["skill1", "skill2"], // Array of strings (technical skills, languages, tools)
  "projects": [
    {
      "title": "Project Name",
      "description": "Short description of what the project is",
      "link": "Project URL or GitHub link if present, else empty string"
    }
  ],
  "preferredRoles": ["Role1", "Role2"], // Array of strings (e.g. Software Engineer, Frontend Developer)
  "branch": "Branch/Department from Education", // e.g., Computer Science
  "graduationYear": 2025, // Integer, estimated graduation year from Education
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization"
    }
  ]
}
`;

      // 4. Generate JSON
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    }

    // Parse the result
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const extractedData = JSON.parse(jsonStr);

    // 5. Update Student profile with extracted data if not already present/filled
    let updated = false;

    if (extractedData.skills && Array.isArray(extractedData.skills) && extractedData.skills.length > 0) {
      // Merge unique skills
      const existingSkills = new Set((student.skills || []).map(s => s.toLowerCase()));
      const newSkills = extractedData.skills.filter(s => s && typeof s === 'string' && !existingSkills.has(s.toLowerCase()));
      if (newSkills.length > 0) {
        student.skills = [...(student.skills || []), ...newSkills];
        updated = true;
      }
    }

    if (extractedData.projects && Array.isArray(extractedData.projects) && extractedData.projects.length > 0) {
      const validProjects = extractedData.projects.filter(p => p && p.title);
      if (validProjects.length > 0) {
        // If they only have the default empty project, overwrite it
        if (!student.projects || student.projects.length === 0 || (student.projects.length === 1 && !student.projects[0].title)) {
          student.projects = validProjects;
          updated = true;
        } else {
          // Append new projects
          student.projects = [...student.projects, ...validProjects];
          updated = true;
        }
      }
    }

    if (extractedData.preferredRoles && Array.isArray(extractedData.preferredRoles) && extractedData.preferredRoles.length > 0) {
      const existingRoles = new Set((student.preferredRoles || []).map(r => r.toLowerCase()));
      const newRoles = extractedData.preferredRoles.filter(r => r && typeof r === 'string' && !existingRoles.has(r.toLowerCase()));
      if (newRoles.length > 0) {
        student.preferredRoles = [...(student.preferredRoles || []), ...newRoles];
        updated = true;
      }
    }

    if (extractedData.branch && !student.branch) {
      student.branch = extractedData.branch;
      updated = true;
    }

    if (extractedData.graduationYear && !student.graduationYear) {
      const year = parseInt(extractedData.graduationYear);
      if (!isNaN(year)) {
        student.graduationYear = year;
        updated = true;
      }
    }

    if (extractedData.certifications && Array.isArray(extractedData.certifications) && extractedData.certifications.length > 0) {
      const validCerts = extractedData.certifications.filter(c => c && c.name);
      if (validCerts.length > 0) {
        if (!student.certifications || student.certifications.length === 0 || (student.certifications.length === 1 && !student.certifications[0].name)) {
          student.certifications = validCerts;
          updated = true;
        } else {
          student.certifications = [...student.certifications, ...validCerts];
          updated = true;
        }
      }
    }

  } catch (error) {
    console.error("Error auto-filling profile from resume:", error);
  }
};
