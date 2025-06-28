const express = require('express')
const app = express()
var morgan = require('morgan')



// Define a custom token to log the request body
morgan.token('body', (req) => JSON.stringify(req.body));

// Use custom format including the 'body' token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json())


let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


let infoMessage =  {

  "info": "Phonebook has info for" + " " + persons.length + " "+ "people",
  "date": new Date().toString()
}



app.get('/', (request, response) => {
  response.send('<h1>Please add an ID</h1>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(entry => entry.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }

  })

app.get('/api/persons', (request, response) => {
  //response.json(notes)
  response.end(JSON.stringify(persons))
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  // Helper function to generate a unique ID
  const generateId = () => {
    // Generate a random ID that is not already in use
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0;
    return maxId + 1; // Simple increment for demonstration
  };

  // 1. Input validation: Check if name or number are missing
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    });
  }


  const existingPerson = persons.find(person => person.name === body.name);
  if (existingPerson) {
    return response.status(409).json({ 
      error: 'name must be unique'
    });
  }


  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };


  persons = persons.concat(person); 
  
  response.status(201).json(person);
});



app.get('/api/info', (request, response) => {

  response.end(JSON.stringify(infoMessage))
})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(persons => persons.id !== id)
  
    response.status(204).end()
  })
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})