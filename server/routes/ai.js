const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



const DISASTER_CONTEXT = `You are JAGRUK AI, an expert disaster management and safety education assistant for Indian schools and colleges. 
Your role is to:
1. Educate students about disaster preparedness (earthquakes, floods, fires, cyclones, etc.)
2. Provide safety tips and emergency procedures
3. Answer questions about disaster management protocols
4. Help with drill preparation and safety planning
5. Suggest appropriate responses during emergencies

Always provide accurate, age-appropriate, and actionable advice. Focus on Indian context and NDMA (National Disaster Management Authority) guidelines.
Keep responses concise but informative. Use simple language suitable for students.`;

// Use consistent model
const AI_MODEL = "gemini-1.5-flash"; // Falling back to flash but verifying version. 
// Wait, user said flash failed with 404. Let's try gemini-pro or gemini-1.5-pro-latest.
// Actually, gemini-pro is the safest GA model.
const MODEL_NAME = "gemini-2.0-flash";

router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'AI service not configured' 
      });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `${DISASTER_CONTEXT}\n\nUser Question: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get AI response',
      error: error.message
    });
  }
});

router.post('/generate-quiz', async (req, res) => {
  try {
    const { topic = 'disaster safety', difficulty = 'medium', count = 5 } = req.body;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `Generate ${count} multiple choice questions about "${topic}" for disaster management education.
Difficulty level: ${difficulty}
Target audience: Indian school students.

Format your response as a JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correctAnswer": "A",
    "explanation": "Brief explanation why this is correct"
  }
]

Only output the JSON array, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid quiz format from AI');
    }
    
    const quiz = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      quiz,
      topic,
      difficulty
    });

  } catch (error) {
    console.error('Quiz Generation Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate quiz' 
    });
  }
});

router.post('/safety-tips', async (req, res) => {
  try {
    const { disasterType = 'earthquake', audience = 'students' } = req.body;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `Provide 10 essential safety tips for ${disasterType} disaster specifically for ${audience} in Indian schools/colleges.

Format as JSON:
{
  "disasterType": "${disasterType}",
  "beforeDisaster": ["tip1", "tip2", "tip3"],
  "duringDisaster": ["tip1", "tip2", "tip3"],
  "afterDisaster": ["tip1", "tip2", "tip3"],
  "emergencyContacts": ["NDMA: 1078", "Police: 100", "Fire: 101", "Ambulance: 102"]
}

Only output the JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid format from AI');
    }
    
    const tips = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      ...tips
    });

  } catch (error) {
    console.error('Safety Tips Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate safety tips' 
    });
  }
});

router.post('/drill-scenario', async (req, res) => {
  try {
    const { drillType = 'fire', participantCount = 100, duration = 30 } = req.body;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `Create a detailed drill scenario for a ${drillType} emergency drill in an Indian school/college.
Participants: ${participantCount}
Duration: ${duration} minutes

Format as JSON:
{
  "title": "Drill title",
  "scenario": "Detailed scenario description",
  "objectives": ["objective1", "objective2"],
  "phases": [
    {"name": "Phase name", "duration": "X minutes", "actions": ["action1", "action2"]}
  ],
  "evaluationCriteria": ["criteria1", "criteria2"],
  "safetyOfficerInstructions": "Instructions for safety officer"
}

Only output the JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid format from AI');
    }
    
    const scenario = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      ...scenario
    });

  } catch (error) {
    console.error('Drill Scenario Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate drill scenario' 
    });
  }
});

module.exports = router;
