// Show password
let password = document.getElementById('password');
let toggleA = document.getElementById('show-password');

toggleA.addEventListener("click", handleToggleClick, false);

function handleToggleClick() {
  if (this.checked && password.type !== "text") {
    password.type = "text";
  } else {
    password.type = "password";
    password.blur();
    password.focus();
  }
}