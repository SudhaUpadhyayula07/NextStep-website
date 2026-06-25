document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.getElementById('mobileMenuButton');
  const aside = document.querySelector('aside.sidebar-responsive');
  const topNavLinks = document.getElementById('topNavLinks');

  if (!menuButton || (!aside && !topNavLinks)) {
    return;
  }

  let touchStartX = null;
  let touchStartY = null;
  let touchStartedInNav = false;

  const backdrop = aside ? document.createElement('div') : null;
  if (backdrop) {
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  const setOpenState = function (isOpen) {
    if (aside) {
      aside.classList.toggle('mobile-open', isOpen);
      document.body.classList.toggle('sidebar-open', isOpen);
    }
    if (topNavLinks) {
      topNavLinks.classList.toggle('hidden', !isOpen);
    }
    menuButton.setAttribute('aria-expanded', String(isOpen));
    if (backdrop) {
      backdrop.classList.toggle('visible', isOpen);
    }
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
    if (!aside || event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartedInNav = aside.contains(event.target) || event.target === aside;
  };

  const onTouchMove = function (event) {
    if (!aside || touchStartX === null || event.touches.length !== 1) {
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
    const isOpen = aside
      ? aside.classList.contains('mobile-open')
      : topNavLinks && !topNavLinks.classList.contains('hidden');
    setOpenState(!isOpen);
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', resetTouch);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && ((aside && aside.classList.contains('mobile-open')) || (topNavLinks && !topNavLinks.classList.contains('hidden')))) {
      closeMenu();
    }
  });
});
