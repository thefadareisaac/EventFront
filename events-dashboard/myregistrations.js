document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserId = localStorage.getItem("loggedInUser");
    const registrationsGrid = document.getElementById("registrationsGrid");
  
    if (!loggedInUserId) {
      registrationsGrid.innerHTML = "<p>You must log in to view your registrations.</p>";
      return;
    }
  
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  
    // Filter events the user has registered for
    const myRegistrations = registrations
      .filter(r => r.userId == loggedInUserId)
      .map(r => events.find(ev => ev.id == r.eventId))
      .filter(ev => ev); // remove nulls if event was deleted
  
    if (myRegistrations.length === 0) {
      registrationsGrid.innerHTML = "<p>You have not registered for any events yet.</p>";
      return;
    }
  
    myRegistrations.forEach(event => {
      const card = document.createElement("div");
      card.classList.add("event-card");
  
      card.innerHTML = `
        <img src="${event.image}" alt="Event Banner"/>
        <h3>${event.name}</h3>
        <p>${event.description}</p>
        <button class="viewEventBtn" data-id="${event.id}">View Event</button>
      `;
  
      registrationsGrid.appendChild(card);
    });
  
    // Attach listeners to open dialog (reuse same dialog logic as dashboard)
    document.querySelectorAll(".viewEventBtn").forEach(btn => {
      btn.addEventListener("click", openEventDialog);
    });
  });

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

function openEventDialog(e) {
  // 1. Get the event ID from the clicked button (stored in data-id attribute)
  const eventId = e.target.getAttribute("data-id");

  // 2. Load all events from localStorage (or empty array if none exist)
  const events = JSON.parse(localStorage.getItem("events")) || [];

  // 3. Load all registrations from localStorage (or empty array if none exist)
  const registrations = JSON.parse(localStorage.getItem("registrations")) || [];

  // 4. Get the currently logged-in user ID
  const loggedInUserId = localStorage.getItem("loggedInUser");

  // 5. Find the event object that matches the clicked eventId
  const event = events.find(ev => ev.id == eventId);

  // 6. If no event is found, stop the function
  if (!event) return;

  // --- Populate the dialog with event details ---
  document.getElementById("dialogEventImage").src = event.image;               // Event image
  document.getElementById("dialogEventName").textContent = event.name;         // Event name
  document.getElementById("dialogEventDescription").textContent = event.description; // Event description
  document.getElementById("dialogEventDate").textContent = `Date: ${event.date || "N/A"}`; // Event date
  document.getElementById("dialogEventLocation").textContent = `Location: ${event.location || "N/A"}`; // Event location

  // --- Show the dialog box ---
  document.getElementById("eventDialog").style.display = "flex";

  // --- Handle Register/Unregister Button ---
  const actionBtn = document.getElementById("unregisterBtn"); // This is your button inside the dialog

  // 7. Check if the user is already registered for this event
  const isRegistered = registrations.some(r => r.userId == loggedInUserId && r.eventId == eventId);

  if (isRegistered) {
    // ✅ User is already registered → show "Unregister"
    actionBtn.textContent = "Unregister";
    actionBtn.disabled = false;

    // Define what happens when "Unregister" is clicked
    actionBtn.onclick = () => {
      // Remove this registration from the list

      if (confirm("Are you sure you want to unregister from this event?")) {
      const updatedRegistrations = registrations.filter(r => !(r.userId == loggedInUserId && r.eventId == eventId));
      localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));

      alert("You have unregistered from this event.");
      document.getElementById("eventDialog").style.display = "none"; // Close dialog
      location.reload(); // Refresh page to update list
      }
    };

  } 
}

// Close dialog
document.getElementById("closeDialog").addEventListener("click", () => {
  document.getElementById("eventDialog").style.display = "none";
});

// Close when clicking outside
document.getElementById("eventDialog").addEventListener("click", (e) => {
  if (e.target.id === "eventDialog") {
    document.getElementById("eventDialog").style.display = "none";
  }
});

