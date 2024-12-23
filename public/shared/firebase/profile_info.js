import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
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

const logoutButton = document.createElement("div");
logoutButton.innerHTML = '<button class="log-in-out log-out">Logi välja</button>'

const pictureHTML = `<img src="example.jpg" alt="Profile picture" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">`;
onAuthStateChanged(auth, async (user) => {
  if (user) {
    var token = await user.getIdToken();
    const claims = await user.getIdTokenResult(); // Get user claims
    var isAdmin = claims.claims.admin || false; // Check if user is admin
    var uid = user.uid;
    if (isAdmin) {
      localStorage.setItem('userAdmin', true);
    }
    const baseUrl = window.location.origin;
    const testname = localStorage.getItem('userName')
    if (!testname) {
      try {
        const token = await auth.currentUser.getIdToken()
        var url = `${baseUrl}/api/name`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: uid
          })
          })
        if (response.ok) {
          var data = await response.json()
          console.log(data)
          const the_name = document.getElementById('the_nimi')
          if (the_name) {
            the_name.textContent = data.message
          }
          localStorage.setItem('userName', data.message)
          Array.from(document.getElementsByClassName("name")).map((name) => name.textContent = data.message);
        }
      } catch (error) {
        console.error(error)
      }
    }
    var email = document.getElementById('email')
    if (email) {
      email.textContent = user.email
    }
    if (!localStorage.getItem('pfpUrl')) {
      const response = await fetch(`${window.location.origin}/api/pfp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idToken: token,
        })
      });
      if (response.ok) {
        const responseData = await response.json();
        if (responseData == true) {
          localStorage.setItem('pfpUrl', 'images/pfp/'+ user.uid + '.avif');
          Array.from(document.getElementsByClassName("pfp")).map((pfp) => pfp.innerHTML = `<img src="${'images/pfp/'+ user.uid + '.avif'}" alt="Profile picture" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">`);
        }
      } else {
        if (user.photoURL) {
          localStorage.setItem('pfpUrl', user.photoURL)
          Array.from(document.getElementsByClassName("pfp")).map((pfp) => pfp.innerHTML = `<img src="`+ user.photoURL + `" alt="Profile picture" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">`);
        }
      }
    }
    Array.from(document.getElementsByClassName('log-in'))[0].replaceWith(logoutButton);
    Array.from(document.getElementsByClassName('log-out'))[0].addEventListener('click', () => {
      localStorage.clear()
      signOut(auth).then(window.location.href = '/login_register_page');
    });
  }
});