const { NodeSSH } = require('node-ssh');
const sftp = new NodeSSH();

const getDiffFromClientRepository = async (ip, pathToConnect) => {
  try {
    console.log("connecting to", ip, pathToConnect);
    await sftp.connect({
      host: `${ip}`,
      port: '22',
      username: 'user',
      password: 'user'
    })

    const result = await sftp.exec('git diff', [], {
      cwd: pathToConnect
    })
    await sftp.dispose();
    return result;
  } catch (err) {
    console.log(err);
    await sftp.dispose();
    return 0;
  }

}


module.exports.getRepositoryDiffFromUser = async (req, res) => {
  const body = req.body;
  if (!body.username) return res.status(404).send({ message: 'User Name not found' });
  if (!body.projectName) return res.status(404).send({ message: 'User Name not found' });
  if (!body.ip) return res.status(404).send({ message: 'Local id not found' });
  if (!body.repositoryPath) return res.status(404).send({ message: 'Repository not found' });

  const diff = await getDiffFromClientRepository(body.ip, body.repositoryPath);
  if (diff === 0) return res.status(404).send({ message: 'repository not found' });
  return res.status(200).send({ diff });
}

