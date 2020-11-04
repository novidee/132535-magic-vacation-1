class AccentTypography {
  constructor(
      element,
      duration,
      classForActivate
  ) {
    this._element = element;
    this._duration = duration;
    this._classForActivate = classForActivate;
    this._timeOffset = 0;

    this.prepareText();
  }

  createLetterElement(letter) {
    const span = document.createElement(`span`);
    span.textContent = letter;
    span.style.transition = `transform ${this._duration}ms ease ${this._timeOffset}ms`;
    this._timeOffset += 20;
    return span;
  }

  prepareText() {
    if (!this._element) {
      return;
    }
    const text = this._element.textContent.trim().split(` `).filter(Boolean);

    const content = text.reduce((textContainer, word) => {
      const letters = Array.from(word).reduce((wordContainer, letter) => {
        wordContainer.appendChild(this.createLetterElement(letter));
        return wordContainer;
      }, document.createDocumentFragment());

      const wordContainer = document.createElement(`span`);
      wordContainer.classList.add(`text__word`);
      wordContainer.appendChild(letters);
      textContainer.appendChild(wordContainer);
      return textContainer;
    }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.appendChild(content);
  }

  runAnimation() {
    if (!this._element) {
      return;
    }
    this._element.classList.add(this._classForActivate);
  }

  destroyAnimation() {
    this._element.classList.remove(this._classForActivate);
  }
}

export default () => {
  const animationTopScreenTextLine = new AccentTypography(
      document.querySelector(`.intro__title`),
      500,
      `active`
  );
  setTimeout(() => {
    animationTopScreenTextLine.runAnimation();
  }, 500);
};
