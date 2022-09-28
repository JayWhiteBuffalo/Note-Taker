const fs = require('fs');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');

//parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
//parse incoming JSON data
app.use(express.json());

const notes = require('./db/db.json');

function createNote(body, noteArr){
    console.log(body);
    const note = body
    noteArr.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(noteArr)
    );
    return noteArr;
}

//This will return notes in database in JSON format
app.get('/api/notes', (req,res) => {
    
    res.json(notes);
});

// Add Notes
app.post('/api/notes', (req, res) => {
    let note = createNote(req.body, notes);
    console.log(note)
    res.json(note);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);

});
