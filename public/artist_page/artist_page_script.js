const profilePic = document.getElementById("profile-pic");
const profileImageUrl = window.location.href.split('?')[1];
if (profileImageUrl) {
    profilePic.innerHTML = `<img src="${'images/pfp/' + profileImageUrl + '.avif'}" alt="Profile picture" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">`;
}
var url = `${window.location.origin}/api/name`;
const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    idToken: profileImageUrl
  })
  })
if (response.ok) {
    const data = await response.json();
    const artistNameElement = document.getElementById("artist-name"); // Ensure this ID exists in your HTML
    artistNameElement.textContent = data.message; // Assuming the API returns an object with a 'name' property
} else {
  const data = await response.json();
    console.error('Error fetching artist name:', data.message);
}

  var bioText = document.getElementById('bio_text').value;
  try {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/api/bio`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: profileImageUrl,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('bio_text').textContent = ` ${data.message}`;
    } else {
      document.getElementById('bio_text').textContent = ``;
    }
  } catch (error) {
    document.getElementById('bio_text').textContent = '';
  }