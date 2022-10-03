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

app.get('/info', (request, response) => {
    Person.find({}).then( persons => {
        const timestamp = new Date
        response.send(`<div>Phonebook has info for ${persons.length} people.</div><div>${timestamp.toString()}</div>`)
    })
})

app.get('/api/persons/', (request, response) => {
    Person.find({}).then( persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query'})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })

}

app.use(unknownEndpoint)

// express error handler
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
        return response.status(400).send({error: 'malformed id'})
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// must be the last loaded middlewear
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
