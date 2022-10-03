const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} else if (process.argv.length === 3) {
    const password = encodeURI(process.argv[2])
    const url = `mongodb+srv://fullstack:${password}@fso0.a31ltpt.mongodb.net/phonebook?retryWrites=true&w=majority`
    console.log("phonebook:")
    // fetch all existing persons
    mongoose
        .connect(url)
        .then((result) => {
            Person
                .find({})
                .then( persons => {
                persons.forEach( person => {
                    console.log(`${person.name} ${person.number}`)
                })
                mongoose.connection.close()
            })
        })
        .catch((err) => console.log(err))
} else if (process.argv.length === 5) {
    const password = process.argv[2]
    const pname = process.argv[3]
    const pnumber = process.argv[4]
    const url = `mongodb+srv://fullstack:${password}@fso0.a31ltpt.mongodb.net/phonebook?retryWrites=true&w=majority`
    // add peson to phonebook
    mongoose
        .connect(url)
        .then((result) => {
            console.log('connected')

            const person = new Person({
                name: pname,
                number: pnumber,
            })

            return person.save()
        })
        .then((person) => {
            console.log(`added ${person.name} number ${person.number} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}
