const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 9999;

const repositoryRoutes = require("./src/modules/routes/repository.route");
const userRoutes = require("./src/modules/routes/user.route");

app.use(express.json());

app.use(cors());

const url = 'mongodb://localhost:27017/codeReview';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
  if (err) return console.log("DB connection lost");
  console.log("DB connected!");
});


app.use('/ssh/repository', repositoryRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`CodeReview server app listening on port ${port}`)
})
