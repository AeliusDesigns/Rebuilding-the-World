document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded successfully.");

  // Function to navigate to different pages
  window.navigateTo = function (page) {
    window.location.href = page;
  };
});
