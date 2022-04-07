import refs from '../refs.js';

const { sliderHeroEl, sliderTabHeroEl } = refs;

addEventListener('DOMContentLoaded', () => {
  sliderTabHeroEl.addEventListener('click', handlerTabHero);
  sliderHeroEl.addEventListener('pointerdown', handlerSliderHero);
  sliderHeroEl.addEventListener('pointerover', сhangeSlidesIntervalStop);
  addEventListener('unload', clearListener);
  сhangeSlidesIntervalStart();
});

const sliderHeroList = sliderHeroEl.firstElementChild.firstElementChild;
const sliderHeroItems = sliderHeroList.children;
const widthSlide = 100;
let indexSlide = 1;
let x1 = null;
let clientWidth = null;
let swipeX = null;
let intervalId = null;
let indexTab = 1;
let prevProgressTab = null;
let prevProgressSlide = null;

function сhangeSlidesIntervalStart() {
  addProgressSlide();

  intervalId = setInterval(() => {
    if (indexTab >= sliderHeroItems.length - 2) {
      indexTab = 1;
    } else {
      indexTab += 1;
    }
    nextSlide();
  }, 5000);

  sliderHeroEl.removeEventListener('pointerout', сhangeSlidesIntervalStart);
}

function сhangeSlidesIntervalStop() {
  removeProgressSlide();
  clearInterval(intervalId);
  sliderHeroEl.addEventListener('pointerout', сhangeSlidesIntervalStart);
}

const swipeXPercent = () => (swipeX / clientWidth) * 100;

const transitionSlide = transitionValue =>
  (sliderHeroList.style.transition = transitionValue);

const transformSlide = (swipeValue = 0) =>
  (sliderHeroList.style.transform = `translateX(${
    -(widthSlide * indexSlide) + swipeValue
  }%)`);

const addProgressSlide = () => {
  const progressTab =
    sliderTabHeroEl.children[indexTab - 1].lastElementChild.lastElementChild;
  const progressSlide =
    sliderHeroItems[indexTab].lastElementChild.lastElementChild;

  progressTab.classList.add('u-progress-loading');
  progressSlide.classList.add('u-progress-loading');

  prevProgressTab = progressTab;
  prevProgressSlide = progressSlide;
};

const removeProgressSlide = () => {
  prevProgressTab.classList.remove('u-progress-loading');
  prevProgressSlide.classList.remove('u-progress-loading');
};

function handlerTabHero(event) {
  if (!event.target.classList.contains('c-card-tab-hero')) {
    return;
  }

  indexTab =
    [...event.currentTarget.children].findIndex(
      el => el === event.target.parentNode,
    ) + 1;

  if (indexSlide === indexTab) {
    return;
  } else if (indexTab < indexSlide) {
    indexSlide = indexTab + 1;
    prevSlide();
  } else {
    indexSlide = indexTab - 1;
    nextSlide();
  }
}

function handlerSliderHero(event) {
  removeProgressSlide();
  startSwipe(event);
}

function startSwipe(event) {
  sliderHeroEl.ondragstart = () => false;
  x1 = event.pageX;
  clientWidth = event.currentTarget.clientWidth;
  sliderHeroEl.addEventListener('pointermove', swiping);
  sliderHeroEl.addEventListener('pointerup', stopSwipe);
  sliderHeroEl.addEventListener('pointercancel', stopSwipe);
}

function swiping(event) {
  swipeX = event.pageX - x1;
  transitionSlide('none');
  transformSlide(swipeXPercent());
}

function stopSwipe(event) {
  const index = [...sliderHeroItems].findIndex(
    el => el === event.target.parentNode,
  );

  if (swipeXPercent() >= 50) {
    if (index <= 1) {
      indexTab = sliderHeroItems.length - 2;
    } else {
      indexTab = index - 1;
    }
    prevSlide();
  } else if (swipeXPercent() <= -50) {
    if (index >= sliderHeroItems.length - 2) {
      indexTab = 1;
    } else {
      indexTab = index + 1;
    }
    nextSlide();
  } else {
    transitionSlide('transform 250ms ease-in-out');
    transformSlide();
  }

  swipeX = null;
  sliderHeroEl.removeEventListener('pointermove', swiping);
  sliderHeroEl.removeEventListener('pointerup', stopSwipe);
  sliderHeroEl.removeEventListener('pointercancel', stopSwipe);
}

function prevSlide() {
  indexSlide -= 1;
  transitionSlide('transform 250ms ease-in-out');
  transformSlide();

  if (indexSlide === 0) {
    indexSlide = sliderHeroItems.length - 2;
    sliderHeroList.addEventListener('transitionend', firstLastSlideSwitching);
  }

  removeProgressSlide();
  addProgressSlide();
}

function nextSlide() {
  transitionSlide('transform 250ms ease-in-out');

  if (indexSlide < sliderHeroItems.length - 1) {
    indexSlide += 1;
    transformSlide();
  }

  if (indexSlide === sliderHeroItems.length - 1) {
    indexSlide = 1;
    sliderHeroList.addEventListener('transitionend', firstLastSlideSwitching);
  }

  removeProgressSlide();
  addProgressSlide();
}

function firstLastSlideSwitching() {
  transitionSlide('none');
  transformSlide();
  sliderHeroList.removeEventListener('transitionend', firstLastSlideSwitching);
}

function clearListener() {
  clearInterval(intervalId);
  sliderHeroEl.removeEventListener('pointerdown', handlerSliderHero);
  sliderHeroEl.removeEventListener('pointerover', сhangeSlidesIntervalStop);
}
