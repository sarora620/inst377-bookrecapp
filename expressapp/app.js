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


// this goes at the END // 

// ----------------------- serve them HTML pages!!!! ----------------------- //
app.get('/', (req, res) => {
    res.sendFile('public/home.html', {root: __dirname});
});

app.get('/', (req, res) => {
    res.sendFile('public/about.html', {root: __dirname});
});

app.get('/', (req, res) => {
    res.sendFile('public/savedBooks.html', {root: __dirname});
});

// 404 page 
app.use((req, res) => {
    res.status(404).sendFile('public/404.html', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
});