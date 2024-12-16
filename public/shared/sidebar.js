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

// Automatically close and open the sidebar at a certain width. Scale the icons in the footer.
function checkWidth() {
  const uploadWork = document.querySelector(".upload-work-button");

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

  if (window.innerWidth <= 1085) {
    uploadWork.innerHTML = "+ Lae oma töö";
  } else {
    uploadWork.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>';
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
