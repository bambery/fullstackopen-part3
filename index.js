const express = require('express')
const crypto = require('crypto')
const morgan = require('morgan')

const app = express()
app.use(express.json())

app.use(morgan('tiny'))

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    // the exercise says to use Math.random(), but es6 offers the crypto api which is better designed for this situation:
    const array = new Uint32Array(1)
    return crypto.getRandomValues(array)[0]
}

app.get('/info', (request, response) => {
    const timestamp = new Date
//    response.send(`<h1>Hello World! ${Date.now()}</h1>`)
    response.send(`<div>Phonebook has info for ${persons.length} people.</div><div>${timestamp.toString()}</div>`)
})

app.get('/api/persons/', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    } else if (persons.find(p => p.name === body.name)){
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
