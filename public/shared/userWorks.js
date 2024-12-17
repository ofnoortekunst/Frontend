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
const template =`<div class="art-container">
<div class="art-pic" onclick="openPage('work_opened');"></div>
<p class="name-and-author">"Portree" - Mari Vilde</p>
<hr>
<p class="specifications">Akrüül - 150x206 - paber - 2023</p>
<hr>
<div class="price-and-like">
  <button class="save-work">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
      <path
        d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
    </svg>
    <span>Lemmikutesse</span>
  </button>
  <div class="post-rating">
    <span class="post-rating-button material-icons">
      thumb_up
    </span>
    <span class="post-rating-count">0</span>
  </div>
  <p class="delete-work-button" data-modal-target="#delete-work-modal">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
      <path
        d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  </p>
</div>
</div>`
onAuthStateChanged(auth, async function(user) {
  if (user) {
    const baseUrl = window.location.origin;
    const token = await user.getIdToken();
        try {
          var url = `${baseUrl}/api/userworks`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: token,
              works: "all"
            }),
          });
  
          if (response.ok) {
            const mainElement = document.querySelector('main');
            const responseData = await response.json();
            responseData.message.forEach(url => {
                // Create a new <img> element
                const img = document.createElement('img');
                
                img.src = url;
                console.log(url)
                
                img.alt = 'Image description';
            
                mainElement.appendChild(img);
            });
          } else {
            console.error('Failed to fetch worknum data');
          }
        } catch (error) {
          console.error('Error getting ID token or fetching data:', error);
        }
    }
});