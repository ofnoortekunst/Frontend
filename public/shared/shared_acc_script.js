import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  updateEmail,
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

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

// Helper function to handle error message visibility
export function showError(elementId, message) {
  const errorBox = document.getElementById(elementId).closest('#error-box, #error-box-delete');
  const errorHolder = document.getElementById('error-box').closest('#error-box, #error-box-delete');
  if (message) {
    document.getElementById(elementId).textContent = message;
    errorBox.style.display = 'block';
    errorHolder.style.display = 'block';
  } else {
    document.getElementById(elementId).textContent = '';
    errorBox.style.display = 'none';
    errorHolder.style.display = 'none';
  }
}

// Show password toggle functionality
export function initializePasswordToggles() {
  let toggle1 = document.getElementById('show-pass-1');
  let toggle2 = document.getElementById('show-pass-2');
  let password1 = document.getElementById('password');
  let password2 = document.getElementById('psw-new');

  function handleToggleClick(passwordElement, isChecked) {
    passwordElement.type = isChecked ? "text" : "password";
  }

  toggle1?.addEventListener("click", function() {
    handleToggleClick(password1, this.checked);
  });

  toggle2?.addEventListener("click", function() {
    handleToggleClick(password2, this.checked);
  });
}

// Profile picture upload functionality
export function initializeProfilePicUpload() {
  let profilePicture = document.getElementById('profile-pic');
  let inputFile = document.getElementById('input-file');

  inputFile?.addEventListener('change', async () => {
    const file = inputFile.files[0];
    if (!file) return;

    try {
      // Convert the image to base64
      const base64Image = await convertToBase64(file);
      
      // Get the user's ID token
      const idToken = await auth.currentUser.getIdToken();
      
      // Make the API call
      const response = await fetch(`${window.location.origin}/api/pfp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idToken: idToken,
          image: base64Image.split(',')[1]
        })
      });
      if (response.ok) {
        localStorage.setItem('pfpUrl', 'images/pfp/'+ auth.currentUser.uid + '.avif');
        Array.from(document.getElementsByClassName("pfp")).map((pfp) => pfp.innerHTML = `<img src="${'images/pfp/'+ auth.currentUser.uid + '.avif'}" alt="Profile picture" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">`);
      }
      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      // Update the profile picture preview
      profilePicture.src = URL.createObjectURL(file);

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      showError('error_text_password', 'Viga profiilipildi üleslaadimisel. Palun proovige uuesti.');
    }
  });
}

// Helper function to convert file to base64
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// Common event listeners setup
export function setupCommonEventListeners() {
  // Logout
  document.getElementById("logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    auth.signOut();
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
      document.getElementById('approve-box').style.display = 'block';
    }
  })
  
  // Password reset
  document.getElementById('forgot-password')?.addEventListener('click', function(e) {
    e.preventDefault();
    try {
      sendPasswordResetEmail(auth, auth.currentUser.email).then(() => {
        showError('error_text_password', "Saatsime parooli lähtestamise emaili.");
      });
    } catch (error) {
        if (error.code === "auth/missing-email") {
            document.getElementById('error_text_password').textContent = "Õige email puudub";
            document.getElementById('error-box-password').style.display = 'block';
          } else {
            document.getElementById('error_text_password').textContent = "Midagi läks valesti";
            document.getElementById('error-box-password').style.display = 'block';
          }
        }
  });

  // Password change
  document.getElementById('sub-button')?.addEventListener('click', async function(e) {
    e.preventDefault();
    if (document.getElementById('psw-new').value !== document.getElementById('password').value) {
      showError('error_text_password', "Paroolid ei ole samad.");
      return;
    }
    try {
      await updatePassword(auth.currentUser, document.getElementById('psw-new').value);
      showError('error_text_password', "Parool muudetud");
    } catch (error) {
      showError('error_text_password', "Viga parooli muutmisel: " + error.message);
    }
  });

  // Account deletion
  let delete_confirm = 0;
  document.getElementById("delete")?.addEventListener("click", async function(e) {
    e.preventDefault();
    try {
      if (delete_confirm) {
        await auth.currentUser.delete();
        localStorage.clear();
        window.location.href = '/login_register_page';
      } else {
        delete_confirm = 1;
        document.getElementById('error_text_delete').textContent = "Kindel, et tahate kustuta? Vajuta teist korda, et kinnitada.";
        document.getElementById('error-box-delete').style.display = 'block';
      }
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        window.location.href = "/login_register_page?account_relogin";
      }
    }
  });

  // Add name change handler
  document.getElementById('new_name_button')?.addEventListener('click', async function() {
    var newName = document.getElementById('new_name').value;
    try {
      const idToken = await auth.currentUser.getIdToken();
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/name`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: idToken,
          name: newName
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update display name in Firebase Auth
        await updateProfile(auth.currentUser, {
          displayName: newName
        });
        document.getElementById('the_nimi').textContent = newName;
        localStorage.setItem('userName', newName)
        document.querySelector('.name').textContent = newName
        document.getElementById('error_text_name').textContent = ` ${data.message}`;
        document.getElementById('error-box-name').style.display = 'block';
      } else {
        document.getElementById('error_text_name').textContent = `${data.message}`;
        document.getElementById('error-box-name').style.display = 'block';
        throw new Error('Name update failed');
      }
    } catch (error) {
      document.getElementById('error_text_name').textContent = 'Viga nime muutmisel. Palun proovige uuesti.';
      document.getElementById('error-box-name').style.display = 'block';
      console.error('Error updating name:', error);
    }
  });
} 


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
      } else if (error.code === "auth/invalid-email") {
        document.getElementById('error-box-email').style.display = 'block';
        document.getElementById('error_text_email').textContent = "Email ei ole korrektne."
      }
    }
  });
  