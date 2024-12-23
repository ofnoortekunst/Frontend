// Show password
let password = document.getElementById('password');
let toggleA = document.getElementById('show-password');

// Reset password field type on focus
password.addEventListener("focus", () => {
  password.type = "password";
});

toggleA.addEventListener("click", handleToggleClick, false);

function handleToggleClick() {
  if (this.checked && password.type !== "text") {
    password.type = "text";
    password.blur();
    password.focus();
  } else {
    password.type = "password";
    password.blur();
    password.focus();
  }
}