const accessToken = 'YOUR_ACCESS_TOKEN';
const options = {
  url: 'https://api.github.com/orgs/YOUR_ORGANIZATION_NAME/repos',
  headers: {
    'User-Agent': 'request',
    Authorization: `token ${accessToken}`
  }
};
request(options, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const repositories = JSON.parse(body);
    const repositoryNames = repositories.map(repo => repo.name);
    console.log(repositoryNames);
  } else {
    console.error(error);
  }
});
