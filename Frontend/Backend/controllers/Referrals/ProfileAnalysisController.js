import fs from 'fs';
import path from 'path';

// Mock response for when external API is unavailable or disabled
const getMockAnalysisResponse = (target_role) => {
  return {
    status: 'success',
    data: {
      key_aaskills: {
        python: 2.0,
        javascript: 8.5,
        typescript: 4.2,
        react: 6.8,
        nodejs: 3.5,
        mongodb: 2.1,
        html: 5.0,
        css: 4.5,
        git: 3.0,
      },
      key_skills: {
        javascript: 8.5,
        react: 6.8,
        nodejs: 3.5,
        typescript: 4.2,
        html: 5.0,
      },
      job_role: target_role,
      compatibility_score_percent: 72.5,
      missing_skills: ['GraphQL', 'Docker', 'Kubernetes'],
      weak_skills: ['DevOps', 'System Design'],
      advisory: [
        'Focus on improving system design knowledge',
        'Consider learning containerization technologies',
        'GraphQL experience would be beneficial'
      ]
    }
  };
};

// Analyze student profile against target role (safely mocked to prevent external API crashes)
export const analyzeProfile = async (req, res) => {
  try {
    const resume = req.files?.resume || req.files?.[0];
    const target_role = req.body?.target_role;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required',
      });
    }

    if (!target_role) {
      return res.status(400).json({
        success: false,
        message: 'Target role is required',
      });
    }

    // Safely bypass the unstable external AI integration
    const mockResponse = getMockAnalysisResponse(target_role);
    
    return res.status(200).json({
      success: true,
      data: mockResponse.data,
      note: 'Mock response used - external analyzer is disabled for stability'
    });

  } catch (error) {
    console.error('[Profile Analysis] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error analyzing profile',
      error: error.message,
    });
  }
};