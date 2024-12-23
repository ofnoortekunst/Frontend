import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
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
const provider = new GoogleAuthProvider();

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

function getNameFromEmail(email) {
  if (!email.includes("@")) {
    return null;
  }

  const namePart = email.split("@")[0];
  const name = namePart.replace(/[._]/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

document.getElementById("email-a").addEventListener("blur", function (e) {
  const inputValue = this.value;
  const name = getNameFromEmail(inputValue);
  const name_field = document.getElementById("name-a");
  if ((name != null) & (name_field.value === "")) {
    name_field.value = name;
  }
});
document.getElementById("email-i").addEventListener("blur", function (e) {
  const inputValue = this.value;
  const name = getNameFromEmail(inputValue);
  const name_field = document.getElementById("name-i");
  if ((name != null) & (name_field.value === "")) {
    name_field.value = name;
  }
});

const url = window.location.href;
if (url.includes("?signup")) {
  const sign_up_label = document.getElementById("close-forms-i");
  if (sign_up_label) {
    sign_up_label.click();
  }
}
var returnToSettings = 0
if (url.includes("?account_relogin")) {
  document.getElementById("error_text").textContent = "Tähtsate konto sätete muutmiseks logi uuesti sisse."
  returnToSettings = 1
}

function handleToggleClick2() {
  if (this.checked && pswA.type !== "text") {
    pswA.type = "text";
  } else {
    pswA.type = "password";
    // Blur and refocus to ensure iOS redraws the field properly
    pswA.blur();
    pswA.focus();
  }
}
function handleToggleClick1() {
  if (this.checked && password.type !== "text") {
    password.type = "text";
  } else {
    password.type = "password";
    password.blur();
    password.focus();
  }
}

function handleToggleClick3() {
  if (this.checked && pswI.type !== "text") {
    pswI.type = "text";
  } else {
    pswI.type = "password";
    pswI.blur();
    pswI.focus();
  }
}

// Show 'looja' or 'huviline' sections based on radio
const radioButtons = document.querySelectorAll("input[name='role']");

const findSelected = () => {
  const selected = document.querySelector("input[name='role']:checked").value;

  if (selected === "interested") {
    document.getElementById("interested-form").classList.add("selected");
    document.getElementById("artist-form").classList.remove("selected");
  } else {
    document.getElementById("artist-form").classList.add("selected");
    document.getElementById("interested-form").classList.remove("selected");
  }
};

radioButtons.forEach((radioBtn) => {
  radioBtn.addEventListener("change", findSelected);
});

// Close forms from artist page
document.getElementById("close-forms-a").addEventListener("click", () => {
  document.getElementById("artist-form").classList.remove("selected");
  document.getElementById("interested-form").classList.remove("selected");
});

// Close forms form interested page
document.getElementById("close-forms-i").addEventListener("click", () => {
  document.getElementById("artist-form").classList.remove("selected");
  document.getElementById("interested-form").classList.remove("selected");
});

// Show password
let password = document.getElementById("password");
let toggle = document.getElementById("show-password");
let pswA = document.getElementById("psw-a");
let toggleA = document.getElementById("show-password-a");
let pswI = document.getElementById("psw-i");
let toggleI = document.getElementById("show-password-i");

toggle.addEventListener("click", handleToggleClick1, false);
toggleA.addEventListener("click", handleToggleClick2, false);
toggleI.addEventListener("click", handleToggleClick3, false);

document
  .getElementById("login_form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const email = this.elements["email"].value;
      const password = this.elements["password"].value;

      const user = await signInWithEmailAndPassword(auth, email, password);
      if (returnToSettings) {
        window.location.href = "/acc_page_interested"
      } else {
        window.location.href = "/"
      }
    } catch (error) {
      // Handle authentication errors
      const code = error.code;
      if (code == "auth/invalid-credential") {
        document.getElementById('error_text').textContent = "Parool või email ei ole õige";
        document.getElementById('error-box').style.display = 'block';
      } else {
        document.getElementById('error_text').textContent = "Midagi läks valesti";
        document.getElementById('error-box').style.display = 'block';
      }
    }
  });

  document
  .getElementById("interested-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const email = this.elements["email"].value;
      const password = this.elements["password"].value;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      const idToken = await user.getIdToken();


      const formData = Object.fromEntries(new FormData(this).entries());

      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/register`;

      const darkmode = localStorage.getItem("darkmode")
      if (darkmode === null) {
        darkmode = "inactive"
      }
      // Send the data to the server
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formdata: formData,
          idToken: idToken,
          darkmode: darkmode,
        }),
      });

      if (response.ok) {
        // Redirect to home page
        window.location.href = "/";
      } else {
        // Display error message
        document.getElementById("error_text_interested").textContent =
          "Midagi läks valesti";
      }
    } catch (error) {
      // Handle authentication errors
      const code = error.code;
      if (code === "auth/invalid-credential") {
        document.getElementById('error_text_interested').textContent = "Parool või email ei ole õige";
        document.getElementById('error-box-interested').style.display = 'block';
      } else if (code === "auth/email-already-in-use") {
        document.getElementById('error_text_interested').textContent = "Konto selle emailiga juba eksisteerib";
        document.getElementById('error-box-interested').style.display = 'block';
      }
      else {
        document.getElementById('error_text_interested').textContent = "Midagi läks valesti.";
        document.getElementById('error-box-interested').style.display = 'block';
      }
      if (auth.currentUser & auth.currentUser.email === email) {
        await auth.currentUser.delete();
        document.getElementById('error_text_interested').textContent = "Hetkel ei ole võimalik kasutajat teha.";
        document.getElementById('error-box-interested').style.display = 'block';
      }
    }
  });

document.getElementById('forgot-password').addEventListener('click', function(e) {
  e.preventDefault()
  try {
    sendPasswordResetEmail(auth, document.getElementById('email-l').value).then(() => {
      document.getElementById('error_text').textContent = "Saatsime parooli lähtestamise emaili. " + document.getElementById('email-l').value
      document.getElementById('error-box').style.display = 'block';
    })
  } catch (error) {
    if (error.code === "auth/missing-email") {
      document.getElementById('error_text').textContent = "Õige email puudub";
      document.getElementById('error-box').style.display = 'block';
    } else {
      document.getElementById('error_text').textContent = "Midagi läks valesti";
      document.getElementById('error-box').style.display = 'block';
    }
  }
})

  document
  .getElementById("artist-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const email = this.elements["email"].value;
      const password = this.elements["password"].value;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idToken = await user.getIdToken();


      const formData = Object.fromEntries(new FormData(this).entries());
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/register`;

      var darkmode = localStorage.getItem("darkmode")
      if (darkmode === null) {
        darkmode = "inactive"
      }
      // Send the data to the server
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formdata: formData,
          idToken: idToken,
          darkmode: darkmode,
        }),
      });

      if (response.ok) {
        // Redirect to home page
        window.location.href = "/upload_work";
      } else {
        // Display error message
        document.getElementById("error_text_artist").textContent =
          "Midagi läks valesti";
      }
    } catch (error) {
      // Handle authentication errors
      const code = error.code;
      if (code == "auth/invalid-credential") {
        document.getElementById('error_text_artist').textContent = "Parool või email ei ole õige";
        document.getElementById('error-box-artist').style.display = 'block';
      } else if (code == "auth/email-already-in-use") {
        document.getElementById('error_text_artist').textContent = "Konto selle emailiga juba eksisteerib";
        document.getElementById('error-box-artist').style.display = 'block';
      }
      else {
        console.error(error.message);
        if (auth.currentUser) {
          await auth.currentUser.delete();
        }
        document.getElementById('error_text_artist').textContent = "Midagi läks valesti.";
        document.getElementById('error-box-artist').style.display = 'block';
      }
      const email = this.elements["email"].value;
      if (auth.currentUser & auth.currentUser.email === email) {
        await auth.currentUser.delete();
        document.getElementById('error_text_artist').textContent = "Hetkel ei ole võimalik kasutajat teha.";
        document.getElementById('error-box-artist').style.display = 'block';
      }
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const googleButton = document.getElementById("Google");
  if (googleButton) {
    googleButton.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/api/register`;
        const formData = Object.fromEntries(new FormData(this).entries());
        var darkmode = localStorage.getItem("darkmode")
        if (darkmode === null) {
          darkmode = "inactive"
        }
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formdata: formData,
            idToken: idToken,
            darkmode: darkmode,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message === "success") {
            if (returnToSettings) {
              window.location.href = "/acc_page_interested"
            }
            else {
              window.location.href = "/";
            }
          } else {
            const data = await response.json();
            document.getElementById('error_text').textContent = data.message;
            document.getElementById('error-box').style.display = 'block';
          }
        } else {
          document.getElementById('error_text').textContent = "Midagi läks valesti";
          document.getElementById('error-box').style.display = 'block';
        }
      } catch (error) {
        document.getElementById('error_text').textContent = "Midagi läks valesti";
        document.getElementById('error-box').style.display = 'block';
      }
    });
  } else {
    console.error("Google button not found");
  }
});

document
  .getElementById("interested-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

  const formData = new FormData(this);
  const jsonObject = Object.fromEntries(formData.entries());

  // Use fetch to send the POST request
  fetch(`${window.location.origin}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonObject)
  })
  .then(response => {
      if (response.ok) {
        window.location.href = "/index.html";
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

// Change some text when login is clicked
const loginButton = document.getElementById('login-btn-loader');

loginButton.addEventListener('click', () => {
  loginButton.value = 'Laeb...';

  setTimeout(() => {
    loginButton.value = 'Logi sisse 0/3';
  }, 2000);
})

const registerButtonA = document.getElementById('loading-a');

registerButtonA.addEventListener('click', () => {
  registerButtonA.value = 'Laeb...';

  setTimeout(() => {
    registerButtonA.value = 'Loo konto';
  }, 2000);
})

const registerButtonI = document.getElementById('loading-i');

registerButtonI.addEventListener('click', () => {
  registerButtonI.value = 'Laeb...';

  setTimeout(() => {
    registerButtonI.value = 'Loo konto';
  }, 2000);
})

