

function userrepos(username,token){


const gitToken = token;


  const octokit = new Octokit({
    auth: `${gitToken}`
  });


  let repos;
  async function getPrivateRepoNamesForUser(username) {
    const { data } = await octokit.repos.listForUser({
      username: username,
      visibility: "private",
    });

    const repoNames = data.map((repo) => repo.name);
    return repoNames;
  }
  getPrivateRepoNamesForUser(username).then((repoNames) => {


    repo = repoNames;
    res.json(repo);
  });
}
module.exports={userrepos};