import { 
  auth,
  showError, 
  initializePasswordToggles, 
  initializeProfilePicUpload,
  setupCommonEventListeners,
} from '../shared/shared_acc_script.js';
import { onAuthStateChanged,   updateEmail,
  sendEmailVerification,
  updatePassword,
  sendPasswordResetEmail  } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Initialize shared functionality
initializePasswordToggles();
initializeProfilePicUpload();
setupCommonEventListeners();

// Keep only the unique code for acc_interested
onAuthStateChanged(auth, async function(user) {
  const alreadyGrade = localStorage.getItem('userGrade')
  if (user) {
    const user = auth.currentUser;
    const uid = user.uid; // Get the current user's UID
    if (localStorage.getItem('pfpUrl')) {
      const profilePicture = document.getElementById('profile-pic');
      profilePicture.src = `images/pfp/${uid}.avif`; // Set the profile picture source
    }
    const worknum = document.getElementById('load-works');
    const select = document.getElementById('school-select');
    const baseUrl = window.location.origin;
    const token = await user.getIdToken();
    try {
      const nameResponse = await fetch(`${baseUrl}/api/name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: uid
        })
      });
      
      if (nameResponse.ok) {
        const nameData = await nameResponse.json();
        document.getElementById('the_nimi').textContent = nameData.message;
      }
    } catch (error) {
      console.error('Error fetching name:', error);
    }
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
            if (parseInt(responseData.message) >= 3) {
              localStorage.setItem('userGrade', parseInt(responseData.message))
              window.location.href = "/acc_page_artist"
            }
            worknum.textContent = responseData.message + "/" + "3";
          } else {
            console.error('Failed to fetch worknum data');
          }
        } catch (error) {
          console.error('Error getting ID token or fetching data:', error);
        }
      }
        try {
          var url = `${baseUrl}/api/usergrade`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: token,
              grade: "get"
            }),
          });
  
          if (response.ok) {
            const responseData = await response.json();
            select.value = responseData.message;
          } else {
            console.error('Failed to fetch school data');
          }
        } catch (error) {
          console.error('Error getting ID token or fetching data:', error);
        }
      }
    });

document.getElementById('newname').addEventListener('click', async function(e) {
  e.preventDefault()
  try {
    await updateProfile(auth.currentUser, {
      displayname: document.getElementById('new-name').value
    })
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
  localStorage.clear()
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

// Show password
let toggle1 = document.getElementById("show-pass-1");
let toggle2 = document.getElementById("show-pass-2");
let password1 = document.getElementById("password");
let password2 = document.getElementById("psw-new");

toggle1.addEventListener("click", handleToggleClick1, false);
toggle2.addEventListener("click", handleToggleClick2, false);

function handleToggleClick1() {
  if (this.checked && password1.type !== "text") {
    password1.type = "text";
  } else {
    password1.type = "password";
    password1.blur();
    password1.focus();
  }
}

function handleToggleClick2() {
  if (this.checked && password2.type !== "text") {
    password2.type = "text";
  } else {
    password2.type = "password";
    password2.blur();
    password2.focus();
  }
}

//Profile pic uploading
let profilePicture = document.getElementById("profile-pic");
let inputFile = document.getElementById("input-file");

inputFile.onchange = () => {
  profilePicture.src = URL.createObjectURL(inputFile.files[0]);
};
