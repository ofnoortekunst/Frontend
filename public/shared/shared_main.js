const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const settingsOverlay = document.getElementById("settings-overlay");
const toggleButton = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const sibling1 = document.querySelector(".search-bar");
const sibling2 = document.querySelector(".sorting-options");

function checkWidth() {
  const uploadWork = document.querySelector(".upload-work-button");

  if (window.innerWidth <= 1085) {
    uploadWork.innerHTML = "+ Lae oma töö";
  } else {
    uploadWork.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>';
  }

  if (window.innerWidth <= 1090) {
    sidebar.classList.add("close");
    document.body.classList.add("sidebar-collapsed");
    toggleButton.classList.add("rotate");

    closeAllSubMenus();
  } else {
    sidebar.classList.remove("close");
    document.body.classList.remove("sidebar-collapsed");
    toggleButton.classList.remove("rotate");
  }

  if (window.innerWidth < 620) {
    // Listen for the focusin and focusout events on the first sibling
    sibling1.addEventListener("focusin", () => {
      // When sibling-1 (or its children) gains focus, add the 'focused' class to sibling-2
      sibling2.classList.add("focused");
    });

    sibling1.addEventListener("focusout", () => {
      // When sibling-1 (or its children) loses focus, remove the 'focused' class from sibling-2
      sibling2.classList.remove("focused");
    });
  } else {
    // Listen for the focusin and focusout events on the first sibling
    sibling1.addEventListener("focusin", () => {
      // When sibling-1 (or its children) gains focus, add the 'focused' class to sibling-2
      sibling2.classList.remove("focused");
    });
  }
}
window.addEventListener("resize", checkWidth);

// Scroll to top button function
function scrollToTop() {
  document.querySelector("header").scrollIntoView({ behavior: "smooth" });
}

// Scroll to bottom function
function scrollToBottom() {
  document.querySelector("footer").scrollIntoView({ behavior: "smooth" });
}

// Close all submenus.
function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName("show")).forEach((ul) => {
    ul.classList.remove("show");
    ul.previousElementSibling.classList.remove("rotate");
  });
}

function hideSideBar() {
  const sidebarCheckBox = document.getElementById("sidebar-active");
  sidebarCheckBox.checked = false;
}

// For each modal that is created in the beginning of this js, when it's clicked it saves a modal variable which is used for the openModal() function.
openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

// Same as the open but this time the variable is used for the closeModal() function.
closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".settings-modal");
    closeModal(modal);
  });
});

// When the settingsOverlay is clicked it selects all modals with the settings-active class and closes them.
settingsOverlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".settings-modal.settings-active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

// Takes the modal from openModalButtons and adds settings-active class, same for the settingsOverlay.
function openModal(modal) {
  if (modal == null) {
    return;
  } else {
    modal.classList.add("settings-active");
    settingsOverlay.classList.add("settings-active");
  }
}

// Takes the modal from closeModalButtons and removes settings-active class, same for the settingsOverlay.
function closeModal(modal) {
  if (modal == null) {
    return;
  } else {
    modal.classList.remove("settings-active");
    settingsOverlay.classList.remove("settings-active");
  }
}

// Dark mode stuff

const mainLogo = document.querySelector(".home-link");
const sidebarActiveLogo = document.querySelector(".static-a");
const footer = document.querySelector(".logo-container");

// Enables darkmode and saves active status into localStorage.
const enableDarkmode = () => {
  document.documentElement.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");

  mainLogo.innerHTML =
    '<img class="logo" alt="logo" src="images/dark-mode-logo.avif">';
  sidebarActiveLogo.innerHTML =
    '<img alt="logo-static" class="logo-static" src="images/dark-mode-logo.avif">';

  footer.innerHTML =
    '<img class="dark-logo-footer" alt="dark-logo" src="images/footer-logo-darkmode.avif">';
  var logoElement = document.getElementById("noortekunst-logo");
  if (logoElement) {
    logoElement.src = "images/dark-mode-logo.avif";
  }
  var logoElement2 = document.getElementById("noortekunst-logo-black");
  if (logoElement2) {
    logoElement2.src = "images/dark-back-darkmode-logo.avif";
  }

  var backgroundImage = document.getElementById("background-img");
  if (backgroundImage) {
    backgroundImage.src = "images/dark-mountains.avif";
  }

  document.documentElement.classList.add(
    "css-transitions-only-after-page-load"
  ); // Disable transitions

  setTimeout(() => {
    document.documentElement.classList.remove(
      "css-transitions-only-after-page-load"
    );
  }, 50); // 50ms delay should be sufficient
};

// Disables darkmodeand saves inactive into localStorage.
const disableDarkmode = () => {
  document.documentElement.classList.remove("darkmode");
  localStorage.setItem("darkmode", "inactive");

  mainLogo.innerHTML =
    '<img class="logo" alt="logo" src="images/pro-logo-transparent.avif">';
  sidebarActiveLogo.innerHTML =
    '<img alt="logo-static" class="logo-static" src="images/pro-logo-transparent.avif">';

  footer.innerHTML =
    '<img class="dark-logo-footer" alt="dark-logo" src="images/footer-logo.avif">';
  footer.innerHTML =
    '<img class="dark-logo-footer" alt="dark-logo" src="images/footer-logo-darkmode.avif">';
  var logoElement = document.getElementById("noortekunst-logo");
  if (logoElement) {
    logoElement.src = "images/pro-logo-transparent.avif";
  }
  var logoElement2 = document.getElementById("noortekunst-logo-black");
  if (logoElement2) {
    logoElement2.src = "images/logo-white-background.avif";
  }

  var backgroundImage = document.getElementById("background-img");
  if (backgroundImage) {
    backgroundImage.src = "images/potential-background-image.avif";
  }

  document.documentElement.classList.add(
    "css-transitions-only-after-page-load"
  ); // Disable transitions

  setTimeout(() => {
    document.documentElement.classList.remove(
      "css-transitions-only-after-page-load"
    );
  }, 50); // 50ms delay should be sufficient
};

// Get darkmode from local storage.
let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("theme-switch");

// Check if darkmode is active or not when the page loads.
if (darkmode === "active") {
  enableDarkmode();
}

// When themeSwitch is clicked it takes darkmode from localStorage and if its not active it enables it and if its active it disables it.
themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode");
  // Toggle between enabling and disabling dark mode based on current state.
  darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});

function prefetchAsset(url) {
  // Create a link tag for prefetching
  const existingLink = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
  if (!existingLink) {
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = url;
    // Append the link to the head to start fetching the asset
    document.head.appendChild(prefetchLink);
  }
}