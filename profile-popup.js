(function() {
  const PROFILE_KEY = 'nextstep_profile';
  const SETTINGS_KEY = 'nextstep_settings';
  const DEFAULT_SETTINGS = {
    emailAlerts: true,
    smsAlerts: false,
    examReminders: true,
    personalizedRecommendations: true,
    showProfileToMentors: false,
    allowDataSharing: false,
    secureSession: true
  };

  let currentProfile = { name: '', photo: '', class: '', stream: '', interest: '' };
  let modalOverlay;
  let tabButtons;
  let tabs;
  let profileViewSection;
  let profileEditSection;
  let viewPhoto;
  let viewName;
  let viewClass;
  let viewStream;
  let viewInterest;
  let profilePhotoPreview;
  let profilePhotoInput;
  let profileFullName;
  let profileClass;
  let profileStream;
  let profileInterest;
  let profileStatusText;
  let notificationsEmail;
  let notificationsSMS;
  let notificationsExam;
  let notificationsPersonalized;
  let notificationsStatusText;
  let saveNotificationsBtn;
  let resetNotificationsBtn;
  let privacyProfileToggle;
  let privacyDataSharing;
  let privacySecureSession;
  let privacyStatusText;
  let savePrivacyBtn;
  let resetPrivacyBtn;

  function readProfile() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        return {
          name: saved.name || '',
          photo: saved.photo || '',
          class: saved.class || '',
          stream: saved.stream || '',
          interest: saved.interest || ''
        };
      }
    } catch (error) {
      console.warn('Unable to read profile:', error);
    }
    try {
      const legacy = JSON.parse(localStorage.getItem('user') || 'null');
      if (legacy && typeof legacy === 'object') {
        return { name: legacy.name || '', photo: '', class: '', stream: '', interest: '' };
      }
    } catch (error) {
      // fallback only
    }
    return { name: '', photo: '', class: '', stream: '', interest: '' };
  }

  function writeProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  function readSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
      return saved && typeof saved === 'object' ? Object.assign({}, DEFAULT_SETTINGS, saved) : Object.assign({}, DEFAULT_SETTINGS);
    } catch (error) {
      return Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  function writeSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function getInitial(name) {
    return name.trim().charAt(0).toUpperCase() || '';
  }

  function setHeaderAvatar(profile) {
    const headerAvatar = document.getElementById('profileHeaderAvatar');
    if (!headerAvatar) return;

    if (profile.photo) {
      headerAvatar.innerHTML = `<img src="${profile.photo}" alt="Profile photo" class="w-full h-full object-cover rounded-full" />`;
      headerAvatar.classList.remove('bg-secondary-fixed');
    } else if (profile.name) {
      const initial = getInitial(profile.name);
      headerAvatar.innerHTML = `<span class="font-semibold text-[#1B2D5B]">${initial}</span>`;
      headerAvatar.classList.remove('bg-secondary-fixed');
    } else {
      headerAvatar.innerHTML = '<span class="material-symbols-outlined text-primary">person</span>';
      headerAvatar.classList.add('bg-secondary-fixed');
    }
  }

  function refreshHeader() {
    const profile = readProfile();
    currentProfile = profile;
    const headerName = document.getElementById('user-profile-name');
    if (headerName) {
      headerName.textContent = profile.name || 'User';
    }
    setHeaderAvatar(profile);
  }

  function showView(profile) {
    if (viewName) viewName.textContent = profile.name || 'Not set';
    if (viewClass) viewClass.textContent = profile.class || 'Not set';
    if (viewStream) viewStream.textContent = profile.stream || 'Not set';
    if (viewInterest) viewInterest.textContent = profile.interest || 'Not set';
    if (viewPhoto) {
      viewPhoto.innerHTML = profile.photo
        ? `<img src="${profile.photo}" alt="Photo" class="w-full h-full object-cover" />`
        : `<span class="material-symbols-outlined">account_circle</span>`;
    }
  }

  function showEdit(profile) {
    if (profileFullName) profileFullName.value = profile.name || '';
    if (profileClass) profileClass.value = profile.class || '';
    if (profileStream) profileStream.value = profile.stream || '';
    if (profileInterest) profileInterest.value = profile.interest || '';
    if (profilePhotoPreview) {
      profilePhotoPreview.innerHTML = profile.photo
        ? `<img src="${profile.photo}" alt="Photo preview" class="w-full h-full object-cover" />`
        : '<span class="material-symbols-outlined">account_circle</span>';
    }
    currentProfile = profile;
  }

  function setMode(editMode) {
    if (profileViewSection) profileViewSection.classList.toggle('hidden', editMode);
    if (profileEditSection) profileEditSection.classList.toggle('hidden', !editMode);
    if (profileStatusText) profileStatusText.textContent = '';
  }

  function setActiveTab(tabName) {
    Object.keys(tabs).forEach(key => {
      if (tabs[key]) tabs[key].classList.toggle('hidden', key !== tabName);
    });
    if (tabButtons) {
      tabButtons.forEach(button => {
        const isActive = button.dataset.tab === tabName;
        button.classList.toggle('bg-[#E9E3D6]', isActive);
        button.classList.toggle('font-semibold', isActive);
      });
    }
    if (profileStatusText) profileStatusText.textContent = '';
    if (notificationsStatusText) notificationsStatusText.textContent = '';
    if (privacyStatusText) privacyStatusText.textContent = '';
  }

  function applySettingsToControls(settings) {
    if (notificationsEmail) notificationsEmail.checked = settings.emailAlerts;
    if (notificationsSMS) notificationsSMS.checked = settings.smsAlerts;
    if (notificationsExam) notificationsExam.checked = settings.examReminders;
    if (notificationsPersonalized) notificationsPersonalized.checked = settings.personalizedRecommendations;
    if (privacyProfileToggle) privacyProfileToggle.checked = settings.showProfileToMentors;
    if (privacyDataSharing) privacyDataSharing.checked = settings.allowDataSharing;
    if (privacySecureSession) privacySecureSession.checked = settings.secureSession;
  }

  function readCurrentSettings() {
    return {
      emailAlerts: notificationsEmail?.checked || false,
      smsAlerts: notificationsSMS?.checked || false,
      examReminders: notificationsExam?.checked || false,
      personalizedRecommendations: notificationsPersonalized?.checked || false,
      showProfileToMentors: privacyProfileToggle?.checked || false,
      allowDataSharing: privacyDataSharing?.checked || false,
      secureSession: privacySecureSession?.checked || false
    };
  }

  function createModal() {
    if (document.getElementById('nextstepProfileModalOverlay')) return;
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'nextstepProfileModalOverlay';
    modalOverlay.className = 'hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto';
    modalOverlay.innerHTML = `
      <div class="w-full max-w-4xl rounded-[32px] border border-[#1B2D5B] bg-[#F5F0E8] shadow-2xl overflow-hidden max-h-[calc(100vh-4rem)]">
        <div class="flex items-center justify-between px-8 py-6 border-b border-[#1B2D5B]/20 bg-[#F5F0E8] sticky top-0 z-10">
          <div>
            <h2 class="font-display-lg text-3xl font-bold text-[#1B2D5B]">Profile & Settings</h2>
            <p class="font-body-md text-[#1B2D5B]/80 mt-1">Manage your account details, notification preferences, and privacy from one window.</p>
          </div>
          <button id="nextstepProfileModalClose" type="button" class="text-[#1B2D5B] text-2xl leading-none hover:text-[#122141]" aria-label="Close profile window">✕</button>
        </div>
        <div class="grid gap-6 lg:grid-cols-[220px_1fr] px-8 py-8">
          <aside class="space-y-6">
            <div class="rounded-[32px] border border-[#1B2D5B]/20 bg-white p-5 space-y-3">
              <p class="font-label-md uppercase tracking-[0.24em] text-[#1B2D5B]/70">Settings menu</p>
              <button type="button" data-tab="profile" class="tab-button w-full text-left rounded-2xl px-4 py-3 bg-[#E9E3D6] text-[#1B2D5B] font-semibold shadow-sm">Profile Details</button>
              <button type="button" data-tab="notifications" class="tab-button w-full text-left rounded-2xl px-4 py-3 text-[#1B2D5B] hover:bg-[#E9E3D6]">Notifications</button>
              <button type="button" data-tab="privacy" class="tab-button w-full text-left rounded-2xl px-4 py-3 text-[#1B2D5B] hover:bg-[#E9E3D6]">Privacy & Safety</button>
            </div>
            <div class="rounded-[32px] border border-[#1B2D5B]/20 bg-white p-5">
              <p class="font-semibold text-[#1B2D5B] mb-3">Quick note</p>
              <p class="text-sm text-[#1B2D5B]/70">All profile and settings controls are available in this popup. No separate settings page is required.</p>
            </div>
          </aside>
          <section class="space-y-6 overflow-y-auto">
            <div id="profileTab" class="tab-panel space-y-8">
              <div id="profileViewSection" class="space-y-8">
                <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div class="flex items-center gap-4">
                    <div id="profileViewPhoto" class="w-28 h-28 rounded-full border border-[#1B2D5B] bg-[#F5F0E8] flex items-center justify-center text-5xl text-[#1B2D5B] overflow-hidden">
                      <span class="material-symbols-outlined">account_circle</span>
                    </div>
                    <div class="space-y-3">
                      <div>
                        <p class="text-sm uppercase tracking-[0.24em] text-[#1B2D5B]/70">Full Name</p>
                        <p id="profileViewName" class="font-semibold text-[#1B2D5B]">Not set</p>
                      </div>
                      <div>
                        <p class="text-sm uppercase tracking-[0.24em] text-[#1B2D5B]/70">Class / Year</p>
                        <p id="profileViewClass" class="font-semibold text-[#1B2D5B]">Not set</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="rounded-[24px] border border-[#1B2D5B]/20 bg-white p-6">
                    <p class="text-sm uppercase tracking-[0.24em] text-[#1B2D5B]/70 mb-2">Stream</p>
                    <p id="profileViewStream" class="font-semibold text-[#1B2D5B]">Not set</p>
                  </div>
                  <div class="rounded-[24px] border border-[#1B2D5B]/20 bg-white p-6">
                    <p class="text-sm uppercase tracking-[0.24em] text-[#1B2D5B]/70 mb-2">Career Interest</p>
                    <p id="profileViewInterest" class="font-semibold text-[#1B2D5B]">Not set</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-3">
                  <button id="editProfileBtn" type="button" class="inline-flex items-center justify-center rounded-full border border-[#1B2D5B] bg-[#1B2D5B]/10 px-6 py-3 font-semibold text-[#1B2D5B] hover:bg-[#E9E3D6] transition-colors">Edit Profile</button>
                  <button id="logoutBtn" type="button" class="inline-flex items-center justify-center rounded-full border border-red-600 bg-red-600/10 px-6 py-3 font-semibold text-red-600 hover:bg-red-600/20 transition-colors">Logout</button>
                </div>
              </div>
              <div id="profileEditSection" class="hidden space-y-6">
                <form id="profileForm" class="space-y-6">
                  <div class="grid gap-4 sm:grid-cols-[auto_1fr] items-center">
                    <div class="relative">
                      <div id="profilePhotoPreview" class="w-28 h-28 rounded-full border border-[#1B2D5B] bg-[#F5F0E8] flex items-center justify-center text-5xl text-[#1B2D5B] overflow-hidden">
                        <span class="material-symbols-outlined">account_circle</span>
                      </div>
                      <label for="profilePhotoInput" class="absolute inset-0 cursor-pointer"></label>
                      <input id="profilePhotoInput" type="file" accept="image/*" class="hidden">
                    </div>
                    <div>
                      <p class="font-semibold text-[#1B2D5B] mb-2">Profile Photo</p>
                      <p class="text-sm text-[#1B2D5B]/70">Upload a profile photo or click the circle to update it.</p>
                    </div>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <label class="block">
                      <span class="font-semibold text-[#1B2D5B]">Full Name</span>
                      <input id="profileFullName" type="text" placeholder="Enter your full name" class="mt-2 w-full rounded-[20px] border border-[#1B2D5B] bg-white px-4 py-3 text-[#1B2D5B] focus:outline-none focus:ring-2 focus:ring-[#1B2D5B]/20">
                    </label>
                    <label class="block">
                      <span class="font-semibold text-[#1B2D5B]">Class / Year</span>
                      <select id="profileClass" class="mt-2 w-full rounded-[20px] border border-[#1B2D5B] bg-white px-4 py-3 text-[#1B2D5B] focus:outline-none focus:ring-2 focus:ring-[#1B2D5B]/20">
                        <option value="">Select class/year</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                        <option value="1st Year UG">1st Year UG</option>
                        <option value="2nd Year UG">2nd Year UG</option>
                        <option value="3rd Year UG">3rd Year UG</option>
                        <option value="4th Year UG">4th Year UG</option>
                      </select>
                    </label>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <label class="block">
                      <span class="font-semibold text-[#1B2D5B]">Stream</span>
                      <select id="profileStream" class="mt-2 w-full rounded-[20px] border border-[#1B2D5B] bg-white px-4 py-3 text-[#1B2D5B] focus:outline-none focus:ring-2 focus:ring-[#1B2D5B]/20">
                        <option value="">Select stream</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Medical">Medical</option>
                        <option value="Arts">Arts</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Technology & Digital">Technology & Digital</option>
                        <option value="Government">Government</option>
                        <option value="Law & Legal Services">Law & Legal Services</option>
                        <option value="Media & Journalism">Media & Journalism</option>
                        <option value="Education & Training">Education & Training</option>
                        <option value="Wellness & Lifestyle">Wellness & Lifestyle</option>
                        <option value="Real Estate & Construction">Real Estate & Construction</option>
                        <option value="Pure Sciences">Pure Sciences</option>
                        <option value="Sports & Fitness">Sports & Fitness</option>
                        <option value="Environment & Agriculture">Environment & Agriculture</option>
                        <option value="Hotel Management & Hospitality">Hotel Management & Hospitality</option>
                        <option value="Entrepreneurship">Entrepreneurship</option>
                      </select>
                    </label>
                    <label class="block">
                      <span class="font-semibold text-[#1B2D5B]">Career Interest</span>
                      <select id="profileInterest" class="mt-2 w-full rounded-[20px] border border-[#1B2D5B] bg-white px-4 py-3 text-[#1B2D5B] focus:outline-none focus:ring-2 focus:ring-[#1B2D5B]/20">
                        <option value="">Select interest</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Medical">Medical</option>
                        <option value="Arts">Arts</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Technology & Digital">Technology & Digital</option>
                        <option value="Government">Government</option>
                        <option value="Law & Legal Services">Law & Legal Services</option>
                        <option value="Media & Journalism">Media & Journalism</option>
                        <option value="Education & Training">Education & Training</option>
                        <option value="Wellness & Lifestyle">Wellness & Lifestyle</option>
                        <option value="Real Estate & Construction">Real Estate & Construction</option>
                        <option value="Pure Sciences">Pure Sciences</option>
                        <option value="Sports & Fitness">Sports & Fitness</option>
                        <option value="Environment & Agriculture">Environment & Agriculture</option>
                        <option value="Hotel Management & Hospitality">Hotel Management & Hospitality</option>
                        <option value="Entrepreneurship">Entrepreneurship</option>
                      </select>
                    </label>
                  </div>
                  <p id="profileStatusText" class="text-sm text-[#1B2D5B]/70"></p>
                  <div class="flex flex-wrap gap-3">
                    <button id="profileSaveBtn" type="submit" class="inline-flex items-center justify-center rounded-full bg-[#1B2D5B] px-6 py-3 font-semibold text-[#F5F0E8] hover:bg-[#122141] transition-colors">Save</button>
                    <button id="profileCancelBtn" type="button" class="inline-flex items-center justify-center rounded-full border border-[#1B2D5B] bg-[#F5F0E8] px-6 py-3 font-semibold text-[#1B2D5B] hover:bg-white transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
            <div id="notificationsTab" class="tab-panel hidden">
              <div class="rounded-[32px] border border-[#1B2D5B]/20 bg-white p-8 space-y-6">
                <div>
                  <h3 class="font-headline-md text-2xl font-bold text-[#1B2D5B]">Notifications</h3>
                  <p class="text-sm text-[#1B2D5B]/70 mt-1">Choose how you want to receive reminders and career updates.</p>
                </div>
                <div class="space-y-4">
                  <label class="flex items-center justify-between gap-4 rounded-3xl border border-[#1B2D5B]/10 bg-[#F5F0E8] px-4 py-4">
                    <div>
                      <p class="font-semibold text-[#1B2D5B]">Email alerts</p>
                      <p class="text-sm text-[#1B2D5B]/70">Receive email updates about recommendations and new opportunities.</p>
                    </div>
                    <input id="notificationsEmail" type="checkbox" class="h-5 w-5 rounded accent-primary">
                  </label>
                  <label class="flex items-center justify-between gap-4 rounded-3xl border border-[#1B2D5B]/10 bg-[#F5F0E8] px-4 py-4">
                    <div>
                      <p class="font-semibold text-[#1B2D5B]">SMS reminders</p>
                      <p class="text-sm text-[#1B2D5B]/70">Get exam and deadline reminders by SMS.</p>
                    </div>
                    <input id="notificationsSMS" type="checkbox" class="h-5 w-5 rounded accent-primary">
                  </label>
                  <label class="flex items-center justify-between gap-4 rounded-3xl border border-[#1B2D5B]/10 bg-[#F5F0E8] px-4 py-4">
                    <div>
                      <p class="font-semibold text-[#1B2D5B]">Exam deadline alerts</p>
                      <p class="text-sm text-[#1B2D5B]/70">Receive timely notices for upcoming exam dates.</p>
                    </div>
                    <input id="notificationsExam" type="checkbox" class="h-5 w-5 rounded accent-primary">
                  </label>
                  <label class="flex items-center justify-between gap-4 rounded-3xl border border-[#1B2D5B]/10 bg-[#F5F0E8] px-4 py-4">
                    <div>
                      <p class="font-semibold text-[#1B2D5B]">Personalized recommendations</p>
                      <p class="text-sm text-[#1B2D5B]/70">Allow tailored career suggestions based on your progress.</p>
                    </div>
                    <input id="notificationsPersonalized" type="checkbox" class="h-5 w-5 rounded accent-primary">
                  </label>
                </div>
                <div class="flex flex-wrap gap-3">
                  <button id="saveNotificationsBtn" type="button" class="inline-flex items-center justify-center rounded-full bg-[#1B2D5B] px-6 py-3 font-semibold text-[#F5F0E8] hover:bg-[#122141] transition-colors">Save Notifications</button>
                  <button id="resetNotificationsBtn" type="button" class="inline-flex items-center justify-center rounded-full border border-[#1B2D5B] bg-[#F5F0E8] px-6 py-3 font-semibold text-[#1B2D5B] hover:bg-white transition-colors">Reset to Default</button>
                </div>
                <p id="notificationsStatusText" class="text-sm text-[#1B2D5B]/70"></p>
              </div>
            </div>
            <div id="privacyTab" class="tab-panel hidden">
              <div class="rounded-[32px] border border-[#1B2D5B]/20 bg-white p-8 space-y-6">
                <div>
                  <h3 class="font-headline-md text-2xl font-bold text-[#1B2D5B]">Privacy & Safety</h3>
                  <p class="text-sm text-[#1B2D5B]/70 mt-1">Control what information is visible and how your data is shared.</p>
                </div>
                <div class="space-y-4">
                  <label class="flex items-center justify-between gap-4 rounded-3xl border border-[#1B2D5B]/10 bg-[#F5F0E8] px-4 py-4">
                    <div>
                      <p class="font-semibold text-[#1B2D5B]">Show profile to mentors</p>
                      <p class="text-sm text-[#1B2D5B]/70">Allow coaches and mentors to view your student profile.</p>
                    </div>
                    <input id="privacyProfileToggle" type="checkbox" class="h-5 w-5 rounded accent-primary">
                  </label>
                  <label class="flex items-center justify-between gap-4 rounded-3xl border border-[#1B2D5B]/10 bg-[#F5F0E8] px-4 py-4">
                    <div>
                      <p class="font-semibold text-[#1B2D5B]">Allow anonymous data sharing</p>
                      <p class="text-sm text-[#1B2D5B]/70">Help improve career guidance by sharing usage anonymously.</p>
                    </div>
                    <input id="privacyDataSharing" type="checkbox" class="h-5 w-5 rounded accent-primary">
                  </label>
                  <label class="flex items-center justify-between gap-4 rounded-3xl border border-[#1B2D5B]/10 bg-[#F5F0E8] px-4 py-4">
                    <div>
                      <p class="font-semibold text-[#1B2D5B]">Secure session</p>
                      <p class="text-sm text-[#1B2D5B]/70">Keep your dashboard access safe on shared devices.</p>
                    </div>
                    <input id="privacySecureSession" type="checkbox" class="h-5 w-5 rounded accent-primary">
                  </label>
                </div>
                <div class="flex flex-wrap gap-3">
                  <button id="savePrivacyBtn" type="button" class="inline-flex items-center justify-center rounded-full bg-[#1B2D5B] px-6 py-3 font-semibold text-[#F5F0E8] hover:bg-[#122141] transition-colors">Save Privacy</button>
                  <button id="resetPrivacyBtn" type="button" class="inline-flex items-center justify-center rounded-full border border-[#1B2D5B] bg-[#F5F0E8] px-6 py-3 font-semibold text-[#1B2D5B] hover:bg-white transition-colors">Reset to Default</button>
                </div>
                <p id="privacyStatusText" class="text-sm text-[#1B2D5B]/70"></p>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    tabButtons = modalOverlay.querySelectorAll('.tab-button');
    tabs = {
      profile: modalOverlay.querySelector('#profileTab'),
      notifications: modalOverlay.querySelector('#notificationsTab'),
      privacy: modalOverlay.querySelector('#privacyTab')
    };
    profileViewSection = modalOverlay.querySelector('#profileViewSection');
    profileEditSection = modalOverlay.querySelector('#profileEditSection');
    viewPhoto = modalOverlay.querySelector('#profileViewPhoto');
    viewName = modalOverlay.querySelector('#profileViewName');
    viewClass = modalOverlay.querySelector('#profileViewClass');
    viewStream = modalOverlay.querySelector('#profileViewStream');
    viewInterest = modalOverlay.querySelector('#profileViewInterest');
    profilePhotoPreview = modalOverlay.querySelector('#profilePhotoPreview');
    profilePhotoInput = modalOverlay.querySelector('#profilePhotoInput');
    profileFullName = modalOverlay.querySelector('#profileFullName');
    profileClass = modalOverlay.querySelector('#profileClass');
    profileStream = modalOverlay.querySelector('#profileStream');
    profileInterest = modalOverlay.querySelector('#profileInterest');
    profileStatusText = modalOverlay.querySelector('#profileStatusText');
    notificationsEmail = modalOverlay.querySelector('#notificationsEmail');
    notificationsSMS = modalOverlay.querySelector('#notificationsSMS');
    notificationsExam = modalOverlay.querySelector('#notificationsExam');
    notificationsPersonalized = modalOverlay.querySelector('#notificationsPersonalized');
    notificationsStatusText = modalOverlay.querySelector('#notificationsStatusText');
    saveNotificationsBtn = modalOverlay.querySelector('#saveNotificationsBtn');
    resetNotificationsBtn = modalOverlay.querySelector('#resetNotificationsBtn');
    privacyProfileToggle = modalOverlay.querySelector('#privacyProfileToggle');
    privacyDataSharing = modalOverlay.querySelector('#privacyDataSharing');
    privacySecureSession = modalOverlay.querySelector('#privacySecureSession');
    privacyStatusText = modalOverlay.querySelector('#privacyStatusText');
    savePrivacyBtn = modalOverlay.querySelector('#savePrivacyBtn');
    resetPrivacyBtn = modalOverlay.querySelector('#resetPrivacyBtn');

    const closeButton = modalOverlay.querySelector('#nextstepProfileModalClose');
    const editButton = modalOverlay.querySelector('#editProfileBtn');
    const logoutButton = modalOverlay.querySelector('#logoutBtn');
    const cancelButton = modalOverlay.querySelector('#profileCancelBtn');
    const profileForm = modalOverlay.querySelector('#profileForm');

    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', event => {
      if (event.target === modalOverlay) closeModal();
    });

    if (tabButtons) {
      tabButtons.forEach(button => {
        button.addEventListener('click', () => setActiveTab(button.dataset.tab));
      });
    }

    if (editButton) editButton.addEventListener('click', () => setMode(true));
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
          localStorage.clear();
          window.location.href = 'index.html';
        }
      });
    }
    if (cancelButton) cancelButton.addEventListener('click', () => {
      showView(currentProfile);
      showEdit(currentProfile);
      setMode(false);
    });

    if (profilePhotoInput) {
      profilePhotoInput.addEventListener('change', event => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          currentProfile.photo = reader.result;
          if (profilePhotoPreview) profilePhotoPreview.innerHTML = `<img src="${reader.result}" alt="Photo preview" class="w-full h-full object-cover" />`;
        };
        reader.readAsDataURL(file);
      });
    }

    if (profileForm) {
      profileForm.addEventListener('submit', event => {
        event.preventDefault();
        const updatedProfile = {
          name: profileFullName?.value.trim() || '',
          photo: currentProfile.photo || '',
          class: profileClass?.value || '',
          stream: profileStream?.value || '',
          interest: profileInterest?.value || ''
        };
        writeProfile(updatedProfile);
        refreshHeader();
        showView(updatedProfile);
        showEdit(updatedProfile);
        setMode(false);
        if (profileStatusText) profileStatusText.textContent = 'Profile saved successfully.';
      });
    }

    if (saveNotificationsBtn) {
      saveNotificationsBtn.addEventListener('click', () => {
        writeSettings(readCurrentSettings());
        if (notificationsStatusText) notificationsStatusText.textContent = 'Notification settings saved.';
      });
    }
    if (resetNotificationsBtn) {
      resetNotificationsBtn.addEventListener('click', () => {
        writeSettings(DEFAULT_SETTINGS);
        applySettingsToControls(DEFAULT_SETTINGS);
        if (notificationsStatusText) notificationsStatusText.textContent = 'Notification settings reset to default.';
      });
    }
    if (savePrivacyBtn) {
      savePrivacyBtn.addEventListener('click', () => {
        writeSettings(readCurrentSettings());
        if (privacyStatusText) privacyStatusText.textContent = 'Privacy settings saved.';
      });
    }
    if (resetPrivacyBtn) {
      resetPrivacyBtn.addEventListener('click', () => {
        writeSettings(DEFAULT_SETTINGS);
        applySettingsToControls(DEFAULT_SETTINGS);
        if (privacyStatusText) privacyStatusText.textContent = 'Privacy settings reset to default.';
      });
    }
  }

  function openModal() {
    createModal();
    const profile = readProfile();
    currentProfile = profile;
    showView(profile);
    showEdit(profile);
    setMode(false);
    applySettingsToControls(readSettings());
    setActiveTab('profile');
    if (modalOverlay) {
      modalOverlay.classList.remove('hidden');
    }
    document.body.classList.add('overflow-hidden');
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  function init() {
    refreshHeader();
    const headerButton = document.getElementById('profileHeaderButton');
    if (headerButton) {
      headerButton.addEventListener('click', openModal);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
