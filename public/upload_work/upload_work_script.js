const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const settingsOverlay = document.getElementById('settings-overlay');


document.addEventListener('DOMContentLoaded', () => {
  const fInput = document.getElementById('fileInput');
  const pBar = document.getElementById('progressBar');
  const pText = document.getElementById('progressText');
  const fName = document.getElementById('fileName');
  const modal = document.getElementById('myModal');
  const cModal = document.getElementById('closeModal');
  const uImage = document.getElementById('uploadedImageModal');
  const pContainer = document.getElementById('previewContainer');
  const cBtn = document.getElementById('clearButton');
  fInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadstart = () => {
          pBar.style.width = '0%';
          pText.style.display = 'block';
          pText.innerText = '0%';
          pContainer.style.display = 'none';
          cBtn.style.display = 'none';
        };
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = 
              (event.loaded / event.total) * 100;
                pBar.style.width = `${progress}%`;
                pText.innerText = `${Math.round(progress)}%`;
          }
        };
        reader.onload = () => {
          const uploadTime = 4000;
          const interval = 50;
          const steps = uploadTime / interval;
          let currentStep = 0;
          const updateProgress = () => {
            const progress = (currentStep / steps) * 100;
            pBar.style.width = `${progress}%`;
            pText.innerText = `${Math.round(progress)}%`;
            currentStep++;

            if (currentStep <= steps) {
              setTimeout(updateProgress, interval);
            } else {
              pBar.style.width = '100%';
              pText.innerText = '100%';
              fName.innerText = `Faili nimi: ${file.name}`;
              pContainer.innerHTML = 
                    `<img src="${reader.result}" 
                        alt="Preview" id="previewImage">`;
              pContainer.style.display = 'block';
              cBtn.style.display = 'block';
            }
        };
        setTimeout(updateProgress, interval);
        };
        reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
      fInput.value = '';
    }
  });
  pContainer.addEventListener('click', () => {
    modal.style.display = 'block';
    uImage.src = document.getElementById('previewImage').src;
  });
  cModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  cBtn.addEventListener('click', () => {
    fInput.value = '';
    pBar.style.width = '0%';
    pText.style.display = 'none';
    fName.innerText = '';
    pContainer.style.display = 'none';
    cBtn.style.display = 'none';
  });
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

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
