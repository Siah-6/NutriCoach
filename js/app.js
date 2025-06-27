document.addEventListener('DOMContentLoaded', function() {
    function setupImageErrorHandlers() {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            // Skip logo image from error handling
            if (
                img.hasAttribute('data-error-handled') ||
                img.src.includes('images/NutriLogo.png')
            ) {
                return;
            }
            img.setAttribute('data-error-handled', 'true');
            
            let bgColor = '#2563eb';
            if (img.closest('#meal-plans-content')) {
                bgColor = '#16a34a';
            } else if (img.closest('#supplements-content')) {
                bgColor = '#9333ea';
            } else if (img.closest('#progress-content')) {
                bgColor = '#f59e0b';
            }
            
            let icon = 'ri-image-line';
            if (img.closest('#workouts-content')) {
                icon = 'ri-heart-pulse-line';
            } else if (img.closest('#meal-plans-content')) {
                icon = 'ri-restaurant-line';
            } else if (img.closest('#supplements-content')) {
                icon = 'ri-medicine-bottle-line';
            } else if (img.closest('#progress-content')) {
                icon = 'ri-line-chart-line';
            }
            
            const imgTimeout = setTimeout(() => {
                handleImageError(img, bgColor, icon);
            }, 2000);
            
            img.onerror = function() {
                clearTimeout(imgTimeout);
                handleImageError(this, bgColor, icon);
            };
            
            img.onload = function() {
                clearTimeout(imgTimeout);
            };
        });
    }
    
    function handleImageError(img, bgColor, icon) {
        img.onerror = null;
        img.onload = null;
        
        const parent = img.parentNode;
        if (parent) {
            const replacementDiv = document.createElement('div');
            replacementDiv.className = img.className;
            replacementDiv.style.backgroundColor = bgColor;
            replacementDiv.style.display = 'flex';
            replacementDiv.style.alignItems = 'center';
            replacementDiv.style.justifyContent = 'center';
            replacementDiv.innerHTML = `<i class="${icon} text-2xl text-white"></i>`;
            parent.replaceChild(replacementDiv, img);
        }
    }
    
    setupImageErrorHandlers();

    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const dashboardContent = document.getElementById('dashboard-content');
    const chatContent = document.getElementById('chat-content');
    
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const mobileLogoutButton = document.getElementById('mobile-logout-button');
    
    // Hamburger menu elements
    const mobileHamburgerBtn = document.getElementById('mobile-hamburger-btn');
    const mobileHamburgerMenu = document.getElementById('mobile-hamburger-menu');
    const mobileHamburgerClose = document.getElementById('mobile-hamburger-close');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle-btn');
    const mobileThemeToggleIcon = document.getElementById('mobile-theme-toggle-icon');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const mobileHamburgerProfile = mobileHamburgerMenu ? mobileHamburgerMenu.querySelector('a[href="#profile"]') : null;
    // Add this for bottom navbar links
    const mobileNavLinks = document.querySelectorAll('nav.fixed.bottom-0 a[href^="#"]');
    
    const chatInput = document.getElementById('chat-input');
    const sendMessageButton = document.getElementById('send-message-button');
    const chatMessages = document.getElementById('chat-messages');

    // Add this line to define mobileMenu (for mobile sidebar overlay)
    const mobileMenu = document.getElementById('mobile-menu');

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                loginScreen.classList.add('hidden');
                dashboardScreen.classList.remove('hidden');
                showAlert('Welcome back, Josiah!', 'success');
            } else {
                showAlert('Please enter both email and password', 'error');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', handleLogout);
    }
    
    // Hamburger menu logic (mobile)
    if (mobileHamburgerBtn && mobileHamburgerMenu && mobileHamburgerClose) {
        mobileHamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileHamburgerMenu.classList.remove('hidden');
        });
        mobileHamburgerClose.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileHamburgerMenu.classList.add('hidden');
        });
        // Close menu when clicking outside the panel
        mobileHamburgerMenu.addEventListener('click', function(e) {
            if (e.target === mobileHamburgerMenu) {
                mobileHamburgerMenu.classList.add('hidden');
            }
        });
    }

    // Hamburger Profile link: go to profile and close menu
    if (mobileHamburgerProfile) {
        mobileHamburgerProfile.addEventListener('click', function(e) {
            e.preventDefault();
            mobileHamburgerMenu.classList.add('hidden');
            const contentSections = document.querySelectorAll('main > div[id$="-content"]');
            contentSections.forEach(section => section.classList.add('hidden'));
            document.getElementById('profile-content').classList.remove('hidden');
        });
    }

    // Mobile logout
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function() {
            mobileHamburgerMenu.classList.add('hidden');
            handleLogout();
        });
    }

    // Mobile theme toggle
    if (mobileThemeToggleBtn) {
        mobileThemeToggleBtn.addEventListener('click', function() {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
            // Update icon
            mobileThemeToggleIcon.className = isDark ? 'ri-moon-line mr-3 text-xl' : 'ri-sun-line mr-3 text-xl';
        });
        // Set correct icon on load
        const isDark = document.documentElement.classList.contains('dark');
        mobileThemeToggleIcon.className = isDark ? 'ri-sun-line mr-3 text-xl' : 'ri-moon-line mr-3 text-xl';
    }

    // Hide desktop theme toggle on mobile when logged in
    function updateThemeToggleVisibility() {
        if (themeToggleBtn) {
            if (window.innerWidth < 768 && !loginScreen.classList.contains('hidden')) {
                themeToggleBtn.classList.remove('hidden');
            } else if (window.innerWidth < 768 && !dashboardScreen.classList.contains('hidden')) {
                themeToggleBtn.classList.add('hidden');
            } else {
                themeToggleBtn.classList.remove('hidden');
            }
        }
    }
    window.addEventListener('resize', updateThemeToggleVisibility);
    // Call on load and after login/logout
    updateThemeToggleVisibility();

    // After login, hide theme toggle on mobile
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                loginScreen.classList.add('hidden');
                dashboardScreen.classList.remove('hidden');
                showAlert('Welcome back, Josiah!', 'success');
            } else {
                showAlert('Please enter both email and password', 'error');
            }
            updateThemeToggleVisibility();
        });
    }
    function handleLogout() {
        dashboardScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        showAlert('You have been successfully logged out!', 'success');
        updateThemeToggleVisibility();
    }

    // Navigation for all links (sidebar, mobile menu, bottom navbar)
    // Improved: Remove all previous listeners, attach to all nav links, and handle both click/touch reliably
    function handleNavLinkClick(e) {
        // Only handle left click or touch
        // Prevent duplicate firing on touch/click
        if (e.type === 'touchend') {
            e.preventDefault();
            // Mark as handled so click doesn't fire after touchend
            this._touched = true;
        } else if (e.type === 'click' && this._touched) {
            this._touched = false;
            return;
        } else {
            e.preventDefault();
        }

        const target = this.getAttribute('href').substring(1);

        // Hide both mobile menus if open
        if (mobileMenu) mobileMenu.classList.add('hidden');
        if (mobileHamburgerMenu) mobileHamburgerMenu.classList.add('hidden');

        // Show the correct content section
        const contentSections = document.querySelectorAll('main > div[id$="-content"]');
        contentSections.forEach(section => section.classList.add('hidden'));

        if (target === 'dashboard') {
            dashboardContent.classList.remove('hidden');
        } else if (target === 'chat') {
            chatContent.classList.remove('hidden');
            if (chatMessages) scrollToBottom(chatMessages);
        } else if (target === 'workouts') {
            document.getElementById('workouts-content').classList.remove('hidden');
        } else if (target === 'meal-plans') {
            document.getElementById('meal-plans-content').classList.remove('hidden');
        } else if (target === 'supplements') {
            document.getElementById('supplements-content').classList.remove('hidden');
        } else if (target === 'progress') {
            document.getElementById('progress-content').classList.remove('hidden');
        } else if (target === 'profile') {
            document.getElementById('profile-content').classList.remove('hidden');
        }

        setTimeout(setupImageErrorHandlers, 100);
    }

    // Remove all previous nav event listeners to avoid duplicates
    function resetNavLinkListeners() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
        });
    }

    function setupNavLinks() {
        resetNavLinkListeners();
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick, false);
            link.addEventListener('touchend', handleNavLinkClick, { passive: false });
        });
    }

    // Initial setup
    setupNavLinks();

    // Re-setup nav links on window resize (for responsive/mobile view changes)
    window.addEventListener('resize', setupNavLinks);

    // THEME TOGGLE LOGIC
    const root = document.documentElement;
    function setTheme(mode) {
        if (mode === 'dark') {
            root.classList.add('dark');
            themeToggleBtn.innerHTML = '<i class="ri-sun-line"></i><span class="sr-only">Switch to light mode</span>';
        } else {
            root.classList.remove('dark');
            themeToggleBtn.innerHTML = '<i class="ri-moon-line"></i><span class="sr-only">Switch to dark mode</span>';
        }
        localStorage.setItem('nutricoach-theme', mode);
    }
    function getPreferredTheme() {
        return localStorage.getItem('nutricoach-theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            setTheme(root.classList.contains('dark') ? 'light' : 'dark');
        });
        setTheme(getPreferredTheme());
    }

    // CHATBOT GEMINI INTEGRATION
    // Replace generateAIResponse with Gemini API call
    async function generateAIResponse(message) {
        // Build user profile context dynamically
        const userProfile = {
            name: "Jon Josiah",
            age: 34,
            gender: "Male",
            goal: "Weight Loss & Strength Training",
            currentWeight: "78kg",
            targetWeight: "75kg",
            activityLevel: "Moderately Active",
            experience: "Intermediate"
            // ...add more as needed
        };
        const systemPrompt = `
You are NutriCoach AI, a confident, expert fitness and nutrition coach for Sir A's Fitness Gym.
The user profile is:
Name: ${userProfile.name}, Age: ${userProfile.age}, Gender: ${userProfile.gender}, Goal: ${userProfile.goal},
Current Weight: ${userProfile.currentWeight}, Target Weight: ${userProfile.targetWeight}, Activity Level: ${userProfile.activityLevel},
Experience: ${userProfile.experience}.
Greet and introduce yourself only on the user's first message or greeting. For all other questions, be direct, concise, and do not repeat your introduction.
Always give advice tailored to the user's goals, progress, and experience. Respond as a supportive personal coach.
`;

        try {
            // Combine system prompt and user message
            const prompt = `${systemPrompt}\nUser: ${message}`;
            const reply = await window.geminiSendMessage(prompt);
            return reply || "Sorry, I couldn't get a response. Please try again.";
        } catch (err) {
            return "Sorry, there was an error connecting to the AI service.";
        }
    }

    // Update sendChatMessage to handle async Gemini call and loading/error states
    if (sendMessageButton && chatInput && chatMessages) {
        sendMessageButton.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    async function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addChatMessage(message, 'user');
        chatInput.value = '';
        showTypingIndicator();

        try {
            const aiResponse = await generateAIResponse(message);
            removeTypingIndicator();
            addChatMessage(aiResponse, 'assistant');
        } catch (err) {
            removeTypingIndicator();
            addChatMessage("Sorry, there was an error connecting to the AI service.", 'assistant');
        }
    }

    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    function addChatMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex ' + (sender === 'user' ? 'justify-end' : '');

        const currentTime = formatTime(new Date());

        // Detect dark mode
        const isDark = document.documentElement.classList.contains('dark');
        // Use appropriate classes for dark mode
        const aiBubbleClass = isDark
            ? 'bg-gray-200 text-gray-800 dark:bg-gray-200 dark:text-gray-900'
            : 'bg-gray-200 text-gray-800';

        if (sender === 'assistant') {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                    <i class="ri-robot-line"></i>
                </div>
                <div class="${aiBubbleClass} rounded-xl rounded-bl-none p-3 max-w-[80%]">
                    <p>${content}</p>
                    <div class="text-xs opacity-70 text-right mt-1">
                        ${currentTime}
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="bg-blue-600 text-white rounded-xl rounded-br-none p-3 max-w-[80%]">
                    <p>${content}</p>
                    <div class="text-xs opacity-70 text-right mt-1">
                        ${currentTime}
                    </div>
                </div>
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0">
                    <span class="text-sm font-medium">JJ</span>
                </div>
            `;
        }

        chatMessages.querySelector('.space-y-4').appendChild(messageDiv);
        scrollToBottom(chatMessages);
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex typing-indicator';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                <i class="ri-robot-line"></i>
            </div>
            <div class="bg-gray-200 text-gray-800 rounded-xl rounded-bl-none p-3 max-w-[80%]">
                <div class="flex space-x-2">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce loading-dot"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce loading-dot"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce loading-dot"></div>
                </div>
            </div>
        `;
        chatMessages.querySelector('.space-y-4').appendChild(typingDiv);
        scrollToBottom(chatMessages);
    }
});
