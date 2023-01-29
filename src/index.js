const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const route = require('./routes/route');


app.use(express.json());

mongoose.connect('mongodb+srv://sandy_varanasi:sRzKkk5zN4u6uAZG@sandy-clusture.eimj9vg.mongodb.net/roleKey', {
  useNewUrlParser: true
})
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err.message));

app.use('/', route);



app.listen(3000, () => {
  console.log("Server online on port 3000");
})