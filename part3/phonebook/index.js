const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

morgan.token("content", (req, method) => {
  if (method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return null;
  }
});

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    const method = tokens.method(req, res);
    return [
      method,
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.content(req, method),
    ].join(" ");
  })
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendick",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (req, res) => {
  const numPeople = `<p>Phonebook has info for ${persons.length} people</p>`;
  const timeStamp = new Date();
  res.send(numPeople + timeStamp);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const requestId = Number(req.params.id);
  person = persons.find((person) => person.id === requestId);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const requestId = Number(req.params.id);
  persons = persons.filter((person) => person.id !== requestId);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).send({ error: "Must contain name and number." });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).send({ error: "Name must be unique." });
  }

  const newRecord = {
    name: body.name,
    number: body.number,
    id: Math.round(Math.random() * 200000),
  };

  persons = persons.concat(newRecord);
  res.json(newRecord);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
