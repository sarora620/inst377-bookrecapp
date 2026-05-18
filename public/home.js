// // change the slider number as the user slides it. 
// let sliderTouched = false; // set to false for input validation
//  // set to true to indicate that the slider has been touched

function searchSubmit(event) {

    event.preventDefault();

    const genre = document.getElementById("genreSelect").value;
    const pageCount = document.getElementById("pageSlider").value;

    if (genre === "") {
        alert("Please choose a genre");
        return false;
    }

    console.log(genre, pageCount);

    apiBookFetch(genre, pageCount);

    // loading text
    document.getElementById("loading").innerText = "Loading...";

}


async function apiBookFetch(genre, pageCount) {

    const cleanGenre = genre.trim().replace(/\s+/g, "_");
    const cleanPage = Number(pageCount);
    const response = await fetch(`https://openlibrary.org/search.json?q=subject_key:${cleanGenre}`);
    const data = await response.json();
    const books = data.docs.slice(0, 20);
    
    const results = await Promise.all(
        books.map(async (book) => {

            const editionKey = book.cover_edition_key;

            if (!editionKey) {
                console.log("NO EDITION KEY:", book.title);
                return null;
            }

            try {
                const res = await fetch(
                    `https://openlibrary.org/books/${editionKey}.json`
                );

                if (!res.ok) {
                    console.log("FAILED FETCH:", editionKey);
                    return null;
                }

                const ed = await res.json();

                return {
                    title: book.title,
                    author: book.author_name?.[0],
                    pages: ed.number_of_pages || null
                };

            } catch (err) {
                console.log("ERROR FETCHING:", editionKey, err);
                return null;
            }
        })
    );

    console.log("RAW RESULTS:", results);

    const filtered = results.filter(b =>
        b && b.pages && b.pages <= cleanPage
    );

    if (filtered.length === 0) {
        document.getElementById("loading").innerText = "We couldn't find any books with that page count. Here are some recommendations in your genre instead!";
        displayBooks(results.slice(0, 10));
    } else {
        document.getElementById("loading").innerText = "";
        displayPagedBooks(filtered);
        displayBooks(results.slice(0, 10));
    }
};

function displayPagedBooks() {
    console.log("now displaying")
    pageBooks = document.getElementById("pageCountBooks");
    noPageBooks = document.getElementById("genreBooks");

    
};

function displayBooks() {
    console.log("now displaying")
    pageBooks = document.getElementById("pageCountBooks");
    noPageBooks = document.getElementById("genreBooks");


};


