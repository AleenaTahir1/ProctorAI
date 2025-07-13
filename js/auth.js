// DOM Elements
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");
const passwordRequirements = document.getElementById("passwordRequirements");
const signupError = document.getElementById("signupError");
const loginPasswordError = document.getElementById("loginPasswordError");

// Toggle between sign in and sign up forms
sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// Password validation requirements
const requirements = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[^A-Za-z0-9]/
};

// Password requirements are now hidden by default
signupPassword.addEventListener("focus", function() {
    // No longer showing password requirements on focus
});

signupPassword.addEventListener("blur", function() {
    // No longer showing password requirements on blur
});

// Real-time password validation and strength indicator
signupPassword.addEventListener("input", function() {
    validatePassword();
    updatePasswordStrength();
});

function validatePassword() {
    const password = signupPassword.value;
    let isValid = true;
    
    // If password is empty, return false
    if (password.length === 0) {
        return false;
    }
    
    // Check each requirement without updating UI elements
    for (const [requirement, regex] of Object.entries(requirements)) {
        if (!regex.test(password)) {
            isValid = false;
        }
    }
    
    return isValid;
}

function updatePasswordStrength() {
    const password = signupPassword.value;
    const strengthIndicator = document.getElementById("passwordStrength");
    
    // Remove all classes first
    strengthIndicator.className = "password-strength";
    
    if (password.length === 0) {
        return;
    }
    
    // Count how many requirements are met
    let metRequirements = 0;
    for (const regex of Object.values(requirements)) {
        if (regex.test(password)) {
            metRequirements++;
        }
    }
    
    // Set strength class based on requirements met
    if (metRequirements <= 2) {
        strengthIndicator.classList.add("weak");
        document.getElementById("passwordStrength").setAttribute("data-strength", "weak");
    } else if (metRequirements <= 4) {
        strengthIndicator.classList.add("medium");
        document.getElementById("passwordStrength").setAttribute("data-strength", "medium");
    } else {
        strengthIndicator.classList.add("strong");
        document.getElementById("passwordStrength").setAttribute("data-strength", "strong");
    }
}

// Form submission handlers
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    if (password.length < 8) {
        loginPasswordError.textContent = "Password must be at least 8 characters long";
        loginPasswordError.classList.add("error-message");
        return;
    }
    
    loginPasswordError.textContent = "";
    loginPasswordError.classList.remove("error-message");
    
    // Simulate login - in a real app, this would be an API call
    console.log("Login attempt:", { email });
    
    // Simulate successful login
    alert("Login successful! Redirecting to dashboard...");
    // In a real app, redirect to dashboard or show loading spinner
    // window.location.href = "dashboard.html";
});

signupForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = signupPassword.value;
    const confirmPwd = confirmPassword.value;
    
    // Validate password
    if (!validatePassword()) {
        signupError.textContent = "Please meet all password requirements";
        signupError.classList.add("error-message");
        document.getElementById("passwordRequirements").classList.remove("hidden");
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPwd) {
        signupError.textContent = "Passwords do not match";
        signupError.classList.add("error-message");
        return;
    }
    
    signupError.textContent = "";
    signupError.classList.remove("error-message");
    
    // Simulate registration - in a real app, this would be an API call
    console.log("Registration attempt:", { name, email });
    
    // Simulate successful registration
    alert("Registration successful! Please check your email to verify your account.");
    // In a real app, show verification message or redirect
    container.classList.remove("sign-up-mode");
    document.getElementById("passwordRequirements").classList.add("hidden");
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
