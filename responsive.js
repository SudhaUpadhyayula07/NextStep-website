document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.getElementById('mobileMenuButton');
  const aside = document.querySelector('aside.sidebar-responsive');
  if (!menuButton || !aside) {
    return;
  }

  let touchStartX = null;
  let touchStartY = null;
  let touchStartedInNav = false;

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

  const resetTouch = function () {
    touchStartX = null;
    touchStartY = null;
    touchStartedInNav = false;
  };

  const onTouchStart = function (event) {
    if (event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartedInNav = aside.contains(event.target) || event.target === aside;
  };

  const onTouchMove = function (event) {
    if (touchStartX === null || event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < 40 && absDy < 40) {
      return;
    }

    if (aside.classList.contains('mobile-open')) {
      if (dx < -40 && absDx > absDy) {
        closeMenu();
        resetTouch();
      } else if (dy > 40 && absDy > absDx && touchStartedInNav) {
        closeMenu();
        resetTouch();
      }
    } else {
      if (dx > 40 && touchStartX <= 50 && absDx > absDy) {
        setOpenState(true);
        resetTouch();
      }
    }
  };

  menuButton.addEventListener('click', function () {
    setOpenState(!aside.classList.contains('mobile-open'));
  });

  backdrop.addEventListener('click', closeMenu);
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('touchend', resetTouch);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && aside.classList.contains('mobile-open')) {
      closeMenu();
    }
  });
});
