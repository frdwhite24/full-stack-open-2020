const mongoose = require("mongoose");

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@fw-dev.703f8.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (!newName && !newNumber) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else if (newName && newNumber) {
  const person = new Person({
    name: newName,
    number: newNumber,
  });
  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
