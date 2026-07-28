/**
 * Featured Projects Data
 * Billa Komal Sushank - Interactive Business Card
 */

const PROJECTS = [
  {
    id: "language-ai",
    title: "Language AI – AI-Powered Review Sentiment Analyzer",
    category: "NLP & Sentiment Analysis",
    description: "AI-powered review analysis platform detecting sentiment, key phrases, and named entities with real-time visual breakdown.",
    image: "assets/images/language-ai.png",
    github: "https://github.com/Sushank47/LANGUAGE_AI.git",
    live: "https://language-ai-lovat.vercel.app",
    tags: ["AI/ML", "NLP", "Sentiment Analysis", "JavaScript", "Vercel"],
    aiPrompt: "Tell me more about Sushank's Language AI project. What architecture and features does it use for sentiment analysis and key phrase extraction?"
  },
  {
    id: "vision-ai",
    title: "Vision AI – AI Image Captioning & OCR Platform",
    category: "Computer Vision & OCR",
    description: "Computer vision suite featuring automated image captioning, object detection, and drag-and-drop OCR text extraction.",
    image: "assets/images/vision-ai.png",
    github: "https://github.com/Sushank47/VISION-AI.git",
    live: "https://vision-ai-puce.vercel.app",
    tags: ["Computer Vision", "OCR", "Image AI", "Drag & Drop UI", "Web API"],
    aiPrompt: "Explain how Sushank's Vision AI platform performs image captioning and text extraction with OCR."
  },
  {
    id: "speech-ai",
    title: "Speech AI – Real-Time Speech Transcription & Voice Generator",
    category: "Speech & Audio Processing",
    description: "Real-time audio processing engine providing speech-to-text transcription and instant neural voice synthesis.",
    image: "assets/images/speech-ai.png",
    github: "https://github.com/Sushank47/SPEECH-AI.git",
    live: "https://speech-ai-six.vercel.app",
    tags: ["Speech Recognition", "Text-to-Speech", "Audio Processing", "Real-Time AI"],
    aiPrompt: "How does Sushank's Speech AI project process real-time voice transcription and text-to-speech generation?"
  },
  {
    id: "azure-openai",
    title: "Azure OpenAI – AI FAQ Chatbot",
    category: "LLM & Conversational AI",
    description: "Domain-specific AI assistant powered by Azure OpenAI with custom prompt engineering for grounded, context-aware answers.",
    image: "assets/images/azure-ai.png",
    github: "https://github.com/Sushank47/Azure-AI.git",
    live: "https://azure-ai-woad.vercel.app",
    tags: ["Azure OpenAI", "Prompt Engineering", "System Prompts", "Chatbot UI"],
    aiPrompt: "What system prompt strategies and Azure OpenAI integrations did Sushank use in his AI FAQ Chatbot project?"
  },
  {
    id: "document-rag",
    title: "Document Intelligence Chatbot (RAG)",
    category: "RAG & Vector Search",
    description: "Retrieval-Augmented Generation (RAG) platform for PDF document analysis and hallucination-free natural language Q&A.",
    image: "assets/images/rag-ai.png",
    github: "https://github.com/Sushank47/RAG.git",
    live: "https://rag-two-gamma.vercel.app",
    tags: ["RAG", "Document Intelligence", "Vector Search", "PDF Analysis", "LLM Grounding"],
    aiPrompt: "How does Sushank's Document Intelligence RAG application prevent hallucinations when answering questions from PDF uploads?"
  },
  {
    id: "employee-management",
    title: "Employee Management System",
    category: "Full-Stack Web App",
    description: "Full-stack workforce portal supporting secure authentication, role-based access control (RBAC), and full CRUD operations.",
    image: "assets/images/employee-system.png",
    github: "https://github.com/Sushank47/Employee-Management-System-.git",
    live: "https://employee-management-system-ebon-sigma.vercel.app",
    tags: ["Full-Stack", "CRUD", "Auth & RBAC", "Dashboard UI", "Web Application"],
    aiPrompt: "Can you summarize the tech stack and security features (RBAC, Auth) of Sushank's Employee Management System?"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PROJECTS;
}
