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
async function getWorks(token, hereid) {
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
              id: hereid,
              works: {},
              start: 0,
              end: 10,
              sort: { Title: 'asc' },
              full: true
            }),
          });
  
          if (response.ok) {
            const mainElement = document.querySelector('main');
            const responseData = await response.json();
            const data = responseData.message[0]
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
              const newDiv = `<div class="container-in-main">
                <div class="image-container">
                    <div class="opened-image"><img src="${data.imageReference}" alt="pilt" class="image-container opened-image"></div>
                </div>
                <div class="popup-image">
                    <span>&times;</span>
                    <img src="" alt="pilt">
                </div>
                <span id="date-uploaded">${data.uploadDate}</span>
                <div class="text-about-author">
                    <div class="top-spec">
                    <div class="work-title">
                        <p>"${data.title}" -&nbsp</p>
                        <p class="author-button" onclick="window.location.href='${data.authorId}'">${data.name}</p>
                    </div>
                    <div class="like-and-save">
                        ${favorite}
                        <div class="post-rating ${liked}">
                        <span class="post-rating-button material-icons">
                            thumb_up
                        </span>
                        <span class="post-rating-count">${data.likes}</span>
                        </div>
                    </div>
                    </div>
                    <div class="art-specs">
                    <p class="specs">Looja nägemus:</p>
                    <p class="art-specification">"${data.description}"</p>
                    <p class="specs">Täpsustused</p>
                    <p class="art-specification">${data.technique}</p>
                    <hr>
                    <p class="art-specification">${data.surface}</p>
                    <hr>
                    <p class="art-specification">${data.size}</p>
                    <hr>
                    <p class="art-specification">${data.direction}</p>
                    <hr>
                    <p class="art-specification">${data.year}</p>
                    <p class="art-specification">Kontakt: marivilde9372@gmail.com</p>
                    </div>
                </div>
                </div>`
              mainElement.innerHTML = newDiv;
              if (token == 'visitor') {
                return;
              }
              document.querySelector('.image-container').addEventListener('click', (image) => {
                document.querySelector('.popup-image').style.display = 'block';
                document.querySelector('.popup-image img').src = image.target.getAttribute('src');
                })
              document.querySelector('.popup-image span').addEventListener('click', () => {
                document.querySelector('.popup-image').style.display = 'none';
              })
              var thisdiv = document.getElementsByClassName('container-in-main')[0]

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
          } else {
            console.error('Failed to fetch worknum data');
          }
        } catch (error) {
          console.error('Error getting ID token or fetching data:', error);
        }
}
onAuthStateChanged(auth, async function(user) {
    var token = 'visitor'
    if (user) {
        token = await user.getIdToken();
    }
    const herePostId = parseInt(window.location.href.split('?')[1]);
    getWorks(token, {Id: herePostId})
})