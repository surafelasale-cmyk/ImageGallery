const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const closeButton = document.querySelector('.lightbox-close');
const previousButton = document.querySelector('.lightbox-previous');
const nextButton = document.querySelector('.lightbox-next');

let visibleItems = galleryItems;
let currentIndex = 0;
let lastFocusedElement;

function updateVisibleItems(filter) {
  visibleItems = galleryItems.filter((item) => filter === 'all' || item.dataset.category === filter);

  galleryItems.forEach((item) => {
    item.hidden = !visibleItems.includes(item);
  });
}

function showImage(index) {
  currentIndex = (index + visibleItems.length) % visibleItems.length;
  const item = visibleItems[currentIndex];
  const image = item.querySelector('img');

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxTitle.textContent = item.querySelector('h3').textContent;
  previousButton.disabled = visibleItems.length < 2;
  nextButton.disabled = visibleItems.length < 2;
}

function openLightbox(item) {
  lastFocusedElement = document.activeElement;
  showImage(visibleItems.indexOf(item));
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.classList.add('is-open');
  document.body.classList.add('lightbox-open');
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  lightboxImage.src = '';
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });
    updateVisibleItems(button.dataset.filter);
  });
});

galleryItems.forEach((item) => {
  item.querySelector('.image-button').addEventListener('click', () => openLightbox(item));
});

closeButton.addEventListener('click', closeLightbox);
previousButton.addEventListener('click', () => showImage(currentIndex - 1));
nextButton.addEventListener('click', () => showImage(currentIndex + 1));

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-open')) {
    return;
  }

  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowLeft') {
    showImage(currentIndex - 1);
  } else if (event.key === 'ArrowRight') {
    showImage(currentIndex + 1);
  }
});

updateVisibleItems('all');