// http://localhost:3000/pagename
const express = require('express');
const app = express();
const port = 3000;

// add public directory to connect front + backend 
app.use(express.static(__dirname + '/public'));

// core API stuff goes here // 


// this goes at the END // 

// serve them HTML pages!!!! 
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