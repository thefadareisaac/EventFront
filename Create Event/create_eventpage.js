// === Image Preview ===
// Get file input and preview image element
const fileInput = document.getElementById('eventimage');
const preview = document.getElementById('preview');

// Show preview when user selects an image
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            preview.setAttribute('src', this.result); // set preview src
            preview.style.display = 'block';          // show preview
        });
        reader.readAsDataURL(file); // convert file to base64 string
    }
});

// === Form Validation ===
function validateEventForm() {
    let valid = true;

    // Get values
    const name = document.getElementById('eventname').value.trim();
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value.trim();
    const image = document.getElementById('eventimage').files[0];

    // Get error containers
    const nameError = document.getElementById('name-error');
    const descError = document.getElementById('description-error');
    const dateError = document.getElementById('date-error');
    const timeError = document.getElementById('time-error');
    const locationError = document.getElementById('location-error');
    const imageError = document.getElementById('image-error');

    // Clear old errors
    nameError.innerText = "";
    descError.innerText = "";
    dateError.innerText = "";
    timeError.innerText = "";
    locationError.innerText = "";
    imageError.innerText = "";

    // Validate name
    if (name === "") {
        nameError.innerText = "Event name is required.";
        valid = false;
    } else if (name.length < 3) {
        nameError.innerText = "Event name must be at least 3 characters.";
        valid = false;
    }

    // Validate description
    if (description === "") {
        descError.textContent = "Description is required.";
        valid = false;
    } else if (description.length < 10) {
        descError.textContent = "Description must be at least 10 characters.";
        valid = false;
    }

    // Validate time
    if (time === "") {
        timeError.textContent = "Event time is required.";
        valid = false;
    }

    // Validate location
    if (location === "") {
        locationError.textContent = "Event location is required.";
        valid = false;
    }

    // Validate date
    if (date === "") {
        dateError.textContent = "Event date is required.";
        valid = false;
    } else {
        const today = new Date();
        const selectedDate = new Date(date);
        if (selectedDate < today) {
            dateError.textContent = "Event date cannot be in the past.";
            valid = false;
        }
    }

    // Validate image
    if (!image) {
        imageError.textContent = "Banner image is required.";
        valid = false;
    } else {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(image.type)) {
            imageError.textContent = "Only JPEG or PNG images are allowed.";
            valid = false;
        }
    }

    return valid;
}

// === Save Event to Local Storage ===
document.getElementById('eventform').addEventListener('submit', function(event) {
    event.preventDefault(); // stop form submission

    // Check if user is logged in
    const loggedInUserId = localStorage.getItem("loggedInUser");
    if (!loggedInUserId) {
        alert("You must log in to create an event.");
        window.location.href = "/Login/login.html";
        return;
    }

    // Validate form
    if (validateEventForm()) {
        // Get existing events
        let events = JSON.parse(localStorage.getItem("events")) || [];

        // Create new event object
        const newEvent = {
            id: Date.now(), // unique ID
            name: document.getElementById('eventname').value.trim(),
            description: document.getElementById('description').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            location: document.getElementById('location').value.trim(),
            image: preview.src, // base64 image string
            createdBy: loggedInUserId
        };

        // Save event
        events.push(newEvent);
        localStorage.setItem("events", JSON.stringify(events));

        alert("Event created successfully!");
        window.location.href = "/Events Dashboard/dashboard.html"; // redirect to dashboard
    }
});
