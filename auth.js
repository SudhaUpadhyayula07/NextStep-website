(function () {
  const API_BASE = window.NEXTSTEP_API_BASE || ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:4000' : '');

  function getToken() {
    return localStorage.getItem('token') || localStorage.getItem('authToken') || '';
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }

  function saveSession(data) {
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('authToken', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    localStorage.setItem('loggedIn', 'true');
  }

  function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true' || !!getToken();
  }

  function requireLogin() {
    if (!isLoggedIn()) {
      const next = encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search);
      window.location.href = `login.html?next=${next}`;
    }
  }

  function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
  }

  window.NextStepAuth = {
    API_BASE,
    getToken,
    getUser,
    saveSession,
    isLoggedIn,
    requireLogin,
    logout
  };
})();
