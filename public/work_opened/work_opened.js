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

function createFavoriteButton(isFavorite, isVisitor) {
  if (isVisitor) return '';
  
  const selectedClass = isFavorite ? ' selected' : '';
  const svg = isFavorite ? 
    '<path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/>' :
    '<path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />';
  
  return `
    <button class="save-work${selectedClass}">
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">${svg}</svg>
      <span>${isFavorite ? 'Lemmikutes' : 'Lemmikutesse'}</span>'
    </button>`;
}

function createArtworkHTML(data, token) {
  return `
    <div class="container-in-main">
      <div class="image-container">
        <div class="opened-image">
          <img src="${data.imageReference}" alt="pilt" class="image-container opened-image">
        </div>
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
            <p class="author-button" onclick="window.location.href='/artist_page?${data.authorId}'">${data.name}</p>
          </div>
          <div class="like-and-save">
            ${createFavoriteButton(data.favorite, token === 'visitor')}
            <div class="post-rating${data.liked ? ' selected' : ''}">
              <span class="post-rating-button material-icons">thumb_up</span>
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
    </div>`;
}

async function handleLikeClick(token, postId, rating) {
  const response = await fetch(`${window.location.origin}/api/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token, post: postId }),
  });

  const data = await response.json();
  const count = rating.querySelector('.post-rating-count');
  
  if (response.ok) {
    if (data.message === "removed") {
      rating.classList.remove('selected');
      count.textContent = Math.max(0, Number(count.textContent) - 1);
    } else {
      count.textContent = Number(count.textContent) + 1;
      rating.classList.add('selected');
    }
  }
}

async function handleFavoriteClick(token, postId, button) {
  const response = await fetch(`${window.location.origin}/api/favorite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token, id: postId }),
  });

  if (response.ok) {
    const { message } = await response.json();
    const isRemoving = message === "removed";
    
    button.classList.toggle('selected', !isRemoving);
    button.innerHTML = createFavoriteButton(!isRemoving, false).trim();
  }
}

async function getWorks(token = 'visitor', hereid) {
  try {
    const response = await fetch(`${window.location.origin}/api/userworks`, {
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

    if (!response.ok) {
      throw new Error('Failed to fetch worknum data');
    }

    const { message } = await response.json();
    const data = message[0];
    const mainElement = document.querySelector('main');
    
    mainElement.innerHTML = createArtworkHTML(data, token);

    if (token === 'visitor') return;

    const container = document.querySelector('.container-in-main');
    const imageContainer = container.querySelector('.image-container');
    const popupImage = container.querySelector('.popup-image');
    const rating = container.querySelector('.post-rating');
    const saveButton = container.querySelector('.save-work');

    imageContainer.addEventListener('click', (e) => {
      popupImage.style.display = 'block';
      popupImage.querySelector('img').src = e.target.getAttribute('src');
    });

    popupImage.querySelector('span').addEventListener('click', () => {
      popupImage.style.display = 'none';
    });

    rating.querySelector('.post-rating-button').addEventListener('click', () => {
      handleLikeClick(token, data.id, rating);
    });

    if (saveButton) {
      saveButton.addEventListener('click', () => {
        handleFavoriteClick(token, data.id, saveButton);
      });
    }

  } catch (error) {
    console.error('Error getting ID token or fetching data:', error);
  }
}

onAuthStateChanged(auth, async function(user) {
  const token = user ? await user.getIdToken() : 'visitor';
  const postId = parseInt(window.location.href.split('?')[1]);
  getWorks(token, {Id: postId});
});