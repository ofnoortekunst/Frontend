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
var delete_confirm = 0;
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Show password
let toggle1 = document.getElementById('show-pass-1');
let toggle2 = document.getElementById('show-pass-2');
let password1 = document.getElementById('password');
let password2 = document.getElementById('psw-new');

toggle1.addEventListener("click", handleToggleClick1, false);
toggle2.addEventListener("click", handleToggleClick2, false);

document.getElementById('new_name_button').addEventListener('click', async function(e) {
  e.preventDefault()
  const baseUrl = window.location.origin;
  var url = `${baseUrl}/api/name`;
  try {
    const token = await auth.currentUser.getIdToken()
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: token,
        name: document.getElementById('new_name').value
      })
      })
    if (response.ok) {
      document.getElementById('the_nimi').textContent = document.getElementById('new_name').value
    }
  } catch (error) {
    console.error(error)
  }
})

document.getElementById("delete").addEventListener("click", async function(e) {
  e.preventDefault();
  try {
    if (delete_confirm) {
      const userDelete = await auth.currentUser.delete();
    } else {
      delete_confirm = 1;
      document.getElementById("error_text_delete").textContent =
        "Kindel, et tahate kustuta? Vajuta teist korda, et kinnitada.";
    }
  } catch (error) {
    if (error.code == "auth/requires-recent-login") {
      window.location.href = "/login_register_page?account_relogin"
    }
  }
});

document.getElementById('school-select').addEventListener('change', async function() {
  var selectedValue = document.getElementById('school-select').value;
  const idToken = await auth.currentUser.getIdToken()
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/api/usergrade`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idToken: idToken,
      grade: selectedValue
    }),
  });
  if (response.ok) {
    const data = await response.json();
    document.getElementById('grade-change').textContent = `Kooliaste muudetud. ${data.message}`
  }
})

document.getElementById("logout").addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
  console.log("logged out");
});

document.getElementById("change-email").addEventListener("click", async function(e) {
  e.preventDefault();
  try {
    await updateEmail(auth.currentUser, document.getElementById("new-email").value);
  } catch (error) {
    console.log(error);
    if (error.code === "requires-recent-login") {
      window.location.href = "/login_register_page?account_relogin";
    } else if (error.code === "auth/operation-not-allowed") {
      try {
        await sendEmailVerification(auth.currentUser);
        document.getElementById('error_text_email').textContent = "Enne emaili vahetamist kinnitage oma praegune email. Saatsime teate " + auth.currentUser.email
      } catch (error) {
        if (error.code == auth/too-many-requests) {
                  document.getElementById('error_text_email').textContent = "Liiga palju muudatusi."
        } else {
        document.getElementById('error_text_email').textContent = "Midagi läks valesti."
        console.log(error)
        }
      }
    }
  }
});

document.getElementById('forgot-password').addEventListener('click', function(e) {
  e.preventDefault()
  sendPasswordResetEmail(auth, auth.currentUser.email).then(() => {
    document.getElementById('error_text_password').textContent = "Saatsime parooli lähtestamise emaili."
  })
})

document.getElementById('sub-button').addEventListener('click', async function(e) {
  e.preventDefault()
  if (!document.getElementById('psw-new').value == document.getElementById('password').value) {
    document.getElementById('error_text_password').textContent = "Paroolid ei ole samad."
  }
  try {
    await updatePassword(auth.currentUser, document.getElementById('psw-new').value);
    document.getElementById('error_text_password').textContent = "Parool muudetud"
  } catch (error) {
    console.log(error)
  }
})

// Show pass for the first one
function handleToggleClick1(event) {
  if (this.checked) {
    console.warn("Change input 'type' to: text");
    password1.type = "text";
  } else {
    console.warn("Change input 'type' to: password");
    password1.type = "password";
  }
}

// Show pass for the second one
function handleToggleClick2(event) {
  if (this.checked) {
    console.warn("Change input 'type' to: text");
    password2.type = "text";
  } else {
    console.warn("Change input 'type' to: password");
    password2.type = "password";
  }
}

//Profile pic uploading
let profilePicture = document.getElementById('profile-pic');
let inputFile = document.getElementById('input-file');

inputFile.onchange = () => {
  profilePicture.src = URL.createObjectURL(inputFile.files[0]);
};

// Show chosen media
const contactOptions = document.getElementById('contact-select');
const iconInInput = document.getElementById('chosen-contact');

// Event listener for when the dropdown value changes
contactOptions.addEventListener('change', function () {
  const chosenOne = contactOptions.value;

  if (chosenOne === 'nothing') {
    iconInInput.innerHTML = '';
  } else if (chosenOne === 'instagram-contact') {
    iconInInput.innerHTML = '<svg class="insta-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" /></svg>';
  } else if (chosenOne === 'tiktok-contact') {
    iconInInput.innerHTML = '<svg class="tiktok-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50"><path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z"></path></svg>';
  } else if (chosenOne === 'mail-contact') {
    iconInInput.innerHTML = '<svg class="gmail-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gmail</title><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>';
  } else {
    iconInInput.innerHTML = '';
  }
});
