// Show password
let toggle1 = document.getElementById('show-pass-1');
let toggle2 = document.getElementById('show-pass-2');
let password1 = document.getElementById('password');
let password2 = document.getElementById('psw-new');

toggle1.addEventListener("click", handleToggleClick1, false);
toggle2.addEventListener("click", handleToggleClick2, false);

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
