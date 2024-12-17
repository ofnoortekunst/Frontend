import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  updateEmail,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
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
onAuthStateChanged(auth, async function(user) {
  if (user) {
    const worknum = document.getElementById('load-works');
    const baseUrl = window.location.origin;
    const token = await user.getIdToken();
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
            if (parseInt(responseData.message) > 3) {
                window.location.href = "/acc_artist"
            }
            worknum.textContent = responseData.message + "/" + "3";
          } else {
            console.error('Failed to fetch worknum data');
          }
        } catch (error) {
          console.error('Error getting ID token or fetching data:', error);
        }
      }
    });