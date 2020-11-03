const RULES_LINK_ANIMATE_CLASS = `rules__link--animate`;

export default () => {
  const lastRuleText = document.querySelector(`.rules__item:last-child .rules__text`);
  lastRuleText.addEventListener(`animationend`, () => {
    document.querySelector(`.rules__link`).classList.add(RULES_LINK_ANIMATE_CLASS);
  });
};
