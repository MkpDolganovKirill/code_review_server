const userSchema = require('../../db/models/users/index');


module.exports.checkExistUser = async (req, res) => {
  const params = req.query;
  if (!params.username) return res.status(404).send({ message: 'User Name not found' });
  if (!params.ip) return res.status(404).send({ message: 'Local id not found' });


}

module.exports.addNewUser = async (req, res) => {
  try {
    const body = req.body;
    if (!body.username) return res.status(404).send({ message: 'User Name not found' });
    if (!body.ip) return res.status(404).send({ message: 'Local id not found' });

    const user = new userSchema({ ...body, projects: [] });
    await user.save();

    return res.status(200).send({ user, message: 'New user created!' });
  } catch (error) {
    console.log(error + "");
    return res.status(422).send({ error, message: "Error with create user" });
  }
}

