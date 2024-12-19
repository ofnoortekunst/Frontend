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

const firebase = initializeApp(firebaseConfig)
const auth = getAuth(firebase)

async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      const base64String = event.target.result.split(',')[1]; // Extract Base64 string
      resolve(base64String);
    };
    reader.onerror = function(error) {
      reject(new Error(`Error converting to Base64: ${error}`));
    };
    reader.readAsDataURL(file);
  });
}

document.getElementById("work_upload").addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());
    onAuthStateChanged(auth, async function(user) {
    if (user) {
        const idToken = await user.getIdToken();
        const baseUrl = window.location.origin;
        const url = `dev.noortekunst.ee/api/upload`;

        const name = formData.image.name
        const type = formData.image.type
        formData.imageData = {name: name,
          type: type
        }
        formData.image = await readFileAsBase64(formData.image)
        console.log(formData)
        // Send the data to the server
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            formdata: formData,
            idToken: idToken,
            }),
        });
        if (response.ok) {
            document.getElementById('work_upload').reset();
            window.location.reload();
        } else {
          const data = await response.json();
          console.log(data.message)
        }
    }
    });
  });