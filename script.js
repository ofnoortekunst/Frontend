const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

// Toggle the sidebar button.
function toggleSidebar() {
  sidebar.classList.toggle('close');
  toggleButton.classList.toggle('rotate');

  closeAllSubMenus();
};

// Automatically close and open the sidebar at a certain width.
function checkWidth() {
  if (window.innerWidth <= 1055) {
    sidebar.classList.add('close');
    toggleButton.classList.add('rotate');

    closeAllSubMenus();
  }
}
checkWidth();
window.addEventListener('resize', checkWidth);

// Toggle the submenus.
function toggleSubMenu(button) {

  if (!button.nextElementSibling.classList.contains('show')) {
    closeAllSubMenus();
  };

  button.nextElementSibling.classList.toggle('show');
  button.classList.toggle('rotate');

  if (sidebar.classList.contains('close')) {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
  };
};

// Close all submenus.
function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show');
    ul.previousElementSibling.classList.remove('rotate');
  });
};

// Change the 'favourite' icon based on if the navbar has gone to the side.
document.getElementById('sidebar-active').addEventListener('change', function() {
  const changeColorIcon = document.querySelector('.icon');

  if (this.checked) {
    changeColorIcon.innerHTML = '<img alt="bookmark" src="images/bookmark-color-change.png" class="bookmark">Lemmikud';
  } else {
    changeColorIcon.innerHTML = '<img alt="bookmark" src="images/pro-bookmark.png" class="bookmark">Lemmikud';
  }
});
