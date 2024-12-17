// Toggle the sidebar button.
function toggleSidebar(explicitClose = false) {
  if (explicitClose) {
    sidebar.classList.add("close");
    document.body.classList.add("sidebar-collapsed");
    toggleButton.classList.add("rotate");
  } else {
    sidebar.classList.toggle("close");
    document.body.classList.toggle("sidebar-collapsed");
    toggleButton.classList.toggle("rotate");
  }
  closeAllSubMenus();
}

// Disable closing on scroll
sidebar.addEventListener(
  "touchmove",
  (event) => {
    event.stopPropagation();
  },
  { passive: false }
);

sidebar.addEventListener("scroll", (event) => {
  event.stopPropagation();
});

// Toggle the submenus.
function toggleSubMenu(button) {
  if (!button.nextElementSibling.classList.contains("show")) {
    closeAllSubMenus();
  }

  button.nextElementSibling.classList.toggle("show");
  button.classList.toggle("rotate");

  if (sidebar.classList.contains("close")) {
    sidebar.classList.toggle("close");
    document.body.classList.toggle("sidebar-collapsed");
    toggleButton.classList.toggle("rotate");
  }
}
