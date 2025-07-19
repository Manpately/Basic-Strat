// script.js

// LOGIN VALIDATION
function handleLogin(event) {
  event.preventDefault();
  const username = document.querySelector('#login-username').value.trim();
  const password = document.querySelector('#login-password').value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  // Simulated login check (You can add real login logic here)
  alert(`Welcome back, ${username}!`);
  window.location.href = "index.html"; // Redirect to welcome or dashboard
}

// SIGNUP VALIDATION
function handleSignup(event) {
  event.preventDefault();
  const username = document.querySelector('#signup-username').value.trim();
  const password = document.querySelector('#signup-password').value.trim();
  const contact = document.querySelector('#signup-contact').value.trim();

  if (!username || !password || !contact) {
    alert("Please fill all fields.");
    return;
  }

  alert("Account created successfully!");
  window.location.href = "login.html";
}

// VERIFY BUTTON HANDLER
function handleVerify() {
  const contact = document.querySelector('#signup-contact').value.trim();
  if (contact) {
    alert(`Verification link sent to ${contact}`);
  } else {
    alert("Please enter mobile number or email to verify.");
  }
}

// INIT FUNCTION
function initFormHandlers() {
  const loginForm = document.querySelector('#login-form');
  const signupForm = document.querySelector('#signup-form');
  const verifyBtn = document.querySelector('#verify-btn');

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (signupForm) signupForm.addEventListener('submit', handleSignup);
  if (verifyBtn) verifyBtn.addEventListener('click', handleVerify);
}

window.addEventListener('DOMContentLoaded', initFormHandlers);
function handleVerify() {
  const contact = document.querySelector('#signup-contact').value.trim();

  // Check if it's a valid 10-digit number
  const isMobile = /^[0-9]{10}$/.test(contact);

  if (!contact) {
    alert("Please enter a mobile number or email first.");
  } else if (isMobile) {
    alert(`✅ Verification code sent to: ${contact}`);
  } else {
    alert("❌ Please enter a valid 10-digit mobile number only.");
  }
}
