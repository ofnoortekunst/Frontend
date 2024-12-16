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