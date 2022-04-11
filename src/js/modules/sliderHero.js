import refs from '../refs.js';

const { sliderHeroEl, sliderTabHeroEl } = refs;

const sliderList = sliderHeroEl.firstElementChild.firstElementChild;
const sliderItems = sliderList.children;
const widthSlide = 100;
let indexSlide = 1;
let indexTab = 1;
let isSwipe = false;
let clientWidth = null;
let x = null;
let swipeX = null;
let intervalId = null;
let progressTab = null;
let progressSlide = null;
let link = null;
let index = null;

export function сhangeSlidesIntervalStartHero() {
  if (!progressTab?.classList.contains('u-progress-loading')) {
    addProgressSlide();
  }

  intervalId = setInterval(() => {
    if (indexTab >= sliderItems.length - 2) {
      indexTab = 1;
    } else {
      indexTab += 1;
    }
    nextSlide();
  }, 5000);

  sliderHeroEl.removeEventListener('pointerout', сhangeSlidesIntervalStartHero);
}

export function сhangeSlidesIntervalStopHero() {
  removeProgressSlide();
  clearInterval(intervalId);
  sliderHeroEl.addEventListener('pointerout', handlerPointerOut);
}

function handlerPointerOut() {
  сhangeSlidesIntervalStartHero();
  if (Math.abs(swipeX)) {
    stopSwipe();
  }
}

const transitionSlide = transitionValue =>
  (sliderList.style.transition = transitionValue);

const transformSlide = (swipeValue = 0) =>
  (sliderList.style.transform = `translateX(${
    -(widthSlide * indexSlide) + swipeValue
  }%)`);

const swipeXPercent = () => (swipeX / clientWidth) * 100;

const addProgressSlide = () => {
  progressTab =
    sliderTabHeroEl.children[indexTab - 1].lastElementChild.lastElementChild;
  progressSlide = sliderItems[indexTab].lastElementChild.lastElementChild;
  progressTab.classList.add('u-progress-loading');
  progressSlide.classList.add('u-progress-loading');
};

const removeProgressSlide = () => {
  progressTab.classList.remove('u-progress-loading');
  progressSlide.classList.remove('u-progress-loading');
};

export function handlerTabHero(event) {
  if (!event.target.classList.contains('c-card-tab-hero')) {
    return;
  }

  сhangeSlidesIntervalStopHero();
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

  сhangeSlidesIntervalStartHero();
}

export function handlerSliderHero(event) {
  clientWidth = event.currentTarget.clientWidth;
  x = event.pageX;
  sliderHeroEl.ondragstart = () => false;
  sliderHeroEl.addEventListener('pointermove', swiping);
  sliderHeroEl.addEventListener('pointerup', stopSwipe);
}

function swiping(event) {
  swipeX = event.pageX - x;
  transitionSlide('none');
  transformSlide(swipeXPercent());

  if (Math.abs(swipeX) > 1 && !isSwipe) {
    index = [...sliderItems].findIndex(
      el => el === event.target.offsetParent.parentNode,
    );
    if (event.target.nodeName === 'A') {
      link = event.target;
    }
    link.addEventListener('click', preventDefaultLink, {
      once: true,
    });
    isSwipe = true;
  }
}

function preventDefaultLink(event) {
  event.preventDefault();
}

function stopSwipe() {
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
  isSwipe = false;
  sliderHeroEl.removeEventListener('pointermove', swiping);
  sliderHeroEl.removeEventListener('pointerup', stopSwipe);
}

function prevSlide() {
  indexSlide -= 1;
  transitionSlide('transform 250ms ease-in-out');
  transformSlide();

  if (indexSlide === 0) {
    indexSlide = sliderItems.length - 2;
    sliderList.addEventListener('transitionend', firstLastSlideSwitching);
  }

  if (progressTab.classList.contains('u-progress-loading')) {
    removeProgressSlide();
  }

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

  if (progressTab.classList.contains('u-progress-loading')) {
    removeProgressSlide();
  }

  addProgressSlide();
}

function firstLastSlideSwitching() {
  transitionSlide('none');
  transformSlide();
  sliderList.removeEventListener('transitionend', firstLastSlideSwitching);
}
