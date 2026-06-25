document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.getElementById('mobileMenuButton');
  const aside = document.querySelector('aside.sidebar-responsive');
  if (!menuButton || !aside) {
    return;
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-nav-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);

  const setOpenState = function (isOpen) {
    aside.classList.toggle('mobile-open', isOpen);
    document.body.classList.toggle('sidebar-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    backdrop.classList.toggle('visible', isOpen);
  };

  const closeMenu = function () {
    setOpenState(false);
  };

  menuButton.addEventListener('click', function () {
    setOpenState(!aside.classList.contains('mobile-open'));
  });

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && aside.classList.contains('mobile-open')) {
      closeMenu();
    }
  });
});
