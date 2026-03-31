// === Dialog Elements ===
const dialog = document.getElementById("eventDialog");
const closeBtn = document.getElementById("closeDialog");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const editForm = document.getElementById("editEventForm");

// === Load Only My Events ===
function loadMyEvents() {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const loggedInUserId = localStorage.getItem("loggedInUser");
  const myEventsGrid = document.getElementById("myEventsGrid");

  myEventsGrid.innerHTML = "";

  events.forEach(event => {
    if (event.createdBy == loggedInUserId) {
      const card = document.createElement("div");
      card.classList.add("event-card");

      card.innerHTML = `
        <img src="${event.image}" alt="Event Banner"/>
        <h3>${event.name}</h3>
        <p>${event.description}</p>
        <button class="viewEventBtn" data-id="${event.id}">View Event</button>
        <button class="viewParticipantsBtn" data-id="${event.id}">View Participants</button>
      `;

      myEventsGrid.appendChild(card);
    }
  });

  // Attach listeners
  document.querySelectorAll(".viewEventBtn").forEach(btn => {
    btn.addEventListener("click", openEventDialog);
  });
  document.querySelectorAll(".viewParticipantsBtn").forEach(btn => {
    btn.addEventListener("click", openParticipantsDialog);
  });

}

// === Open Event Dialog ===
function openEventDialog(e) {
  const eventId = e.target.getAttribute("data-id");
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  const eventData = events.find(ev => ev.id == eventId);

  if (eventData) {
    document.getElementById("dialogEventName").textContent = eventData.name;
    document.getElementById("dialogEventDescription").textContent = eventData.description;
    document.getElementById("dialogEventDate").textContent = `${eventData.date} at ${eventData.time}`;
    document.getElementById("dialogEventLocation").textContent = eventData.location;
    document.getElementById("dialogEventImage").src = eventData.image;


    // Count how many registrations for this event
    const count = registrations.filter(r => r.eventId == eventId).length;

    // Show registration count
    let stats = document.getElementById("registrationStats");
    if (!stats) {
      stats = document.createElement("p");
      stats.id = "registrationStats";
      document.querySelector(".event-details").appendChild(stats);
    }
    if (count === 0) {
      stats.innerHTML = `<strong>Registered:</strong> No attendees yet`;
    } else if (count === 1) {
      stats.innerHTML = `<strong>Registered:</strong> ${count} attendee`;
    } else {
      stats.innerHTML = `<strong>Registered:</strong> ${count} attendees`;
    }


    // Show dialog
    dialog.style.display = "flex";

    // Attach eventId to buttons
    editBtn.setAttribute("data-id", eventId);
    deleteBtn.setAttribute("data-id", eventId);

    // Hide edit form initially
    editForm.style.display = "none";
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

// === Edit Event ===
editBtn.addEventListener("click", () => {
  const eventId = editBtn.getAttribute("data-id");
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const eventData = events.find(ev => ev.id == eventId);

  if (eventData) {
    // Populate edit form
    document.getElementById("editName").value = eventData.name;
    document.getElementById("editDescription").value = eventData.description;
    document.getElementById("editDate").value = eventData.date;
    document.getElementById("editTime").value = eventData.time;
    document.getElementById("editLocation").value = eventData.location;

    // Show edit form
    editForm.style.display = "block";

    // Handle form submission
    editForm.onsubmit = function(ev) {
      ev.preventDefault();

      eventData.name = document.getElementById("editName").value.trim();
      eventData.description = document.getElementById("editDescription").value.trim();
      eventData.date = document.getElementById("editDate").value;
      eventData.time = document.getElementById("editTime").value;
      eventData.location = document.getElementById("editLocation").value;

      // Save updated events
      localStorage.setItem("events", JSON.stringify(events));

      alert("Event updated successfully!");
      dialog.style.display = "none";
      loadMyEvents();
    };
  }
});

// === Delete Event ===
deleteBtn.addEventListener("click", () => {
  const eventId = deleteBtn.getAttribute("data-id");
  let events = JSON.parse(localStorage.getItem("events")) || [];

  if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
    events = events.filter(ev => ev.id != eventId);
    localStorage.setItem("events", JSON.stringify(events));

    alert("Event deleted successfully!");
    dialog.style.display = "none";
    loadMyEvents();
  }
});

// === View Participants ===
function openParticipantsDialog(e) {
    const eventId = e.target.getAttribute("data-id");

    const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const events = JSON.parse(localStorage.getItem("events")) || [];

    // Get event details for export filename
    const eventData = events.find(ev => ev.id == eventId);

    // Find all registrations for this event
    const eventRegistrations = registrations.filter(r => r.eventId == eventId);

    // Map to user details + registration time
  const registeredUsers = eventRegistrations
    .map(r => {
      const user = users.find(u => u.id == r.userId);
      if (user) {
        return {
          fullname: user.fullname || user.username,
          email: user.email || "N/A",
          time: r.time || "Unknown"
        };
      }
      return null;
    })
    .filter(u => u);

  // Build table rows
  const participantsList = document.getElementById("participantsList");
  participantsList.innerHTML = registeredUsers.length > 0
    ? registeredUsers.map(u => `
        <tr>
          <td>${u.fullname}</td>
          <td>${u.email}</td>
          <td>${u.time}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="3">No participants yet.</td></tr>`;

  // Show dialog
  document.getElementById("participantsDialog").style.display = "flex";

  // ✅ Attach export button logic
  const exportBtn = document.getElementById("exportParticipantsBtn");
  exportBtn.onclick = () => {
    exportParticipants(eventData.name, registeredUsers);
  };
  
};

// Close dialog
document.getElementById("closeParticipantsDialog").addEventListener("click", () => {
  document.getElementById("participantsDialog").style.display = "none";
});

// Close when clicking outside
document.getElementById("participantsDialog").addEventListener("click", (e) => {
  if (e.target.id === "participantsDialog") {
    document.getElementById("participantsDialog").style.display = "none";
  }
});


// === Export Participants as CSV ===
function exportParticipants(eventName, participants) {
  // Build CSV content
  let csvContent = `${eventName}\n\n`; // main heading
  csvContent += "Full Name,Email,Registration Time\n"; // column headers

  participants.forEach(p => {
    csvContent += `"${p.fullname}","${p.email}","${p.time}"\n`;
  });

  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${eventName}.csv`); // filename = event name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// === Load events on page load ===
window.addEventListener("DOMContentLoaded", loadMyEvents);  