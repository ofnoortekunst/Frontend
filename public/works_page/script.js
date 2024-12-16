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
