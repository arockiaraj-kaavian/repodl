
function reponames(){
const gitToken = "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";
const request = require('request');

const username = 'arockiaraj-kaavian';
const accessToken = `${gitToken}`;

const options = {
  url: `https://api.github.com/users/${username}/repos`,
  headers: {
    'User-Agent': 'request',
    'Authorization': `token ${accessToken}`
  }
};

request(options, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const repositories = JSON.parse(body);
    console.log(repositories);
    // response.JSON(repositories);
  }
});
}
module.exports={reponames};
