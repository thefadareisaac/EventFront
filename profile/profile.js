// Check if user is logged in
const loggedInUserId = localStorage.getItem("loggedInUser");
if (!loggedInUserId) {
  alert("You must log in to view your profile.");
  window.location.href = "/Login/login.html";
}

// Get elements
const profileMenu = document.getElementById("profileMenu");
const profileIcon = document.getElementById("profileIcon");
const dropdownMenu = document.getElementById("dropdownMenu");
const logoutBtn = document.getElementById("logoutBtn");
const form = document.getElementById("profile-form");
const fullnameInput = document.getElementById("fullname");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Show profile menu if logged in
if (loggedInUserId) {
  profileMenu.style.display = "inline-block";
}

// Toggle dropdown when clicking profile icon
profileIcon.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent the click from bubbling up
  dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});


// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!profileMenu.contains(e.target)) {
    dropdownMenu.style.display = "none";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out.");
  window.location.href = "/Home Page/index.html";
});

// Load user details
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = users.find(user => user.id == loggedInUserId);

if (currentUser) {
  fullnameInput.value = currentUser.fullname;
  usernameInput.value = currentUser.username;
  emailInput.value = currentUser.email;
  passwordInput.value = currentUser.password;
}

// Update profile
form.addEventListener("submit", e => {
  e.preventDefault();
  currentUser.fullname = fullnameInput.value.trim();
  currentUser.username = usernameInput.value.trim();
  currentUser.email = emailInput.value.trim();
  currentUser.password = passwordInput.value.trim();

  // Save updated user back to local storage
  localStorage.setItem("users", JSON.stringify(users));

  alert("Profile updated successfully!");
});