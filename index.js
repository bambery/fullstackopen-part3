require('dotenv').config()
const express = require('express')
const crypto = require('crypto')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())

// http request logger
morgan.token('body', function (req, res) { if (req.method === "POST"){ return JSON.stringify(req.body)}})
app.use(morgan(':method, :url, :status, :res[content-length] - :response-time ms :body'))

/*
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
*/

app.get('/info', (request, response) => {
    const timestamp = new Date
    response.send(`<div>Phonebook has info for ${persons.length} people.</div><div>${timestamp.toString()}</div>`)
})

app.get('/api/persons/', (request, response) => {
    Person.find({}).then( persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })

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
        /*
         **** exercise 3.9 says that PUT/updates will be implemented in exercise 3.17
         *
    } else if (persons.find(p => p.name === body.name)){
        return response.status(409).json({
            error: 'name must be unique'
        })
        */
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
