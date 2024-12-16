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

async function convertFormDataToBase64(formData) {
    const imageFile = formData['image'];
    
    if (imageFile && imageFile instanceof File) {
      const reader = new FileReader();
      
      reader.onloadend = function () {
        const fileProperties = {
          name: imageFile.name,
          type: imageFile.type,
          base64: reader.result
        };
  
        return fileProperties
      };
      
      reader.readAsDataURL(imageFile);
    } else {
      console.error("No image file found in FormData");
    }
  }

document.getElementById("work_upload").addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());
    formData['image'] = JSON.stringify({image: formData['image']});
    console.log(formData)
    onAuthStateChanged(auth, async function(user) {
    if (user) {
        const idToken = await user.getIdToken();

        const baseUrl = window.location.origin;
        const url = `${baseUrl}/api/upload`;

        const darkmode = localStorage.getItem("darkmode")
        if (darkmode === null) {
            darkmode = "inactive"
        }
        //const imageProperties = convertFormDataToBase64(formData)
        // Send the data to the server
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            formdata: formData,
            idToken: idToken,
            imageData: imageProperties
            }),
        });
        if (response.ok) {
            document.getElementById('work_upload').reset();
            window.location.reload();
        }
    }
    });
  });