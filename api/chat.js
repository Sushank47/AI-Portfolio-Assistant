/**
 * Vercel Serverless Function: /api/chat.js
 * Connects to Azure OpenAI / Azure AI Inference API securely.
 */

try {
  require('dotenv').config();
} catch (e) {
  // dotenv optional in production Vercel runtime
}

const SYSTEM_PROMPT = require('./systemPrompt.js');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid payload. "messages" array is required.' });
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || process.env.AZURE_AI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY || process.env.AZURE_AI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AZURE_AI_MODEL_NAME || 'bot-ai';
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview';

    // Fallback if credentials are missing
    if (!endpoint || !apiKey) {
      const userLastMsg = messages[messages.length - 1]?.content || '';
      return res.status(200).json({
        reply: generateOfflineFallbackResponse(userLastMsg),
        isDemoMode: true
      });
    }

    // Construct full messages payload with system prompt
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-8)
    ];

    // Build URL for Azure OpenAI or Azure AI Inference
    let cleanEndpoint = endpoint.trim().replace(/\/+$/, '');
    let apiUrl = '';

    if (cleanEndpoint.includes('/openai/deployments')) {
      apiUrl = cleanEndpoint;
    } else if (cleanEndpoint.includes('/chat/completions')) {
      apiUrl = cleanEndpoint;
    } else {
      apiUrl = `${cleanEndpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        messages: fullMessages,
        temperature: 0.3,
        max_tokens: 800,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure OpenAI API Error:', response.status, errorText);
      return res.status(200).json({
        reply: `*(Azure OpenAI Error ${response.status})* ${generateOfflineFallbackResponse(messages[messages.length - 1]?.content || '')}`
      });
    }

    const rawText = await response.text();
    let replyText = '';

    try {
      const data = JSON.parse(rawText);
      replyText = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
    } catch (e) {
      // If endpoint returned SSE stream lines (data: {...})
      const lines = rawText.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          try {
            const parsed = JSON.parse(line.substring(6));
            const delta = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.text || '';
            replyText += delta;
          } catch (err) {
            // skip unparseable chunks
          }
        }
      }
    }

    if (!replyText) {
      replyText = "I couldn't generate a response. Please try again.";
    }

    return res.status(200).json({
      reply: replyText,
      model: deployment
    });

  } catch (error) {
    console.error('Serverless Chat Exception:', error);
    return res.status(500).json({
      error: 'An internal server error occurred while contacting the AI Assistant serverless endpoint.'
    });
  }
};

/**
 * Intelligent Fallback Response Generator
 */
function generateOfflineFallbackResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('rag') || q.includes('document')) {
    return `**Document Intelligence Chatbot (RAG)** is one of Billa Komal Sushank's key projects!\n\n- **Overview**: A Retrieval-Augmented Generation (RAG) platform allowing users to upload PDF documents and inquire in natural language.\n- **Key Tech**: Vector Search, RAG Architecture, PDF Chunking, LLM Grounding.\n- **GitHub**: [View Repository](https://github.com/Sushank47/RAG.git)\n- **Live Demo**: [Open Application](https://rag-two-gamma.vercel.app)`;
  }

  if (q.includes('vision') || q.includes('ocr') || q.includes('caption')) {
    return `**Vision AI – AI Image Captioning & OCR Platform**:\n\n- **Overview**: Automatically generates descriptive image captions, detects objects, and extracts text via OCR.\n- **Features**: Drag-and-drop file upload, real-time image segmentation, dark glass UI.\n- **GitHub**: [View Repository](https://github.com/Sushank47/VISION-AI.git)\n- **Live Demo**: [Open Application](https://vision-ai-puce.vercel.app)`;
  }

  if (q.includes('speech') || q.includes('voice') || q.includes('audio')) {
    return `**Speech AI – Real-Time Speech Transcription & Voice Generator**:\n\n- **Overview**: Converts speech into text instantly and synthesizes natural-sounding voice playback.\n- **GitHub**: [View Repository](https://github.com/Sushank47/SPEECH-AI.git)\n- **Live Demo**: [Open Application](https://speech-ai-six.vercel.app)`;
  }

  if (q.includes('sentiment') || q.includes('language')) {
    return `**Language AI – Review Sentiment Analyzer**:\n\n- **Overview**: Analyzes customer reviews using AI to detect sentiment (Positive, Neutral, Negative), key phrases, and entities.\n- **GitHub**: [View Repository](https://github.com/Sushank47/LANGUAGE_AI.git)\n- **Live Demo**: [Open Application](https://language-ai-lovat.vercel.app)`;
  }

  if (q.includes('azure') || q.includes('faq')) {
    return `**Azure OpenAI – AI FAQ Chatbot**:\n\n- **Overview**: Domain-specific intelligent chatbot powered by Azure OpenAI with optimized system prompt engineering.\n- **GitHub**: [View Repository](https://github.com/Sushank47/Azure-AI.git)\n- **Live Demo**: [Open Application](https://azure-ai-woad.vercel.app)`;
  }

  if (q.includes('employee') || q.includes('crud') || q.includes('management')) {
    return `**Employee Management System**:\n\n- **Overview**: Full-stack workforce management application supporting CRUD operations, authentication, and Role-Based Access Control (RBAC).\n- **GitHub**: [View Repository](https://github.com/Sushank47/Employee-Management-System-.git)\n- **Live Demo**: [Open Application](https://employee-management-system-ebon-sigma.vercel.app)`;
  }

  if (q.includes('linkedin') || q.includes('contact') || q.includes('connect')) {
    return `You can connect with **Billa Komal Sushank** directly:\n\n- **LinkedIn**: [billa-komal-sushank-135623366](https://www.linkedin.com/in/billa-komal-sushank-135623366/)\n- **GitHub**: [Sushank47](https://github.com/Sushank47)`;
  }

  if (q.includes('weather') || q.includes('recipe') || q.includes('math') || q.includes('capital') || q.includes('who is president')) {
    return `I am designed specifically as Sushank's AI Portfolio Assistant to answer questions about his software projects, AI innovations, and professional background. Feel free to ask me about his RAG Document Chatbot, Vision AI, Speech AI, or how to connect with him!`;
  }

  return `Hello! I am Billa Komal Sushank's AI Portfolio Assistant. I can answer any questions about his 6 featured projects, tech stack, or GitHub and LinkedIn profiles!`;
}
