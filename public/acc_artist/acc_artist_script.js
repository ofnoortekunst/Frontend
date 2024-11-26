const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const settingsOverlay = document.getElementById('settings-overlay');

// Scale the icons in the footer.
function checkWidth() {
  const uploadWork = document.querySelector('.upload-work-button');

  if (window.innerWidth <= 1085) {
    uploadWork.innerHTML = '+ Lae oma töö';
  } else {
    uploadWork.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>';
  };
};
checkWidth();
window.addEventListener('resize', checkWidth);

// Scroll to top button function
function scrollToTop() {
  window.scrollTo(0,0);
};

// Scroll to bottom function
function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
};

// Hide sidebar onclick
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
const loginLogo = document.querySelector('.image-and-desc');

// Enables darkmode and saves active status into localStorage.
const enableDarkmode = () => {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');

  mainLogo.innerHTML = '<img class="logo" alt="logo" src="images/dark-mode-logo.avif">';
  sidebarActiveLogo.innerHTML = '<img alt="logo-static" class="logo-static" src="images/dark-mode-logo.avif">';

  footer.innerHTML = '<img class="dark-logo-footer" alt="dark-logo" src="images/footer-logo-darkmode.avif">';

  loginLogo.innerHTML = '<img alt="logo" src="images/dark-back-darkmode-logo.avif"><p>Eesti esimene noortele loodud veebigalerii</p>';

  document.body.classList.add('css-transitions-only-after-page-load'); // Disable transitions

  setTimeout(() => {
    document.body.classList.remove('css-transitions-only-after-page-load');
  }, 50); // 50ms delay should be sufficient
};

// Disables darkmodeand saves inactive into localStorage.
const disableDarkmode = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', 'inactive');

  mainLogo.innerHTML = '<img class="logo" alt="logo" src="images/pro-logo-transparent.avif">';
  sidebarActiveLogo.innerHTML = '<img alt="logo-static" class="logo-static" src="images/pro-logo-transparent.avif">';

  footer.innerHTML = '<img class="dark-logo-footer" alt="dark-logo" src="images/footer-logo.avif">';

  loginLogo.innerHTML = '<img alt="logo" src="images/logo-white-background.avif"><p>Eesti esimene noortele loodud veebigalerii</p>';

  document.body.classList.add('css-transitions-only-after-page-load'); // Disable transitions

  setTimeout(() => {
    document.body.classList.remove('css-transitions-only-after-page-load');
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

// Open the page onclick
function openPage(pageUrl){
  window.location.href = pageUrl;
}

// Show password
let toggle1 = document.getElementById('show-pass-1');
let toggle2 = document.getElementById('show-pass-2');
let password1 = document.getElementById('password');
let password2 = document.getElementById('psw-new');

toggle1.addEventListener("click", handleToggleClick1, false);
toggle2.addEventListener("click", handleToggleClick2, false);

// Show pass for the first one
function handleToggleClick1(event) {
  if (this.checked) {
    console.warn("Change input 'type' to: text");
    password1.type = "text";
  } else {
    console.warn("Change input 'type' to: password");
    password1.type = "password";
  }
}

// Show pass for the second one
function handleToggleClick2(event) {
  if (this.checked) {
    console.warn("Change input 'type' to: text");
    password2.type = "text";
  } else {
    console.warn("Change input 'type' to: password");
    password2.type = "password";
  }
}

//Profile pic uploading
let profilePicture = document.getElementById('profile-pic');
let inputFile = document.getElementById('input-file');

inputFile.onchange = () => {
  profilePicture.src = URL.createObjectURL(inputFile.files[0]);
};
