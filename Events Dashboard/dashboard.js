// === Dialog Elements ===
const dialog = document.getElementById("eventDialog");
const closeBtn = document.getElementById("closeDialog");
const registerBtn = document.getElementById("registerBtn");

// === Load Only Events Created by Others ===
function loadOtherEvents() {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const loggedInUserId = localStorage.getItem("loggedInUser");
  const otherEventsGrid = document.getElementById("otherEventsGrid");

  otherEventsGrid.innerHTML = "";

  // Loop through events and show only those not created by the logged-in user
  events.forEach(event => {
    if (event.createdBy != loggedInUserId) {
      const card = document.createElement("div");
      card.classList.add("event-card");

      card.innerHTML = `
        <img src="${event.image}" alt="Event Banner"/>
        <h3>${event.name}</h3>
        <p>${event.description}</p>
        <button class="viewEventBtn" data-id="${event.id}">View Event</button>
      `;

      otherEventsGrid.appendChild(card);
    }
  });

  // Attach listeners to "View Event" buttons
  document.querySelectorAll(".viewEventBtn").forEach(btn => {
    btn.addEventListener("click", openEventDialog);
  });
}

// === Open Event Dialog ===
function openEventDialog(e) {
  const eventId = e.target.getAttribute("data-id");
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  const eventData = events.find(ev => ev.id == eventId);
  const loggedInUserId = localStorage.getItem("loggedInUser");

  if (eventData) {
    document.getElementById("dialogEventName").textContent = eventData.name;
    document.getElementById("dialogEventDescription").textContent = eventData.description;
    document.getElementById("dialogEventDate").textContent = `${eventData.date} at ${eventData.time}`;
    document.getElementById("dialogEventLocation").textContent = eventData.location;
    document.getElementById("dialogEventImage").src = eventData.image;

    registerBtn.setAttribute("data-id", eventId);

    // Count registrations
    const count = registrations.filter(r => r.eventId == eventId).length;
    let stats = document.getElementById("registrationStats");
    if (!stats) {
      stats = document.createElement("p");
      stats.id = "registrationStats";
      document.querySelector(".event-details").appendChild(stats);
    }
    stats.innerHTML =
      count === 0 ? `<strong>Registered:</strong> No attendees yet` :
      count === 1 ? `<strong>Registered:</strong> ${count} attendee` :
                    `<strong>Registered:</strong> ${count} attendees`;

    // ✅ Check if current user is registered and update button state
    const alreadyRegistered = registrations.some(r => r.userId == loggedInUserId && r.eventId == eventId);
    updateRegisterButton(alreadyRegistered);

    dialog.style.display = "flex";
  }
}



// === Close Dialog ===
closeBtn.addEventListener("click", () => {
  dialog.style.display = "none";
});

// Close when clicking outside
document.getElementById("eventDialog").addEventListener("click", (e) => {
  if (e.target.id === "eventDialog") {
    document.getElementById("eventDialog").style.display = "none";
  }
});

// === Register for Event ===
// === Register / Unregister Toggle ===
registerBtn.addEventListener("click", () => {
  const loggedInUserId = localStorage.getItem("loggedInUser");
  if (!loggedInUserId) {
    alert("You must log in to register for events.");
    window.location.href = "/Login/login.html";
    return;
  }

  const eventId = registerBtn.getAttribute("data-id");
  let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

  const alreadyRegistered = registrations.some(r => r.userId == loggedInUserId && r.eventId == eventId);

  if (alreadyRegistered) {
    // Unregister
    registrations = registrations.filter(r => !(r.userId == loggedInUserId && r.eventId == eventId));
    localStorage.setItem("registrations", JSON.stringify(registrations));

    alert("You have unregistered from this event.");
    updateRegisterButton(false); // revert button
  } else {
    // Register
    registrations.push({ 
      userId: loggedInUserId, 
      eventId: eventId ,
      time: new Date().toLocaleString() // ✅ saves date + time
    });
    localStorage.setItem("registrations", JSON.stringify(registrations));

    alert("You have registered successfully!");
    updateRegisterButton(true); // update button
  }

  // Update registration count immediately
  const count = registrations.filter(r => r.eventId == eventId).length;
  document.getElementById("registrationStats").innerHTML =
    count === 0 ? `<strong>Registered:</strong> No attendees yet` :
    count === 1 ? `<strong>Registered:</strong> ${count} attendee` :
                  `<strong>Registered:</strong> ${count} attendees`;
});



// === Load events on page load ===
window.addEventListener("DOMContentLoaded", loadOtherEvents);

// === Helper to update button state ===
function updateRegisterButton(isRegistered) {
  if (isRegistered) {
    registerBtn.textContent = "Registered";
    registerBtn.style.backgroundImage = "none"; // remove gradient
    registerBtn.style.backgroundColor = "green";

    // Hover effect to show "Unregister"
    registerBtn.onmouseover = () => {
      registerBtn.textContent = "Unregister";
      registerBtn.style.backgroundColor = "#E43939"; // red
    };
    registerBtn.onmouseout = () => {
      registerBtn.textContent = "Registered";
      registerBtn.style.backgroundColor = "green";
    };
  } else {
    registerBtn.textContent = "Register";
    registerBtn.style.backgroundImage = "linear-gradient(to right, #E43939, #581D60)";
    registerBtn.style.backgroundColor = "transparent";

    // Reset hover
    registerBtn.onmouseover = null;
    registerBtn.onmouseout = null;
  }
}

// === Display User Greeting ===
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUserId = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userGreeting = document.getElementById("userGreeting");

  if (loggedInUserId && userGreeting) {
    // Find the user object by ID
    const currentUser = users.find(u => u.id == loggedInUserId);

    if (currentUser) {
      userGreeting.textContent = `Hello, ${currentUser.username.toUpperCase()}!`;
    } else {
      userGreeting.textContent = "Hello!";
    }
  }
});