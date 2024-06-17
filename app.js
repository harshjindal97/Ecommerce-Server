const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());

const CategoryRoute = require('./routes/category')


app.use('/api/category', CategoryRoute);


mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database connection established');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
