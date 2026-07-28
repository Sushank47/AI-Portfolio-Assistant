/**
 * AI Portfolio Assistant Client Controller
 * Manages Chat UI, Markdown rendering, copy-to-clipboard, storage, and API communication.
 */

class AIChatAssistant {
  constructor() {
    this.messages = [];
    this.isProcessing = false;
    this.storageKey = 'sushank_ai_chat_history';
    
    // UI elements
    this.chatDrawer = document.getElementById('ai-chat-drawer');
    this.chatOverlay = document.getElementById('ai-chat-overlay');
    this.chatContainer = document.getElementById('chat-messages-list');
    this.chatInput = document.getElementById('chat-input-field');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.clearBtn = document.getElementById('chat-clear-btn');
    this.closeBtn = document.getElementById('chat-close-btn');
    this.openBtns = document.querySelectorAll('.trigger-ai-chat');
    this.suggestedPillsContainer = document.getElementById('chat-suggested-pills');
    
    this.init();
  }

  init() {
    this.loadHistory();
    this.bindEvents();
    this.renderSuggestedPills();
  }

  bindEvents() {
    // Event delegation for opening AI chat drawer (handles both static and dynamically rendered buttons)
    document.addEventListener('click', (e) => {
      const triggerBtn = e.target.closest('.trigger-ai-chat');
      if (triggerBtn) {
        e.preventDefault();
        e.stopPropagation();
        const prompt = triggerBtn.getAttribute('data-ai-prompt');
        this.openDrawer(prompt);
      }
    });

    // Close chat drawer
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeDrawer());
    }
    if (this.chatOverlay) {
      this.chatOverlay.addEventListener('click', () => this.closeDrawer());
    }

    // Send button
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSendMessage());
    }

    // Enter key sending
    if (this.chatInput) {
      this.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    // Clear history
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clearHistory());
    }
  }

  openDrawer(initialPrompt = null) {
    if (this.chatDrawer) {
      this.chatDrawer.classList.add('active');
      if (this.chatInput) {
        this.chatInput.focus();
      }
    }

    if (initialPrompt) {
      this.sendMessage(initialPrompt);
    }
  }

  closeDrawer() {
    if (this.chatDrawer) {
      this.chatDrawer.classList.remove('active');
    }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.messages = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
      this.messages = [];
    }

    if (this.messages.length === 0) {
      // Add initial welcome message
      this.messages.push({
        role: 'assistant',
        content: `Hi there! 👋 I am **Billa Komal Sushank's AI Portfolio Assistant**.\n\nAsk me anything about Sushank's projects (*RAG Chatbot, Vision AI, Speech AI, Language AI, Azure OpenAI, Employee Portal*), tech stack, or GitHub & LinkedIn profiles!`
      });
    }

    this.renderMessages();
  }

  saveHistory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.messages));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  }

  clearHistory() {
    this.messages = [{
      role: 'assistant',
      content: `Chat history cleared. How can I assist you with Sushank's portfolio today?`
    }];
    this.saveHistory();
    this.renderMessages();
  }

  renderSuggestedPills() {
    if (!this.suggestedPillsContainer || typeof CONFIG === 'undefined') return;
    this.suggestedPillsContainer.innerHTML = '';
    
    CONFIG.suggestedQuestions.forEach(q => {
      const pill = document.createElement('button');
      pill.className = 'chat-pill';
      pill.innerText = q;
      pill.addEventListener('click', () => {
        this.sendMessage(q);
      });
      this.suggestedPillsContainer.appendChild(pill);
    });
  }

  handleSendMessage() {
    if (!this.chatInput) return;
    const text = this.chatInput.value.trim();
    if (!text || this.isProcessing) return;

    this.chatInput.value = '';
    this.sendMessage(text);
  }

  async sendMessage(text) {
    if (this.isProcessing) return;

    // Add user message
    this.messages.push({ role: 'user', content: text });
    this.saveHistory();
    this.renderMessages();
    this.scrollToBottom();

    this.isProcessing = true;
    this.showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: this.messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      this.removeTypingIndicator();

      if (data.reply) {
        this.messages.push({ role: 'assistant', content: data.reply });
      } else {
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I ran into an issue connecting to the AI endpoint. Please try asking again!'
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      this.removeTypingIndicator();
      this.messages.push({
        role: 'assistant',
        content: `I experienced a network connection error. You can view Sushank's projects directly or retry your prompt.`
      });
    }

    this.isProcessing = false;
    this.saveHistory();
    this.renderMessages();
    this.scrollToBottom();
  }

  showTypingIndicator() {
    if (!this.chatContainer) return;
    this.removeTypingIndicator(); // remove existing if any

    const typingEl = document.createElement('div');
    typingEl.id = 'chat-typing-indicator';
    typingEl.className = 'chat-msg-row assistant-row';
    typingEl.innerHTML = `
      <div class="chat-avatar">AI</div>
      <div class="chat-bubble typing-bubble">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
    this.chatContainer.appendChild(typingEl);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  renderMessages() {
    if (!this.chatContainer) return;
    this.chatContainer.innerHTML = '';

    this.messages.forEach((msg, idx) => {
      const isUser = msg.role === 'user';
      const row = document.createElement('div');
      row.className = `chat-msg-row ${isUser ? 'user-row' : 'assistant-row'}`;

      const avatarHtml = isUser
        ? `<div class="chat-avatar user-avatar">YOU</div>`
        : `<div class="chat-avatar assistant-avatar">AI</div>`;

      const formattedContent = this.parseMarkdown(msg.content);

      const copyBtnHtml = !isUser
        ? `<button class="copy-msg-btn" data-index="${idx}" title="Copy response">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>`
        : '';

      row.innerHTML = `
        ${avatarHtml}
        <div class="chat-bubble">
          <div class="chat-text">${formattedContent}</div>
          ${copyBtnHtml}
        </div>
      `;

      this.chatContainer.appendChild(row);
    });

    // Attach copy button listeners
    this.chatContainer.querySelectorAll('.copy-msg-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = btn.getAttribute('data-index');
        if (idx !== null && this.messages[idx]) {
          navigator.clipboard.writeText(this.messages[idx].content);
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          setTimeout(() => {
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
          }, 2000);
        }
      });
    });
  }

  parseMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Markdown links [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // Inline code block
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Convert line breaks and bullet lists
    const lines = html.split('\n');
    let inList = false;
    let result = '';

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          result += '<ul>';
          inList = true;
        }
        result += `<li>${trimmed.substring(2)}</li>`;
      } else if (/^\d+\.\s/.test(trimmed)) {
        if (!inList) {
          result += '<ol>';
          inList = true;
        }
        const itemContent = trimmed.replace(/^\d+\.\s/, '');
        result += `<li>${itemContent}</li>`;
      } else {
        if (inList) {
          result += '</ul>';
          inList = false;
        }
        if (trimmed) {
          result += `<p>${line}</p>`;
        }
      }
    });

    if (inList) result += '</ul>';
    return result;
  }

  scrollToBottom() {
    if (this.chatContainer) {
      setTimeout(() => {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
      }, 50);
    }
  }
}

// Global assistant instance
let aiAssistant;
document.addEventListener('DOMContentLoaded', () => {
  aiAssistant = new AIChatAssistant();
});
