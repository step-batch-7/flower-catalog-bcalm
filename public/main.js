const removeJug = function() {
  const jug = document.getElementById("animatedJug");
  jug.style.visibility = "hidden";
  setTimeout(() => {
    jug.style.visibility = "visible";
  }, 1000);
};
