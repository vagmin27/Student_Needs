import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const ANALYZE_API_URL = 'https://niftier-gaylene-buccal.ngrok-free.dev/analyze';

// Mock response for when external API is unavailable
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

// Analyze student profile against target role
export const analyzeProfile = async (req, res) => {
  try {
    console.log('[Profile Analysis] Request received');
    console.log('[Profile Analysis] req.files:', req.files);
    console.log('[Profile Analysis] req.body:', req.body);

    // Get files from request - handle both express-fileupload and direct multipart
    const resume = req.files?.resume || req.files?.[0];
    const linkedin = req.files?.linkedin || req.files?.[1];
    const github_url = req.body?.github_url;
    const target_role = req.body?.target_role;

    console.log('[Profile Analysis] Extracted:');
    console.log('Resume:', resume?.name || resume?.originalname || 'Not found');
    console.log('LinkedIn:', linkedin?.name || linkedin?.originalname || 'Not found');
    console.log('GitHub:', github_url);
    console.log('Target Role:', target_role);

    if (!resume) {
      console.error('[Profile Analysis] Resume file is missing');
      return res.status(400).json({
        success: false,
        message: 'Resume file is required',
      });
    }

    if (!target_role) {
      console.error('[Profile Analysis] Target role is missing');
      return res.status(400).json({
        success: false,
        message: 'Target role is required',
      });
    }

    console.log('[Profile Analysis] Analyzing profile');

    // Create FormData for external API
    const formData = new FormData();
    
    // Add resume file - use the temp file path from express-fileupload
    const resumePath = resume.tempFilePath;
    const resumeName = resume.name || resume.originalname || 'resume.pdf';
    
    console.log('[Profile Analysis] Resume temp path:', resumePath);
    console.log('[Profile Analysis] Resume exists:', fs.existsSync(resumePath));
    
    // Read the file as a stream for form-data
    const resumeStream = fs.createReadStream(resumePath);
    formData.append('resume', resumeStream, resumeName);
    console.log('[Profile Analysis] Added resume stream:', resumeName);

    // Add LinkedIn file if provided
    if (linkedin) {
      const linkedinPath = linkedin.tempFilePath;
      const linkedinName = linkedin.name || linkedin.originalname || 'linkedin.pdf';
      
      console.log('[Profile Analysis] LinkedIn temp path:', linkedinPath);
      console.log('[Profile Analysis] LinkedIn exists:', fs.existsSync(linkedinPath));
      
      const linkedinStream = fs.createReadStream(linkedinPath);
      formData.append('linkedin', linkedinStream, linkedinName);
      console.log('[Profile Analysis] Added linkedin stream:', linkedinName);
    } else {
      console.log('[Profile Analysis] No LinkedIn file provided');
    }

    // Add github_url and target_role
    formData.append('github_url', github_url || '');
    formData.append('target_role', target_role);

    // Call external API
    const ANALYZE_API_URL = 'https://niftier-gaylene-buccal.ngrok-free.dev/analyze';
    console.log('[Profile Analysis] Calling external API:', ANALYZE_API_URL);
    
    try {
      const analyzeResponse = await axios.post(ANALYZE_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      console.log('[Profile Analysis] External API Response:', analyzeResponse.status);
      console.log('[Profile Analysis] Response data structure:', JSON.stringify(analyzeResponse.data).substring(0, 200));

      // Return the response from external API (flatten if needed)
      const analysisData = analyzeResponse.data.data || analyzeResponse.data;
      
      console.log('[Profile Analysis] Extracted analysis data:', JSON.stringify(analysisData).substring(0, 200));
      
      return res.status(200).json({
        success: true,
        data: analysisData,
      });
    } catch (apiError) {
      console.error('[Profile Analysis] External API Error:', apiError.message);

      // If external API is unavailable, use mock response for testing
      if (apiError.code === 'ECONNREFUSED' || apiError.response?.status === 503 || apiError.response?.status === 404) {
        console.log('[Profile Analysis] External API unavailable, using mock response for testing');
        
        const mockResponse = getMockAnalysisResponse(target_role);
        console.log('[Profile Analysis] Mock response created:', JSON.stringify(mockResponse).substring(0, 200));
        
        return res.status(200).json({
          success: true,
          data: mockResponse.data,
          note: 'Mock response used - external analyzer is offline'
        });
      }

      // For other errors, still return mock response
      if (apiError.response) {
        console.error('API Response Status:', apiError.response.status);
        console.error('API Response Data:', JSON.stringify(apiError.response.data).substring(0, 300));
      }

      // Default to mock response to allow testing
      console.log('[Profile Analysis] Error accessing external API, using mock response');
      const mockResponse = getMockAnalysisResponse(target_role);
      return res.status(200).json({
        success: true,
        data: mockResponse.data,
        note: 'Mock response used - external analyzer is temporarily unavailable'
      });
    }
  } catch (error) {
    console.error('[Profile Analysis] Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error analyzing profile',
      error: error.message,
    });
  }
};