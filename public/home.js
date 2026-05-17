// // change the slider number as the user slides it. 
// let sliderTouched = false; // set to false for input validation
//  // set to true to indicate that the slider has been touched

// validate the form
function validate(event) {
    // stop refresh 
    event.preventDefault();

    var validation = /^$|^\s+$|[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    const title = document.getElementById("searchInput").value.trim();
    const genre = document.getElementById("genreSelect").value;

    if (validation.test(title)) {
            alert("Please input a valid title search our catalog!");
            return false;
        } else if (title === "" && genre === "" && !sliderTouched) {
            alert("To search the cozy catalog, you must fill one of the search fields!");
            return false;
        }

    return true;
}

function searchSubmit(event) {

    // validate dat form 
    const valid = validate(event);
    if  (!valid) {
        return false;
    }

    const title = document.getElementById("searchInput").value.trim();
    const genre = document.getElementById("genreSelect").value;
    const pageCount = document.getElementById("pageSlider").value;

    console.log(title, genre, pageCount);

    apiBookFetch(title, genre, pageCount);

    // loading text
    document.getElementById("loading").innerText = "Loading...";

}


async function apiBookFetch(title, genre, pageCount) {

    // search 
    const cleanTitle = title.trim().replace(/\s+/g, "+");

    let url = "https://openlibrary.org/search.json?";




    const searchData = {
        searchText: searchInput.value,
        genre: document.getElementById("genreSelect").value,
        maxPages: pageSlider.value
  };
  console.log(searchData);
};


