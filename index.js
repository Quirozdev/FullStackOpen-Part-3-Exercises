require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => {
      console.error(err.message);
    });
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Missing name or number' });
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then((savedPerson) => {
    res.status(201).json(savedPerson);
  });
});

app.put('/api/persons/:id', (req, res) => {
  const { id } = req.params;

  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/info', (req, res) => {
  Person.countDocuments({}).then((peopleCount) => {
    res.send(`
    <p>Phonebook has info for ${peopleCount} people</p>
    <p>${new Date()}</p>
  `);
  });
});

app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
});

app.use((error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Invalid id format' });
  }

  next(error);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
