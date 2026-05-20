// ===== Reveal-on-scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 40, 240)}ms`;
  io.observe(el);
});

// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Smooth-scroll offset for fixed nav =====
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 60;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
});

// ===== Gallery data =====
const galleries = {
  awisso: {
    name: 'Awisso+',
    eyebrow: '🛍️ E-Commerce iOS App',
    images: [
      { src: 'images/awisso/SignIn.svg',        label: 'Sign In' },
      { src: 'images/awisso/statics.svg',       label: 'Analytics' },
      { src: 'images/awisso/orders.svg',        label: 'Orders' },
      { src: 'images/awisso/orderDetails.svg',  label: 'Order Details' },
      { src: 'images/awisso/ordersfilter.svg',  label: 'Filter' },
      { src: 'images/awisso/calendar.svg',      label: 'Calendar' },
      { src: 'images/awisso/chat.svg',          label: 'Live Chat' },
      { src: 'images/awisso/notifications.svg', label: 'Notifications' },
      { src: 'images/awisso/Settings.svg',      label: 'Settings' },
    ],
  },
  activetribe: {
    name: 'Active Tribe',
    eyebrow: '🏋️ Health & Fitness · IoT iOS App',
    images: [
      { src: 'images/active-tribe/1.png',  label: 'Welcome' },
      { src: 'images/active-tribe/2.png',  label: 'Onboarding' },
      { src: 'images/active-tribe/3.png',  label: 'Features' },
      { src: 'images/active-tribe/4.png',  label: 'Sign In' },
      { src: 'images/active-tribe/5.png',  label: 'Auth' },
      { src: 'images/active-tribe/6.jpg',  label: 'Sign Up' },
      { src: 'images/active-tribe/7.png',  label: 'Profile' },
      { src: 'images/active-tribe/8.png',  label: 'Home' },
      { src: 'images/active-tribe/9.png',  label: 'Map' },
      { src: 'images/active-tribe/10.png', label: 'Locker' },
      { src: 'images/active-tribe/11.png', label: 'Booking' },
      { src: 'images/active-tribe/12.jpg', label: 'Workout' },
      { src: 'images/active-tribe/13.jpg', label: 'Tracking' },
      { src: 'images/active-tribe/14.png', label: 'History' },
      { src: 'images/active-tribe/15.jpg', label: 'Stats' },
    ],
  },
  deliverydriver: {
    name: 'DeliveryDriver',
    eyebrow: '🚚 Delivery · MapKit iOS App',
    images: [
      { src: 'images/imageDeliverDriver/IMG_2364.PNG', label: 'Home Map' },
      { src: 'images/imageDeliverDriver/IMG_2366.PNG', label: 'Pickup' },
      { src: 'images/imageDeliverDriver/IMG_2367.PNG', label: 'Destination' },
      { src: 'images/imageDeliverDriver/IMG_2368.PNG', label: 'Route' },
      { src: 'images/imageDeliverDriver/IMG_2369.PNG', label: 'Trip Request' },
      { src: 'images/imageDeliverDriver/IMG_2371.PNG', label: 'Tracking' },
      { src: 'images/imageDeliverDriver/IMG_2372.PNG', label: 'Driver Status' },
      { src: 'images/imageDeliverDriver/IMG_2373.PNG', label: 'Trip Details' },
    ],
  },
  luggdriver: {
    name: 'LuggDriver',
    eyebrow: '🚛 Logistics · Transportation iOS App',
    images: [
      { src: 'images/imageLuggDriver/IMG_2357.PNG', label: 'Driver Map' },
      { src: 'images/imageLuggDriver/IMG_2359.PNG', label: 'Request' },
      { src: 'images/imageLuggDriver/IMG_2360.PNG', label: 'Route' },
      { src: 'images/imageLuggDriver/IMG_2361.PNG', label: 'Pickup' },
      { src: 'images/imageLuggDriver/IMG_2362.PNG', label: 'Trip Status' },
    ],
  },
};

// ===== Gallery elements =====
const modal       = document.getElementById('galleryModal');
const track       = document.getElementById('galleryTrack');
const nameEl      = document.getElementById('galleryName');
const eyebrowEl   = document.getElementById('galleryEyebrow');
const prevBtn     = document.getElementById('galleryPrev');
const nextBtn     = document.getElementById('galleryNext');
const barFill     = document.getElementById('galleryBarFill');

let currentIndex = 0;
let phoneEls = [];

function buildGallery(key) {
  const data = galleries[key];
  if (!data) return;

  nameEl.textContent = data.name;
  eyebrowEl.textContent = data.eyebrow;
  track.innerHTML = '';

  data.images.forEach((img, i) => {
    const phone = document.createElement('div');
    phone.className = 'phone-frame';
    phone.dataset.index = i;
    phone.innerHTML = `
      <div class="phone-notch"></div>
      <div class="phone-viewport">
        <img src="${img.src}" alt="${data.name} — ${img.label}" />
      </div>
    `;
    track.appendChild(phone);
  });

  phoneEls = Array.from(track.querySelectorAll('.phone-frame'));
  currentIndex = 0;
}

function openGallery(key) {
  buildGallery(key);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gallery-locked');
  // Focus first phone after paint
  requestAnimationFrame(() => scrollToIndex(0, false));
}

function closeGallery() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('gallery-locked');
}

function scrollToIndex(i, smooth = true) {
  if (!phoneEls.length) return;
  currentIndex = Math.max(0, Math.min(i, phoneEls.length - 1));
  const phone = phoneEls[currentIndex];
  const trackRect = track.getBoundingClientRect();
  const phoneRect = phone.getBoundingClientRect();
  const offset = (phoneRect.left + phoneRect.width / 2) - (trackRect.left + trackRect.width / 2);
  track.scrollBy({ left: offset, behavior: smooth ? 'smooth' : 'auto' });
  updateActive();
}

function updateActive() {
  if (!phoneEls.length) return;
  const trackCenter = track.scrollLeft + track.clientWidth / 2;
  let nearest = 0;
  let nearestDist = Infinity;
  phoneEls.forEach((p, i) => {
    const center = p.offsetLeft + p.offsetWidth / 2;
    const dist = Math.abs(center - trackCenter);
    if (dist < nearestDist) { nearestDist = dist; nearest = i; }
  });
  currentIndex = nearest;
  phoneEls.forEach((p, i) => p.classList.toggle('is-active', i === currentIndex));
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === phoneEls.length - 1;
  const pct = phoneEls.length > 1 ? (currentIndex / (phoneEls.length - 1)) * 100 : 100;
  barFill.style.width = `${pct}%`;
}

// ===== Open / close triggers =====
document.querySelectorAll('.view-more-btn').forEach((btn) => {
  btn.addEventListener('click', () => openGallery(btn.dataset.gallery));
});
modal.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeGallery);
});

prevBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
nextBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));

// Update on scroll (for drag/wheel)
let scrollTimer;
track.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(updateActive, 60);
});

// Keyboard
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowLeft') scrollToIndex(currentIndex - 1);
  if (e.key === 'ArrowRight') scrollToIndex(currentIndex + 1);
});

// Convert vertical wheel into horizontal scroll inside the track
track.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    track.scrollLeft += e.deltaY;
    e.preventDefault();
  }
}, { passive: false });

// Mouse drag-to-scroll
let isDown = false, startX = 0, startScroll = 0;
track.addEventListener('mousedown', (e) => {
  isDown = true;
  startX = e.pageX;
  startScroll = track.scrollLeft;
});
window.addEventListener('mouseup', () => { isDown = false; });
track.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  track.scrollLeft = startScroll - (e.pageX - startX);
});
