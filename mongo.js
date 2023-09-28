const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('provide a password as argument');
  process.exit(1);
}

const password = process.argv[2];

const mongoUri = `mongodb+srv://admin:${password}@fullstack.sntxvh3.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(mongoUri);

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhoneBookEntry = mongoose.model('PhoneBookEntry', phoneBookSchema);

const phoneBookEntryName = process.argv[3];
const phoneBookEntryNumber = process.argv[4];

if (!phoneBookEntryName || !phoneBookEntryNumber) {
  console.log('phonebook:');
  PhoneBookEntry.find({}).then((result) => {
    result.forEach((phoneBookEntry) => {
      console.log(`${phoneBookEntry.name} ${phoneBookEntry.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const newPhoneBookEntry = new PhoneBookEntry({
    name: phoneBookEntryName,
    number: phoneBookEntryNumber,
  });
  newPhoneBookEntry.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
