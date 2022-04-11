import refs from '../refs.js';

const { languageLinkEl } = refs;

export function toggleLanguage(event) {
  if (!event.target.classList.contains('c-language__link')) {
    return;
  }

  languageLinkEl.forEach(element => {
    element.parentElement.classList.toggle('c-language__item--hidden');
    element.classList.toggle('c-language__link--active');
  });
}
