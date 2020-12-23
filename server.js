const mongoose = require('mongoose');
const dotenv = require('dotenv');
const color = require('colors');

dotenv.config({ path: './config.env' });

const app = require('./app');

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
  .then(() => console.log('🦖 DB Connection SUCCESSFUL...'.cyan.bold));

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`.white.bold);
});
