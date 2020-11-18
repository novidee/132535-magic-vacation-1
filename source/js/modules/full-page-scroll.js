import throttle from 'lodash/throttle';
import {Theme, setTheme} from './theme';

const STORY_SCREEN_INDEX = 1;
const PRIZES_SCREEN_INDEX = 2;
const BACKGROUND_SCREEN_ACTIVE_CLASS = `background-screen--active`;
const BACKGROUND_SCREEN_ANIMATE_CLASS = `background-screen--animate`;

const activeScreenThemeMap = {
  0: Theme.PURPLE_LIGHT,
  1: Theme.PURPLE,
  2: Theme.PURPLE_LIGHT,
  3: Theme.PURPLE_LIGHT,
  4: Theme.PURPLE_LIGHT
};

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;
    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.backgroundScreen = document.querySelector(`.background-screen`);

    this.activeScreen = 0;
    this.previousActiveScreen = null;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.backgroundScreen.addEventListener(`animationend`, () => {
      this.onBackgroundAnimationEnd();
    });
    this.backgroundScreen.addEventListener(`animationcancel`, () => {
      this.onBackgroundAnimationEnd();
    });

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.previousActiveScreen = currentPosition;
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.previousActiveScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  onBackgroundAnimationEnd() {
    this.showActiveScreen();
    this.backgroundScreen.classList.remove(BACKGROUND_SCREEN_ANIMATE_CLASS);
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    if (this.previousActiveScreen === STORY_SCREEN_INDEX && this.activeScreen === PRIZES_SCREEN_INDEX) {
      this.backgroundScreen.classList.add(BACKGROUND_SCREEN_ANIMATE_CLASS);
    } else {
      this.showActiveScreen();
    }

    if (this.activeScreen < PRIZES_SCREEN_INDEX) {
      this.backgroundScreen.classList.remove(BACKGROUND_SCREEN_ACTIVE_CLASS);
    }

    if (this.activeScreen >= PRIZES_SCREEN_INDEX) {
      this.backgroundScreen.classList.add(BACKGROUND_SCREEN_ACTIVE_CLASS);
    }
  }

  showActiveScreen() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    this.screenElements[this.activeScreen].classList.add(`active`);
    setTheme(activeScreenThemeMap[this.activeScreen]);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
