const express = require('express');
const app = express();
const cors = require('cors')
const shortid = require('shortid');
app.use(express.json());
app.use(cors());

app.locals.notes = [
  { id: 12345, name: 'worf', type: 'cat' }
]

app.listen('3001', () => {
  console.log('Server is now running at http://localhost:3001');
})


app.get('/api/v1/notes', (request, response) => {
  response.status(200).json(app.locals.notes);
});


app.post('/api/v1/notes', (request, response) => {
  const { notes } = app.locals;
  const { name, type } = request.body;

  if(!name && !type) return send422(response, 'Name and Type is required')
  if(!name) return send422(response, 'Name is required')
  if(!type) return send422(response, 'Type is required')

  const note = { id: shortid.generate(), name, type }

  notes.push(note);
  return response.status(201).json(note);
});


app.put('/api/v1/notes/:id', (request, response) => {
  const { name, type } = request.body;
  const { id } = request.params;
  const { notes } = app.locals;

  let noteFound;
  let noteIndex;

  notes.map((note, index) => {
    if (note.id == id) {
      noteFound = note;
      noteIndex = index;
    }
  });

  if(!noteFound) return send400(response, 'Note is not found')
  if(!name) return send400(response, 'Name is required')
  if(!type) return send400(response, 'Type is required')

  const updatedNote = {
    id: noteFound.id,
    name: request.body.name || noteFound.name,
    type: request.body.type || noteFound.type,
  };

  notes.splice(noteIndex, 1, updatedNote);
  return send200(response, 'Note added successfully')
});


app.delete('/api/v1/notes/:id', (request, response) => {
  const { id } = request.params;
  const { notes } = app.locals;

  notes.map((note, index) => {
    if (note.id == id) {
       notes.splice(index, 1);
       return send200(resonse, 'Note deleted successfuly')
    }
  });

  return send404(response, 'Note not found')
});


const send200 = (response, message) => {
  response.status(200).json(message)
}

const send201 = (response, message) => {
  response.status(201).json(message)
}

const send422 = (response, message) => {
  response.status(422).json(message)
}

const send404 = (response, message) => {
  response.status(404).json(message)
}
