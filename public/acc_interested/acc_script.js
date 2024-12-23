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