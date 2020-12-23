const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../Models/tourModel');

dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('🦖 DB Connection Successful...'));

// Reading JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully LOADED');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// Delete all data from collection
const deleteExistingData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully DELETED');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === '--export') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteExistingData();
}
