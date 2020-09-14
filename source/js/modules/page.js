export default () => {
  window.addEventListener('load', () => {
    document.querySelector('.page').classList.add('page--loaded');
  });
};
