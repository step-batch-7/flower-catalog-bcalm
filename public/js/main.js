const removeJug = function() {
  const timeToAppear = 1000;
  const jug = document.getElementById('animatedJug');
  jug.style.visibility = 'hidden';
  setTimeout(() => {
    jug.style.visibility = 'visible';
  }, timeToAppear);
};
