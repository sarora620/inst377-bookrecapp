// http://localhost:3000/pagename
const express = require('express');
// add dotenv
const dotenv = require('dotenv');
dotenv.config();

// add middleware 
const bodyParser = require('body-parser');
// add supabase client
const supabaseClient = require('@supabase/supabase-js');
const app = express();
const port = 3000;
// initialize middeware
app.use(bodyParser.json());


// ----------------------- add supabase db ----------------------- // 

// SAVEDBOOKS DB //
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // will link to dotenv

// initialize the db 
const supabase = supabaseClient.createClient(supabaseURL, supabaseKey);

// ----------------------- add public directory to connect front + backend ----------------------- //
app.use(express.static(__dirname + '/public'));

// ----------------------- core API stuff goes here ----------------------- // 

// get books from supabase
app.get('/books', async (req, res) => {
    console.log('Getting books');

    const { data, error } = await supabase.from('savedBooks').select('*');

    if (error) {
        console.log('Error: ', error);
        res.status(500).send(error);
    } else {
        res.json(data);
    }
});

// put books into supabase 
app.post('/books', async (req, res) => {
    console.log('Adding book');
    console.log(`Request ${JSON.stringify(req.body)}`);

    const title = req.body.title;

    const { data, error } = await supabase.from('savedBooks').insert({
            title: title
        }).select();

    if (error) {
        console.log('Error: ', error);
        res.status(500).send(error);
    } else {
        res.json(data);
    }
});

// get books from openlibrary
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


// this goes at the END // 

// ----------------------- serve them HTML pages!!!! ----------------------- //
app.get('/', (req, res) => {
    res.sendFile('/public/home.html', {root: __dirname});
});

app.get('/about', (req, res) => {
    res.sendFile('/public/about.html', {root: __dirname});
});

app.get('/savedBooks', (req, res) => {
    res.sendFile('/public/savedBooks.html', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
});