import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBxkehsxAYKmu8kPPUEGYZBYjSc_rZVFZE",

  authDomain: "noortekunst.firebaseapp.com",

  projectId: "noortekunst",

  storageBucket: "noortekunst.firebasestorage.app",

  messagingSenderId: "293895391339",

  appId: "1:293895391339:web:54d410d4832a1576a7492e",

  measurementId: "G-WP5PX2R36D",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
async function getWorks(filter, token, sort, hereid, start, end, refresh) {
  if (!refresh) {
    end = 10
    start = 0
    refresh = true
  } else {
    refresh = false
  }
  if (!token) {
    token = 'visitor'
  }
  const baseUrl = window.location.origin;
        try {
          var url = `${baseUrl}/api/userworks`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: token,
              works: filter,
              id: hereid,
              sort: sort,
              start: start,
              end: end,
            }),
          });
  
          if (response.ok) {
            const mainElement = document.querySelector('main');
            if (refresh) {
              mainElement.innerHTML = ''
            }
            const responseData = await response.json();
            responseData.message.forEach(data => {
              let favorite = '';
              if (data.favorite) {
                favorite = `<button class="save-work selected">
                      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/></svg><span>Lemmikutes</span>'
                    </button>`
              } else if (token != 'visitor') {
                favorite = `<button class="save-work">
                      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" /></svg><span>Lemmikutesse</span>'
                    </button>`
              }
              let liked = ""
              if (data.liked) {
                liked = 'selected'
              }
              const newDiv = `<div class="art-container" id="${data.id}">
              <div class="art-pic" onclick="window.location.href='${'work_opened?' + data.id}'">
                <img src="${data.imageReference}" alt='"${data.title}" - ${data.name}'style="position: relative; width: 100%; height: 100%; object-fit: contain">
              </div>
              <p class="name-and-author">"${data.title}" - ${data.name}</p>
              <hr>
              <p class="specifications">${data.technique} - ${data.size} - ${data.surface} - ${data.year}</p>
              <hr>
              <div class="price-and-like">
                ${favorite}
                <div class="post-rating ${liked}">
                  <span class="post-rating-button material-icons">
                    thumb_up
                  </span>
                  <span class="post-rating-count">${data.likes}</span>
                </div>
                <p class="delete-work-button" data-modal-target="#delete-work-modal">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                    <path
                      d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </p>
              </div>
              </div>`
              mainElement.insertAdjacentHTML('beforeend', newDiv);
              if (token == 'visitor') {
                return;
              }
              var thisdiv = document.getElementById(data.id)

              const rating = thisdiv.querySelector('.post-rating');
              const button = thisdiv.querySelector('.post-rating-button');
              const saveButton = thisdiv.querySelector('.save-work');
              const count = thisdiv.querySelector('.post-rating-count');

              button.addEventListener('click', async () => {  
                const postId = data.id
                const baseUrl = window.location.origin;
                const heretoken = token;
                      var url = `${baseUrl}/api/like`;
                      const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          idToken: heretoken,
                          post: postId
                        }),
                      });
                const responseData = await response.json();
                if (response.ok) {
                  if (responseData.message == "removed") {
                    const count = rating.querySelector('.post-rating-count');
                    rating.classList.remove('selected');
                    count.textContent = Math.max(0, Number(count.textContent) - 1);
                  } else {
                    count.textContent = Number(count.textContent) + 1;
                    rating.classList.add('selected');
                  }
                }
              })
              saveButton.addEventListener('click', async () => {
                const postId = data.id
                const baseUrl = window.location.origin;
                const heretoken = token;
                      var url = `${baseUrl}/api/favorite`;
                      const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          idToken: heretoken,
                          id: postId
                        }),
                      });
                if (response.ok) {
                  const responseData = await response.json();
                  if (responseData.message == "removed") {
                    // If already saved, remove saved state
                    saveButton.classList.remove('selected');
                    saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" /></svg><span>Lemmikutesse</span>';
                  } else {
                    // If not saved, add saved state
                    saveButton.classList.add('selected');
                    saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/></svg><span>Lemmikutes</span>';
                  }
                }
              });
            });
          } else {
            console.error('Failed to fetch worknum data');
          }
        } catch (error) {
          console.error('Error getting ID token or fetching data:', error);
        }
}
onAuthStateChanged(auth, async function(user) {
  var thisfilter = {}
  var sort = {Title: 'asc'}
  var hereid = {}
  var start = 0
  var end = 10
  var location = window.location.origin
  switch (window.location.href) {
    case (`${location}/favourites_page`):
      thisfilter = { Favourites: true}
      break;
  }
  if (user) {
    var token = await user.getIdToken();
    if (window.location.href == `${location}/artist_works`) {
      thisfilter = {User_id: user.uid}
    }
    } else {
      var token = 'visitor'
    }
    //sort alphabetically
    const sortAlpha = document.getElementById('alphabetical')
    sortAlpha.addEventListener('click', () => {
      if (sortAlpha.innerText.includes('A-Z')) {
        sortAlpha.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" style="transform: scaleY(-1);">
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>Z-A`
        sort = {Title: 'desc'}
      } else {
        sortAlpha.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>A-Z`
        sort = {Title: 'asc'}
      }
      getWorks(thisfilter, token, sort, hereid, start, end)
    })
    //sort popularity
    const sortPopularity = document.getElementById('popularity')
      sortPopularity.addEventListener('click', () => {
        if (!sortPopularity.innerHTML.includes('scaleY')) {
          sortPopularity.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" style="transform: scaleY(-1);">
            <path d="M480-360 280-560h400L480-360Z" />
          </svg>Populaarsus`
          sort = {Likes: 'desc'}
        } else {
          sortPopularity.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M480-360 280-560h400L480-360Z" />
          </svg>Populaarsus`
          sort = {Likes: 'asc'}
        }
      getWorks(thisfilter, token, sort, hereid, start, end)
    })
    //search logic
    const filterText = document.getElementById('search_text')
    const filterButton = document.getElementById('search_button')
    filterButton.addEventListener('click', () => {
      hereid.Title = {contains: filterText.value}
      getWorks(thisfilter, token, sort, hereid, start, end)
    })
    //load more
    const loadMore = document.getElementsByClassName("load-more-btn")[0]
    loadMore.addEventListener('click', () => {
      var refresh = true
      start += 10
      end += 10
      getWorks(thisfilter, token, sort, hereid, start, end, refresh)
    })
    // Add event listeners to all checkboxes inside the sidebar-filter
    document.querySelectorAll('.sidebar-filter .switch-input').forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
          const checkbox = event.target;
          const checkid = checkbox.id
          const isChecked = checkbox.checked;
          const labelText = checkbox.closest('.sidebar-filter-spec').querySelector('.toggle-switch-text').textContent;
          if (checkid in technique) {
            if (checkid) {
              if ('Technique' in hereid) {
                hereid.Technique = {AND: {}}
              } else {
              hereid.Technique = {contains: labelText}
              }
            }
          }
          // Log the checkbox value or perform other actions
          console.log(`Checkbox with id "${id}" is ${isChecked ? 'checked' : 'unchecked'}`);

          console.log(`Label text: ${labelText}`);
      });
    });
    getWorks(thisfilter, token, sort, hereid, start, end)
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
/*
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
*/
/*
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
};*/
