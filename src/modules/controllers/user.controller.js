const userSchema = require('../../db/models/users/index');


module.exports.checkExistUser = async (req, res) => {
  const user = await userSchema.findOne({ "ip": req.connection.remoteAddress.slice(7) }).lean();
  res.status(200).send({ user });
}

module.exports.addNewUser = async (req, res) => {
  try {
    const params = req.query;
    if (!params.username) return res.status(404).send({ message: 'User Name not found' });

    console.log(req.connection.remoteAddress.slice(7));

    const user = new userSchema({ ...params, ip: req.connection.remoteAddress.slice(7), projects: [] });
    await user.save();

    return res.status(200).send({ user, message: 'New user created!' });
  } catch (error) {
    console.log(error + "");
    return res.status(422).send({ error, message: "Error with create user" });
  }
}

module.exports.getAllUsers = async (req, res) => {
    const users = await userSchema.find().lean();
    res.status(200).send({ users });
}

