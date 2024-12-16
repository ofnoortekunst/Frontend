// Cookies
const cookieBox = document.querySelector('.cookies');
const cookieButtons = document.querySelectorAll('.cookie-button');

// Making the divs in main appear on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
});

const hiddenElements = document.querySelectorAll('.invisible');
hiddenElements.forEach((el => observer.observe(el)));

// Function to show cookie div and act accordingly whether they've been accepted or not.
const executeCookieCodes = () => {
  if (document.cookie.includes('noorteKunst')) return;

const executeCookieCodes = () => {
  cookieBox.classList.add('show-cookies');

  cookieButtons.forEach(button => {
    button.addEventListener('click', () => {
      cookieBox.classList.remove ('show-cookies');

      if (button.id == 'decline-cookies') {
        // Cookies have been accepted so set them for 30 days.
        // 60 = 1min, 60 = 1h, 24 = 1day, 30 = 30days
        document.cookie = "CookieBy=noorteKunst; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      };
    });
  });
};

// When the page is loaded the executeCookieCodes function will run.
window.addEventListener('load', executeCookieCodes)