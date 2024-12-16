// Show password
let password = document.getElementById('password');
let toggleA = document.getElementById('show-password');


toggleA.addEventListener("click", handleToggleClick2, false);

function handleToggleClick2(event) {
  if (this.checked) {
    console.warn("Change input 'type' to: text");
    password.type = "text";
  } else {
    console.warn("Change input 'type' to: password");
    password.type = "password";
  }
};
