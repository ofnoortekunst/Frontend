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

onAuthStateChanged(auth, async function(user) {
  const alreadyGrade = localStorage.getItem('userGrade')
  if (user) {
    const worknum = document.getElementById('upload-button');
    const baseUrl = window.location.origin;
    const token = await user.getIdToken();
    if (!alreadyGrade) {
        try {
          var url = `${baseUrl}/api/userworks`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: token,
              works: "count"
            }),
          });
  
          if (response.ok) {
            const responseData = await response.json();
            document.getElementById('work-upload-label').style.display = 'block';
            worknum.value = responseData.message + "/" + "3";
            if (parseInt(responseData.message) >= 3) {
              localStorage.setItem('userGrade', parseInt(responseData.message))
              worknum.value = responseData.message + "Lae üles";
              document.getElementById('work-upload-label').style.display = 'none';
              document.getElementById('profile_holder').onclick = function() {
                window.location.href = "/acc_page_artist";
              }
            }
          } else {
            console.error('Failed to fetch worknum data');
          }
        } catch (error) {
          console.error('Error getting ID token or fetching data:', error);
        }
      }
    }
  });

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
    document.getElementById('upload-button').value = 'Laeb üles...';
    const formData = Object.fromEntries(new FormData(this).entries());
    onAuthStateChanged(auth, async function(user) {
    if (user) {
        const idToken = await user.getIdToken();
        var baseUrl = window.location.origin;
        const url = baseUrl + `/api/upload`;

        const name = formData.image.name
        const type = formData.image.type
        formData.imageData = {name: name,
          type: type
        }
        formData.image = await readFileAsBase64(formData.image)
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
            document.getElementById('upload-button').value = 'Lae üles';
            window.location.reload();
        } else {
          const data = await response.json();
          document.getElementById('error_text_upload').textContent = data.message;
          document.getElementById('error-box-upload').style.display = 'block';
        }
    }
    });
  });