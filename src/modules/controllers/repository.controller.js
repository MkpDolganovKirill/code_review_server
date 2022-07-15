const body = require("../../utilities/type-check.module");
const DiffType = require("../../enums/diffType");
const { NodeSSH } = require('node-ssh');
const userSchema = require('../../db/models/users/index');


const getDiffFromClientRepository = async (ip, pathToConnect, diffType, commitId) => {
  const sftp = new NodeSSH();
  try {
    console.log("connecting to", ip, pathToConnect);
    await sftp.connect({
      host: `${ip}`,
      port: '22',
      username: 'user',
      password: 'user'
    });
    commitId = commitId ? `${commitId}^!` : '';

    const result = await sftp.exec(`git diff ${commitId}`, [], {
      cwd: pathToConnect
    });

    await sftp.dispose();
    return result || "";
  } catch (err) {
    console.error(err.message);
    await sftp.dispose();
    return null;
  }

}


const getRepositoryDiffFromUser = async (req, res) => {
  try {
    const { ip, repositoryPath, diffType, commitId } = req.body;

    try {
      body(req.body).existMany('ip', 'repositoryPath', 'diffType');
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }

    if (diffType === DiffType.byCommitId && !commitId)
      return res.status(400).send({ message: 'Commit id not found' });

    const diff = await getDiffFromClientRepository(ip, repositoryPath, diffType, commitId);

    if (diff === null) return res.status(404).send({ message: 'repository not found' });

    return res.status(200).send({ diff });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error, message: 'Failed in GetRepositoryDiffFromUser' });
  }
}

const addNewRepository = async (req, res) => {
  const sftp = new NodeSSH();
  try {
    const { repositoryPath, diffType, commitId } = req.body;

    const ip = req.connection.remoteAddress.slice(7);
    console.log(ip);

    try {
      body(req.body).existMany('ip', 'projectName', 'repositoryPath', 'diffType');
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }

    if (diffType === '3' && !commitId) return res.status(404).send({ message: 'Commit id not found' });

    let newCommitId;

    await sftp.connect({
      host: `${ip}`,
      port: '22',
      username: 'user',
      password: 'user'
    });

    console.log(typeof diffType);
    switch (diffType) {
      case '1':
        newCommitId = "";
        break;
      case '2':
        console.log("inner");
        let lastCommitId;
        lastCommitId = await sftp.exec(`git log`, [], {
          cwd: `${repositoryPath}`,
        });
        newCommitId = lastCommitId.slice(lastCommitId.indexOf('commit ') + 7, lastCommitId.indexOf('commit ') + 47);
        break;
      case '3':
        newCommitId = commitId;
        break;
      default:
        newCommitId = '';
    }
    sftp.dispose();
    console.log("commit id:", newCommitId);

    const newRepository = { ...req.body, commitId: newCommitId };

    const user = await userSchema.findOne({ ip }).lean();

    if (!user) return res.status(404).send({ message: 'User not found' });

    console.log("test");
    await userSchema.updateOne({ ip: req.connection.remoteAddress.slice(7) },
      { projects: [ ...user.projects, newRepository ] }
    );
    console.log("test1");
    res.status(200).send({ message: 'Project added to user profile' });
  } catch (error) {
    sftp.dispose();
    return res.status(422).send({ error, message: 'Error with update user projects' });
  }

}

const updateRepositorySettings = (req, res) => {

}

module.exports = {
  getRepositoryDiffFromUser,
  addNewRepository,
  updateRepositorySettings,
}

