// Floating Chatbot Widget
(function() {
    // Create widget HTML
    const widgetHTML = `
        <div class="chatbot-widget" id="chatbotWidget">
            <button class="chatbot-toggle-btn" id="chatbotToggle" aria-label="Open chat" title="Career Guidance Chat">
                <span class="material-symbols-outlined" style="font-size: 28px;">chat</span>
            </button>
            <div class="chatbot-container">
                <div class="chatbot-header">
                    <span>Career Guidance Chat</span>
                    <button class="chatbot-close-btn" id="chatbotClose" aria-label="Close chat">
                        ✕
                    </button>
                </div>
                <div class="chatbot-content">
                    <iframe src="https://jotform.jotform.io/form/019efc83ad867a568c96b7284d5a7f1a2bdf" frameborder="0" scrolling="no"></iframe>
                </div>
            </div>
        </div>
    `;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

    function initChatbot() {
        // Add widget to page
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        const widget = document.getElementById('chatbotWidget');
        const toggleBtn = document.getElementById('chatbotToggle');
        const closeBtn = document.getElementById('chatbotClose');

        // Toggle chat open/close
        toggleBtn.addEventListener('click', () => {
            widget.classList.toggle('open');
            const isOpen = widget.classList.contains('open');
            toggleBtn.setAttribute('aria-label', isOpen ? 'Close chat' : 'Open chat');
        });

        closeBtn.addEventListener('click', () => {
            widget.classList.remove('open');
            toggleBtn.setAttribute('aria-label', 'Open chat');
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && widget.classList.contains('open')) {
                widget.classList.remove('open');
                toggleBtn.setAttribute('aria-label', 'Open chat');
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (widget.classList.contains('open') && 
                !widget.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                // Don't close if clicking inside the widget
            }
        });

        // Save state to localStorage
        const savedState = localStorage.getItem('chatbot-open');
        if (savedState === 'true') {
            widget.classList.add('open');
        }

        toggleBtn.addEventListener('click', () => {
            localStorage.setItem('chatbot-open', widget.classList.contains('open'));
        });

        closeBtn.addEventListener('click', () => {
            localStorage.setItem('chatbot-open', 'false');
        });
    }
})();
