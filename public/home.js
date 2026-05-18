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

    const unfiltered = results.filter(b =>
        (b && b.pages && b.pages > cleanPage) || null
    );

    if (filtered.length === 0) {
        document.getElementById("loading").innerText = "We couldn't find any books with that page count. Here are some recommendations in your genre instead!";
        displayBooks(unfiltered);
    } else {
        document.getElementById("loading").innerText = "";
        displayPagedBooks(filtered);
        displayBooks(unfiltered);
    }
};

function createBookDisplay(book) {
    if (!book) return null;
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
        <p id="book-title"><strong>${book.title}</strong></p>
        <p class="book-author">${book.author || "Unknown author"}</p>
        <p class="book-pages">${book.pages ? book.pages + " pages" : "Pages unknown"}</p>
    `;

    return card;
}

function displayPagedBooks(books) {
    console.log("now displaying books that meet page requirements")
    pageBooks = document.getElementById("pageCountBooks");
    pageBooks.innerHTML = "";

    const title = document.createElement("h2");
    title.innerText = "Best matches for your page limit";
    pageBooks.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "book-grid";

    books.forEach(book => {
        const card = createBookDisplay(book);
        if (card) grid.appendChild(card);
    });

    pageBooks.appendChild(grid); 
};

function displayBooks(books) {
    console.log("now displaying")
    noPageBooks = document.getElementById("genreBooks");
    noPageBooks.innerHTML = "";

    const title = document.createElement("h2");
    title.innerText = "Best matches for your genre!";
    noPageBooks.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "book-grid";

    books.forEach(book => {
        const card = createBookDisplay(book);
        if (card) grid.appendChild(card);
    });

    noPageBooks.appendChild(grid);
};


