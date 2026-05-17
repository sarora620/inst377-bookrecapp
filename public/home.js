function activateNav() {
    const links = document.querySelectorAll(".nav-link");
  
    links.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });
};

function expandSearch() {
    const searchOptions = document.getElementById("searchOptions");
    searchOptions.classList.add("active");
}

function updatePageNumber() {
    const pageValue = document.getElementById("pageValue");
    pageValue.textContent = pageSlider.value;
}

function handleSearch() {
    const searchInput = document.getElementById("searchInput");

    const searchData = {
        searchText: searchInput.value,
        genre: document.getElementById("genreSelect").value,
        maxPages: pageSlider.value
  };
  console.log(searchData);
};

  
// Run the function when the page loads
activateNav();

// run these functions when an event happens 
searchInput.addEventListener("click", expandSearch);
pageSlider.addEventListener("input", updatePageNumber);
searchBtn.addEventListener("click", handleSearch);