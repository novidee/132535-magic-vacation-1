class AccentTypography {
  constructor(
      element,
      duration,
      classForActivate
  ) {
    this._element = element;
    this._duration = duration;
    this._classForActivate = classForActivate;
    this._delays = this.getDelays(
        this.getText().reduce((sum, word) => sum + word.length, 0)
    );

    this.prepareText();
  }

  getDelays(count) {
    const DELAY = 80;
    const STEP_PATTERN = [2, -1, 2, 2, -1];

    const result = [];
    let lastDelay = 0;
    for (let i = 0; i < count; i++) {
      const step = STEP_PATTERN[i % STEP_PATTERN.length];
      result.push(lastDelay);
      lastDelay = lastDelay + step * DELAY;
    }

    return result;
  }

  createLetterElement(letter, duration, delay) {
    const letterContainer = document.createElement(`span`);
    letterContainer.classList.add(`accent-word__letter`);
    letterContainer.textContent = letter;
    letterContainer.style.transition = `transform ${duration}ms ease ${delay}ms`;
    return letterContainer;
  }

  createWordElement(letters) {
    const wordContainer = document.createElement(`span`);
    wordContainer.classList.add(`accent-word`);
    wordContainer.appendChild(letters);
    return wordContainer;
  }

  getText() {
    return this._element.textContent.trim().split(` `).filter(Boolean);
  }

  prepareText() {
    const text = this.getText();

    let letterIndex = 0;
    const content = text.reduce((textContainer, word) => {
      const letters = Array.from(word).reduce((wordContainer, letter) => {
        wordContainer.appendChild(this.createLetterElement(letter, this._duration, this._delays[letterIndex]));
        letterIndex++;
        return wordContainer;
      }, document.createDocumentFragment());

      textContainer.appendChild(this.createWordElement(letters));
      return textContainer;
    }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.appendChild(content);
  }

  runAnimation() {
    this._element.classList.add(this._classForActivate);
  }
}

export default () => {
  const introAccentTypography = new AccentTypography(
      document.querySelector(`.intro__title`),
      500,
      `intro__title--accent`
  );
  setTimeout(() => {
    introAccentTypography.runAnimation();
  }, 500);

  const introDateAccentTypography = new AccentTypography(
      document.querySelector(`.intro__date`),
      500,
      `intro__date--accent`
  );
  setTimeout(() => {
    introDateAccentTypography.runAnimation();
  }, 1000);
};
