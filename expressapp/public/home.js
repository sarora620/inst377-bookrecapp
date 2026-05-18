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
    // openLibray api only accepts subject queries if the spaces inbetween are underscores NOT plus signs like we did in lab 7.
    const cleanGenre = genre.trim().replace(/\s+/g, "_");
    // the cool lil range form doesnt give us a number, so i had to convert from string --> number
    const cleanPage = Number(pageCount);
    const response = await fetch(`/external-books?genre=${cleanGenre}`);
    const data = await response.json();
    // i tried 50...i got yelled at by the API for too many requests....
    const books = data.docs.slice(0, 20);
    
    // I TRIED using a map and await fetch to simply get the edition for each book but that did NOT work. So i did a lil research and promise.all seemed to be the best solution here
    // don't ask me how it works I have no idea but IT WORKS SO IM NOT COMPLAINING
    const results = await Promise.all(
        books.map(async (book) => {
            // openLibrary doesnt really have clear pages for books if you search normally. You have to query the specific edition
            // and even then they barely record pages. genuinely the bane of my existence. 
            const editionKey = book.cover_edition_key;

            if (!editionKey) {
                console.log("NO EDITION KEY:", book.title);
                return null;
            }

            try {
                const res = await fetch(
                    `https://openlibrary.org/books/${editionKey}.json`
                );
                // if the result doesnt work, log that it failed. 
                if (!res.ok) {
                    console.log("FAILED FETCH:", editionKey);
                    return null;
                }

                const ed = await res.json();
                // everything else is easy to get with a simple map
                // ITS THE STUPID NUMBER OF PAGES THAT MADE ME DO THIS WHOLE ERROR CATCHING MESS
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

    // okay so this looks confusing but it isnt trust
    // basically b is book and i only get the books that have pages listed, and where the pages are less than or equal to the user's desired page count
    const filtered = results.filter(b =>
        b && b.pages && b.pages <= cleanPage
    );

    // i did this because i didnt wanna just put in a raw slice of the data since that would just duplicate the results from the filtered list. 
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
        <br>
    `;

    const saveButton = document.createElement("button");
    saveButton.className = "saveButton";
    saveButton.textContent = "Save";

    saveButton.addEventListener("click", async () => {

        console.log("Saving book:", book.title);

        const response = await fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: book.title
            })
        });

        const data = await response.json();
        console.log("Saved:", data);

        saveButton.textContent = "Saved";
        saveButton.disabled = true;
    });

    card.appendChild(saveButton);

    return card;
}

// TWO display functions because i love my users and i want them to get whatever books they can! 
function displayPagedBooks(books) {
    console.log("now displaying books that meet page requirements")
    pageBooks = document.getElementById("pageCountBooks");
    pageBooks.innerHTML = ""; // RESET. I MADE THE MISTAKE OF NOT DOING THAT. BAD!!!

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


