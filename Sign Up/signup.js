// const form = document.getElementById('signup-form');
// const username = document.getElementById('username');
// const email = document.getElementById('email');
// const password = document.getElementById('password');
// const confirmPassword = document.getElementById('confirmpassword');
// const usernameError = document.getElementById('username-error');
// const emailError = document.getElementById('email-error');
// const passwordError = document.getElementById('password-error');
// const confirmPasswordError = document.getElementById('confirm-password-error');


// form.addEventListener('submit', e => {
//     e.preventDefault();

//     usernameError.innerText = '';
//     emailError.innerText = '';
//     passwordError.innerText = '';
//     confirmPasswordError.innerText = '';

//     let valid = true;

//     const usernameValue = username.value.trim();
//     const emailValue = email.value.trim();
//     const passwordValue = password.value.trim();
//     const confirmPasswordValue = confirmPassword.value.trim();


//     if (usernameValue === ""){
//         usernameError.innerText = 'Username is required.';
//         valid = false;
//     } else if (usernameValue.length < 5){
//         usernameError.innerText = 'Username must be at least 5 characters long.';
//         valid = false;
//     }

//     if (emailValue === '') {
//         emailError.innerText = 'Email is required.';
//         valid = false;
//     } else{
//         const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
//         if (!emailValue.match(emailPattern)) {
//             emailError.innerText= "Please enter a valid email address.";
//             valid = false;
//         }
//     }

//     if (passwordValue === ''){
//         passwordError.innerText = 'Password is required.';
//         valid = false;
//     } else if (passwordValue.length < 8){
//         passwordError.innerText = 'Password must be at least 8 characters long.';
//         valid = false;
//     }

//     if (confirmPasswordValue === ''){
//         confirmPasswordError.innerText = 'Please confirm your password.';
//         valid = false;
//     } else if (passwordValue !== confirmPasswordValue){
//         confirmPasswordError.innerText = 'Passwords do not match.';
//         valid = false;
//     }

//     if (valid){
//         alert('Sign Up successful!');
//         form.submit();
//     }
// })







// Get references to the form and input fields
const form = document.getElementById('signup-form');
const fullname = document.getElementById('fullname');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmpassword');

// Get references to error message containers
const fullnameError = document.getElementById('fullname-error');
const usernameError = document.getElementById('username-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');

// Listen for form submission
form.addEventListener('submit', e => {
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Reset error messages before validating
    fullnameError.innerText = '';
    usernameError.innerText = '';
    emailError.innerText = '';
    passwordError.innerText = '';
    confirmPasswordError.innerText = '';

    let valid = true; // Flag to track if all validations pass

    // Get trimmed values from inputs
    const fullnameValue = fullname.value.trim();
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();


    // === Full Name Validation ===
    if (fullnameValue === "") {
        fullnameError.innerText = 'Full name is required.';
        valid = false;
    }
    // === Username Validation ===
    if (usernameValue === "") {
        usernameError.innerText = 'Username is required.';
        valid = false;
    } else if (usernameValue.length < 5) {
        usernameError.innerText = 'Username must be at least 5 characters long.';
        valid = false;
    }

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

    // === Confirm Password Validation ===
    if (confirmPasswordValue === '') {
        confirmPasswordError.innerText = 'Please confirm your password.';
        valid = false;
    } else if (passwordValue !== confirmPasswordValue) {
        confirmPasswordError.innerText = 'Passwords do not match.';
        valid = false;
    }

    // === If all validations pass ===
    if (valid) {
        // Get existing users from local storage (or empty array if none exist)
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if email is already registered
        const emailExists = users.some(user => user.email === emailValue);
        if (emailExists) {
            emailError.innerText = "Email already registered.";
            return; // Stop signup if duplicate email found
        }

        // Create new user object
        const newUser = {
            id: Date.now(), // Unique ID based on timestamp
            fullname: fullnameValue,
            username: usernameValue,
            email: emailValue,
            password: passwordValue // NOTE: In real apps, passwords should be hashed!
        };

        // Add new user to users array
        users.push(newUser);

        // Save updated users array back to local storage
        localStorage.setItem("users", JSON.stringify(users));

        // Show success message
        alert('Sign Up successful! Please log in.');

        // Redirect to login page
        window.location.href = "/Login/login.html";
    }
});