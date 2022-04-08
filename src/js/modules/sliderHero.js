import refs from '../refs.js';

const { sliderHeroEl, sliderTabHeroEl } = refs;

addEventListener('DOMContentLoaded', () => {
  sliderTabHeroEl.addEventListener('click', handlerTab);
  sliderHeroEl.addEventListener('pointerdown', handlerSlider);
  sliderHeroEl.addEventListener('pointerover', сhangeSlidesIntervalStop);
  addEventListener('unload', clearListener);
  сhangeSlidesIntervalStart();
});

const sliderList = sliderHeroEl.firstElementChild.firstElementChild;
const sliderItems = sliderList.children;
const widthSlide = 100;
let indexSlide = 1;
let indexTab = 1;
let clientWidth = null;
let x = null;
let swipeX = null;
let intervalId = null;
let prevProgressTab = null;
let prevProgressSlide = null;

function сhangeSlidesIntervalStart() {
  addProgressSlide();

  intervalId = setInterval(() => {
    if (indexTab >= sliderItems.length - 2) {
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

const transitionSlide = transitionValue =>
  (sliderList.style.transition = transitionValue);

const transformSlide = (swipeValue = 0) =>
  (sliderList.style.transform = `translateX(${
    -(widthSlide * indexSlide) + swipeValue
  }%)`);

const swipeXPercent = () => (swipeX / clientWidth) * 100;

const addProgressSlide = () => {
  const progressTab =
    sliderTabHeroEl.children[indexTab - 1].lastElementChild.lastElementChild;
  const progressSlide = sliderItems[indexTab].lastElementChild.lastElementChild;
  progressTab.classList.add('u-progress-loading');
  progressSlide.classList.add('u-progress-loading');
  prevProgressTab = progressTab;
  prevProgressSlide = progressSlide;
};

const removeProgressSlide = () => {
  prevProgressTab.classList.remove('u-progress-loading');
  prevProgressSlide.classList.remove('u-progress-loading');
};

function handlerTab(event) {
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

function handlerSlider(event) {
  removeProgressSlide();
  startSwipe(event);
}

function startSwipe(event) {
  sliderHeroEl.ondragstart = () => false;
  clientWidth = event.currentTarget.clientWidth;
  x = event.pageX;
  sliderHeroEl.addEventListener('pointermove', swiping);
  sliderHeroEl.addEventListener('pointerup', stopSwipe);
  sliderHeroEl.addEventListener('pointercancel', stopSwipe);
}

function swiping(event) {
  swipeX = event.pageX - x;
  transitionSlide('none');
  transformSlide(swipeXPercent());
}

function stopSwipe(event) {
  const index = [...sliderItems].findIndex(
    el => el === event.target.parentNode,
  );

  if (swipeXPercent() >= widthSlide / 2) {
    if (index <= 1) {
      indexTab = sliderItems.length - 2;
    } else {
      indexTab = index - 1;
    }
    prevSlide();
  } else if (swipeXPercent() <= -widthSlide / 2) {
    if (index >= sliderItems.length - 2) {
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
    indexSlide = sliderItems.length - 2;
    sliderList.addEventListener('transitionend', firstLastSlideSwitching);
  }

  removeProgressSlide();
  addProgressSlide();
}

function nextSlide() {
  if (indexSlide < sliderItems.length - 1) {
    indexSlide += 1;
    transitionSlide('transform 250ms ease-in-out');
    transformSlide();
  }

  if (indexSlide === sliderItems.length - 1) {
    indexSlide = 1;
    sliderList.addEventListener('transitionend', firstLastSlideSwitching);
  }

  removeProgressSlide();
  addProgressSlide();
}

function firstLastSlideSwitching() {
  transitionSlide('none');
  transformSlide();
  sliderList.removeEventListener('transitionend', firstLastSlideSwitching);
}

function clearListener() {
  clearInterval(intervalId);
  sliderHeroEl.removeEventListener('pointerdown', handlerSlider);
  sliderHeroEl.removeEventListener('pointerover', сhangeSlidesIntervalStop);
}
