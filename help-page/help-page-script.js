const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const settingsOverlay = document.getElementById('settings-overlay');

// Scale the icons in the footer.
function checkWidth() {
  const instaContent = document.querySelector('.insta-content');
  const tiktokContent = document.querySelector('.tiktotk-content');
  const gmailContent = document.querySelector('.gmail-content');
  const uploadWork = document.querySelector('.upload-work-button');
  
  if (window.innerWidth <= 896) {
      instaContent.innerHTML = '<svg class="insta-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>';
  
      tiktokContent.innerHTML = '<svg class="tiktok-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50"><path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z"></path></svg>';
  
      gmailContent.innerHTML = '<svg class="gmail-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gmail</title><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>';
  } else {
      instaContent.innerHTML = '<svg class="insta-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>@of_noortekunst';
  
      tiktokContent.innerHTML = '<svg class="tiktok-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50"><path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z"></path></svg>@of_noortekunst';
  
      gmailContent.innerHTML = '<svg class="gmail-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gmail</title><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>of_noortekunst@gmail.com';
  };

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

  mainLogo.innerHTML = '<img class="logo" alt="logo" src="images/dark-mode-logo.png">';
  sidebarActiveLogo.innerHTML = '<img alt="logo-static" class="logo-static" src="images/dark-mode-logo.png">';

  footer.innerHTML = '<img class="dark-logo-footer" alt="dark-logo" src="images/footer-logo-darkmode.png">';

  loginLogo.innerHTML = '<img alt="logo" src="images/dark-back-darkmode-logo.png"><p>Eesti esimene noortele loodud veebigalerii</p>';

  document.body.classList.add('css-transitions-only-after-page-load'); // Disable transitions

  setTimeout(() => {
    document.body.classList.remove('css-transitions-only-after-page-load');
  }, 50); // 50ms delay should be sufficient
};

// Disables darkmodeand saves inactive into localStorage.
const disableDarkmode = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', 'inactive');

  mainLogo.innerHTML = '<img class="logo" alt="logo" src="images/pro-logo-transparent.png">';
  sidebarActiveLogo.innerHTML = '<img alt="logo-static" class="logo-static" src="images/pro-logo-transparent.png">';

  footer.innerHTML = '<img class="dark-logo-footer" alt="dark-logo" src="images/footer-logo.png">';

  loginLogo.innerHTML = '<img alt="logo" src="images/logo-white-background.png"><p>Eesti esimene noortele loodud veebigalerii</p>';

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