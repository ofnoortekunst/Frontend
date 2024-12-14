const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');
const sibling1 = document.querySelector('.search-bar');
const sibling2 = document.querySelector('.show-sorting');
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const settingsOverlay = document.getElementById('settings-overlay');


// Toggle the sidebar button.
function toggleSidebar(explicitClose = false) {
  if (explicitClose) {
    sidebar.classList.add('close');
    document.body.classList.add('sidebar-collapsed');
    toggleButton.classList.add('rotate');
  } else {
    sidebar.classList.toggle('close');
    document.body.classList.toggle('sidebar-collapsed');
    toggleButton.classList.toggle('rotate');
  }
  closeAllSubMenus();
}

// Disable closing on scroll
sidebar.addEventListener('touchmove', (event) => {
  event.stopPropagation();
}, { passive: false });

sidebar.addEventListener('scroll', (event) => {
  event.stopPropagation();
});

// Automatically close and open the sidebar at a certain width. Scale the icons in the footer.
function checkWidth() {
  const uploadWork = document.querySelector('.upload-work-button');

  if (window.innerWidth <= 1090) {
    sidebar.classList.add('close');
    document.body.classList.add('sidebar-collapsed');
    toggleButton.classList.add('rotate');

    closeAllSubMenus();
  } else {
    sidebar.classList.remove('close');
    document.body.classList.remove('sidebar-collapsed');
    toggleButton.classList.remove('rotate');
  };

  if (window.innerWidth <= 1085) {
    uploadWork.innerHTML = '+ Lae oma töö';
  } else {
    uploadWork.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>';
  };

  if (window.innerWidth < 460) {
    // Listen for the focusin and focusout events on the first sibling
    sibling1.addEventListener('focusin', () => {
      // When sibling-1 (or its children) gains focus, add the 'focused' class to sibling-2
      sibling2.classList.add('focused');
    });

    sibling1.addEventListener('focusout', () => {
      // When sibling-1 (or its children) loses focus, remove the 'focused' class from sibling-2
      sibling2.classList.remove('focused');
    });
  } else {
    // Listen for the focusin and focusout events on the first sibling
    sibling1.addEventListener('focusin', () => {
      // When sibling-1 (or its children) gains focus, add the 'focused' class to sibling-2
      sibling2.classList.remove('focused');
    });
  };
};
checkWidth();
window.addEventListener('resize', checkWidth);

// Toggle the submenus.
function toggleSubMenu(button) {

  if (!button.nextElementSibling.classList.contains('show')) {
    closeAllSubMenus();
  };

  button.nextElementSibling.classList.toggle('show');
  button.classList.toggle('rotate');

  if (sidebar.classList.contains('close')) {
    sidebar.classList.toggle('close');
    document.body.classList.toggle('sidebar-collapsed');
    toggleButton.classList.toggle('rotate');
  };
};

// Close all submenus.
function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show');
    ul.previousElementSibling.classList.remove('rotate');
  });
};

// Making the divs in main appear on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
});

const hiddenElements = document.querySelectorAll('.invisible');
hiddenElements.forEach((el => observer.observe(el)));

// Scroll to top button function
function scrollToTop() {
  document.querySelector('header').scrollIntoView({behavior: 'smooth'});
};

// Scroll to bottom function
function scrollToBottom() {
  document.querySelector('footer').scrollIntoView({behavior: 'smooth'});
};

function hideSideBar() {
  const sidebarCheckBox = document.getElementById('sidebar-active');
  sidebarCheckBox.checked = false;
};

// For each modal that is created in the beginning of this js, when it's clicked it saves a modal variable which is used for the openModal() function.
openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal =  document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  })
});

// Same as the open but this time the variable is used for the closeModal() function.
closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.settings-modal');
    closeModal(modal);
  })
});

// When the settingsOverlay is clicked it selects all modals with the settings-active class and closes them.
settingsOverlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.settings-modal.settings-active');
  modals.forEach(modal => {
    closeModal(modal);
  })
})

// Takes the modal from openModalButtons and adds settings-active class, same for the settingsOverlay.
function openModal(modal) {
  if (modal == null) {
    return;
  } else {
    modal.classList.add('settings-active');
    settingsOverlay.classList.add('settings-active');
  };
};

// Takes the modal from closeModalButtons and removes settings-active class, same for the settingsOverlay.
function closeModal(modal) {
  if (modal == null) {
    return;
  } else {
    modal.classList.remove('settings-active');
    settingsOverlay.classList.remove('settings-active');
  };
};


// Dark mode stuff

const mainLogo = document.querySelector('.home-link');
const sidebarActiveLogo = document.querySelector('.static-a');
const footer = document.querySelector('.logo-container');

// Enables darkmode and saves active status into localStorage.
const enableDarkmode = () => {
  document.documentElement.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');

  mainLogo.innerHTML = '<img class="logo" alt="logo" src="images/dark-mode-logo.avif">';
  sidebarActiveLogo.innerHTML = '<img alt="logo-static" class="logo-static" src="images/dark-mode-logo.avif">';

  footer.innerHTML = '<img class="dark-logo-footer" alt="dark-logo" src="images/footer-logo-darkmode.avif">';

  document.documentElement.classList.add('css-transitions-only-after-page-load'); // Disable transitions

  setTimeout(() => {
    document.documentElement.classList.remove('css-transitions-only-after-page-load');
  }, 50); // 50ms delay should be sufficient
};

// Disables darkmodeand saves inactive into localStorage.
const disableDarkmode = () => {
  document.documentElement.classList.remove('darkmode');
  localStorage.setItem('darkmode', 'inactive');

  mainLogo.innerHTML = '<img class="logo" alt="logo" src="images/pro-logo-transparent.avif">';
  sidebarActiveLogo.innerHTML = '<img alt="logo-static" class="logo-static" src="images/pro-logo-transparent.avif">';

  footer.innerHTML = '<img class="dark-logo-footer" alt="dark-logo" src="images/footer-logo.avif">';

  document.documentElement.classList.add('css-transitions-only-after-page-load'); // Disable transitions

  setTimeout(() => {
    document.documentElement.classList.remove('css-transitions-only-after-page-load');
  }, 50); // 50ms delay should be sufficient
};

// Get darkmode from local storage.
let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

// Check if darkmode is active or not when the page loads.
if (darkmode === 'active') {
  enableDarkmode();
};

// When themeSwitch is clicked it takes darkmode from localStorage and if its not active it enables it and if its active it disables it.
themeSwitch.addEventListener('click', () => {
  darkmode = localStorage.getItem('darkmode');
  // Toggle between enabling and disabling dark mode based on current state.
  darkmode !== 'active' ? enableDarkmode() : disableDarkmode();
});


// Open the artwork onclick
function openPage(pageUrl){
  window.location.href = pageUrl;
}

// Price scale
function getVals() {
  // Get slider values
  let parent = this.parentNode;
  let slides = parent.querySelectorAll(".range-input");
  let slide1 = parseFloat(slides[0].value);
  let slide2 = parseFloat(slides[1].value);

  // Cross Range 
  if (slide1 > slide2) {
    let tmp = slide2;
    slide2 = slide1;
    slide1 = tmp;
  }

  let displayElement = document.getElementById("range-values");
  displayElement.innerHTML = "$" + slide1 + " &nbsp-&nbsp $" + slide2;
};

window.onload = function () {
  let sliderSections = document.getElementById("range-slider");
  let sliders = sliderSections.querySelectorAll(".range-input");

  sliders.forEach((slide) => {
    if (slide.type === "range") {
      // Change Value Method
      slide.oninput = getVals;
      // Initial Value
      slide.oninput();
    }
  });
};

// When the like button is clicked
document.querySelectorAll('.art-container').forEach(post => {
  const postId = post.dataset.postId;
  const rating = post.querySelector('.post-rating'); // Scoped to the current post
  const button = rating.querySelector('.post-rating-button');
  const count = rating.querySelector('.post-rating-count');

  button.addEventListener('click', async () => {  
    if (rating.classList.contains('selected')) {
      const count = rating.querySelector('.post-rating-count');
      rating.classList.remove('selected');
      count.textContent = Math.max(0, Number(count.textContent) - 1);
      return; // Prevent the fetch request when un-liking
    } else {
      count.textContent = Number(count.textContent) + 1;
      rating.classList.add('selected');
    }

    // Fetch is only sent when the select is added
    const response = await fetch(`/posts/${postId}/${"like"}`);
    const body = await response.json();
  });
});

// Adding functionality for the 'Save' button
document.querySelectorAll('.art-container').forEach(post => {
  const postId = post.dataset.postId; // Assuming you have postId for each post container
  const saveButton = post.querySelector('.save-work');

  saveButton.addEventListener('click', async () => {
    if (saveButton.classList.contains('selected')) {
      // If already saved, remove saved state
      saveButton.classList.remove('selected');
      saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" /></svg><span>Lemmikutesse</span>';

      // Optionally send an API request to unsave
      await fetch(`/posts/${postId}/unsave`, { method: 'POST' });
    } else {
      // If not saved, add saved state
      saveButton.classList.add('selected');
      saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/></svg><span>Lemmikutes</span>';

      // Optionally send an API request to save
      await fetch(`/posts/${postId}/save`, { method: 'POST' });
    }
  });
});

// Show the sorting when 'sorteeri' is clicked
const sortingButton = document.querySelector('.show-sorting');
const sortingOptions = document.querySelector('.sorting-options');

sortingButton.addEventListener('click', () => {
  if (sortingOptions.classList.contains('display')) {
    sortingOptions.classList.remove('display');
  } else {
    sortingOptions.classList.add('display');
  }
});
