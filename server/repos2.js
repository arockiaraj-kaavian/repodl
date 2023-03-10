const { username, token } = req.body;
  console.log(username, token);
  const gitToken = token;


  const octokit = new Octokit({
    auth: `${gitToken}`
  });


  let repos;
  async function getRepoNamesForUser(username) {
    const { data } = await octokit.repos.listForUser({
      username: username,
      visibility: "private",
    });

    const repoNames = data.map((repo) => repo.name);
    return repoNames;
  }
  getRepoNamesForUser(username).then((repoNames) => {
    
    repos = repoNames;
    res.json(repos);

  });
  