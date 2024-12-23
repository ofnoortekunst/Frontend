import { 
  auth, 
  showError, 
  initializePasswordToggles, 
  initializeProfilePicUpload,
  setupCommonEventListeners 
} from '../shared/shared_acc_script.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Initialize shared functionality
initializePasswordToggles();
initializeProfilePicUpload();
setupCommonEventListeners();

// Keep only the unique code for acc_artist
onAuthStateChanged(auth, async function(user) {
  if (user) {
    const uid = user.uid; // Get the current user's UID
    var newBio = document.getElementById('bio_text');
    const bioResponse = await fetch(`${window.location.origin}/api/bio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: uid,
      }),
    });
    if (bioResponse.ok) {
      const data = await bioResponse.json();
      newBio.placeholder = ` ${data.message}`;
    } else {
      newBio.placeholder = ``;
    }
    if (localStorage.getItem('pfpUrl')) {
      const profilePicture = document.getElementById('profile-pic');
      profilePicture.src = `images/pfp/${uid}.avif`; // Set the profile picture source
    }
    const select = document.getElementById('school-select');
    const baseUrl = window.location.origin;
    const token = await user.getIdToken();
    
    // Add name check
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
      const data = await nameResponse.json();
      console.error('Error fetching name:', data.message);
    }

    // Existing school grade check code...
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
        if (responseData.message) {
          select.value = responseData.message;
        } else {
          select.value = "other-school"; // Default value if no grade is set
        }
      } else {
        console.error('Failed to fetch school data');
        const errorData = await response.json();
        document.getElementById('grade-change').textContent = errorData.error || 'Viga kooliaste laadimisel';
      }
    } catch (error) {
      console.error('Error getting ID token or fetching data:', error);
      document.getElementById('grade-change').textContent = 'Viga kooliaste laadimisel';
    }
  }
});

document.getElementById('new_bio_button')?.addEventListener('click', async function() {
  var newBio = document.getElementById('bio_text').value;
  try {
    const idToken = await auth.currentUser.getIdToken();
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/api/bio`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: idToken,
        bio: newBio
      }),
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('error_text_bio').textContent = ` ${data.message}`;
      document.getElementById('error-box-bio').style.display = 'block';
    } else {
      document.getElementById('error_text_bio').textContent = `${data.message}`;
      document.getElementById('error-box-bio').style.display = 'block';
      throw new Error('Bio update failed');
    }
  } catch (error) {
    document.getElementById('error_text_bio').textContent = 'Viga bio muutmisel. Palun proovige uuesti.';
    document.getElementById('error-box-bio').style.display = 'block';
    console.error('Error updating bio:', error);
  }
});