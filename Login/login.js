document.addEventListener("DOMContentLoaded", () => {
    // Select all input fields inside the login form
    const loginForm = document.querySelector("#email"); // adjust ID if different
    if (loginForm) {
      const inputs = loginForm.querySelectorAll("input");
      inputs.forEach(input => input.value = ""); // clear values on load
    }
  });


// Get references to the form and input fields
const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');

// Get references to error message containers
const emailError = document.getElementById('email-message');
const passwordError = document.getElementById('password-message');

// Listen for form submission
form.addEventListener('submit', e => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Reset error messages before validating
    emailError.innerText = '';
    passwordError.innerText = '';

    let valid = true; // Flag to track if all validations pass

    // Get trimmed values from inputs
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();  

    // === Email Validation ===
    if (emailValue === '') {
        emailError.innerText = 'Email is required.';
        valid = false;
    } else {
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; // Simple regex for email format
        if (!emailValue.match(emailPattern)) {
            emailError.innerText = "Please enter a valid email address.";
            valid = false;
        }
    }

    // === Password Validation ===
    if (passwordValue === '') {
        passwordError.innerText = 'Password is required.';
        valid = false;
    } else if (passwordValue.length < 8) {
        passwordError.innerText = 'Password must be at least 8 characters long.';
        valid = false;
    }

    // === If all validations pass ===
    if (valid) {
        // Get users from local storage
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Find user with matching email and password
        const foundUser = users.find(user => user.email === emailValue && user.password === passwordValue);

        if (foundUser) {
            // Save logged-in user ID in local storage (acts like a session)
            localStorage.setItem("loggedInUser", foundUser.id);

            alert('Login successful!');

            // Redirect to dashboard page
            window.location.href = "/Events Dashboard/dashboard.html";
        } else {
            // Show error if credentials don't match
            emailError.innerText = "Invalid email or password.";
        }
    }
});


