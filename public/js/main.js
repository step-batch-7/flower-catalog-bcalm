const removeJug = function() {
  const timeToAppear = 1000;
  const jug = document.getElementById('animatedJug');
  jug.style.visibility = 'hidden';
  setTimeout(() => {
    jug.style.visibility = 'visible';
  }, timeToAppear);
};

fetch('localhost:80/html/guestBook.html', {method: 'get'})
  .then(res => res.json())
  .then(json => console.log(json));
