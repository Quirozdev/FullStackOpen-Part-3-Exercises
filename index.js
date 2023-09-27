const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let phoneBookEntries = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(phoneBookEntries);
});

function findPhoneBookEntryByID(id) {
  const phoneBookEntry = phoneBookEntries.find((phoneBookEntry) => {
    return phoneBookEntry.id === id;
  });

  return phoneBookEntry;
}

function isNameAlreadyUsed(name) {
  return phoneBookEntries.some((phoneBookEntry) => {
    return phoneBookEntry.name === name;
  });
}

function generateRandomId() {
  return Math.floor(Math.random() * 100000);
}

app.get('/api/persons/:id', (req, res) => {
  const phoneBookEntry = findPhoneBookEntryByID(Number(req.params.id));

  if (!phoneBookEntry) {
    return res.status(404).send('Phonebook entry not found');
  }

  res.json(phoneBookEntry);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Missing name or number' });
  }

  if (isNameAlreadyUsed(name)) {
    return res.status(409).json({ error: 'name must be unique' });
  }

  phoneBookEntries.find((phoneBookEntry) => {
    return phoneBookEntry.name === name;
  });

  const newPhoneBookEntry = {
    name,
    number,
    id: generateRandomId(),
  };

  phoneBookEntries.push(newPhoneBookEntry);
  res.status(201).json(newPhoneBookEntry);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  phoneBookEntries = phoneBookEntries.filter((phoneBookEntry) => {
    return phoneBookEntry.id !== id;
  });

  res.status(204).end();
});

app.get('/info', (req, res) => {
  console.log(req);
  res.send(`
    <p>Phonebook has info for ${phoneBookEntries.length} people</p>
    <p>${new Date()}</p>
  `);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
