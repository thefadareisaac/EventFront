// Check if user is logged in
const loggedInUserId = localStorage.getItem("loggedInUser");
const profileMenu = document.getElementById("profileMenu");
const profileIcon = document.getElementById("profileIcon");
const dropdownMenu = document.getElementById("dropdownMenu");
const logoutBtn = document.getElementById("logoutBtn");
const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLink");
const myeventsLink = document.getElementById("myeventsLink");


// If user is logged in, show profile icon and hide login/signup
if (loggedInUserId) {
  profileMenu.style.display = "inline-block";
  if (loginLink) loginLink.style.display = "none";
  if (signupLink) signupLink.style.display = "none";
  if (myeventsLink) myeventsLink.style.display = "inline-block";

} else {
  // If not logged in, show login/signup and hide profile menu
  if (loginLink) loginLink.style.display = "inline-block";
  if (signupLink) signupLink.style.display = "inline-block";
  profileMenu.style.display = "none";
  if (myeventsLink) myeventsLink.style.display = "none";
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

// Logout functionality
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser"); // clear session
  alert("You have been logged out.");
  window.location.href = "/Home Page/index.html"; // redirect to homepage
});
