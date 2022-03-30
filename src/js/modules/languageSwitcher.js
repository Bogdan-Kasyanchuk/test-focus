import refs from '../refs.js';

const { languageEl } = refs;

languageEl.addEventListener('click', setLanguage);

const languageLinkEl = languageEl.querySelectorAll('.js-language__link');

function setLanguage(event) {
  if (!event.target.classList.contains('c-language__link')) return;
  languageLinkEl.forEach(element => {
    element.parentElement.classList.toggle('c-language__item--hidden');
    element.classList.toggle('c-language__link--active');
  });
}
