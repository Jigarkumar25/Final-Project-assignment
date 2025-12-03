// Our team uses this script to control the single page app behaviour
// We keep everything inside knowledgeRunner so it is easy to read
function knowledgeRunner() {
  const sections = document.querySelectorAll(".view-section");
  const navLinks = document.querySelectorAll("[data-nav]");
  const main = document.getElementById("main");

  // Helper function that shows one view and hides the others
  function showView(id, push) {
    sections.forEach((section) => {
      const isMatch = section.id === id;
      section.hidden = !isMatch;
    });

    // Update the document title so each view feels like its own page
    let titlePart = "Home";
    if (id === "services") {
      titlePart = "Services";
    } else if (id === "schedule") {
      titlePart = "Schedule a call";
    }
    document.title = "Empower Ability Labs " + titlePart;

    // Move focus to the first heading of the new view
    // This helps screen reader and keyboard users
    const heading = document.querySelector("#" + id + " h1");
    if (heading) {
      heading.focus();
    } else if (main) {
      main.focus();
    }

    // Handle browser history.
    // When push is true we add a new state for the back button
    if (push) {
      history.pushState({ view: id }, "", "#" + id);
    }
  }

  // Navigation click handler
  // We stop the default jump and use showView instead
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = link.getAttribute("data-nav") || "home";
      showView(target, true);
    });
  });

  // When the user presses the browser back button
  // we read the hash and show the correct view
  window.addEventListener("popstate", () => {
    const hash = window.location.hash.replace("#", "") || "home";
    showView(hash, false);
  });

  // When the app loads we use the hash to decide which view to show first
  const startView = window.location.hash.replace("#", "") || "home";
  showView(startView, false);

  // Simple navigation toggle for small screens
  const navToggle = document.querySelector(".navbar-toggler");
  const navMenu = document.getElementById("mainNav");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isExpanded =
        navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      navMenu.classList.toggle("show");
    });
  }

  // -------- Modal behaviour for Meet the Empower Community --------

  const openModalBtn = document.getElementById("openCommunityModal");
  const modal = document.getElementById("communityModal");
  const closeModalBtn = document.getElementById("closeCommunityModal");
  let lastFocusedBeforeModal = null;

  // Open modal and store the element that had focus
  function openModal() {
    if (!modal) return;
    lastFocusedBeforeModal = document.activeElement;
    modal.hidden = false;
    const title = document.getElementById("communityModalTitle");
    if (title) {
      title.focus();
    }
    document.addEventListener("keydown", handleModalKeydown);
  }

  // Close modal and send focus back to the trigger button
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.removeEventListener("keydown", handleModalKeydown);
    if (lastFocusedBeforeModal) {
      lastFocusedBeforeModal.focus();
    }
  }

  // Allow escape key to close the modal
  function handleModalKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  // Wire up open and close events
  if (openModalBtn) {
    openModalBtn.addEventListener("click", openModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }
  if (modal) {
    // Clicking outside the dialog closes it
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // -------- Show and hide text area based on speaker checkbox --------

  const topicSpeaker = document.getElementById("topicSpeaker");
  const eventDetailsGroup = document.getElementById("eventDetailsGroup");
  if (topicSpeaker && eventDetailsGroup) {
    topicSpeaker.addEventListener("change", () => {
      const show = topicSpeaker.checked;
      eventDetailsGroup.hidden = !show;
      // When the area appears we move focus inside so the user can start typing
      if (show) {
        const textArea = document.getElementById("eventDetails");
        if (textArea) {
          textArea.focus();
        }
      }
    });
  }

  // -------- Switch behaviour for email updates --------

  const emailSwitch = document.getElementById("emailUpdatesSwitch");
  if (emailSwitch) {
    // We created a helper to toggle the switch state and text
    function toggleSwitch() {
      const current =
        emailSwitch.getAttribute("aria-checked") === "true";
      const next = !current;
      emailSwitch.setAttribute("aria-checked", String(next));
      emailSwitch.textContent = next ? "On" : "Off";
    }

    // Click and keyboard both control the switch
    emailSwitch.addEventListener("click", toggleSwitch);
    emailSwitch.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        toggleSwitch();
      }
    });
  }

  // -------- Form validation and user messages --------

  const form = document.getElementById("scheduleForm");
  const messages = document.getElementById("formMessages");

  if (form && messages) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      messages.textContent = "";

      const email = document.getElementById("email");
      const errors = [];

      // We focused on email in our validation because it is the required field
      if (!email.value.trim()) {
        errors.push("Email is required");
      } else if (!email.checkValidity()) {
        errors.push("Please enter a valid email address");
      }

      // If there are problems we show them in the alert region
      if (errors.length) {
        messages.textContent = errors.join(". ");
      } else {
        // Simple success state so the user knows the form was sent
        messages.textContent =
          "Thank you. We have received your request.";
        form.reset();

        // Hide the event details again and reset the switch
        if (eventDetailsGroup) {
          eventDetailsGroup.hidden = true;
        }
        if (emailSwitch) {
          emailSwitch.setAttribute("aria-checked", "false");
          emailSwitch.textContent = "Off";
        }
      }
    });
  }
}

// We wait for the document to be ready before running our script
document.addEventListener("DOMContentLoaded", knowledgeRunner);
