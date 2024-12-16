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
      saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/></svg><span>Lemmikutes</span>';

      // Optionally send an API request to unsave
      await fetch(`/posts/${postId}/unsave`, { method: 'POST' });
    } else {
      // If not saved, add saved state
      saveButton.classList.add('selected');
      saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" /></svg><span>Lemmikutesse</span>';

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
