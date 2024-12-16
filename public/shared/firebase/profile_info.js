import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js'
const firebaseConfig = {

  apiKey: "AIzaSyBxkehsxAYKmu8kPPUEGYZBYjSc_rZVFZE",

  authDomain: "noortekunst.firebaseapp.com",

  projectId: "noortekunst",

  storageBucket: "noortekunst.firebasestorage.app",

  messagingSenderId: "293895391339",

  appId: "1:293895391339:web:54d410d4832a1576a7492e",

  measurementId: "G-WP5PX2R36D",

};

function getNameFromEmail(email) {
  if (!email.includes('@')) {
    return null;
  }

  const namePart = email.split('@')[0];
  const name = namePart.replace(/[._]/g, ' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const pictureHTML = `<img src="example.jpg" alt="Profile picture" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">`;
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.displayName) {
      Array.from(document.getElementsByClassName("name")).map((name) => name.textContent = user.displayName);
    }
    else {
      Array.from(document.getElementsByClassName("name")).map((name) => name.textContent = getNameFromEmail(user.email));
    }
    var email = document.getElementById('email')
    if (email) {
      email.textContent = user.email
    }
    if (user.photoURL) {
      Array.from(document.getElementsByClassName("pfp")).map((pfp) => pfp.innerHTML = `<img src="`+ user.photoURL + `" alt="Profile picture" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">`);
    }
  }
});