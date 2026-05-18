## How to install your application and all dependencies

cd into `expressapp` and run `npm install`
the dependencies should include:

- "@supabase/supabase-js": "^2.105.4"
- "body-parser": "^2.2.2"
- "dotenv": "^17.4.2"
- "express": "^5.2.1"
- "nodemon": "^3.1.14"

check the package.json to ensure these dependencies are correct.

To run this app, a `.env` file is required inside of the `expressapp` directory.
It should only include the following:

SUPABASE_URL={URL provided by supabase}
SUPABASE_KEY={private key provided by supabase}

You can find these by going to supabase and clicking "connect" at the top of your database.

For this small scale website, creating your own supabase database makes most sense. Create a database named "books" where the only additional column to the defaults should be "book_title".

## How to run your application on a server

once everything is set up, simply type `node app.js` to run the server.

To deactivate the server press control Z in the terminal on Macbook or Windows.
then run `lsof -1 :3000` to check if the port is clear
if not, a table with a pid number column will appear in terminal. Simply run `kill -9` with the pid number

e.g
kill -9 92427

The above instructions work on mac, please research for windows.

Once the server is running, navigate to "http://localhost:3000/"

## How to run any tests you have written for your software

There are no tests to be run. The only issues I faced were syntax errors, mislabeled variables and directory mishaps (aka my public directory was NOT inside the expressapp)

## The API for your server application - all GET, POST, PATCH, etc endpoints, and what they each do

1. get books from the database. This API retrieves all book_title rows from the books database.

app.get('/books', async (req, res) => {
console.log('Getting books');

    const { data, error } = await supabase.from('books').select('*');

    if (error) {
        console.log('Error: ', error);
        res.status(500).send(error);
    } else {
        res.json(data);
    }

});

This is used in saved.js for the populateTable() function very simply to retrieve titles to populate the saved books page.

const response = await fetch('/books');
const data = await response.json();

2. Save books to the supabase db

app.post('/books', async (req, res) => {
console.log('Adding book');
console.log(`Request ${JSON.stringify(req.body)}`);

    const { data, error } = await supabase.from('books').insert({
            book_title: req.body.title}).select();

    if (error) {
        console.log('Error: ', error);
        res.status(500).send(error);
    } else {
        res.json(data);
    }

});

This is used in home.js when creating the book cards with "save" buttons to save books from the page to the supabase database.

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

        const data = await response.json(); });

3.  get books from openlibrary in a more discrete way
    app.get('/external-books', async (req, res) => {
    console.log('Fetching external books');

        const genre = req.query.genre;

        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=subject_key:${genre}`);
            const data = await response.json();

            res.json(data);}
        catch (error) {
            console.log('Error: ', error);
            res.status(500).send(error);
        }

});

This api endpoint allows the script to query openapi through express. It's used in home.js very simply to query.

const response = await fetch(`/external-books?genre=${cleanGenre}`);
const data = await response.json();

It does NOT append to the supabase database however it does discreetly allow us to do api queries without exposing it all in the front end.

## A clear set of expectations around known bugs and a road-map for future development.

The biggest issues I faced were actually simple problems. Instead of issues, future-development should be prioritized.

For example, a delete functionality should be developed to allow users to remove saved books.

furthermore, being able to query more books or filter by language should become a possibility.
