// controls the single page app
function knowledgeRunner() {
  const sections = document.querySelectorAll(".view-section");
  const navLinks = document.querySelectorAll("[data-nav]");
  const main = document.getElementById("main");

  // Show one view and hide the rest
  function showView(id, push) {
    sections.forEach((section) => {
      const isMatch = section.id === id;
      section.hidden = !isMatch;
    });

    // Update heading in page title
    let titlePart = "Home";
    if (id === "services") {
      titlePart = "Services";
    } else if (id === "schedule") {
      titlePart = "Schedule a call";
    }
    document.title = "Empower Ability Labs " + titlePart;

    navLinks.forEach((link) => {
      const target = link.getAttribute("data-nav") || "home";
      if (target === id) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });

    // Move focus to the first heading of the new view
    const heading = document.querySelector("#" + id + " h1");
    if (heading) {
      heading.focus();
    } else if (main) {
      main.focus();
    }

    if (push) {
      history.pushState({ view: id }, "", "#" + id);
    }
  }

  // Nav link click handler
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = link.getAttribute("data-nav") || "home";
      showView(target, true);
    });
  });

  // Back button support
  window.addEventListener("popstate", () => {
    const hash = window.location.hash.replace("#", "") || "home";
    showView(hash, false);
  });

  // Decide which view to show first
  const startView = window.location.hash.replace("#", "") || "home";
  showView(startView, false);

  // Small screen nav toggle
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

  // Skip link should send focus to main content
  const skipLink = document.querySelector(".skip-link");
  if (skipLink && main) {
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      main.focus();
      main.scrollIntoView({ behavior: "instant" });
    });
  }

  // Modal behaviour for Meet the Empower Community
  const openModalBtn = document.getElementById("openCommunityModal");
  const modal = document.getElementById("communityModal");
  const closeModalBtn = document.getElementById("closeCommunityModal");
  let lastFocusedBeforeModal = null;

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

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.removeEventListener("keydown", handleModalKeydown);
    if (lastFocusedBeforeModal) {
      lastFocusedBeforeModal.focus();
    }
  }

  function handleModalKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  if (openModalBtn) {
    openModalBtn.addEventListener("click", openModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // Show and hide text area based on speaker checkbox
  const topicSpeaker = document.getElementById("topicSpeaker");
  const eventDetailsGroup = document.getElementById("eventDetailsGroup");
  if (topicSpeaker && eventDetailsGroup) {
    topicSpeaker.addEventListener("change", () => {
      const show = topicSpeaker.checked;
      eventDetailsGroup.hidden = !show;
      if (show) {
        const textArea = document.getElementById("eventDetails");
        if (textArea) {
          textArea.focus();
        }
      }
    });
  }

  // Switch behaviour for email updates
  const emailSwitch = document.getElementById("emailUpdatesSwitch");
  if (emailSwitch) {
    function toggleSwitch() {
      const current =
        emailSwitch.getAttribute("aria-checked") === "true";
      const next = !current;
      emailSwitch.setAttribute("aria-checked", String(next));
      emailSwitch.textContent = next ? "On" : "Off";
    }

    emailSwitch.addEventListener("click", toggleSwitch);
    emailSwitch.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        toggleSwitch();
      }
    });
  }

  // Form validation and user messages
  const form = document.getElementById("scheduleForm");
  const messages = document.getElementById("formMessages");

  if (form && messages) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      messages.textContent = "";

      const email = document.getElementById("email");
      const errors = [];

      if (!email.value.trim()) {
        errors.push("Email is required");
      } else if (!email.checkValidity()) {
        errors.push("Please enter a valid email address");
      }

      if (errors.length) {
        email.setAttribute("aria-invalid", "true");
        messages.textContent = errors.join(". ");
        messages.focus();
      } else {
        email.removeAttribute("aria-invalid");
        messages.textContent =
          "Thank you. We have received your request.";
        form.reset();

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

document.addEventListener("DOMContentLoaded", knowledgeRunner);
