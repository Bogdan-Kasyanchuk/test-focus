import refs from '../refs.js';
import { burgerModal } from './burgerModal.js';
import { formSearch } from './formSearch.js';
import { toggleLanguage } from './languageSwitcher.js';
import {
  handlerTabHero,
  handlerSliderHero,
  сhangeSlidesIntervalStopHero,
  сhangeSlidesIntervalStartHero,
} from './sliderHero.js';
import { sliderRatings } from './sliderRatings.js';
import { sliderPopular } from './sliderPopular.js';
import {
  handlerSliderFocus,
  сhangeSlidesIntervalStopFocus,
  сhangeSlidesIntervalStartFocus,
} from './sliderFocus.js';

const {
  buttonBurgerEl,
  buttonSearchEl,
  languageEl,
  sliderTabHeroEl,
  sliderHeroEl,
  sliderRatingsEl,
  sliderPopularEl,
  sliderFocusEl,
} = refs;

addEventListener('DOMContentLoaded', () => {
  buttonBurgerEl.addEventListener('click', burgerModal);
  buttonSearchEl.addEventListener('click', formSearch);
  languageEl.addEventListener('click', toggleLanguage);
  sliderTabHeroEl.addEventListener('click', handlerTabHero);
  sliderHeroEl.addEventListener('pointerdown', handlerSliderHero);
  sliderHeroEl.addEventListener('pointerover', сhangeSlidesIntervalStopHero);
  сhangeSlidesIntervalStartHero();
  sliderRatingsEl.addEventListener(
    'pointerdown',
    sliderRatings.handlerSlider.bind(sliderRatings),
  );
  sliderRatings.setButtonState();
  sliderRatings.progressDrag();
  sliderPopularEl.addEventListener(
    'pointerdown',
    sliderPopular.handlerSlider.bind(sliderPopular),
  );
  sliderPopular.setButtonState();
  sliderPopular.progressDrag();
  sliderFocusEl.addEventListener('pointerdown', handlerSliderFocus);
  sliderFocusEl.addEventListener('pointerover', сhangeSlidesIntervalStopFocus);
  сhangeSlidesIntervalStartFocus();
  addEventListener('resize', () => {
    sliderPopular.updateView();
    sliderRatings.updateView();
  });
});
