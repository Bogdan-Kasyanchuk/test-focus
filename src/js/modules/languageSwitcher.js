import refs from '../refs.js';

const { languageEl, languageLinkEl } = refs;

addEventListener('DOMContentLoaded', () => {
  languageEl.addEventListener('click', toggleLanguage);
  addEventListener('unload', clearListener);
});

function toggleLanguage(event) {
  if (!event.target.classList.contains('c-language__link')) {
    return;
  }

  languageLinkEl.forEach(element => {
    element.parentElement.classList.toggle('c-language__item--hidden');
    element.classList.toggle('c-language__link--active');
  });
}

function clearListener() {
  languageEl.removeEventListener('click', toggleLanguage);
}
