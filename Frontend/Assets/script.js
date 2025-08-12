
const examMenu = document.querySelector(".examMenu");
examMenu.addEventListener("change", function () {
  const selectedPage = this.value;
  if (selectedPage) {
    window.location.href = selectedPage; // This redirects to the selected page
  }
});

const examCategory = document.querySelector(".examCategory");
examCategory.addEventListener("change", function () {
  const selectedPage = this.value;
  if (selectedPage) {
    window.location.href = selectedPage; // This redirects to the selected page
  }
});
