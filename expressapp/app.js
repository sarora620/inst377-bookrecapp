// http://localhost:3000/pagename
const express = require('express');
// add middleware 
const bodyParser = require('body-parser');
// add supabase client
const supabaseClient = require('@supabase/supabase-js');
const app = express();
const port = 3000;
// initialize middeware
app.use(bodyParser.json());

// ----------------------- add supabase db's ----------------------- // 
// USERS DB //
const supabaseURL_1 = '';
const supabaseKey_1 = ''; // will link to dotenv

// initialize the db 
const supabase1 = supabaseClient.createClient(supabaseURL_1, supabaseKey_1);

// SAVEDBOOKS DB //
const supabaseURL_2 = '';
const supabaseKey_2 = ''; // will link to dotenv

// initialize the db 
const supabase2 = supabaseClient.createClient(supabaseURL_2, supabaseKey_2);

// ----------------------- add public directory to connect front + backend ----------------------- //
app.use(express.static(__dirname + '/public'));

// ----------------------- core API stuff goes here ----------------------- // 


// this goes at the END // 

// ----------------------- serve them HTML pages!!!! ----------------------- //
app.get('/', (req, res) => {
    res.sendFile('public/home.html', {root: __dirname});
});

// 404 page 
app.use((req, res) => {
    res.status(404).sendFile('public/404.html', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
});