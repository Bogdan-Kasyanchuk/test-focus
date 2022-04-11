export class Slider {
  constructor(selector) {
    this.selector = selector;
    this.sliderList = this.selector.firstElementChild.firstElementChild;
    this.sliderItems = this.sliderList.children;
    this.clientWidth = this.selector.clientWidth;
    this.indexSlide = 0;
    this.isSwipe = false;
    this.x = null;
    this.swipeX = null;
    this.link = null;
    this.swipingListener = null;
    this.stopSwipeListener = null;
  }

  updateView() {
    this.progressDrag();
    this.setButtonState();
  }

  setButtonState() {
    if (this.indexSlide <= 0) {
      this.selector.children[1].setAttribute('disabled', 'disabled');
    } else {
      this.selector.children[1].removeAttribute('disabled');
    }

    if (
      this.indexSlide >=
      this.sliderItems.length - this.numberVisibleSlides()
    ) {
      this.selector.children[2].setAttribute('disabled', 'disabled');
    } else {
      this.selector.children[2].removeAttribute('disabled');
    }
  }

  progressDrag() {
    this.clientWidth = this.selector.clientWidth;
    this.selector.lastElementChild.lastElementChild.style.width = `${
      ((this.numberVisibleSlides() + this.indexSlide) /
        this.sliderItems.length) *
      100
    }%`;
  }

  widthSlide() {
    return this.sliderItems[0].clientWidth + 24;
  }

  numberVisibleSlides() {
    return Math.round(this.clientWidth / this.widthSlide());
  }

  transitionSlide(transitionValue) {
    return (this.sliderList.style.transition = transitionValue);
  }

  transformSlide(swipeValue = 0) {
    return (this.sliderList.style.transform = `translateX(${
      -(this.widthSlide() * this.indexSlide) + swipeValue
    }px)`);
  }

  handlerSlider(event) {
    this.clientWidth = event.currentTarget.clientWidth;

    if (event.target.nodeName === 'BUTTON') {
      if (event.target.attributes[2].value === 'Previous') {
        this.prevSlide(1);
      } else {
        this.nextSlide(1);
      }
      return;
    }

    this.x = event.pageX;
    this.selector.ondragstart = () => false;
    this.swipingListener = this.swiping.bind(this);
    this.stopSwipeListener = this.stopSwipe.bind(this);
    this.selector.addEventListener('pointermove', this.swipingListener);
    this.selector.addEventListener('pointerup', this.stopSwipeListener);
    this.selector.addEventListener('pointerout', this.stopSwipeListener);
  }

  swiping(event) {
    this.swipeX = event.pageX - this.x;
    this.transitionSlide('none');
    this.transformSlide(this.swipeX);

    if (Math.abs(this.swipeX) > 1 && !this.isSwipe) {
      if (event.target.nodeName === 'A') {
        this.link = event.target;
      }
      this.link.addEventListener('click', this.preventDefaultLink.bind(this), {
        once: true,
      });
      this.isSwipe = true;
    }

    if (
      parseInt(this.sliderList.style.transform.slice(11)) >= 100 ||
      Math.abs(parseInt(this.sliderList.style.transform.slice(11))) >=
        this.widthSlide() *
          (this.sliderItems.length - this.numberVisibleSlides()) +
          100
    ) {
      this.stopSwipe();
    }
  }

  preventDefaultLink(event) {
    event.preventDefault();
  }

  stopSwipe() {
    const number = Math.round(Math.abs(this.swipeX) / this.widthSlide());

    if (this.swipeX >= this.widthSlide() / 2) {
      this.prevSlide(number);
    } else if (this.swipeX <= -this.widthSlide() / 2) {
      this.nextSlide(number);
    } else {
      this.transitionSlide('transform 250ms ease-in-out');
      this.transformSlide();
    }

    this.swipeX = null;
    this.isSwipe = false;
    this.selector.removeEventListener('pointermove', this.swipingListener);
    this.selector.removeEventListener('pointerup', this.stopSwipeListener);
    this.selector.removeEventListener('pointerout', this.stopSwipeListener);
  }

  prevSlide(index) {
    if (this.indexSlide <= 0) {
      return;
    }

    this.indexSlide -= index;
    this.transitionSlide('transform 250ms ease-in-out');
    this.transformSlide();
    this.setButtonState();
    this.progressDrag();
  }

  nextSlide(index) {
    if (
      this.indexSlide <
      this.sliderItems.length - this.numberVisibleSlides()
    ) {
      this.indexSlide += index;
      this.transitionSlide('transform 250ms ease-in-out');
      this.transformSlide();
    }

    this.setButtonState();
    this.progressDrag();
  }
}
