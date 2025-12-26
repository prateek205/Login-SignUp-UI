// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== Theme Toggle Functionality ==========
    const themeToggleBtns = document.querySelectorAll('#themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('auth-theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    // Update toggle button icon based on saved theme
    themeToggleBtns.forEach(btn => {
        if (savedTheme === 'dark') {
            btn.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        btn.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('auth-theme', newTheme);
            
            // Update button icon
            this.innerHTML = newTheme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        });
    });
    
    // ========== Mobile Menu Toggle ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // ========== Demo Credentials Toggle ==========
    const toggleDemoBtn = document.getElementById('toggleDemo');
    const demoContent = document.getElementById('demoContent');
    
    if (toggleDemoBtn && demoContent) {
        toggleDemoBtn.addEventListener('click', function() {
            demoContent.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Copy to clipboard functionality
        document.querySelectorAll('.demo-copy').forEach(button => {
            button.addEventListener('click', function() {
                const text = this.getAttribute('data-text');
                
                // Create a temporary textarea element
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                
                // Select and copy the text
                textarea.select();
                document.execCommand('copy');
                
                // Remove the temporary element
                document.body.removeChild(textarea);
                
                // Visual feedback
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    }
    
    // ========== Password Toggle Visibility ==========
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // ========== Form Validation ==========
    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const loginButton = document.getElementById('loginButton');
        
        // Email validation
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email === '') {
                showError(emailInput, emailError, 'Email is required');
            } else if (!emailRegex.test(email)) {
                showError(emailInput, emailError, 'Please enter a valid email address');
            } else {
                showSuccess(emailInput, emailError);
            }
        });
        
        // Password validation
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            
            if (password === '') {
                showError(passwordInput, passwordError, 'Password is required');
            } else if (password.length < 6) {
                showError(passwordInput, passwordError, 'Password must be at least 6 characters');
            } else {
                showSuccess(passwordInput, passwordError);
            }
        });
        
        // Form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            let isValid = true;
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '' || !emailRegex.test(email)) {
                showError(emailInput, emailError, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Password validation
            if (password === '' || password.length < 6) {
                showError(passwordInput, passwordError, 'Password must be at least 6 characters');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate login process
                simulateLogin();
            }
        });
        
        // Demo credentials auto-fill
        if (emailInput && passwordInput) {
            // Check if we're on login page and auto-fill demo credentials
            if (window.location.pathname.includes('login.html')) {
                setTimeout(() => {
                    emailInput.value = 'demo@authflow.com';
                    passwordInput.value = 'demo1234';
                    
                    // Trigger validation
                    emailInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));
                }, 500);
            }
        }
    }
    
    // ========== Signup Form Functionality ==========
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        // Progress steps
        const progressSteps = document.querySelectorAll('.progress-step');
        const progressLines = document.querySelectorAll('.progress-line');
        const formSteps = document.querySelectorAll('.form-step');
        let currentStep = 1;
        
        // Step navigation buttons
        const nextStep1Btn = document.getElementById('nextStep1');
        const nextStep2Btn = document.getElementById('nextStep2');
        const prevStep2Btn = document.getElementById('prevStep2');
        const prevStep3Btn = document.getElementById('prevStep3');
        const skipToLoginBtn = document.getElementById('skipToLogin');
        
        // Form elements
        const fullNameInput = document.getElementById('fullName');
        const signupEmailInput = document.getElementById('signupEmail');
        const signupPasswordInput = document.getElementById('signupPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const usernameInput = document.getElementById('username');
        const birthdateInput = document.getElementById('birthdate');
        const termsCheckbox = document.getElementById('terms');
        
        // Error elements
        const nameError = document.getElementById('nameError');
        const signupEmailError = document.getElementById('signupEmailError');
        const signupPasswordError = document.getElementById('signupPasswordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        const usernameError = document.getElementById('usernameError');
        const birthdateError = document.getElementById('birthdateError');
        const termsError = document.getElementById('termsError');
        
        // Password strength
        const strengthSegments = document.querySelectorAll('.strength-segment');
        const strengthText = document.getElementById('strengthText');
        
        // Function to update progress steps
        function updateProgressSteps(step) {
            progressSteps.forEach((progressStep, index) => {
                if (index + 1 < step) {
                    progressStep.classList.add('completed');
                    progressStep.classList.remove('active');
                } else if (index + 1 === step) {
                    progressStep.classList.add('active');
                    progressStep.classList.remove('completed');
                } else {
                    progressStep.classList.remove('active', 'completed');
                }
            });
            
            progressLines.forEach((line, index) => {
                if (index + 1 < step) {
                    line.classList.add('completed');
                } else {
                    line.classList.remove('completed');
                }
            });
            
            // Show current form step
            formSteps.forEach((formStep, index) => {
                if (index + 1 === step) {
                    formStep.classList.add('active');
                } else {
                    formStep.classList.remove('active');
                }
            });
            
            currentStep = step;
        }
        
        // Step 1 validation
        function validateStep1() {
            let isValid = true;
            
            // Name validation
            if (fullNameInput.value.trim() === '') {
                showError(fullNameInput, nameError, 'Full name is required');
                isValid = false;
            } else {
                showSuccess(fullNameInput, nameError);
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (signupEmailInput.value.trim() === '') {
                showError(signupEmailInput, signupEmailError, 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(signupEmailInput.value.trim())) {
                showError(signupEmailInput, signupEmailError, 'Please enter a valid email address');
                isValid = false;
            } else {
                showSuccess(signupEmailInput, signupEmailError);
            }
            
            // Password validation
            if (signupPasswordInput.value === '') {
                showError(signupPasswordInput, signupPasswordError, 'Password is required');
                isValid = false;
            } else if (signupPasswordInput.value.length < 8) {
                showError(signupPasswordInput, signupPasswordError, 'Password must be at least 8 characters');
                isValid = false;
            } else {
                showSuccess(signupPasswordInput, signupPasswordError);
            }
            
            // Confirm password validation
            if (confirmPasswordInput.value === '') {
                showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
                isValid = false;
            } else if (confirmPasswordInput.value !== signupPasswordInput.value) {
                showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
                isValid = false;
            } else {
                showSuccess(confirmPasswordInput, confirmPasswordError);
            }
            
            return isValid;
        }
        
        // Step 2 validation
        function validateStep2() {
            let isValid = true;
            
            // Username validation
            if (usernameInput.value.trim() === '') {
                showError(usernameInput, usernameError, 'Username is required');
                isValid = false;
            } else if (usernameInput.value.length < 3) {
                showError(usernameInput, usernameError, 'Username must be at least 3 characters');
                isValid = false;
            } else {
                showSuccess(usernameInput, usernameError);
            }
            
            // Birthdate validation
            if (birthdateInput.value === '') {
                showError(birthdateInput, birthdateError, 'Date of birth is required');
                isValid = false;
            } else {
                // Check if user is at least 13 years old
                const birthdate = new Date(birthdateInput.value);
                const today = new Date();
                let age = today.getFullYear() - birthdate.getFullYear();
                const monthDiff = today.getMonth() - birthdate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
                    age--;
                }
                
                if (age < 13) {
                    showError(birthdateInput, birthdateError, 'You must be at least 13 years old');
                    isValid = false;
                } else {
                    showSuccess(birthdateInput, birthdateError);
                }
            }
            
            return isValid;
        }
        
        // Step 3 validation
        function validateStep3() {
            let isValid = true;
            
            // Terms validation
            if (!termsCheckbox.checked) {
                termsError.classList.add('show');
                termsError.textContent = 'You must accept the terms and conditions';
                isValid = false;
            } else {
                termsError.classList.remove('show');
            }
            
            return isValid;
        }
        
        // Password strength checker
        if (signupPasswordInput) {
            signupPasswordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;
                
                // Reset strength indicators
                strengthSegments.forEach(segment => segment.classList.remove('active'));
                
                // Check password strength
                if (password.length >= 8) strength++;
                if (/[A-Z]/.test(password)) strength++;
                if (/[0-9]/.test(password)) strength++;
                if (/[^A-Za-z0-9]/.test(password)) strength++;
                
                // Update strength indicators
                for (let i = 0; i < strength; i++) {
                    if (strengthSegments[i]) {
                        strengthSegments[i].classList.add('active');
                    }
                }
                
                // Update strength text
                const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
                strengthText.textContent = strengthLabels[strength - 1] || 'Weak';
                strengthText.style.color = 
                    strength === 1 ? '#f44336' : 
                    strength === 2 ? '#ff9800' : 
                    strength === 3 ? '#ff9800' : 
                    '#4caf50';
            });
        }
        
        // Step navigation event listeners
        if (nextStep1Btn) {
            nextStep1Btn.addEventListener('click', function() {
                if (validateStep1()) {
                    updateProgressSteps(2);
                }
            });
        }
        
        if (nextStep2Btn) {
            nextStep2Btn.addEventListener('click', function() {
                if (validateStep2()) {
                    updateProgressSteps(3);
                }
            });
        }
        
        if (prevStep2Btn) {
            prevStep2Btn.addEventListener('click', function() {
                updateProgressSteps(1);
            });
        }
        
        if (prevStep3Btn) {
            prevStep3Btn.addEventListener('click', function() {
                updateProgressSteps(2);
            });
        }
        
        if (skipToLoginBtn) {
            skipToLoginBtn.addEventListener('click', function() {
                window.location.href = 'login.html';
            });
        }
        
        // Form submission
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep3()) {
                simulateSignup();
            }
        });
    }
    
    // ========== Forgot Password Modal ==========
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotModal = document.getElementById('closeForgotModal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.classList.add('active');
        });
    }
    
    if (closeForgotModal) {
        closeForgotModal.addEventListener('click', function() {
            forgotPasswordModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    if (forgotPasswordModal) {
        forgotPasswordModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value;
            
            if (email) {
                // Simulate sending reset email
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert(`Password reset link has been sent to ${email}`);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    forgotPasswordModal.classList.remove('active');
                    forgotPasswordForm.reset();
                }, 1500);
            }
        });
    }
    
    // ========== Helper Functions ==========
    function showError(input, errorElement, message) {
        input.parentElement.classList.add('error');
        input.parentElement.classList.remove('valid');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function showSuccess(input, errorElement) {
        input.parentElement.classList.remove('error');
        input.parentElement.classList.add('valid');
        errorElement.classList.remove('show');
    }
    
    function simulateLogin() {
        const loginButton = document.getElementById('loginButton');
        const buttonText = loginButton.querySelector('.btn-text');
        
        // Show loading state
        loginButton.classList.add('loading');
        loginButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success simulation
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
            
            // Show success message
            alert('Login successful! Redirecting to dashboard...');
            
            // In a real app, you would redirect here
            // window.location.href = 'dashboard.html';
        }, 2000);
    }
    
    function simulateSignup() {
        const completeButton = document.getElementById('completeSignup');
        
        // Show loading state
        completeButton.classList.add('loading');
        completeButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success simulation
            completeButton.classList.remove('loading');
            completeButton.disabled = false;
            
            // Show success modal
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.classList.add('active');
            }
        }, 2000);
    }
    
    // ========== Social Login Buttons ==========
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('google') ? 'Google' :
                           this.classList.contains('github') ? 'GitHub' :
                           this.classList.contains('twitter') ? 'Twitter' : 'Social';
            
            // Add ripple effect
            this.classList.add('ripple');
            
            // Simulate social login
            const originalHTML = this.innerHTML;
            this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting to ${platform}...`;
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.disabled = false;
                this.classList.remove('ripple');
                
                // Show message
                alert(`In a real application, this would redirect to ${platform} authentication.`);
            }, 1500);
        });
    });
    
    // ========== Input Animation Effects ==========
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Add character counting for text inputs
        if (input.type === 'text' || input.type === 'textarea') {
            input.addEventListener('input', function() {
                // You could add character count here if needed
            });
        }
    });
    
    // ========== Add smooth hover effects to buttons ==========
    const buttons = document.querySelectorAll('.btn, .social-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ========== Initialize tooltips ==========
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.opacity = '0';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transition = 'opacity 0.2s ease';
            }, 10);
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (this._tooltip && this._tooltip.parentNode) {
                        this._tooltip.parentNode.removeChild(this._tooltip);
                    }
                }, 200);
            }
        });
    });
    
    // ========== Add tooltip styles ==========
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tooltip {
            position: absolute;
            background-color: var(--card-bg);
            color: var(--text-color);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            white-space: nowrap;
            pointer-events: none;
            border: 1px solid var(--border-color);
            font-family: 'Inter', sans-serif;
        }
        
        .tooltip::before {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: var(--card-bg) transparent transparent transparent;
        }
        
        [data-theme="dark"] .tooltip::before {
            border-color: var(--card-bg) transparent transparent transparent;
        }
    `;
    document.head.appendChild(tooltipStyle);
});

// ========== Add CSS for floating shapes ==========
const floatingShapesStyle = document.createElement('style');
floatingShapesStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        25% {
            transform: translateY(-20px) rotate(5deg);
        }
        50% {
            transform: translateY(-10px) rotate(-5deg);
        }
        75% {
            transform: translateY(-15px) rotate(3deg);
        }
    }
    
    .shape {
        animation: float 20s infinite linear;
    }
`;
document.head.appendChild(floatingShapesStyle);