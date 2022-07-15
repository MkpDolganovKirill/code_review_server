const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new Schema({
  projectName: {
    type: String,
  },
  repositoryPath: {
    type: String,
  },
  diffType: {
    type: Number,
  },
  commitId: {
    type: String,
  }
})

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  ip: {
    type: String,
    unique: true
  },
  projects: [projectSchema],
});

module.exports = UsersSchema = mongoose.model("users", userSchema);
