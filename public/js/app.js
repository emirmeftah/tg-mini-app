/* ============================================================
   MIR Messenger - Complete SPA Application
   Vanilla JavaScript, no frameworks
   ============================================================ */

(() => {
  'use strict';

  // ---- SVG Icons ----
  const Icons = {
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
    phoneOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    userPlus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    messageCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    logOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    micOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.36 2.18"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  };

  // ---- Configuration ----
  const API_BASE = window.location.origin;

  // ---- Application State ----
  const state = {
    currentUser: null,
    token: localStorage.getItem('mir_token'),
    contacts: [],
    activeChat: null, // contactUserId
    messages: {},     // { contactUserId: [msg, msg, ...] }
    onlineUsers: new Set(),
    typingUsers: new Set(),
    unreadCounts: {},  // { contactUserId: count }
    lastMessages: {},  // { contactUserId: { content, timestamp } }
    socket: null,
    isMobile: window.innerWidth <= 768,
    showingChat: false,
  };

  // ---- Audio Module ----
  const Audio = (() => {
    let audioCtx = null;

    function getCtx() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      return audioCtx;
    }

    function playTone(freq, duration, type = 'sine', volume = 0.15) {
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      } catch (e) { /* audio context may not be available */ }
    }

    return {
      messageSent() { playTone(800, 0.1, 'sine', 0.1); },
      messageReceived() {
        playTone(600, 0.1, 'sine', 0.12);
        setTimeout(() => playTone(900, 0.15, 'sine', 0.12), 100);
      },
      callRing() {
        playTone(440, 0.3, 'sine', 0.2);
        setTimeout(() => playTone(520, 0.3, 'sine', 0.2), 400);
      },
      callEnd() { playTone(300, 0.3, 'sine', 0.15); },
    };
  })();

  // ---- Helpers ----
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const el = (tag, attrs = {}, children = []) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'className') e.className = v;
      else if (k === 'innerHTML') e.innerHTML = v;
      else if (k === 'textContent') e.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') {
        e.addEventListener(k.slice(2).toLowerCase(), v);
      } else e.setAttribute(k, v);
    }
    for (const c of children) {
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else if (c) e.appendChild(c);
    }
    return e;
  };

  // Avatar color generation from string
  const avatarColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f5576c 0%, #ff9a44 100%)',
    'linear-gradient(135deg, #667eea 0%, #43e97b 100%)',
  ];

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  function getAvatarColor(name) {
    return avatarColors[hashStr(name || 'U') % avatarColors.length];
  }

  function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  function createAvatar(name, sizeClass = '') {
    const avatar = el('div', { className: `avatar ${sizeClass}`.trim() });
    avatar.style.background = getAvatarColor(name);
    avatar.textContent = getInitials(name);
    return avatar;
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (isYesterday) return 'Yesterday';
    return d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  }

  function formatMessageTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function formatDateDivider(ts) {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  // ---- API Module ----
  const API = {
    async request(method, path, body = null) {
      const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (state.token) opts.headers['Authorization'] = `Bearer ${state.token}`;
      if (body) opts.body = JSON.stringify(body);

      const res = await fetch(`${API_BASE}${path}`, opts);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || `Request failed (${res.status})`);
      }
      return data;
    },

    register(username, password, displayName) {
      return this.request('POST', '/api/auth/register', { username, password, displayName });
    },
    login(username, password) {
      return this.request('POST', '/api/auth/login', { username, password });
    },
    getProfile() {
      return this.request('GET', '/api/users/profile');
    },
    searchUsers(query) {
      return this.request('GET', `/api/users/search?q=${encodeURIComponent(query)}`);
    },
    getContacts() {
      return this.request('GET', '/api/contacts');
    },
    addContact(username) {
      return this.request('POST', '/api/contacts', { username });
    },
    removeContact(contactUserId) {
      return this.request('DELETE', `/api/contacts/${contactUserId}`);
    },
    getMessages(contactUserId) {
      return this.request('GET', `/api/messages/${contactUserId}`);
    },
  };

  // ---- Toast Module ----
  const Toast = (() => {
    let container = null;

    function ensure() {
      if (!container) {
        container = el('div', { className: 'toast-container' });
        document.body.appendChild(container);
      }
    }

    function show(message, type = 'info', duration = 3500) {
      ensure();
      const toast = el('div', { className: `toast ${type}` });
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return { show, error: (m) => show(m, 'error'), success: (m) => show(m, 'success') };
  })();

  // ---- Socket Module ----
  const Socket = (() => {
    function connect() {
      if (state.socket) state.socket.disconnect();

      const socket = io(API_BASE, {
        query: { token: state.token },
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        console.log('[Socket] Connected');
      });

      socket.on('disconnect', (reason) => {
        console.log('[Socket] Disconnected:', reason);
      });

      socket.on('connect_error', (err) => {
        console.error('[Socket] Connection error:', err.message);
      });

      // Messages
      socket.on('message:receive', (data) => {
        handleIncomingMessage(data);
      });

      socket.on('message:read:confirm', (data) => {
        // Messages from `data.from` have been read
      });

      // Typing
      socket.on('typing:start', (data) => {
        state.typingUsers.add(data.from);
        renderTypingState(data.from);
      });

      socket.on('typing:stop', (data) => {
        state.typingUsers.delete(data.from);
        renderTypingState(data.from);
      });

      // Online presence
      socket.on('user:online', (data) => {
        state.onlineUsers.add(data.userId);
        renderOnlineState(data.userId);
      });

      socket.on('user:offline', (data) => {
        state.onlineUsers.delete(data.userId);
        renderOnlineState(data.userId);
      });

      // Calls
      socket.on('call:incoming', (data) => {
        Call.handleIncoming(data);
      });

      socket.on('call:answer:received', (data) => {
        Call.handleAnswer(data);
      });

      socket.on('call:ice-candidate:received', (data) => {
        Call.handleIceCandidate(data);
      });

      socket.on('call:rejected', (data) => {
        Call.handleRejected(data);
      });

      socket.on('call:ended', (data) => {
        Call.handleEnded(data);
      });

      state.socket = socket;
    }

    function disconnect() {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    }

    function emit(event, data) {
      if (state.socket && state.socket.connected) {
        state.socket.emit(event, data);
      }
    }

    return { connect, disconnect, emit };
  })();

  // ---- Handle Incoming Message ----
  function handleIncomingMessage(data) {
    const { from, fromUser, content, timestamp, id } = data;

    // Cache message
    if (!state.messages[from]) state.messages[from] = [];
    state.messages[from].push({
      id,
      from,
      to: state.currentUser._id || state.currentUser.id,
      content,
      timestamp,
    });

    // Update last message
    state.lastMessages[from] = { content, timestamp };

    // If this chat is active, render and mark as read
    if (state.activeChat === from) {
      renderMessages();
      Socket.emit('message:read', { from });
    } else {
      // Increment unread
      state.unreadCounts[from] = (state.unreadCounts[from] || 0) + 1;
      Audio.messageReceived();
    }

    // Re-render chat list to show latest message
    renderChatList();
  }

  // ---- Render Typing State ----
  function renderTypingState(userId) {
    // Update chat list preview
    const chatItem = $(`.chat-item[data-user-id="${userId}"]`);
    if (chatItem) {
      const preview = $('.chat-item-preview', chatItem);
      if (state.typingUsers.has(userId)) {
        preview.textContent = 'typing...';
        preview.classList.add('typing');
      } else {
        preview.classList.remove('typing');
        const lastMsg = state.lastMessages[userId];
        preview.textContent = lastMsg ? lastMsg.content : '';
      }
    }

    // Update chat header and typing indicator
    if (state.activeChat === userId) {
      const statusEl = $('.chat-header-status');
      const typingEl = $('.typing-indicator');
      if (state.typingUsers.has(userId)) {
        if (statusEl) { statusEl.textContent = 'typing...'; statusEl.className = 'chat-header-status typing'; }
        if (typingEl) typingEl.classList.add('visible');
      } else {
        updateChatHeaderStatus(userId);
        if (typingEl) typingEl.classList.remove('visible');
      }
    }
  }

  // ---- Render Online State ----
  function renderOnlineState(userId) {
    // Update chat list online indicator
    const chatItem = $(`.chat-item[data-user-id="${userId}"]`);
    if (chatItem) {
      const avatar = $('.avatar', chatItem);
      let dot = $('.online-indicator', avatar);
      if (state.onlineUsers.has(userId)) {
        if (!dot) {
          dot = el('div', { className: 'online-indicator' });
          avatar.appendChild(dot);
        }
      } else {
        if (dot) dot.remove();
      }
    }

    // Update chat header status
    if (state.activeChat === userId) {
      updateChatHeaderStatus(userId);
    }
  }

  function updateChatHeaderStatus(userId) {
    const statusEl = $('.chat-header-status');
    if (!statusEl) return;
    if (state.typingUsers.has(userId)) {
      statusEl.textContent = 'typing...';
      statusEl.className = 'chat-header-status typing';
    } else if (state.onlineUsers.has(userId)) {
      statusEl.textContent = 'online';
      statusEl.className = 'chat-header-status online';
    } else {
      statusEl.textContent = 'offline';
      statusEl.className = 'chat-header-status';
    }
  }

  // ---- Auth View ----
  function renderAuthView() {
    const app = $('#app');
    app.innerHTML = '';

    let activeTab = 'login';

    const view = el('div', { className: 'auth-view' });

    const card = el('div', { className: 'auth-card' });

    // Logo
    const logo = el('div', { className: 'auth-logo' }, [
      el('div', { className: 'auth-logo-icon', textContent: 'M' }),
      el('h1', { textContent: 'MIR Messenger' }),
      el('p', { textContent: 'Secure, fast, and beautiful messaging' }),
    ]);

    // Tabs
    const tabLogin = el('button', { className: 'auth-tab active', textContent: 'Sign In' });
    const tabRegister = el('button', { className: 'auth-tab', textContent: 'Sign Up' });
    const tabs = el('div', { className: 'auth-tabs' }, [tabLogin, tabRegister]);

    // Error
    const errorEl = el('div', { className: 'auth-error' });

    // Login form
    const loginForm = el('form', { className: 'auth-form' }, [
      el('div', { className: 'form-group' }, [
        el('label', { textContent: 'Username' }),
        el('input', { className: 'form-input', type: 'text', placeholder: 'Enter your username', name: 'username', autocomplete: 'username', required: 'true' }),
      ]),
      el('div', { className: 'form-group' }, [
        el('label', { textContent: 'Password' }),
        el('input', { className: 'form-input', type: 'password', placeholder: 'Enter your password', name: 'password', autocomplete: 'current-password', required: 'true' }),
      ]),
      el('button', { className: 'btn btn-primary', type: 'submit', textContent: 'Sign In' }),
    ]);

    // Register form
    const registerForm = el('form', { className: 'auth-form hidden' }, [
      el('div', { className: 'form-group' }, [
        el('label', { textContent: 'Display Name' }),
        el('input', { className: 'form-input', type: 'text', placeholder: 'Your display name', name: 'displayName', autocomplete: 'name', required: 'true' }),
      ]),
      el('div', { className: 'form-group' }, [
        el('label', { textContent: 'Username' }),
        el('input', { className: 'form-input', type: 'text', placeholder: 'Choose a username', name: 'username', autocomplete: 'username', required: 'true' }),
      ]),
      el('div', { className: 'form-group' }, [
        el('label', { textContent: 'Password' }),
        el('input', { className: 'form-input', type: 'password', placeholder: 'Create a password', name: 'password', autocomplete: 'new-password', required: 'true', minLength: '6' }),
      ]),
      el('button', { className: 'btn btn-primary', type: 'submit', textContent: 'Create Account' }),
    ]);

    // Tab switching
    tabLogin.addEventListener('click', () => {
      activeTab = 'login';
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      errorEl.classList.remove('visible');
    });

    tabRegister.addEventListener('click', () => {
      activeTab = 'register';
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      errorEl.classList.remove('visible');
    });

    // Login handler
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('button[type="submit"]', loginForm);
      const username = $('input[name="username"]', loginForm).value.trim();
      const password = $('input[name="password"]', loginForm).value;

      if (!username || !password) {
        errorEl.textContent = 'Please fill in all fields';
        errorEl.classList.add('visible');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Signing in...`;
      errorEl.classList.remove('visible');

      try {
        const data = await API.login(username, password);
        state.token = data.token;
        state.currentUser = data.user;
        localStorage.setItem('mir_token', data.token);
        Socket.connect();
        renderMainView();
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.add('visible');
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    });

    // Register handler
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('button[type="submit"]', registerForm);
      const displayName = $('input[name="displayName"]', registerForm).value.trim();
      const username = $('input[name="username"]', registerForm).value.trim();
      const password = $('input[name="password"]', registerForm).value;

      if (!displayName || !username || !password) {
        errorEl.textContent = 'Please fill in all fields';
        errorEl.classList.add('visible');
        return;
      }

      if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters';
        errorEl.classList.add('visible');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Creating account...`;
      errorEl.classList.remove('visible');

      try {
        const data = await API.register(username, password, displayName);
        state.token = data.token;
        state.currentUser = data.user;
        localStorage.setItem('mir_token', data.token);
        Socket.connect();
        renderMainView();
      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.add('visible');
        btn.disabled = false;
        btn.textContent = 'Create Account';
      }
    });

    card.append(logo, tabs, errorEl, loginForm, registerForm);
    view.appendChild(card);
    app.appendChild(view);
  }

  // ---- Main View ----
  function renderMainView() {
    const app = $('#app');
    app.innerHTML = '';

    const view = el('div', { className: 'main-view' });

    // Sidebar
    const sidebar = el('div', { className: 'sidebar', id: 'sidebar' });

    const sidebarHeader = el('div', { className: 'sidebar-header' }, [
      el('div', { className: 'sidebar-title', textContent: 'MIR' }),
      el('div', { className: 'sidebar-actions' }, [
        el('button', {
          className: 'btn-icon',
          innerHTML: Icons.userPlus,
          title: 'Add Contact',
          onClick: () => showContactModal(),
        }),
      ]),
    ]);

    const searchBar = el('div', { className: 'search-bar' }, [
      el('div', { className: 'search-input-wrap' }, [
        el('span', { innerHTML: Icons.search }),
        el('input', {
          className: 'search-input',
          type: 'text',
          placeholder: 'Search conversations...',
          id: 'sidebar-search',
        }),
      ]),
    ]);

    const chatListEl = el('div', { className: 'chat-list', id: 'chat-list' });

    // User profile strip
    const userStrip = el('div', { className: 'user-strip', id: 'user-strip' });
    renderUserStrip(userStrip);

    sidebar.append(sidebarHeader, searchBar, chatListEl, userStrip);

    // Chat area
    const chatArea = el('div', { className: 'chat-area', id: 'chat-area' });
    renderEmptyChatArea(chatArea);

    view.append(sidebar, chatArea);
    app.appendChild(view);

    // Sidebar search filter
    const searchInput = $('#sidebar-search');
    searchInput.addEventListener('input', debounce((e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = $$('.chat-item', chatListEl);
      items.forEach(item => {
        const name = item.getAttribute('data-name').toLowerCase();
        item.style.display = name.includes(q) ? '' : 'none';
      });
    }, 200));

    // Load contacts
    loadContacts();

    // Handle resize
    window.addEventListener('resize', () => {
      state.isMobile = window.innerWidth <= 768;
    });
  }

  function renderUserStrip(container) {
    if (!container) container = $('#user-strip');
    if (!container) return;
    container.innerHTML = '';

    const user = state.currentUser;
    if (!user) return;

    const displayName = user.displayName || user.username;
    const avatar = createAvatar(displayName, 'avatar-sm');
    const info = el('div', { className: 'user-strip-info' }, [
      el('div', { className: 'user-strip-name', textContent: displayName }),
      el('div', { className: 'user-strip-status', textContent: `@${user.username}` }),
    ]);
    const logoutBtn = el('button', {
      className: 'btn-icon',
      innerHTML: Icons.logOut,
      title: 'Sign out',
      onClick: handleLogout,
    });

    container.append(avatar, info, logoutBtn);
  }

  function handleLogout() {
    Socket.disconnect();
    state.token = null;
    state.currentUser = null;
    state.contacts = [];
    state.activeChat = null;
    state.messages = {};
    state.onlineUsers.clear();
    state.typingUsers.clear();
    state.unreadCounts = {};
    state.lastMessages = {};
    localStorage.removeItem('mir_token');
    renderAuthView();
  }

  function renderEmptyChatArea(container) {
    if (!container) container = $('#chat-area');
    if (!container) return;
    container.innerHTML = '';
    container.className = 'chat-area';

    const empty = el('div', { className: 'chat-area-empty' }, [
      el('div', { className: 'chat-area-empty-icon', innerHTML: Icons.messageCircle }),
      el('h2', { textContent: 'Welcome to MIR Messenger' }),
      el('p', { textContent: 'Select a conversation from the sidebar or add a new contact to start chatting.' }),
    ]);

    container.appendChild(empty);
  }

  // ---- Contacts Module ----
  async function loadContacts() {
    try {
      const data = await API.getContacts();
      // data might be an array directly or { contacts: [...] }
      state.contacts = Array.isArray(data) ? data : (data.contacts || []);
      renderChatList();
    } catch (err) {
      console.error('Failed to load contacts:', err);
      // If token is invalid, go back to auth
      if (err.message.includes('401') || err.message.includes('unauthorized') || err.message.includes('Unauthorized') || err.message.includes('token') || err.message.includes('Token')) {
        handleLogout();
      }
    }
  }

  function renderChatList() {
    const container = $('#chat-list');
    if (!container) return;
    container.innerHTML = '';

    if (state.contacts.length === 0) {
      const empty = el('div', { className: 'chat-list-empty' }, [
        el('div', { className: 'chat-list-empty-icon', innerHTML: Icons.users }),
        el('h3', { textContent: 'No conversations yet' }),
        el('p', { textContent: 'Add contacts to start messaging. Tap the + button above to search for users.' }),
      ]);
      container.appendChild(empty);
      return;
    }

    // Sort contacts: those with last messages first (by timestamp), then alphabetically
    const sorted = [...state.contacts].sort((a, b) => {
      const idA = a.contactUser?._id || a.contactUser?.id || a._id || a.id;
      const idB = b.contactUser?._id || b.contactUser?.id || b._id || b.id;
      const lastA = state.lastMessages[idA];
      const lastB = state.lastMessages[idB];
      if (lastA && lastB) return new Date(lastB.timestamp) - new Date(lastA.timestamp);
      if (lastA) return -1;
      if (lastB) return 1;
      const nameA = (a.contactUser?.displayName || a.displayName || a.username || '').toLowerCase();
      const nameB = (b.contactUser?.displayName || b.displayName || b.username || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

    sorted.forEach(contact => {
      const user = contact.contactUser || contact;
      const userId = user._id || user.id;
      const displayName = user.displayName || user.username;
      const lastMsg = state.lastMessages[userId];
      const unread = state.unreadCounts[userId] || 0;
      const isOnline = state.onlineUsers.has(userId);
      const isActive = state.activeChat === userId;
      const isTyping = state.typingUsers.has(userId);

      const avatar = createAvatar(displayName);
      if (isOnline) {
        avatar.appendChild(el('div', { className: 'online-indicator' }));
      }

      const previewText = isTyping ? 'typing...' : (lastMsg ? lastMsg.content : '');
      const previewClass = `chat-item-preview${isTyping ? ' typing' : ''}`;

      const item = el('div', {
        className: `chat-item${isActive ? ' active' : ''}`,
        'data-user-id': userId,
        'data-name': displayName,
        onClick: () => openChat(userId, displayName, contact),
      }, [
        avatar,
        el('div', { className: 'chat-item-info' }, [
          el('div', { className: 'chat-item-top' }, [
            el('div', { className: 'chat-item-name', textContent: displayName }),
            lastMsg ? el('div', { className: 'chat-item-time', textContent: formatTime(lastMsg.timestamp) }) : null,
          ]),
          el('div', { className: 'chat-item-bottom' }, [
            el('div', { className: previewClass, textContent: previewText }),
            unread > 0 ? el('div', { className: 'unread-badge', textContent: String(unread) }) : null,
          ]),
        ]),
      ]);

      // Right click for context menu
      item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, userId, displayName);
      });

      container.appendChild(item);
    });
  }

  // ---- Context Menu ----
  function showContextMenu(e, userId, displayName) {
    // Remove existing
    const existing = $('.contact-context-menu');
    if (existing) existing.remove();

    const menu = el('div', { className: 'contact-context-menu' }, [
      el('button', {
        className: 'context-menu-item danger',
        innerHTML: `${Icons.trash}<span>Remove ${displayName}</span>`,
        onClick: async () => {
          menu.remove();
          try {
            await API.removeContact(userId);
            state.contacts = state.contacts.filter(c => {
              const u = c.contactUser || c;
              return (u._id || u.id) !== userId;
            });
            if (state.activeChat === userId) {
              state.activeChat = null;
              renderEmptyChatArea();
              if (state.isMobile) showSidebar();
            }
            renderChatList();
            Toast.success('Contact removed');
          } catch (err) {
            Toast.error(err.message);
          }
        },
      }),
    ]);

    // Position menu
    menu.style.left = `${Math.min(e.clientX, window.innerWidth - 180)}px`;
    menu.style.top = `${Math.min(e.clientY, window.innerHeight - 60)}px`;

    document.body.appendChild(menu);

    // Close on click anywhere
    const closeMenu = () => {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 10);
  }

  // ---- Contact Search Modal ----
  function showContactModal() {
    const overlay = el('div', { className: 'modal-overlay', onClick: (e) => {
      if (e.target === overlay) overlay.remove();
    }});

    const modal = el('div', { className: 'modal' });

    const header = el('div', { className: 'modal-header' }, [
      el('h2', { textContent: 'Add Contact' }),
      el('button', { className: 'modal-close', innerHTML: Icons.x, onClick: () => overlay.remove() }),
    ]);

    const searchInput = el('input', {
      className: 'modal-search-input',
      type: 'text',
      placeholder: 'Search by username...',
      autofocus: 'true',
    });

    const results = el('div', { className: 'search-results' });
    const hint = el('div', { className: 'search-hint', textContent: 'Type a username to search for users' });

    const body = el('div', { className: 'modal-body' }, [searchInput, hint, results]);

    searchInput.addEventListener('input', debounce(async (e) => {
      const q = e.target.value.trim();
      results.innerHTML = '';
      hint.style.display = 'none';

      if (q.length < 1) {
        hint.style.display = '';
        hint.textContent = 'Type a username to search for users';
        return;
      }

      try {
        const data = await API.searchUsers(q);
        const users = Array.isArray(data) ? data : (data.users || []);

        if (users.length === 0) {
          results.innerHTML = `<div class="search-empty">No users found matching "${q}"</div>`;
          return;
        }

        // Filter out self
        const currentId = state.currentUser._id || state.currentUser.id;
        const filtered = users.filter(u => (u._id || u.id) !== currentId);

        if (filtered.length === 0) {
          results.innerHTML = `<div class="search-empty">No other users found</div>`;
          return;
        }

        filtered.forEach(user => {
          const userId = user._id || user.id;
          const isContact = state.contacts.some(c => {
            const u = c.contactUser || c;
            return (u._id || u.id) === userId;
          });

          const item = el('div', { className: 'search-result-item' }, [
            createAvatar(user.displayName || user.username, 'avatar-sm'),
            el('div', { className: 'search-result-info' }, [
              el('div', { className: 'search-result-name', textContent: user.displayName || user.username }),
              el('div', { className: 'search-result-username', textContent: `@${user.username}` }),
            ]),
            isContact
              ? el('span', { className: 'btn btn-ghost', innerHTML: `${Icons.check} Added`, style: 'pointer-events:none;opacity:0.5;padding:8px 12px;font-size:12px;' })
              : el('button', {
                  className: 'btn btn-primary',
                  textContent: 'Add',
                  onClick: async (e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.innerHTML = `<span class="spinner"></span>`;
                    try {
                      await API.addContact(user.username);
                      btn.innerHTML = `${Icons.check} Added`;
                      btn.className = 'btn btn-ghost';
                      btn.style.pointerEvents = 'none';
                      btn.style.opacity = '0.5';
                      // Reload contacts
                      await loadContacts();
                      Toast.success(`${user.displayName || user.username} added!`);
                    } catch (err) {
                      Toast.error(err.message);
                      btn.disabled = false;
                      btn.textContent = 'Add';
                    }
                  },
                }),
          ]);

          results.appendChild(item);
        });
      } catch (err) {
        results.innerHTML = `<div class="search-empty">Search failed: ${err.message}</div>`;
      }
    }, 300));

    modal.append(header, body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus the input
    setTimeout(() => searchInput.focus(), 100);
  }

  // ---- Chat Module ----
  async function openChat(contactUserId, displayName, contactObj) {
    state.activeChat = contactUserId;
    state.unreadCounts[contactUserId] = 0;

    // Mark as read
    Socket.emit('message:read', { from: contactUserId });

    // Mobile: show chat
    if (state.isMobile) showChat();

    // Re-render chat list to update active state
    renderChatList();

    // Render chat area
    renderChatArea(contactUserId, displayName, contactObj);

    // Fetch messages
    try {
      const data = await API.getMessages(contactUserId);
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      state.messages[contactUserId] = msgs;

      // Update last messages
      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        state.lastMessages[contactUserId] = {
          content: lastMsg.content,
          timestamp: lastMsg.timestamp || lastMsg.createdAt,
        };
        renderChatList();
      }

      renderMessages();
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }

  function renderChatArea(contactUserId, displayName, contactObj) {
    const container = $('#chat-area');
    if (!container) return;
    container.innerHTML = '';
    container.className = `chat-area${state.isMobile && state.showingChat ? ' active-mobile' : ''}`;

    const user = contactObj?.contactUser || contactObj || {};
    const name = displayName || user.displayName || user.username || 'Unknown';
    const isOnline = state.onlineUsers.has(contactUserId);
    const isTyping = state.typingUsers.has(contactUserId);

    let statusText = isOnline ? 'online' : 'offline';
    let statusClass = `chat-header-status${isOnline ? ' online' : ''}`;
    if (isTyping) { statusText = 'typing...'; statusClass = 'chat-header-status typing'; }

    // Header
    const header = el('div', { className: 'chat-header' }, [
      el('button', {
        className: 'chat-header-back btn-icon',
        innerHTML: Icons.arrowLeft,
        onClick: () => {
          state.activeChat = null;
          state.showingChat = false;
          renderEmptyChatArea();
          if (state.isMobile) showSidebar();
          renderChatList();
        },
      }),
      createAvatar(name, 'avatar-sm'),
      el('div', { className: 'chat-header-info' }, [
        el('div', { className: 'chat-header-name', textContent: name }),
        el('div', { className: statusClass, textContent: statusText }),
      ]),
      el('div', { className: 'chat-header-actions' }, [
        el('button', {
          className: 'btn-icon',
          innerHTML: Icons.phone,
          title: 'Audio call',
          onClick: () => Call.initiate(contactUserId, name, 'audio'),
        }),
        el('button', {
          className: 'btn-icon',
          innerHTML: Icons.video,
          title: 'Video call',
          onClick: () => Call.initiate(contactUserId, name, 'video'),
        }),
      ]),
    ]);

    // Messages area
    const messagesArea = el('div', { className: 'messages-area', id: 'messages-area' });

    // Typing indicator
    const typingIndicator = el('div', {
      className: `typing-indicator${isTyping ? ' visible' : ''}`,
    }, [
      el('div', { className: 'typing-dots' }, [
        el('span'), el('span'), el('span'),
      ]),
    ]);

    // Input bar
    const msgInput = el('textarea', {
      className: 'message-input',
      placeholder: 'Type a message...',
      rows: '1',
      id: 'message-input',
    });

    const sendBtn = el('button', {
      className: 'send-btn',
      innerHTML: Icons.send,
      title: 'Send message',
      onClick: () => sendMessage(contactUserId),
    });

    const inputBar = el('div', { className: 'message-input-bar' }, [msgInput, sendBtn]);

    // Textarea auto-resize and Enter to send
    let typingTimer = null;
    let isTypingNow = false;

    msgInput.addEventListener('input', () => {
      // Auto-resize
      msgInput.style.height = 'auto';
      msgInput.style.height = Math.min(msgInput.scrollHeight, 120) + 'px';

      // Typing indicator
      if (!isTypingNow && msgInput.value.trim()) {
        isTypingNow = true;
        Socket.emit('typing:start', { to: contactUserId });
      }
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        if (isTypingNow) {
          isTypingNow = false;
          Socket.emit('typing:stop', { to: contactUserId });
        }
      }, 2000);
    });

    msgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(contactUserId);
      }
    });

    container.append(header, messagesArea, typingIndicator, inputBar);

    // Render existing messages
    renderMessages();
  }

  function sendMessage(contactUserId) {
    const input = $('#message-input');
    if (!input) return;

    const content = input.value.trim();
    if (!content) return;

    // Stop typing
    Socket.emit('typing:stop', { to: contactUserId });

    // Send via socket
    Socket.emit('message:send', { to: contactUserId, content });

    // Optimistic local update
    const myId = state.currentUser._id || state.currentUser.id;
    const msg = {
      id: `local_${Date.now()}`,
      from: myId,
      to: contactUserId,
      content,
      timestamp: new Date().toISOString(),
    };

    if (!state.messages[contactUserId]) state.messages[contactUserId] = [];
    state.messages[contactUserId].push(msg);

    // Update last message
    state.lastMessages[contactUserId] = { content, timestamp: msg.timestamp };

    // Play sound
    Audio.messageSent();

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Render
    renderMessages();
    renderChatList();
  }

  function renderMessages() {
    const container = $('#messages-area');
    if (!container || !state.activeChat) return;

    const msgs = state.messages[state.activeChat] || [];
    container.innerHTML = '';

    if (msgs.length === 0) {
      const empty = el('div', {
        className: 'chat-area-empty',
        style: 'height:100%;padding:20px;',
      }, [
        el('p', {
          textContent: 'No messages yet. Say hello!',
          style: 'color:var(--text-muted);font-size:14px;',
        }),
      ]);
      container.appendChild(empty);
      return;
    }

    const myId = state.currentUser._id || state.currentUser.id;
    let lastDate = null;

    msgs.forEach((msg) => {
      const ts = msg.timestamp || msg.createdAt;
      const msgDate = new Date(ts).toDateString();

      // Date divider
      if (msgDate !== lastDate) {
        lastDate = msgDate;
        const divider = el('div', { className: 'message-date-divider' }, [
          el('span', { textContent: formatDateDivider(ts) }),
        ]);
        container.appendChild(divider);
      }

      const isSent = (msg.from === myId) || (msg.from?._id === myId) || (msg.from?.id === myId);
      const row = el('div', { className: `message-row ${isSent ? 'sent' : 'received'}` });
      const bubble = el('div', { className: 'message-bubble' }, [
        el('div', { className: 'message-text', textContent: msg.content }),
        el('div', { className: 'message-meta' }, [
          el('span', { className: 'message-time', textContent: formatMessageTime(ts) }),
        ]),
      ]);
      row.appendChild(bubble);
      container.appendChild(row);
    });

    // Scroll to bottom
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }

  // ---- Mobile Navigation ----
  function showChat() {
    state.showingChat = true;
    const sidebar = $('#sidebar');
    const chatArea = $('#chat-area');
    if (sidebar) sidebar.classList.add('hidden-mobile');
    if (chatArea) chatArea.classList.add('active-mobile');
  }

  function showSidebar() {
    state.showingChat = false;
    const sidebar = $('#sidebar');
    const chatArea = $('#chat-area');
    if (sidebar) sidebar.classList.remove('hidden-mobile');
    if (chatArea) chatArea.classList.remove('active-mobile');
  }

  // ---- Call Module ----
  const Call = (() => {
    let peerConnection = null;
    let localStream = null;
    let remoteStream = null;
    let callOverlay = null;
    let callTimerInterval = null;
    let callStartTime = null;
    let currentCallUser = null;
    let currentCallType = null;
    let ringInterval = null;

    const ICE_SERVERS = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ];

    function startRinging() {
      Audio.callRing();
      ringInterval = setInterval(() => Audio.callRing(), 3000);
    }

    function stopRinging() {
      if (ringInterval) {
        clearInterval(ringInterval);
        ringInterval = null;
      }
    }

    async function initiate(userId, displayName, type = 'audio') {
      currentCallUser = { id: userId, displayName };
      currentCallType = type;

      showOutgoingCallUI(displayName, type);
      startRinging();

      try {
        const constraints = type === 'video'
          ? { audio: true, video: true }
          : { audio: true, video: false };

        localStream = await navigator.mediaDevices.getUserMedia(constraints);

        peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            Socket.emit('call:ice-candidate', {
              to: userId,
              candidate: event.candidate,
            });
          }
        };

        peerConnection.ontrack = (event) => {
          remoteStream = event.streams[0];
          const remoteAudio = $('#remote-audio');
          const remoteVideo = $('#remote-video');
          if (remoteVideo && type === 'video') {
            remoteVideo.srcObject = remoteStream;
          } else if (remoteAudio) {
            remoteAudio.srcObject = remoteStream;
          }
        };

        peerConnection.oniceconnectionstatechange = () => {
          if (peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'failed') {
            endCall();
          }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        Socket.emit('call:offer', {
          to: userId,
          offer: offer,
          type: type,
        });
      } catch (err) {
        console.error('Call initiation failed:', err);
        Toast.error('Could not start call: ' + err.message);
        endCall();
      }
    }

    function handleIncoming(data) {
      const { from, fromUser, offer, type } = data;
      currentCallUser = { id: from, displayName: fromUser?.displayName || fromUser?.username || 'Unknown' };
      currentCallType = type || 'audio';

      showIncomingCallUI(currentCallUser.displayName, currentCallType, async () => {
        // Accept
        stopRinging();
        try {
          const constraints = currentCallType === 'video'
            ? { audio: true, video: true }
            : { audio: true, video: false };

          localStream = await navigator.mediaDevices.getUserMedia(constraints);

          peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

          localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
          });

          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              Socket.emit('call:ice-candidate', {
                to: from,
                candidate: event.candidate,
              });
            }
          };

          peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            const remoteAudio = $('#remote-audio');
            const remoteVideo = $('#remote-video');
            if (remoteVideo && currentCallType === 'video') {
              remoteVideo.srcObject = remoteStream;
            } else if (remoteAudio) {
              remoteAudio.srcObject = remoteStream;
            }
          };

          peerConnection.oniceconnectionstatechange = () => {
            if (peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'failed') {
              endCall();
            }
          };

          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          Socket.emit('call:answer', {
            to: from,
            answer: answer,
          });

          showActiveCallUI(currentCallUser.displayName, currentCallType);
        } catch (err) {
          console.error('Failed to accept call:', err);
          Toast.error('Failed to accept call: ' + err.message);
          endCall();
        }
      }, () => {
        // Reject
        stopRinging();
        Socket.emit('call:reject', { to: from });
        removeCallOverlay();
      });

      startRinging();
    }

    async function handleAnswer(data) {
      stopRinging();
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          showActiveCallUI(currentCallUser?.displayName || 'Unknown', currentCallType);
        } catch (err) {
          console.error('Failed to set remote description:', err);
        }
      }
    }

    async function handleIceCandidate(data) {
      if (peerConnection && data.candidate) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Failed to add ICE candidate:', err);
        }
      }
    }

    function handleRejected() {
      stopRinging();
      Toast.show('Call was rejected');
      Audio.callEnd();
      endCall();
    }

    function handleEnded() {
      stopRinging();
      Audio.callEnd();
      endCall();
    }

    function endCall() {
      stopRinging();
      if (callTimerInterval) {
        clearInterval(callTimerInterval);
        callTimerInterval = null;
      }
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
        localStream = null;
      }
      if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
      }
      remoteStream = null;
      callStartTime = null;

      if (currentCallUser) {
        Socket.emit('call:end', { to: currentCallUser.id });
      }
      currentCallUser = null;
      currentCallType = null;

      removeCallOverlay();
    }

    function removeCallOverlay() {
      if (callOverlay) {
        callOverlay.remove();
        callOverlay = null;
      }
    }

    function showOutgoingCallUI(displayName, type) {
      removeCallOverlay();

      const avatar = createAvatar(displayName, 'avatar-xl');
      const avatarWrap = el('div', { className: 'call-avatar ringing' }, [avatar]);

      callOverlay = el('div', { className: 'call-overlay' }, [
        type === 'video' ? el('audio', { id: 'remote-audio', autoplay: 'true' }) : el('audio', { id: 'remote-audio', autoplay: 'true' }),
        el('div', { className: 'call-info' }, [
          avatarWrap,
          el('div', { className: 'call-name', textContent: displayName }),
          el('div', { className: 'call-status', textContent: `Calling... (${type})` }),
          el('div', { className: 'call-timer', id: 'call-timer' }),
        ]),
        el('div', { className: 'call-actions' }, [
          el('div', { className: 'call-btn-label' }, [
            el('button', {
              className: 'call-btn call-btn-end',
              innerHTML: Icons.phoneOff,
              onClick: () => { endCall(); },
            }),
            el('span', { textContent: 'End' }),
          ]),
        ]),
      ]);

      document.body.appendChild(callOverlay);
    }

    function showIncomingCallUI(displayName, type, onAccept, onReject) {
      removeCallOverlay();

      const avatar = createAvatar(displayName, 'avatar-xl');
      const avatarWrap = el('div', { className: 'call-avatar ringing' }, [avatar]);

      callOverlay = el('div', { className: 'call-overlay' }, [
        el('audio', { id: 'remote-audio', autoplay: 'true' }),
        el('div', { className: 'call-info' }, [
          avatarWrap,
          el('div', { className: 'call-name', textContent: displayName }),
          el('div', { className: 'call-status', textContent: `Incoming ${type} call...` }),
        ]),
        el('div', { className: 'call-incoming-actions' }, [
          el('div', { className: 'call-btn-label' }, [
            el('button', {
              className: 'call-btn call-btn-reject',
              innerHTML: Icons.phoneOff,
              onClick: onReject,
            }),
            el('span', { textContent: 'Decline' }),
          ]),
          el('div', { className: 'call-btn-label' }, [
            el('button', {
              className: 'call-btn call-btn-accept',
              innerHTML: Icons.phone,
              onClick: onAccept,
            }),
            el('span', { textContent: 'Accept' }),
          ]),
        ]),
      ]);

      document.body.appendChild(callOverlay);
    }

    function showActiveCallUI(displayName, type) {
      removeCallOverlay();
      callStartTime = Date.now();
      let isMuted = false;

      const avatar = createAvatar(displayName, 'avatar-xl');
      const timerEl = el('div', { className: 'call-timer', id: 'call-timer', textContent: '00:00' });

      const muteBtn = el('button', {
        className: 'call-btn call-btn-mute',
        innerHTML: Icons.mic,
        onClick: () => {
          isMuted = !isMuted;
          if (localStream) {
            localStream.getAudioTracks().forEach(t => { t.enabled = !isMuted; });
          }
          muteBtn.innerHTML = isMuted ? Icons.micOff : Icons.mic;
          muteBtn.classList.toggle('active', isMuted);
        },
      });

      const videoElements = [];
      if (type === 'video') {
        const remoteVideo = el('video', { id: 'remote-video', autoplay: 'true', playsinline: 'true' });
        const localVideo = el('video', { id: 'local-video', className: 'local-video', autoplay: 'true', playsinline: 'true', muted: 'true' });
        if (remoteStream) remoteVideo.srcObject = remoteStream;
        if (localStream) localVideo.srcObject = localStream;
        videoElements.push(
          el('div', { className: 'video-container' }, [remoteVideo, localVideo])
        );
      }

      callOverlay = el('div', { className: 'call-overlay' }, [
        el('audio', { id: 'remote-audio', autoplay: 'true' }),
        ...videoElements,
        ...(type !== 'video' ? [
          el('div', { className: 'call-info' }, [
            el('div', { className: 'call-avatar' }, [avatar]),
            el('div', { className: 'call-name', textContent: displayName }),
            timerEl,
          ]),
        ] : []),
        el('div', { className: type === 'video' ? 'call-overlay-actions' : 'call-actions' }, [
          el('div', { className: 'call-btn-label' }, [
            muteBtn,
            el('span', { textContent: 'Mute' }),
          ]),
          el('div', { className: 'call-btn-label' }, [
            el('button', {
              className: 'call-btn call-btn-end',
              innerHTML: Icons.phoneOff,
              onClick: () => { endCall(); },
            }),
            el('span', { textContent: 'End' }),
          ]),
        ]),
      ]);

      // Connect remote stream to audio
      if (remoteStream) {
        const audioEl = $('audio', callOverlay);
        if (audioEl) audioEl.srcObject = remoteStream;
      }

      document.body.appendChild(callOverlay);

      // Start timer
      callTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - callStartTime) / 1000);
        const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const ss = String(elapsed % 60).padStart(2, '0');
        const te = type === 'video' ? null : $('#call-timer');
        if (te) te.textContent = `${mm}:${ss}`;
      }, 1000);
    }

    return { initiate, handleIncoming, handleAnswer, handleIceCandidate, handleRejected, handleEnded };
  })();

  // ---- Initialize ----
  async function init() {
    // Show loading
    const app = $('#app');
    app.innerHTML = `<div class="loading-view"><div class="loading-spinner"></div></div>`;

    // Try auto-login
    if (state.token) {
      try {
        const data = await API.getProfile();
        state.currentUser = data.user || data;
        Socket.connect();
        renderMainView();
        return;
      } catch (err) {
        console.log('Auto-login failed:', err.message);
        state.token = null;
        localStorage.removeItem('mir_token');
      }
    }

    renderAuthView();
  }

  // Start the app
  init();
})();
