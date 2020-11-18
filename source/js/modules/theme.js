const Theme = {
  PURPLE_LIGHT: `purple-light`,
  PURPLE: `purple`,
  BLUE_LIGHT: `blue-light`,
  BLUE: `blue`
};

function setTheme(theme) {
  document.body.dataset.theme = theme;
}

export {
  Theme,
  setTheme
};
