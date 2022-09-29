const fs = require('fs');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');
//this allows use of npm uuid package which I found through StackOverflow
const { v1: uuidv1, v4: uuidv4 } = require('uuid');
//parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
//parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));


const notes = require('./db/db.json');

//Creates, adds to noteArr, writes to database in JSON format, returns note
function createNote(body, noteArr){
    const newNote = body
    newNote.id = uuidv1();
    noteArr.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(noteArr)
    );
    console.log(noteArr[1])
    return noteArr;
}

//Validate Note function
function validateNote(note){
    if (!note.title || typeof note.title !== 'string'){
        return false;
    }
    if(!note.text || typeof note.text !== 'string'){
        return false;
    }
    return true;
}

//DeleteNote
function deleteNote(notesArr, id) {
    //for loop (Runs through noteArr by increment counter)
    for (let i = 0; i < notesArr.length; i++) {

        if (notesArr[i].id == id) {
            noteArr.splice(i, 1);
            break;
        }
    }
}

//This will return notes in database in JSON format
app.get('/api/notes', (req,res) => {
    
    res.json(notes);
});

// Add Notes
app.post('/api/notes', (req, res) => {
    if(!validateNote(req.body)){
        res.status(400).send('The animal is not properly formatted.');
    } else {
    let note = createNote(req.body, notes);
    console.log(note)
    res.json(note);
    }
});
//gets index html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//gets notes html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//wild card route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// delete 
app.delete("/api/notes/:id", (req, res) => {
    deleteNote(notes, req.params.id);
    res.json(notes);
    }
  );


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);

});
